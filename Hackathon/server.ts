import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { obtenerProblemasRealesZabbix, ZabbixProblem } from "./src/services/zabbixService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory problem store - se inicializa de forma asincrónica
let currentProblems: ZabbixProblem[] = [];

// Cargar problemas al iniciar
(async () => {
  try {
    currentProblems = await obtenerProblemasRealesZabbix();
    console.log(`✓ Cargados ${currentProblems.length} problemas de la API Zabbix`);
  } catch (error) {
    console.error("✗ Error al cargar datos iniciales de Zabbix:", error);
  }
})();

// Lazy-initialized Gemini client with safety guard and telemetry Header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST Endpoints adhering to Zabbix API principles e.g. problem.get / event.get
// Exposing simulated Zabbix API actions

// 1. Get raw list / problem.get replica
app.get("/api/zabbix/problems", (req, res) => {
  const { zone, severity, status, search } = req.query;
  let result = [...currentProblems];

  if (zone) {
    result = result.filter(p => p.zone.toLowerCase() === (zone as string).toLowerCase());
  }
  if (severity) {
    result = result.filter(p => p.severity.toLowerCase() === (severity as string).toLowerCase());
  }
  if (status) {
    result = result.filter(p => p.status.toLowerCase() === (status as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(p => 
      p.host.toLowerCase().includes(q) || 
      p.problem.toLowerCase().includes(q) ||
      p.zone.toLowerCase().includes(q)
    );
  }

  res.json({
    jsonrpc: "2.0",
    result: result,
    id: 1
  });
});

// 2. Get list of unique Zones with calculated metrics (for filtration)
app.get("/api/zabbix/zones", (req, res) => {
  const zonesMap: Record<string, {
    name: string;
    activeProblems: number;
    resolvedProblems: number;
    warnings: number;
    highSeverity: number;
    averageSeverity: number;
    totalProblems: number;
  }> = {};

  currentProblems.forEach(p => {
    if (!zonesMap[p.zone]) {
      zonesMap[p.zone] = {
        name: p.zone,
        activeProblems: 0,
        resolvedProblems: 0,
        warnings: 0,
        highSeverity: 0,
        averageSeverity: 0,
        totalProblems: 0
      };
    }

    const z = zonesMap[p.zone];
    z.totalProblems++;
    if (p.status === 'PROBLEM') {
      z.activeProblems++;
    } else {
      z.resolvedProblems++;
    }

    if (p.severity === 'Warning') z.warnings++;
    else if (p.severity === 'High') z.highSeverity++;
    else if (p.severity === 'Average') z.averageSeverity++;
  });

  const zonesList = Object.values(zonesMap).sort((a,b) => b.activeProblems - a.activeProblems);

  res.json({
    jsonrpc: "2.0",
    result: zonesList,
    id: 1
  });
});

// 3. Simulated API Endpoint for restoring or triggering issues
app.post("/api/zabbix/problems/toggle-status", (req, res) => {
  const { id } = req.body;
  const problem = currentProblems.find(p => p.id === id);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }

  if (problem.status === 'PROBLEM') {
    problem.status = 'RESOLVED';
    problem.recoveryTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    problem.duration = "Resuelto Justo Ahora";
  } else {
    problem.status = 'PROBLEM';
    problem.recoveryTime = "";
    problem.duration = "10s";
  }

  res.json({
    jsonrpc: "2.0",
    result: problem,
    id: 1
  });
});

// 4. Reset simulation dataset
app.post("/api/zabbix/reset", async (req, res) => {
  try {
    currentProblems = await obtenerProblemasRealesZabbix();
    res.json({
      jsonrpc: "2.0",
      result: "success",
      message: "Dataset de eventos Zabbix de Coopeguanacaste restaurado exitosamente desde la API.",
      problemsLoaded: currentProblems.length,
      id: 1
    });
  } catch (error) {
    res.status(500).json({
      jsonrpc: "2.0",
      error: "Error restaurando datos de Zabbix",
      id: 1
    });
  }
});

// 5. AIOps Super-Incident Engine (Clustering / Alert correlation)
// Aggregates raw single alarms into clustered Super-Incidents representing underlying root causes
app.get("/api/zabbix/super-incidents", (req, res) => {
  // We identify 4 pre-calculated super incidents based on the manual and the dataset:
  const activeProblems = currentProblems.filter(p => p.status === 'PROBLEM');
  
  // Incident 1: Planta DC Caimital Blackout (The giant primary alarm storm!)
  // Root Cause: Battery / AC flow failure in OLT Caimital ("PLANTA DC CMTL")
  // Symptom Alarms: All Unavailable by ICMP pings in adjacent Guanacaste regions
  const caimitalOutageAlarm = activeProblems.find(p => p.host === "PLANTA DC CMTL");
  const pingTimeouts = activeProblems.filter(p => p.problem.includes("Unavailable by ICMP ping"));
  
  const correlatedAlarmsCaimital = activeProblems.filter(p => 
    p.host === "PLANTA DC CMTL" || 
    (p.problem.includes("Unavailable by ICMP") && 
     ["Caimital", "Pozo de Agua", "Dominicas", "Corralillo de Nicoya", "San Antonio", "Nicoya Florida"].some(loc => p.host.includes(loc)))
  );

  // Incident 2: Cisco CGR1000 DC Power Warning Outbreak 
  // Root Cause: Localized power fluctuations or battery maintenance cycle in North coastal Ring
  const powerFluctuationAlarms = activeProblems.filter(p => 
    p.problem.includes("power supply") && 
    ["Bahia Gigante", "27 de Abril", "Zapotal", "Huacas Matapalo", "Pilas de Canjel", "Quiriman"].some(loc => p.host.includes(loc))
  );

  // Incident 3: High Resource Exhaustion
  const resourceIssues = activeProblems.filter(p => 
    p.problem.includes("Processor") || p.problem.includes("Space is low") || p.problem.includes("swap space")
  );

  // Build high value response
  const superIncidents = [
    {
      id: "super-1",
      title: "Corte de Fibra o Apagón Eléctrico en Nodo Core Caimital (Anillo Norte)",
      status: caimitalOutageAlarm ? "CRITICAL" : "RESOLVED",
      detectedAt: "2026-05-21 09:56:43 AM",
      rootCauseHost: "PLANTA DC CMTL",
      rootCauseDevice: "OLT CAIMITAL, Sensor: ModoBateria, Tipo: PlantaEmerson",
      description: "Pérdida de flujo eléctrico principal reportada por el rectificador Emerson. Esto desencadenó una avalancha de pings fallidos en 6 routers de distribución de campo dependientes de la misma fibra de transporte.",
      suppressedAlertsCount: correlatedAlarmsCaimital.length,
      impact: "Corte de transporte WAN afectando subestaciones de Pozo de Agua, Corralillo, San Antonio y Caimital.",
      mitigationAction: "Despachar cuadrilla a OLT Caimital para verificar breakers de alimentación eléctrica principal. Monitorear autonomía de baterías Emerson.",
      correlatedProblems: correlatedAlarmsCaimital
    },
    {
      id: "super-2",
      title: "Inestabilidad de Voltaje en Enlaces CGR de la Península",
      status: powerFluctuationAlarms.length > 0 ? "WARNING" : "RESOLVED",
      detectedAt: "2026-05-21 07:32:00 PM",
      rootCauseHost: "Falla de alimentación secundaria en múltiples CGR1000",
      rootCauseDevice: "Cisco Industrial Grid Routers (CGR1000)",
      description: "Fluctuaciones concurrentes de corriente directa en el sistema de respaldo DC. Se han agrupado 6 alertas independientes bajo un mismo patrón meteorológico/eléctrico regional.",
      suppressedAlertsCount: powerFluctuationAlarms.length,
      impact: "Degradación potencial de contingencia redundante en subestaciones del Golfo y Costa.",
      mitigationAction: "Programar mantenimiento preventivo de baterías DC. Validar cargador integrado Cisco IOS.",
      correlatedProblems: powerFluctuationAlarms
    },
    {
      id: "super-3",
      title: "Saturación de Recursos en Zabbix Server Core",
      status: resourceIssues.length > 0 ? "AVERAGE" : "RESOLVED",
      detectedAt: "2026-04-28 02:46:37 AM",
      rootCauseHost: "Zabbix server",
      rootCauseDevice: "Servidor de Monitoreo Centralizado Linux",
      description: "Saturación combinada de espacio en disco de base de datos (/), swap space, y cola de procesos del ICMP pinger superando el 75%.",
      suppressedAlertsCount: resourceIssues.length,
      impact: "Retraso en recopilación de métricas (jitter de monitoreo) y posible pérdida transitoria de históricos.",
       mitigationAction: "Ejecutar limpieza de tablas de histórico en la base de datos de Zabbix y aumentar threads de ICMP pinger en zabbix_server.conf.",
      correlatedProblems: resourceIssues
    }
  ];

  res.json({
    jsonrpc: "2.0",
    result: superIncidents,
    noiseReductionPercent: Math.round(((activeProblems.length - 3) / (activeProblems.length || 1)) * 100),
    id: 1
  });
});

// 6. Gemini Troubleshooting API (Mantenimiento Correctivo Inteligente)
app.post("/api/gemini/troubleshoot", async (req, res) => {
  const { problemId, problemText, host, severity, tags, zone } = req.body;

  if (!problemText || !host) {
    return res.status(400).json({ error: "Faltan datos requeridos (problemText, host)" });
  }

  const prompt = `
Contexto de Operación de Red de Telecomunicaciones para Coopeguanacaste, Costa Rica.
Estás resolviendo un incidente técnico de Zabbix calificado como Mantenimiento Correctivo Inteligente (Detección de causa raíz y triaje rápido).

Detalles del Problema:
- Equipo / Host: ${host} (Ubicado en la Zona de: ${zone || 'Guanacaste Norte/Sur'})
- Severidad: ${severity || 'Warning'}
- Mensaje del Evento: ${problemText}
- Clasificación / Tags Zabbix: ${JSON.stringify(tags || [])}

De acuerdo con el Manual de Operación y Laboratorios de la Hackathon Coopeguanacaste UNA 2026:
1. El equipo principal OLT tiene alimentación redundante.
2. Si el host es "PLANTA DC CMTL", representa la central de OLT Caimital. Una pérdida de flujo eléctrico aquí apaga enlaces que desconectará decenas de routers Cisco CGR1000 en cascada (Pozo de Agua, Dominicas, Corralillo, etc.).
3. Los Cisco CGR1000 tiene fuentes DC y AC. Las alertas de "warning" suelen referir a fallas de UPS secundarias o problemas de tierra/humedad en postes.

Por favor, como tu IA Asistente Experto en AIOps para el NOC de Coopeguanacaste, genera un reporte de triaje interactivo estructurado de la siguiente forma en Español técnico, directo y sumamente profesional (evita saludos largos):

🚨 diagnóstico y severidad del incidente
- Explica qué está ocurriendo exactamente en este nodo de Guanacaste de forma simplificada para el ingeniero de campo.

🔍 Causa Raíz Identificada ("Paciente Cero")
- Clasifica si esta falla es un síntoma secundario de una falla mayor (por ejemplo, si es una caída por ICMP y hay apagón en la planta eléctrica principal de Caimital) o si es un problema local del equipo.

📊 Impacto del Negocio y SLA Coopeguanacaste
- Estima el número de abonados residenciales, comerciales o nodos inteligentes del cantón que podrían verse desconectados y la criticidad para el SLA.

🛠️ Plan de Acción Correctiva Detallado (Pasos 1, 2, 3)
- Indica qué comando usar en Cisco IOS o Juniper, o qué acción física debe realizar la cuadrilla de campo de Coopeguanacaste en Guanacaste (por ej. medir voltaje en rectificador, revisar la acometida de fibra en el poste, o reiniciar el módulo redundante).

💡 Comando Técnico Recomendado / Troubleshooting
- Proporciona un comando útil de diagnóstico (por ejemplo: 'show power status', 'ping cisco', 'show cellular status', etc.) que el operador pueda ejecutar de inmediato.
`;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Return a beautiful localized high-quality simulated response if GEMINI_API_KEY is not configured yet!
      // This ensures 100% reliability and amazing visual experience even without config.
      const simulatedResponse = generateSimulatedTroubleshootingResponse(host, problemText, zone, severity);
      return res.json({
        success: true,
        text: simulatedResponse,
        modelUsed: "Simulated AIOps Local Engine (No API Key)"
      });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      text: response.text || "No se pudo generar el plan de acción automático.",
      modelUsed: "gemini-3.5-flash"
    });

  } catch (error: any) {
    console.error("Gemini troubleshooting error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error al contactar con el motor de IA."
    });
  }
});

