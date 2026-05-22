import { ZabbixProblem } from './zabbixService';

// @ts-ignore
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function consultarIA(problemaActual: ZabbixProblem, historialCompleto: ZabbixProblem[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "Error: No has configurado la variable VITE_GEMINI_API_KEY en tu .env.local";
  }

  // Filtramos el historial para pasarle solo eventos resueltos o relevantes como contexto (para no saturar la memoria)
  const contextoHistorial = historialCompleto
    .slice(0, 30) // Enviamos los últimos 30 registros para optimizar velocidad
    .map(p => `- Host: ${p.host} | Problema: ${p.problem} | Estado Histórico: ${p.status} | Zona: ${p.zone}`)
    .join('\n');

  // El PROMPT: Aquí le damos la instrucción exacta de comportamiento a la IA
  const prompt = `
    [SISTEMA DE ANÁLISIS COGNITIVO DE RED - COOPEGUANACASTE AIOPS]
    
    IDENTIDAD:
    Actúas como el Ingeniero Consultor Principal en Telemática y Redes Eléctricas Inteligentes de Coopeguanacaste. Tu objetivo es reducir el MTTR (Tiempo Medio de Reparación) interpretando alertas de Zabbix y proporcionando un diagnóstico de mantenimiento correctivo de alta precisión.

    ENTORNO OPERATIVO Y GEOGRÁFICO:
    - Coopeguanacaste opera en la provincia de Guanacaste, una zona sujeta a climas tropicales severos, altas temperaturas, fuertes vientos y descargas atmosféricas que impactan tanto las líneas de distribución eléctrica como la infraestructura de fibra óptica aérea y nodos de microondas.
    - La topología incluye anillos de distribución IP/MPLS core, celdas de última milla inalámbricas y monitoreo de plantas de energía de respaldo (bancos de baterías, inversores, generadores).
    
    ALERTA ACTUAL EN TIEMPO REAL:
    - Nodo/Host: ${problemaActual.host}
    - Mensaje del Incidente: ${problemaActual.problem}
    - Severidad Asignada: ${problemaActual.severity}
    - Región Afectada: ${problemaActual.zone}

    HISTORIAL RECIENTE DE OPERACIONES (CONTEXTO LOCAL):
    ${contextoHistorial}

    DIRECTRICES DE RAZONAMIENTO LOGÍSTICO (PIENSA PASO A PASO):
    1. ANALIZA EL HISTORIAL: Determina si el comportamiento actual del Host o la naturaleza del error coincide con patrones previos almacenados en la memoria caché local.
    2. CORRELACIONA CAUSAS RAÍZ: No te limites a lo obvio. Si ves fallas de ICMP junto a palabras como "Power", "Flujo" o "Batteries", deduce si la pérdida de conectividad es un síntoma de una degradación del suministro eléctrico en el nodo. Si es un switch regional, evalúa fallas físicas por cortes de fibra en líneas aéreas.
    3. GENERA EL RUNBOOK (TROUBLESHOOTING): Redacta una guía técnica directa para el operario de cuadrilla o del NOC. Evita introducciones corporativas o saludos informales; ve directo al grano técnico.

    FORMATO DE RESPUESTA REQUERIDO (Estricto, para que la app lo lea bien):
    Genera tu respuesta utilizando exclusivamente estas dos secciones bien diferenciadas por líneas:

    CAUSAS INFERIDAS:
    - [Detalla aquí la causa raíz probable considerando el entorno geográfico/eléctrico de la zona]
    - [Detalla una segunda causa alternativa, como saturación, degradación de potencia óptica o atenuación]

    PASOS DE SOLUCIÓN SUGERIDOS:
    - Paso 1: [Acción técnica inicial de validación remota o comando CLI]
    - Paso 2: [Acción de aislamiento físico del problema o escalamiento a cuadrilla de energía/fibra]
    - Paso 3: [Acción de verificación y cierre del ciclo de la alerta]
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    return "Lo sentimos, hubo un problema al conectar con el núcleo de Inteligencia Artificial.";
  }
}