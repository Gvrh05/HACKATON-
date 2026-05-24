import { useEffect, useState } from 'react';
import {
  ErrorKnowledge,
  eliminarSolucionDelHistorial,
  guardarOActualizarSolucion,
  obtenerHistorialCompleto,
} from '../../data/knowledgeBase';
import RunbookEditorModal from './RunbookEditorModal.tsx';

interface GlobalHistoryViewProps {
  onBack: () => void;
}

export default function GlobalHistoryView({ onBack }: GlobalHistoryViewProps) {
  const [historial, setHistorial] = useState<ErrorKnowledge[]>([]);
  const [registroEditando, setRegistroEditando] = useState<ErrorKnowledge | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [erroresExpandidos, setErroresExpandidos] = useState<Record<string, boolean>>({});

  const refrescarHistorial = () => {
    setHistorial(obtenerHistorialCompleto() || []);
  };

  useEffect(() => {
    refrescarHistorial();
  }, []);

  const handleEliminarRegistro = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta solución de la base de conocimiento? Esto reactivará el análisis en vivo de la IA para este error.")) {
      eliminarSolucionDelHistorial(id);
      refrescarHistorial();
    }
  };

  const handleGuardarEdicion = (registroActualizado: ErrorKnowledge) => {
    guardarOActualizarSolucion(registroActualizado);
    refrescarHistorial();
    setRegistroEditando(null);
  };

  const alternarError = (idError: string) => {
    setErroresExpandidos((prev) => ({
      ...prev,
      [idError]: !prev[idError],
    }));
  };

  // Filtrado seguro contra valores nulos
  const historialFiltrado = historial.filter((item) => {
    if (!item) return false;
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return true;

    const pasos = item.solutionSteps || [];
    const descripcionesPasos = pasos.map(p => p.description || "");

    const camposBuscables = [
      item.pattern || "",
      ...descripcionesPasos,
    ];

    return camposBuscables.some((campo) => campo.toLowerCase().includes(termino));
  });

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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* BARRA DE BÚSQUEDA INTEGRADA */}
        <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5">
          <label htmlFor="buscador" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Buscar en el registro histórico
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 font-bold">⌕</span>
            <input
              id="buscador"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Filtra por patrón, código de error o pasos de solución..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {/* Tabla del Historial */}
        {historial.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-2">📭</span>
            <p className="text-sm font-medium text-slate-400">La bitácora está vacía. Indexa soluciones desde el mapa para poblar la base.</p>
          </div>
        ) : historialFiltrado.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-2">🔎</span>
            <p className="text-sm font-medium text-slate-400">No hay coincidencias para tu búsqueda.</p>
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
                {historialFiltrado.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="p-4 align-top">
                      <div className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 font-bold break-words whitespace-pre-wrap">
                        {item.pattern || "Patrón Desconocido"}
                      </div>
                    </td>
                    
                    <td className="p-4 align-top">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded shadow-sm inline-block ${
                        item.createdBy === 'IA' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {item.createdBy === 'IA' ? '🤖 CORE GEMINI' : '📖 HISTORIAL'}
                      </span>
                    </td>
                    
                    <td className="p-4 align-top">
                      <div className="space-y-2">
                        <button
                          onClick={() => alternarError(item.id)}
                          className="flex items-center gap-2 text-xs font-bold text-green-700 hover:text-green-800 transition-colors cursor-pointer bg-green-50 px-3 py-1.5 rounded border border-green-100"
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-green-300 bg-white font-bold text-green-700 leading-none">
                            {erroresExpandidos[item.id] ? '−' : '+'}
                          </span>
                          {erroresExpandidos[item.id] ? 'Ocultar pasos de solución' : 'Ver pasos de solución'}
                        </button>

                        {erroresExpandidos[item.id] && (
                          <div className="space-y-1.5 mt-3 animate-fade-in bg-slate-50 p-3 rounded border border-slate-100">
                            {(item.solutionSteps || []).map((s, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                <span className="text-emerald-600 font-mono font-bold shrink-0">[{s.step || idx + 1}]</span>
                                <span className="leading-relaxed text-slate-700 font-medium">{s.description || ""}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center align-top">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setRegistroEditando(item)}
                          className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition border border-blue-100 cursor-pointer"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          onClick={() => handleEliminarRegistro(item.id)}
                          className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition border border-rose-100 cursor-pointer"
                          title="Eliminar de la Base de Conocimiento"
                        >
                          🗑️ Borrar
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {registroEditando && (
        <RunbookEditorModal
          item={registroEditando}
          onClose={() => setRegistroEditando(null)}
          onSave={handleGuardarEdicion}
        />
      )}
    </div>
  );
}