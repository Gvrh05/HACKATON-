import { useState } from 'react';
import { parsedProblems } from '../../data/zabbixData';

interface AiConsoleProps {
  zoneName: string;
  onBack: () => void;
}

export default function AiConsole({ zoneName, onBack }: AiConsoleProps) {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'High' | 'Warning'>('ALL');

  // Filtrar las alertas que pertenecen UNICAMENTE a esta zona seleccionada
  const activeZoneProblems = parsedProblems.filter(
    (p) => p.zone === zoneName && p.status === 'PROBLEM'
  );

  // Filtrar por Severidad si el usuario técnico lo solicita
  const filteredProblems = severityFilter === 'ALL'
    ? activeZoneProblems
    : activeZoneProblems.filter((p) => p.severity === severityFilter);

  // Estadísticas operativas en tiempo real de la zona
  const totalAlerts = activeZoneProblems.length;
  const highSeverityCount = activeZoneProblems.filter((p) => p.severity === 'High').length;
  const powerIssuesCount = activeZoneProblems.filter(
    (p) => p.problem.toLowerCase().includes('power') || p.problem.toLowerCase().includes('flujo')
  ).length;

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Panel Superior de Navegación Operativa */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          
          {/* BOTÓN ATRÁS OPTIMIZADO */}
          <button 
            onClick={onBack}
            className="px-4 py-2.5 bg-slate-100 hover:bg-green-600 hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-2 cursor-pointer group shadow-sm font-sans"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform text-sm font-bold">←</span> 
            Regiones
          </button>
          
          <div>
            <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider font-mono">
              AIOps Topology & Triage Console
            </div>
            <h2 className="text-2xl font-bold text-slate-800 font-display tracking-tight">
              Región: <span className="text-green-600">{zoneName}</span>
            </h2>
          </div>
        </div>

        {/* selectores de severidad rápidos para diagnóstico rápido */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto">
          <button 
            onClick={() => setSeverityFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${severityFilter === 'ALL' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Todos ({totalAlerts})
          </button>
          <button 
            onClick={() => setSeverityFilter('High')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${severityFilter === 'High' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-rose-600'}`}
          >
            High ({highSeverityCount})
          </button>
          <button 
            onClick={() => setSeverityFilter('Warning')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${severityFilter === 'Warning' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-amber-600'}`}
          >
            Warnings ({totalAlerts - highSeverityCount})
          </button>
        </div>
      </div>

      {/* Tarjetas de Diagnóstico de Impacto y Salud Física */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estado de Conectividad</p>
            <p className="text-2xl font-black font-mono text-slate-800 mt-1">
              {highSeverityCount > 0 ? `${highSeverityCount} Caídos` : 'Estable'}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${highSeverityCount > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-green-50 text-green-600'}`}>
            {highSeverityCount > 0 ? '⚠️' : '✓'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fallas de Energía (Fuentes)</p>
            <p className="text-2xl font-black font-mono text-amber-600 mt-1">
              {powerIssuesCount} Alertas
            </p>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dispositivo Principal Detectado</p>
            <p className="text-sm font-bold text-slate-700 mt-2 truncate max-w-[200px]">
              {filteredProblems[0]?.host.split(" ")[0] || 'Ninguno'}
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-mono font-bold text-[10px]">
            CGR
          </div>
        </div>

      </div>

      {/* Bloque del Correlación Inteligente de Incidentes */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-mono font-bold rounded border border-green-500/30 uppercase tracking-wider">
            Diagnóstico de Causa Raíz (RCA)
          </span>
          <span className="text-xs text-slate-400 font-mono">• Analizador Topológico</span>
        </div>
        
        {highSeverityCount > 0 && powerIssuesCount > 0 ? (
          <div>
            <h3 className="text-lg font-bold text-green-400 font-display">
              Efecto Cascada por Degradación de Suministro Eléctrico
            </h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed max-w-5xl">
              El motor identifica que las alarmas de tipo <span className="text-rose-400 font-mono">ICMP ping down</span> están precedidas cronológicamente por fallas críticas en las fuentes de poder DC de los routers de la zona. Se recomienda validar breakers e inversores en el sitio físico de distribución.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-slate-200 font-display">
              Monitoreo y Alertas Crónicas en la Zona
            </h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed max-w-5xl">
              No se detecta un patrón de caída masiva concurrente en este instante. Sin embargo, existen eventos individuales con duraciones prolongadas que degradan la redundancia física de la red regional.
            </p>
          </div>
        )}
      </div>

      {/* Lista técnica detallada de filas de Zabbix */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Registros Activos Filtrados ({filteredProblems.length})
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Filtro: {severityFilter}</span>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400 font-medium bg-slate-50/50">
            No existen alertas activas para los filtros seleccionados en esta región.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProblems.map((problem) => (
              <div key={problem.id} className="p-6 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-sans">
                
                {/* Detalles técnicos de la alerta */}
                <div className="space-y-2 max-w-4xl">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase font-mono border ${
                      problem.severity === 'High' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {problem.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {problem.hostId}
                    </span>
                    <span className="text-xs text-slate-700 font-semibold truncate max-w-xs">
                      {problem.host.replace(problem.hostId, '').trim()}
                    </span>
                  </div>
                  
                  <p className="text-sm font-bold text-slate-800 tracking-tight font-mono">
                    {problem.problem}
                  </p>

                  {/* Tags exactas de Zabbix */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {problem.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-slate-50 border border-slate-150 text-slate-400 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Métricas de tiempo de Zabbix a la derecha */}
                <div className="flex lg:flex-col items-end justify-between lg:justify-center text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Duración:</span>
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50/60 px-2 py-0.5 rounded border border-rose-100 lg:ml-1.5">
                      {problem.duration}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1.5 font-mono">
                    {problem.time}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}