export interface SolutionStep {
  step: number;
  description: string;
}

export interface ErrorKnowledge {
  id: string;
  pattern: string; 
  title: string;
  createdBy: "IA" | "Soporte Técnico" | "Historial";
  possibleCauses: string[];
  solutionSteps: SolutionStep[];
}

// Aseguramos que la constante global esté declarada correctamente en el módulo
const STORAGE_KEY = 'knowledge_base_rules';

const solucionesPredefinidas: ErrorKnowledge[] = [
  {
    id: "seed-1",
    pattern: "Power supply is in warning state", 
    title: "Protocolo preventivo de Fuentes de Alimentación CGR",
    createdBy: "Soporte Técnico",
    possibleCauses: ["Fluctuación de voltaje externo en la línea de distribución", "Fallo de redundancia en módulo secundario."],
    solutionSteps: [
      { step: 1, description: "Desplazar cuadrilla para medir la entrada de AC en el breaker de transferencia." },
      { step: 2, description: "Verificar el estado de los inversores y la temperatura interna del gabinete." },
      { step: 3, description: "Si el estado persiste por más de 2 horas, programar reemplazo de módulo hot-swap." }
    ]
  },
  {
    id: "seed-2",
    pattern: "Unavailable by ICMP ping", 
    title: "Mitigación por Pérdida Total de Conectividad",
    createdBy: "Soporte Técnico",
    possibleCauses: ["Corte físico en anillo de fibra óptica principal", "Desconexión de enlace de última milla."],
    solutionSteps: [
      { step: 1, description: "Ejecutar traza ICMP desde el Switch Core hacia la IP de la controladora." },
      { step: 2, description: "Revisar si hay alarmas de pérdida de señal (LOS) en el puerto óptico de la OLT." },
      { step: 3, description: "Comprobar el estado de transferencia de energía en el nodo local." }
    ]
  }
];

// EXPORTACIÓN EXPLICITA Y SÓLIDA PARA EVITAR ERRORES DE COMPILACIÓN
export const obtenerHistorialCompleto = (): ErrorKnowledge[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solucionesPredefinidas));
    return solucionesPredefinidas;
  }
  return JSON.parse(data);
};

export const buscarSolucionEnHistorial = (errorZabbix: string): ErrorKnowledge | null => {
  if (!errorZabbix) return null;
  const historial = obtenerHistorialCompleto();
  
  const coincidencia = historial.find(item => 
    errorZabbix.toLowerCase().includes(item.pattern.toLowerCase()) ||
    item.pattern.toLowerCase().includes(errorZabbix.toLowerCase())
  );
  
  return coincidencia || null;
};

export const guardarOActualizarSolucion = (nuevaSolucion: ErrorKnowledge) => {
  const historial = obtenerHistorialCompleto();
  const index = historial.findIndex(item => item.id === nuevaSolucion.id);
  
  if (index >= 0) {
    historial[index] = nuevaSolucion;
  } else {
    historial.push(nuevaSolucion);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
};

// EXPORTACIÓN CORRECTA PARA EXTRACTOR DE BITÁCORA
export const eliminarSolucionDelHistorial = (id: string) => {
  const historial = obtenerHistorialCompleto();
  const nuevoHistorial = historial.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoHistorial));
};