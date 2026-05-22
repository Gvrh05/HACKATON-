import { useState } from 'react';
import { zoneSummaries } from '../../data/zabbixData';

interface ZonesViewProps {
  onSelectZone: (zoneName: string) => void;
}

export default function ZonesView({ onSelectZone }: ZonesViewProps) {
  // Estados para el buscador y los filtros rápidos
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'POWER' | 'ICMP'>('ALL');

  // Lógica de filtrado en tiempo real
  const filteredZones = zoneSummaries.filter((zone) => {
    // 1. Filtrar por término de búsqueda
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Filtrar por tipo de avería activa
    if (activeFilter === 'POWER') return matchesSearch && zone.electricCount > 0;
    if (activeFilter === 'ICMP') return matchesSearch && zone.icmpCount > 0;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider font-mono">
            Network Operations Center • Guanacaste
          </div>
          <h2 className="text-3xl font-bold text-slate-800 font-display tracking-tight">
            Resumen de Regiones Activas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Panel interactivo de topologías y estado crítico de infraestructura.
          </p>
        </div>
      </div>

      {/* BARRA DE FILTROS Y BUSCADOR INTERACTIVO */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
        
        {/* Buscador de Texto */}
        <div className="relative w-full lg:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar región (ej: Tamarindo, Jicaral)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Selectores de Estado / Filtros Rápidos */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full lg:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'ALL' 
                ? 'bg-white shadow-sm text-slate-800' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todas ({zoneSummaries.length})
          </button>
          <button
            onClick={() => setActiveFilter('POWER')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'POWER' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'text-slate-500 hover:text-amber-600'
            }`}
          >
            <span className="text-sm">⚡</span> Energía
          </button>
          <button
            onClick={() => setActiveFilter('ICMP')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'ICMP' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-500 hover:text-rose-600'
            }`}
          >
            <span className="text-sm">⚠️</span> Caídos
          </button>
        </div>
      </div>

      {/* Mensaje de aviso si no encuentra nada */}
      {filteredZones.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-sm text-slate-400 font-medium font-sans my-6">
          No se encontraron regiones con el criterio de búsqueda seleccionado.
        </div>
      )}

      {/* Grid Dinámico de Regiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredZones.map((zone) => {
          const totalIncidentes = zone.electricCount + zone.icmpCount;
          
          return (
<div 
  key={zone.name}
  onClick={() => onSelectZone(zone.name)} // <--- ESTO DISPARA EL CAMBIO DE PANTALLA
  className="cursor-pointer hover:scale-[1.01] transition-transform"
>
              {/* Línea verde superior decorativa en hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-green-500 transition-colors"></div>

              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-700 transition-colors font-display tracking-tight truncate max-w-[180px]">
                    {zone.name}
                  </h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${
                    totalIncidentes > 0 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {totalIncidentes} {totalIncidentes === 1 ? 'evento' : 'eventos'}
                  </span>
                </div>
                
                {/* Desglose de fallas */}
                <div className="mt-5 space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <span className="text-amber-500 text-sm">⚡</span> Energía:
                    </span>
                    <span className={`font-bold px-2 py-0.5 rounded-md font-mono ${
                      zone.electricCount > 0 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'text-slate-400'
                    }`}>
                      {zone.electricCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <span className="text-rose-500 text-sm">📡</span> Enlaces:
                    </span>
                    <span className={`font-bold px-2 py-0.5 rounded-md font-mono ${
                      zone.icmpCount > 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'text-slate-400'
                    }`}>
                      {zone.icmpCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pie de la tarjeta interactiva */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 group-hover:text-green-600 transition-colors">
                <span>Inspeccionar Averías</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform text-lg leading-none">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}