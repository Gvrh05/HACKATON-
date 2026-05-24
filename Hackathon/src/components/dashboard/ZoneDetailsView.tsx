import { useState } from 'react';
import { buscarSolucionEnHistorial, guardarOActualizarSolucion, ErrorKnowledge } from '../../data/knowledgeBase';
import { consultarIA } from '../../services/aiService'; 

interface ZoneDetailsViewProps {
  zoneName: string;
  zoneProblems: any[]; 
  onBack: () => void;
}

export default function ZoneDetailsView({ zoneName, zoneProblems, onBack }: ZoneDetailsViewProps) {
  const [analizandoId, setAnalizandoId] = useState<string | null>(null);
  const [solucionesAbiertas, setSolucionesAbiertas] = useState<{ [key: string]: ErrorKnowledge }>({});
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [solucionesVisibles, setSolucionesVisibles] = useState<{ [key: string]: boolean }>({});

  const actualizarCausa = (cardId: string, nuevaCausa: string) => {
    setSolucionesAbiertas(prev => ({
      ...prev,
      [cardId]: { ...prev[cardId], possibleCauses: [nuevaCausa] }
    }));
  };

  const actualizarPaso = (cardId: string, indexPaso: number, nuevaDescripcion: string) => {
    setSolucionesAbiertas(prev => {
      const solucion = prev[cardId];
      const pasosActuales = solucion.solutionSteps || [];
      const nuevosPasos = [...pasosActuales];
      if (nuevosPasos[indexPaso]) {
        nuevosPasos[indexPaso] = { ...nuevosPasos[indexPaso], description: nuevaDescripcion };
      }
      return { ...prev, [cardId]: { ...solucion, solutionSteps: nuevosPasos } };
    });
  };

  const handleConsultarDiagnostico = async (problema: any) => {
    const cardId = problema.id || problema.time;
    
    if (solucionesAbiertas[cardId]) {
      setSolucionesVisibles(prev => ({ ...prev, [cardId]: !prev[cardId] }));
      return;
    }

    setAnalizandoId(cardId);

    try {
      const solucionExistente = buscarSolucionEnHistorial(problema.problem);
      
      if (solucionExistente) {
        setSolucionesAbiertas(prev => ({ 
          ...prev, 
          [cardId]: { ...solucionExistente, createdBy: "Historial" } 
        }));
        setSolucionesVisibles(prev => ({ ...prev, [cardId]: true }));
        setAnalizandoId(null);
        return;
      }

      let respuestaCrudaGemini = "";
      try {
        respuestaCrudaGemini = await consultarIA(problema, []);
      } catch (e) {
        console.error("Fallo de conexión con Gemini API:", e);
      }

      if (!respuestaCrudaGemini || respuestaCrudaGemini.includes("Lo sentimos, hubo un problema") || respuestaCrudaGemini.length < 15) {
        alert("Error: El núcleo de IA no pudo generar un diagnóstico en tiempo real. Intente nuevamente.");
        setAnalizandoId(null);
        return;
      }

      // 🌟 NUEVA LÓGICA DE LECTURA (PARSER INTELIGENTE)
      const lineas = respuestaCrudaGemini.split('\n').filter(l => l.trim().length > 0);
      
      // Buscamos dónde empiezan exactamente los pasos de solución (buscando palabras clave o un número con punto "1.")
      const indexInicioPasos = lineas.findIndex(l => 
        l.toUpperCase().includes('PASO') || 
        l.toUpperCase().includes('ACCIÓN') || 
        l.toUpperCase().includes('PLAN') ||
        /^\d+[\.\)]/.test(l.trim())
      );

      let explicacionIA = "";
      let lineasPasos = [];

      // Separamos la explicación (todo lo de arriba) de los pasos (todo lo de abajo)
      if (indexInicioPasos > 0) {
        explicacionIA = lineas.slice(0, indexInicioPasos).join(' '); // Toda la explicación generada por la IA
        lineasPasos = lineas.slice(indexInicioPasos);
      } else {
        // Si la IA no puso pasos, tomamos la primera línea como explicación y el resto como pasos
        explicacionIA = lineas[0];
        lineasPasos = lineas.slice(1);
      }

      // Limpiamos los asteriscos de Markdown y títulos redundantes que la IA a veces pone
      const causaLimpia = explicacionIA
        .replace(/CAUSAS INFERIDAS:/i, '')
        .replace(/CAUSA RAÍZ:/i, '')
        .replace(/¿QUÉ ESTÁ PASANDO\?:/i, '')
        .replace(/[*#-]/g, '')
        .trim();

      const pasosSolucion = lineasPasos
        .filter(l => !l.toUpperCase().includes('PASOS DE SOLUCIÓN') && !l.toUpperCase().includes('PLAN DE ACCIÓN'))
        .map((desc, i) => ({ 
          step: i + 1, 
          description: desc.replace(/^\d+[\.\)]/, '').replace(/[*#-]/g, '').trim() 
        })).filter(p => p.description.length > 0); // Evitamos pasos vacíos

      const sugerenciaIA: ErrorKnowledge = {
        id: `rule-${Date.now()}`,
        pattern: problema.problem,
        title: `Análisis Predictivo de Incidencia Fresh`,
        createdBy: "IA", 
        possibleCauses: [causaLimpia || "La IA detectó una anomalía, pero no generó una descripción en texto claro."],
        solutionSteps: pasosSolucion.length > 0 ? pasosSolucion : [{ step: 1, description: "Monitorear comportamiento." }]
      };

      setSolucionesAbiertas(prev => ({ ...prev, [cardId]: sugerenciaIA }));
      setSolucionesVisibles(prev => ({ ...prev, [cardId]: true }));
    } catch (error) {
      console.error("Error crítico procesando diagnóstico:", error);
    } finally {
      setAnalizandoId(null);
    }
  };

  const handleGuardarEnHistorial = (cardId: string, solucion: ErrorKnowledge) => {
    const solucionParaGuardar: ErrorKnowledge = { ...solucion, createdBy: "Historial" };
    guardarOActualizarSolucion(solucionParaGuardar);
    setSolucionesAbiertas(prev => ({ ...prev, [cardId]: solucionParaGuardar }));
    alert("¡Solución de contingencia registrada exitosamente en la Bitácora Global!");
  };

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      
      <button onClick={onBack} className="text-xs font-bold text-slate-500 hover:text-green-600 transition flex items-center gap-1 cursor-pointer">
        ← Volver al mapa de regiones
      </button>

      <div className="border-b border-slate-100 pb-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Averías Activas: <span className="text-green-700">{zoneName}</span>
        </h2>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-slate-50/50 p-6 space-y-4">
        {(!zoneProblems || zoneProblems.length === 0) ? (
          <p className="text-sm text-slate-400 text-center py-6">No hay alertas críticas en esta zona comercial 🎉</p>
        ) : (
          zoneProblems.map((p, index) => {
            const cardId = p.id || p.time;
            const estaAnalizando = analizandoId === cardId;
            const solucion = solucionesAbiertas[cardId];
            const estaVisible = solucionesVisibles[cardId];
            const yaExisteEnHistorial = buscarSolucionEnHistorial(p.problem);

            return (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative transition-all">
                
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        p.severity === 'Disaster' || p.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {(p.severity || 'Warning').toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-slate-700">{p.host || "Desconocido"}</span>
                      
                      {yaExisteEnHistorial && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold border border-blue-200">
                          📖 Resuelto en Historial
                        </span>
                      )}
                    </div>

                    <h3 className="font-mono text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                      {p.problem}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono">{p.time}</span>
                    <button
                      onClick={() => handleConsultarDiagnostico(p)}
                      disabled={estaAnalizando}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all text-white cursor-pointer ${
                        solucion 
                          ? 'bg-slate-700 hover:bg-slate-800' 
                          : yaExisteEnHistorial 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-amber-500 hover:bg-amber-600'
                      }`}
                    >
                      {estaAnalizando ? <span className="animate-spin">⏳</span> : <span>{solucion ? (estaVisible ? '🔽' : '▶️') : '💡'}</span>}
                      <span>
                        {estaAnalizando 
                          ? "Buscando..." 
                          : solucion 
                            ? (estaVisible ? "Ocultar Solución" : "Mostrar Solución") 
                            : yaExisteEnHistorial 
                              ? "Ver Historial" 
                              : "Pedir Solución IA"}
                      </span>
                    </button>
                  </div>
                </div>

                {solucion && estaVisible && (
                  <div className="mt-4 border-t border-slate-100 pt-4 animate-fade-in">
                    <div className="bg-slate-900 rounded-xl p-4 text-slate-200">
                      <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
                        <span className={`font-mono text-xs font-bold ${solucion.createdBy === 'Historial' ? 'text-blue-400' : 'text-amber-400'}`}>
                          {solucion.createdBy === 'Historial' 
                            ? "📖 BASE DE CONOCIMIENTO LOCAL" 
                            : "🤖 DIAGNÓSTICO EN VIVO IA"}
                        </span>
                        {solucion.createdBy === "IA" && (
                          <button 
                            onClick={() => setEditandoId(editandoId === cardId ? null : cardId)}
                            className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-3 rounded flex items-center gap-2 border border-slate-600 transition"
                          >
                            {editandoId === cardId ? "👁️ Guardar Vista" : "✏️ Editar Texto"}
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3 text-xs">
                        <div>
                          <strong className="text-slate-400 text-[10px] block mb-2 uppercase tracking-wider">¿Qué está pasando? / Causa Raíz:</strong>
                          {editandoId === cardId ? (
                            <textarea 
                              className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded p-2 text-xs font-mono focus:border-amber-500 outline-none resize-y"
                              value={solucion.possibleCauses?.[0] || ""}
                              onChange={(e) => actualizarCausa(cardId, e.target.value)}
                              rows={3}
                            />
                          ) : (
                            <p className="text-slate-100 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                              {solucion.possibleCauses?.[0] || "No especificada."}
                            </p>
                          )}
                        </div>

                        <div className="pt-2">
                          <strong className="text-slate-400 text-[10px] block mb-2 uppercase tracking-wider">Plan de Acción Sugerido:</strong>
                          <ul className="space-y-2">
                            {(solucion.solutionSteps || []).map((paso, i) => (
                              <li key={i} className="flex gap-2 text-slate-300 items-start">
                                <span className="text-emerald-400 font-bold mt-1 shrink-0">[{paso.step || i+1}]</span>
                                {editandoId === cardId ? (
                                  <textarea 
                                    className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded p-2 text-xs font-mono focus:border-amber-500 outline-none resize-y"
                                    value={paso.description || ""}
                                    onChange={(e) => actualizarPaso(cardId, i, e.target.value)}
                                    rows={2}
                                  />
                                ) : (
                                  <span className="mt-1 leading-relaxed">{paso.description}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {solucion.createdBy === "IA" && (
                        <div className="mt-4 pt-2 border-t border-slate-800 text-right">
                          <button 
                            onClick={() => handleGuardarEnHistorial(cardId, solucion)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow"
                          >
                            💾 Guardar solución en Historial Global
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}