// Helper to provide magnificent simulated responses based on Guanacaste local geographic context
function generateSimulatedTroubleshootingResponse(host: string, problemText: string, zone: string, severity: string): string {
  const isPower = problemText.toLowerCase().includes("power") || problemText.toLowerCase().includes("flujo eléctrico");
  const isPing = problemText.toLowerCase().includes("icmp") || problemText.toLowerCase().includes("unavailable");
  
  if (host === "PLANTA DC CMTL" || problemText.includes("flujo eléctrico")) {
    return `### 🚨 Diagnóstico de Emergencia Eléctrica en Planta Caimital
El rectificador Emerson de **PLANTA DC CMTL** reporta que el switch de transferencia de AC falló, operando actualmente de manera crítica solo en **Modo Batería**.

### 🔍 Causa Raíz Identificada ('Paciente Cero')
- **Falla Crítica Eléctrica Central**: Pérdida de alimentación comercial por parte de la red de distribución de Coopeguanacaste u obsolescencia del fusible principal del poste.
- **Relaciones de Dependencia**: Este evento es el **Paciente Cero**. La subsecuente caída de ping en CGR Pozo de Agua, Caimital, Corralillo y Dominicas se debe a la desenergización inminente de los transmisores ópticos del anillo.

### 📊 Impacto del Negocio y SLA Coopeguanacaste
- **Impacto**: ~4,500 Clientes residenciales y comerciales sin servicio en Nicoya y alrededores.
- **Cobro de Multas por SLA**: El incumplimiento supera la tolerancia de 30 minutos del contrato de transporte de datos del ICE/Gobierno, estimándose una penalización de **$15,000 USD por hora** si expira el respaldo de batería (tiempo estimado restante en baterías: **42 minutos**).

### 🛠️ Plan de Acción Correctiva (NOC y Campo)
1. **Despacho Urgente**: Enviar brigada de campo eléctrica del sector Caimital al recinto de la subestación principal con un generador portátil de combustión de respaldo.
2. **Revisión de Breaker**: Proceder a conmutar manualmente la fuente de emergencia en el bypass electromecánico.
3. **Monitoreo Remoto**: Monitorear voltaje DC de barra en Zabbix para asegurar que no disminuya por debajo de **46.8 VDC** (umbral de desconexión por bajo voltaje o LVD).

### 💡 Comando Técnico de Diagnóstico
\`\`\`bash
# Ejecutar en switch core de OLT Caimital para verificar el estado de interfaces ópticas
show controllers optic-ports active | include "Tx Power|Rx Power"
show environment power status
\`\`\`
`;
  }

  if (isPing) {
    return `### 🚨 Diagnóstico de Enlace Desconectado en ${zone}
El dispositivo industrial **${host}** se encuentra completamente inaccesible mediante pruebas de eco de ping básico (ICMP Down), confirmando una pérdida total de comunicación.

### 🔍 Causa Raíz Identificada
- **Aislamiento del Nodo por Fibra**: Atribuido presumiblemente a un corte de fibra de transporte óptica, o pérdida total de acometida eléctrica comercial secundaria sin respaldo de batería funcional en el anillo del circuito de **${zone}**.
- **Nota AIOps**: No se detectan fluctuaciones de energía previas en este equipo, lo que incrementa la probabilidad de un **daño físico de infraestructura** (por ejemplo, choque de poste o cableado suelto por vientos en la costa).

### 📊 Impacto del Negocio y SLA Coopeguanacaste
- **Impacto**: Suspensión temporal de monitoreo inteligente AMR (telemetría de medidores inteligentes de Coopeguanacaste) en el sector de **${zone}**. 
- **Criticidad**: Media-Alta. Afecta cobertura de red inalámbrica redundante de emergencias municipal.

### 🛠️ Plan de Acción Correctiva
1. **Localizar el Último Punto**: Consultar el mapa de reflectometría (OTDR) del NOC de Coopeguanacaste para estimar el kilómetro exacto del corte de fibra en la sección de **${zone}**.
2. **Coordinación Eléctrica**: Verificar si el sector completo de **${zone}** tiene cortes de luz programados o caídas imprevistas de red de media tensión de Coopeguanacaste.
3. **Escalamiento**: Enviar cuadrilla de fibra óptica para empalme por fusión de emergencia en el poste terminal.

### 💡 Comando Técnico de Diagnóstico
\`\`\`bash
# Diagnóstico de puertos físicos y señal LTE/Fibra en terminal Cisco CGR1000
show interfaces description | exclude down
show cellular 0 connection
ping ip 172.28.20.190 source Loopback0
\`\`\`
`;
  }

  // Warning or default power warnings
  return `### 🚨 Diagnóstico de Degradación de Soporte Eléctrico (Warning)
El de red industrial **${host}** ubicado en la sucursal de **${zone}** reporta inestabilidad crítica en su fuente redundante en corriente directa (corriente AC nominal/DC secundaria).

### 🔍 Causa Raíz Identificada
- **Alerta de Mantenimiento Correctivo Preventivo**: El módulo de conversión AC/DC reporta temperaturas que superan los **65° Celsius** o fluctuaciones frecuentes de bajón de voltaje en la entrada principal.
- **Estado de Batería**: Batería interna desgastada por ciclos de descarga profunda frecuentes.

### 📊 Impacto del Negocio y SLA Coopeguanacaste
- **Impacto**: Nivel de contingencia nulo. Ante un corte de energía principal en **${zone}**, el dispositivo se pagará de inmediato, omitiendo el tiempo de gracia de 2 horas.
- **SLA**: Bajo impacto inmediato, pero alto riesgo acumulado de siniestro.

### 🛠️ Plan de Acción Correctiva
1. **Inspección Física**: Agendar visita de mantenimiento de rutina a la caja protectora (Gabinete NEMA en poste o subestación) en **${zone}** para constatar flujo de aire o suciedad en rejillas.
2. **Reemplazo de Módulo**: Reemplazar fusibles de protección DC si hay lecturas de amperajes asimétricos.
3. **Medición**: Registrar lecturas de corriente con pinza amperimétrica directamente en bornas de la fuente Cisco.

### 💡 Comando Técnico de Diagnóstico
\`\`\`bash
# Consultar inventario físico de fuentes y voltajes en Cisco IOS
show environment power
show inventory | include Power
\`\`\`
`;
}


// Start Vite if development, or static server in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Custom catch-all for Vite frontend routing
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Coopeguanacaste AIOps - Triaje Inteligente</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
          </html>`
        );
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Coopeguanacaste AIOps Server] running at http://localhost:${PORT}`);
  });
}

startServer();
