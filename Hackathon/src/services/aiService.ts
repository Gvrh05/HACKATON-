import { ZabbixProblem } from '../data/zabbixData';

// @ts-ignore
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function consultarIA(problemaActual: ZabbixProblem, historialCompleto: ZabbixProblem[]): Promise<string> {
  if (!GROQ_API_KEY) {
    return "Error: No has configurado la variable VITE_GROQ_API_KEY en tu .env.local";
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
PASOS DE SOLUCIÓN SUGERIDOS:
    - Paso 1: [Acción técnica inicial de validación remota o comando CLI]
    - Paso 2: [Siguiente acción lógica de troubleshooting]
    - Paso N: [Desarrolla y enumera TODOS los pasos que consideres necesarios (Paso 3, Paso 4, Paso 5, etc.) para aislar y reparar el problema. No te limites a 3 pasos. Detalla el proceso completo hasta llegar a la última acción de verificación y cierre del ciclo de la alerta.]
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}` // Groq usa el estándar Bearer Token
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Modelo de Meta altamente capaz y ultra rápido
        messages: [
          { role: "system", content: "Eres un ingeniero experto en redes y telecomunicaciones." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2 // Temperatura baja para respuestas técnicas y analíticas
      })
    });

    const data = await response.json();
    
    // 🚨 1. Verificamos si Groq rechazó la petición
    if (!response.ok) {
      console.error("Error real de Groq:", data);
      return `Error API Groq: ${data.error?.message || 'Error desconocido del servidor'}`;
    }

    // 🚨 2. Verificamos si Groq devolvió la estructura correcta
    if (!data.choices || data.choices.length === 0) {
      console.error("Respuesta vacía de Groq:", data);
      return "Error API: La IA no devolvió contenido.";
    }

    // Extraemos el texto en el formato que usa Groq/OpenAI
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Fallo de red al llamar a Groq:", error);
    return `Error API: Problema de red o CORS (${error.message}).`;
  }
}