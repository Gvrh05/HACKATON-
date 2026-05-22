import { useState, useEffect } from 'react';
// Importamos la función de eliminación aquí
import { obtenerHistorialCompleto, eliminarSolucionDelHistorial, ErrorKnowledge } from '../../data/knowledgeBase';

interface GlobalHistoryViewProps {
  onBack: () => void;
}

export default function GlobalHistoryView({ onBack }: GlobalHistoryViewProps) {
  const [historial, setHistorial] = useState<ErrorKnowledge[]>([]);

  // Función encargada de cargar los datos frescos del LocalStorage
  const refrescarHistorial = () => {
    setHistorial(obtenerHistorialCompleto());
  };

  useEffect(() => {
    refrescarHistorial();
  }, []);

  const handleEliminarRegistro = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta solución de la base de conocimiento? Esto reactivará el análisis en vivo de la IA para este error.")) {
      // 1. Borramos del LocalStorage
      eliminarSolucionDelHistorial(id);
      // 2. Refrescamos el estado para que desaparezca de la tabla inmediatamente
      refrescarHistorial();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">📚 Historial Global de IA y Técnicos</h2>
          <p className="text-sm text-slate-500 mt-1">Panel de administración de la base de conocimiento de Coopeguanacaste.</p>
        </div>
        <button 
          onClick={onBack} 
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer shadow-sm border border-slate-200"
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Tabla del Historial con Gestión de Acciones */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {historial.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-2">📭</span>
            <p className="text-sm font-medium text-slate-400">La bitácora está vacía. Indexa soluciones desde el mapa para poblar la base.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-600 text-xs tracking-wider uppercase w-[25%]">Alerta / Patrón</th>
                  <th className="p-4 font-bold text-slate-600 text-xs tracking-wider uppercase w-[15%]">Origen</th>
                  <th className="p-4 font-bold text-slate-600 text-xs tracking-wider uppercase w-[50%]">Pasos de Solución Registrados</th>
                  <th className="p-4 font-bold text-slate-600 text-xs tracking-wider uppercase w-[10%] text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historial.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Patrón de Alerta */}
                    <td className="p-4">
                      <div className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 font-bold break-words whitespace-pre-wrap">
                        {item.pattern}
                      </div>
                    </td>
                    
                    {/* Origen del conocimiento */}
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded shadow-sm inline-block ${
                        item.createdBy === 'IA' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {item.createdBy === 'IA' ? '🤖 CORE GEMINI' : '📖 HISTORIAL'}
                      </span>
                    </td>
                    
                    {/* Pasos */}
                    <td className="p-4">
                      <div className="space-y-1">
                        {item.solutionSteps.map((s, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-emerald-600 font-mono font-bold shrink-0">[{s.step || idx + 1}]</span>
                            <span className="leading-normal text-slate-700 font-medium">{s.description}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Botón de Borrado de la Base Global */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleEliminarRegistro(item.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl transition border border-rose-100 cursor-pointer shadow-sm active:scale-90"
                        title="Eliminar de la Base de Conocimiento"
                      >
                        🗑️ Borrar
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}