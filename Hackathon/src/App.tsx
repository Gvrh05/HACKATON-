import { useState, useEffect } from 'react';
import ZonesView from './components/dashboard/ZonesView';
import ZoneDetailsView from './components/dashboard/ZoneDetailsView';
import GlobalHistoryView from './components/dashboard/GlobalHistoryView';

import { obtenerProblemasRealesZabbix } from './services/zabbixService';
import { calculateZoneSummaries, type ZabbixProblem } from './data/zabbixData';

function App() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [verHistorial, setVerHistorial] = useState<boolean>(false);
  
  const [parsedProblems, setParsedProblems] = useState<ZabbixProblem[]>([]);
  const [zoneSummaries, setZoneSummaries] = useState<Array<{ name: string; electricCount: number; icmpCount: number }>>([]);

  useEffect(() => {
    obtenerProblemasRealesZabbix().then(data => {
      setParsedProblems(data);
      setZoneSummaries(calculateZoneSummaries(data));
    });
  }, []);

  // FILTRADO 100% DINÁMICO:
  const zoneProblems = selectedZone 
    ? parsedProblems.filter((p) => p.zone === selectedZone)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-green-500/30">
      
      {/* Barra superior (Fecha) */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex justify-end items-center text-xs font-medium">
        <span className="text-green-600 font-semibold">22 May 2026 00:26 UTC-6</span>
      </div>

      {/* Header Corporativo con Botón de Historial */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-md font-bold text-white text-xl tracking-wider font-display">
              CG
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 font-display tracking-tight">
                Coopeguanacaste <span className="text-green-600">AIOps</span>
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Sistema Inteligente de Mantenimiento Correctivo
              </p>
            </div>
          </div>

          {/* BOTÓN ELEGANTE EN EL HEADER PRINCIPAL (Solo visible en la pantalla de inicio) */}
          {!selectedZone && !verHistorial && (
            <button
              onClick={() => setVerHistorial(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              📖 Abrir Bitácora e Historial Global
            </button>
          )}

        </div>
      </header>

      {/* Contenido Principal con Enrutamiento Condicional Completo */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-6">
        
        {verHistorial ? (
          // Vista A: Bitácora global de soluciones cargadas
          <GlobalHistoryView onBack={() => setVerHistorial(false)} />
        ) : !selectedZone ? (
          // Vista B: Cuadrícula principal de zonas (Dashboard base)
          <ZonesView onSelectZone={setSelectedZone} zoneSummaries={zoneSummaries} />
        ) : (
          // Vista C: Detalle unificado de la zona seleccionada (Sin duplicados abajo)
          <div className="space-y-6">
            <ZoneDetailsView 
              zoneName={selectedZone} 
              onBack={() => setSelectedZone(null)} 
              zoneProblems={zoneProblems}
              allProblems={parsedProblems}
            />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;