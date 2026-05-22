import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  Wifi, 
  WifiOff, 
  Terminal, 
  Sliders, 
  Search, 
  Bot, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  FileText, 
  Clock, 
  ArrowRight, 
  CornerDownRight, 
  Code, 
  Database, 
  Copy, 
  Check, 
  X,
  Play,
  Settings,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingDown,
  Timer,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ZabbixProblem, ZoneSummary, SuperIncident } from './types';

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'aiops_deck' | 'problem_view' | 'sandbox' | 'api_docs'>('aiops_deck');
  
  // Storage State
  const [problems, setProblems] = useState<ZabbixProblem[]>([]);
  const [zones, setZones] = useState<ZoneSummary[]>([]);
  const [superIncidents, setSuperIncidents] = useState<SuperIncident[]>([]);
  const [noiseReductionPercent, setNoiseReductionPercent] = useState<number>(94);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Filter state for problem.view
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all'); // all, PROBLEM, RESOLVED
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchZoneTerm, setSearchZoneTerm] = useState<string>('');

  // AI Diagnostic panel
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<ZabbixProblem | null>(null);
  const [aiReport, setAiReport] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiModelUsed, setAiModelUsed] = useState<string>('');
  const [diagnosticOpen, setDiagnosticOpen] = useState<boolean>(false);

  // Copy check markers
  const [copiedTextId, setCopiedTextId] = useState<string>('');

  // Simulation Status
  const [simulatingOutage, setSimulatingOutage] = useState<string | null>(null);

  // Local clock state matching actual time context (representing 2026 Hackathon)
  const [currentTime, setCurrentTime] = useState<string>('2026-05-21 21:46:17');

  // Trigger loading data
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      // 1. Fetch zones
      const zoneRes = await fetch('/api/zabbix/zones');
      const zoneData = await zoneRes.json();
      if (zoneData.result) {
        setZones(zoneData.result);
      }

      // 2. Fetch problems
      const probRes = await fetch('/api/zabbix/problems');
      const probData = await probRes.json();
      if (probData.result) {
        setProblems(probData.result);
      }

      // 3. Fetch super incidents
      const incRes = await fetch('/api/zabbix/super-incidents');
      const incData = await incRes.json();
      if (incData.result) {
        setSuperIncidents(incData.result);
      }
      if (incData.noiseReductionPercent !== undefined) {
        setNoiseReductionPercent(incData.noiseReductionPercent);
      }
    } catch (e) {
      console.error("Error loading Zabbix API simulations:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Simulate current clock progressing
    const tInterval = setInterval(() => {
      const now = new Date();
      now.setFullYear(2026); // Maintain simulation year
      now.setMonth(4); // May
      now.setDate(21);
      const str = now.toLocaleTimeString('es-CR', { hour12: false }) + " UTC-6";
      setCurrentTime(`2026-05-21 ${str}`);
    }, 1000);

    return () => clearInterval(tInterval);
  }, []);

  // Sync / Reset Data
  const handleResetData = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/zabbix/reset', { method: 'POST' });
      await loadData(false);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  // Toggle problem status (PROBLEM <=> RESOLVED)
  const handleToggleState = async (problemId: string) => {
    try {
      const res = await fetch('/api/zabbix/problems/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: problemId })
      });
      if (res.ok) {
        // Optimistic update
        setProblems(prev => prev.map(p => {
          if (p.id === problemId) {
            const isProblem = p.status === 'PROBLEM';
            return {
              ...p,
              status: isProblem ? 'RESOLVED' : 'PROBLEM',
              recoveryTime: isProblem ? '2026-05-21 08:05:17 PM' : '',
              duration: isProblem ? 'Resuelto' : '23s'
            };
          }
          return p;
        }));
        // Reload in background
        loadData(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Request Gemini / AI Troubleshooting
  const handleAiTroubleshoot = async (prob: ZabbixProblem) => {
    setSelectedDiagnostic(prob);
    setAiLoading(true);
    setDiagnosticOpen(true);
    setAiReport('');
    setAiModelUsed('');

    try {
      const response = await fetch('/api/gemini/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: prob.id,
          problemText: prob.problem,
          host: prob.host,
          severity: prob.severity,
          tags: prob.tags,
          zone: prob.zone
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiReport(data.text);
        setAiModelUsed(data.modelUsed || 'gemini-3.5-flash');
      } else {
        setAiReport(`### ❌ Error de Procesamiento técnica
No se pudo contactar con el motor inteligente. Motivo: ${data.error || 'Servicio no disponible'}.`);
      }
    } catch (e: any) {
      setAiReport(`### ❌ Excepción de Conexión
Error al enviar solicitud al proxy local full-stack: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Simulate an Outage Storm in Sandbox
  const handleTriggerOutage = async (type: 'caimital_blackout' | 'bahia_gigante_fiber' | 'vientos_costeros') => {
    setSimulatingOutage(type);
    try {
      // Simulate real physical incident by modifying the active problem store
      // We will perform a fetch to server if needed or append locally for simulation
      if (type === 'caimital_blackout') {
        // Set PLANTA DC CMTL and neighbors to PROBLEMA and trigger alert storm
        setProblems(prev => {
          return prev.map(p => {
            if (p.host.includes("Caimital") || p.host.includes("CMTL") || p.host.includes("Pozo de Agua") || p.host.includes("Dominicas")) {
              return {
                ...p,
                status: 'PROBLEM',
                recoveryTime: '',
                time: '2026-05-21 09:56:43 PM',
                duration: 'Just now'
              };
            }
            return p;
          });
        });
      } else if (type === 'vientos_costeros') {
        setProblems(prev => {
          return prev.map(p => {
            if (p.host.includes("Tamarindo") || p.host.includes("Playas del Coco") || p.host.includes("Sardinal")) {
              return {
                ...p,
                status: 'PROBLEM',
                problem: 'Cisco IOS: CGR1000 DC power supply: Power supply is in warning state',
                severity: 'Warning',
                time: '2026-05-21 10:45:26 AM',
                recoveryTime: '',
                duration: 'Just now'
              };
            }
            return p;
          });
        });
      }
      setTimeout(() => {
        setSimulatingOutage(null);
        loadData(true); // Sync with actual values
      }, 1500);
    } catch (err) {
      setSimulatingOutage(null);
    }
  };

  // Helper for copy to clipboard
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(''), 2000);
  };

  // Custom parser to translate markdown-like response from Gemini into HTML tags beautifully
  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-semibold text-slate-800 mt-5 mb-2 border-b border-slate-200 pb-1 font-display tracking-tight flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#00A34F]" /> {line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-slate-900 mt-6 mb-3 font-display tracking-tight text-emerald-800">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-3 font-display tracking-tight uppercase text-emerald-950 border-l-4 border-[#00A34F] pl-2">{line.replace('# ', '')}</h2>;
      }
      
      // Code Blocks markers
      if (line.trim().startsWith('```')) {
        return null; // Skip raw triple backticks lines
      }

      // Check bullet items
      if (line.trim().startsWith('- ')) {
        const cleanContent = line.replace('- ', '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-600 mb-1.5 leading-relaxed">
            {parseInlineStyling(cleanContent)}
          </li>
        );
      }

      // Check numbers
      const numberedMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        return (
          <div key={idx} className="flex gap-2 ml-1 my-1.5">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">{numberedMatch[1]}</span>
            <span className="text-xs text-slate-600 leading-relaxed">{parseInlineStyling(numberedMatch[2])}</span>
          </div>
        );
      }

      // Default text / check for code snippets
      if (line.includes('`')) {
        // Render command line block if it looks like code
        if (line.trim().startsWith('show ') || line.trim().startsWith('#') || line.trim().startsWith('ping ')) {
          return (
            <div key={idx} className="bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-lg my-2 overflow-x-auto border-l-2 border-emerald-500 shadow-inner">
              {line}
            </div>
          );
        }
      }

      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2 font-sans">
          {parseInlineStyling(line)}
        </p>
      );
    });
  };

  // Parse inline **bold** and `code` markers
  const parseInlineStyling = (txt: string) => {
    let parts: React.ReactNode[] = [txt];
    
    // Bold replacement
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let boldParts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    let textToParse = txt;
    // Simple inline parser
    if (textToParse.includes('**')) {
      const subparts = textToParse.split('**');
      return subparts.map((p, i) => i % 2 !== 0 ? <strong className="font-semibold text-slate-900" key={i}>{p}</strong> : p);
    }
    
    if (textToParse.includes('`')) {
      const subparts = textToParse.split('`');
      return subparts.map((p, i) => i % 2 !== 0 ? <code className="bg-slate-100 text-rose-600 font-mono text-[11px] px-1 py-0.5 rounded" key={i}>{p}</code> : p);
    }

    return txt;
  };

  // Helper values
  const activeProblemsCount = problems.filter(p => p.status === 'PROBLEM').length;
  const warningsCount = problems.filter(p => p.status === 'PROBLEM' && p.severity === 'Warning').length;
  const highCount = problems.filter(p => p.status === 'PROBLEM' && p.severity === 'High').length;
  const averageCount = problems.filter(p => p.status === 'PROBLEM' && p.severity === 'Average').length;

  // Render Status Badge
  const getSeverityBadge = (sev: ZabbixProblem['severity']) => {
    switch (sev) {
      case 'Warning':
        return <span className="bg-amber-500/10 text-amber-450 border border-amber-500/25 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider select-none">Warning</span>;
      case 'Average':
        return <span className="bg-orange-500/10 text-orange-450 border border-orange-500/25 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider select-none">Average</span>;
      case 'High':
        return <span className="bg-rose-500/10 text-rose-450 border border-rose-500/25 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider select-none">High</span>;
      default:
        return <span className="bg-slate-800 text-slate-350 border border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider select-none">{sev}</span>;
    }
  };

  // Dynamic filter lists
  const filteredProblems = problems.filter(p => {
    const matchesZone = selectedZone === 'all' || p.zone.toLowerCase() === selectedZone.toLowerCase();
    const matchesSeverity = selectedSeverity === 'all' || p.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      p.host.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.zone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesZone && matchesSeverity && matchesStatus && matchesSearch;
  });

  const sidebarZonesFiltered = zones.filter(z => 
    z.name.toLowerCase().includes(searchZoneTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-300 flex flex-col font-sans antialiased">
      
      {/* GLOBAL SYSTEM BAR */}
      <div className="bg-[#0D1117] border-b border-slate-800 text-slate-400 text-xs px-4 py-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] text-slate-300">NOC Coopeguanacaste LIVE Telemetría</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 flex items-center gap-1"><Server className="w-3.5 h-3.5" /> API Zabbix v7.2.3</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-1 items-center bg-slate-800/80 px-2 py-0.5 rounded font-mono text-[11px] text-emerald-400">
            <Clock className="w-3 h-3 text-slate-500" /> {currentTime}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleResetData()} 
              disabled={refreshing}
              className="text-indigo-400 hover:text-indigo-200 transition-colors flex items-center gap-1 text-[11px] font-semibold bg-indigo-950/40 px-2 py-1 rounded border border-indigo-800/30 font-display cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Reiniciar Simulación
            </button>
          </div>
        </div>
      </div>

      {/* PRIMARY HEADER */}
      <header className="bg-[#161B22] border-b border-slate-700/50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Logo container utilizing precise SVG representing Coopeguanacaste green style */}
          <div className="bg-indigo-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/10">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-white tracking-tight">Coopeguanacaste AIOps</h1>
              <span className="bg-indigo-650/40 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">MUT-UNA</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">Panel de Mantenimiento Correctivo Inteligente y Detección de Fallas Causa Raíz basado en IA</p>
          </div>
        </div>
        
        {/* EXECUTIVE RISK WIDGET */}
        <div className="flex gap-4 self-stretch md:self-auto shrink-0 overflow-x-auto py-1">
          <div className="bg-[#161B22] border border-rose-500/20 px-4 py-2.5 rounded-xl flex items-center gap-3">
            <div className="bg-rose-500/10 p-2 rounded-lg text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multa Proyectada SLA</div>
              <div className="text-sm font-bold text-rose-300 font-mono">
                {activeProblemsCount > 5 ? "$45,000" : activeProblemsCount > 0 ? "$15,000" : "$0"} USD <span className="text-[10px] text-slate-500 font-sans font-normal">/ h</span>
              </div>
            </div>
          </div>

          <div className="bg-[#161B22] border border-emerald-500/20 px-4 py-2.5 rounded-xl flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supresión de Alertas</div>
              <div className="text-sm font-bold text-emerald-300 font-mono">
                {noiseReductionPercent}% <span className="text-[10px] text-emerald-400 font-sans font-semibold">Menos Ruido</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS SECTION */}
      <div className="bg-[#12161D] border-b border-slate-700/50 px-6 flex justify-between items-center">
        <ul className="flex gap-6 overflow-x-auto scrollbar-none py-1">
          <li>
            <button 
              onClick={() => setActiveTab('aiops_deck')}
              className={`py-3.5 px-1.5 focus:outline-none border-b-2 text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'aiops_deck' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Consola de Triaje AIOps
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('problem_view')}
              className={`py-3.5 px-1.5 focus:outline-none border-b-2 text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'problem_view' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              Zabbix problem.view ({problems.length})
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('sandbox')}
              className={`py-3.5 px-1.5 focus:outline-none border-b-2 text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'sandbox' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Sandbox de Simulación
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('api_docs')}
              className={`py-3.5 px-1.5 focus:outline-none border-b-2 text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'api_docs' 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              Zabbix & Gemini API Endpoints
            </button>
          </li>
        </ul>
        <div className="flex gap-2 items-center text-xs text-slate-400">
          <span className="font-mono bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700/30">SLA: 99.85%</span>
        </div>
      </div>

      {/* CORE WRAPPER */}
      <main className="grow p-6 flex flex-col">
        {loading ? (
          <div className="grow flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-400 font-mono tracking-wider">Cargando telemetría de monitoreo Zabbix...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: AIOPS INCIDENT CONSOL CONSOLE */}
            {activeTab === 'aiops_deck' && (
              <motion.div 
                key="aiops_deck"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 flex flex-col grow"
              >
                {/* METRIC RIBBON */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#161B22] p-4 rounded-xl border border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Problemas Críticos Raw (Zabbix)</p>
                      <h3 className="text-2xl font-bold font-mono text-white mt-1">{activeProblemsCount}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Nodos secundarios reportando fallas</p>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded-lg text-slate-300 border border-slate-700">
                      <Server className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-[#161B22] p-4 rounded-xl border border-slate-700/50 shadow-sm flex items-center justify-between font-sans">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Incidentes Consolidados por IA</p>
                      <h3 className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                        {superIncidents.filter(s => s.status !== 'RESOLVED').length}
                      </h3>
                      <p className="text-[10px] text-indigo-400/80 font-semibold mt-1">Paciente Cero Identificado</p>
                    </div>
                    <div className="bg-indigo-950/40 text-indigo-400 p-2.5 rounded-lg border border-indigo-500/20">
                      <Bot className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  <div className="bg-[#161B22] p-4 rounded-xl border border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MTTR (Tiempo Medio de Triage)</p>
                      <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-baseline gap-1">
                        1.4 <span className="text-xs font-normal text-emerald-500">min</span>
                      </h3>
                      <p className="text-[10px] text-emerald-400/80 font-semibold mt-1">⚡ Reducción del 93.5%</p>
                    </div>
                    <div className="bg-emerald-950/40 text-emerald-400 p-2.5 rounded-lg border border-emerald-500/20">
                      <Timer className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-[#12161D] p-4 rounded-xl border border-slate-700/50 shadow-md flex items-center justify-between text-white">
                    <div>
                      <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Estado de Alerta de Fatiga</p>
                      <h3 className="text-lg font-bold font-display mt-1 tracking-tight text-indigo-400">SILENCIADO</h3>
                      <p className="text-[10px] text-slate-400/80 mt-1">Supresión inteligente de alarmas</p>
                    </div>
                    <div className="bg-indigo-950/60 text-indigo-300 p-2.5 rounded-lg border border-indigo-500/30">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* CENTRAL STORM COMPARISON */}
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-3 items-start">
                    <div className="bg-amber-600/20 border border-amber-500/30 text-amber-400 p-2 rounded-lg mt-0.5 animate-pulse">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-400 font-display">Simulador de "Tormenta de Alertas" (Zabbix Default vs AIOps)</h4>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        Cuando falla un router core (ej: **OLT Caimital**), Zabbix satura el NOC con decenas de correos y alertas en rojo. 
                        El enfoque del jurado exige clasificar este problema como **"Mantenimiento Correctivo Inteligente"**. Nuestro sistema suprime este ruido y une las alertas en pocos **Súper-Incidentes**.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('sandbox')}
                    className="bg-amber-600 text-white font-semibold text-xs py-2 px-3 rounded-lg hover:bg-amber-500 transition shadow-sm w-full md:w-auto text-nowrap cursor-pointer"
                  >
                    Probar en Sandbox →
                  </button>
                </div>

                {/* EXECUTIVE SUPER-INCIDENTS DIRECTORY */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Super-Incidentes Consolidados por IA (AIOps)
                    </h3>
                    <span className="text-xs text-slate-500">Mapeado automáticamente por correlación topológica</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {superIncidents.map(inc => {
                      const isActive = inc.status !== 'RESOLVED';
                      return (
                        <div 
                          key={inc.id}
                          className={`bg-[#161B22] rounded-xl border border-slate-700/50 transition-all duration-200 overflow-hidden shadow-sm ${
                            isActive ? 'border-l-4 border-l-rose-500' : 'opacity-60'
                          }`}
                        >
                          <div className="p-5 flex flex-col lg:flex-row justify-between gap-4">
                            <div className="space-y-3 grow">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-extrabold font-mono tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50`}>
                                  {inc.id.toUpperCase()}
                                </span>
                                <h4 className="text-sm font-bold text-white font-display">{inc.title}</h4>
                                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                                  isActive ? 'bg-amber-500/20 text-amber-450 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                  {inc.status}
                                </span>
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] bg-[#12161D] p-2.5 rounded-lg border border-slate-700/30">
                                <div>
                                  <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Paciente Cero (Host)</span>
                                  <span className="font-mono font-medium text-slate-200">{inc.rootCauseHost}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Dispositivo Técnico</span>
                                  <span className="text-slate-300 italic">{inc.rootCauseDevice}</span>
                                </div>
                                <div className="hidden sm:block">
                                  <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Impacto Generado</span>
                                  <span className="text-slate-200 font-medium">{inc.impact}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Alertas Conectadas en Zabbix</span>
                                  <span className="bg-rose-500/15 text-rose-400 border border-rose-500/20 font-mono font-bold px-1.5 py-0.2 rounded inline-block mt-0.5">
                                    {inc.suppressedAlertsCount} Alertas Suprimidas
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-700/50 pt-4 lg:pt-0 lg:pl-4 flex flex-col justify-between gap-4">
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plan Sugerido IA</span>
                                <p className="text-xs text-slate-300 font-medium leading-relaxed">{inc.mitigationAction}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    // Trigger troubleshooting view for the Root cause node
                                    const representativeProblem = problems.find(p => p.host === inc.rootCauseHost) || inc.correlatedProblems[0];
                                    if (representativeProblem) {
                                      handleAiTroubleshoot(representativeProblem);
                                    }
                                  }}
                                  className="grow bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-500/10 cursor-pointer"
                                >
                                  <Bot className="w-4 h-4" />
                                  Ver Reporte de Triaje IA
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Correlated problems list dropdown drawer inside incident card */}
                          <div className="bg-[#0D1117] border-t border-slate-850 px-5 py-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                              Detalle de Alarmas Suprimidas del Árbol de Falla
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {inc.correlatedProblems.map(p => (
                                <div key={p.id} className="bg-[#161B22] border border-slate-700/50 rounded px-2 py-1 text-[10px] font-mono font-medium text-slate-300 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                  <span className="text-indigo-405">{p.host.split(" ")[0]}:</span>
                                  <span className="text-slate-400 truncate max-w-[120px]">{p.problem}</span>
                                </div>
                              ))}
                              {inc.correlatedProblems.length === 0 && (
                                <span className="text-xs text-slate-500 italic">No hay alertas activas de este incidente en el pool de Zabbix</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: FULL ZABBIX REPLICA DASHBOARD (problem.view) */}
            {activeTab === 'problem_view' && (
              <motion.div 
                key="problem_view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 grow"
              >
                {/* SIDEBAR: NETWORK ZONES LIST */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-[#12161D] p-4 rounded-xl border border-slate-700/50 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-indigo-450" />
                        Zonas de Guanacaste
                      </h3>
                      <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700">{zones.length}</span>
                    </div>

                    {/* Search Zone Input */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Buscar zona/cantón..."
                        value={searchZoneTerm}
                        onChange={(e) => setSearchZoneTerm(e.target.value)}
                        className="bg-[#161B22] border border-slate-705 text-xs rounded-lg block w-full pl-9 pr-3 py-2 text-slate-300 placeholder-slate-550 border-slate-700 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Zone Selector list */}
                    <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                      <button
                        onClick={() => setSelectedZone('all')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex justify-between items-center cursor-pointer transition ${
                          selectedZone === 'all' 
                            ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' 
                            : 'bg-transparent border border-transparent text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>Todas las zonas</span>
                        <span className="font-mono text-[10px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded border border-slate-700">
                          {problems.filter(p => p.status === 'PROBLEM').length}
                        </span>
                      </button>

                      {sidebarZonesFiltered.map(z => (
                        <button
                          key={z.name}
                          onClick={() => setSelectedZone(z.name)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex justify-between items-center transition cursor-pointer ${
                            selectedZone === z.name 
                              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' 
                              : 'bg-transparent border border-transparent text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className={`w-2 h-2 rounded-full inline-block ${
                              z.activeProblems > 2 
                                ? 'bg-rose-500' 
                                : z.activeProblems > 0 
                                  ? 'bg-amber-500' 
                                  : 'bg-emerald-500'
                            }`} />
                            <span className="truncate">{z.name}</span>
                          </div>
                          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            z.activeProblems > 0 
                              ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' 
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}>
                            {z.activeProblems}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INFO MANUAL COOPERATIVE NOTES */}
                  <div className="bg-gradient-to-br from-indigo-950/70 to-[#12161D] border border-indigo-500/20 p-4 rounded-xl text-white space-y-2 shadow-sm relative overflow-hidden">
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-indigo-400">
                      <Bot className="w-32 h-32" />
                    </div>
                    <h4 className="text-xs font-extrabold tracking-wider uppercase text-indigo-400 font-display">Correctivo Inteligente</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      El triaje de la IA asiste al NOC en Guanacaste reduciendo la caminata y los tiempos muertos. Resuelve dudas de configuración de los routers residenciales y switches core sobre la marcha.
                    </p>
                  </div>
                </div>

                {/* MAIN GRID: THE problem.view TABLE */}
                <div className="lg:col-span-9 space-y-4">
                  <div className="bg-[#161B22] p-4 rounded-xl border border-slate-700/50 shadow-sm space-y-4">
                    
                    {/* PLUG FILTERS */}
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h2 className="text-sm font-bold font-display text-white uppercase">Zabbix problem.view (Replica Manual Coopeguanacaste)</h2>
                        <p className="text-[11px] text-slate-400 font-sans">
                          Filtrado por: <span className="font-semibold text-indigo-400 font-mono">{selectedZone === 'all' ? 'Todas las zonas' : selectedZone}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Filter */}
                        <select 
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="bg-[#12161D] border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="all">Ver Todos los Estados</option>
                          <option value="PROBLEM">PROBLEMAS ACTIVOS</option>
                          <option value="RESOLVED">RESUELTOS</option>
                        </select>

                        {/* Severity Filter */}
                        <select 
                          value={selectedSeverity} 
                          onChange={(e) => setSelectedSeverity(e.target.value)}
                          className="bg-[#12161D] border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="all">Todas las Severidades</option>
                          <option value="warning">Warning</option>
                          <option value="average">Average</option>
                          <option value="high">High</option>
                        </select>

                        {/* Search keyword */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                          <input 
                            type="text"
                            placeholder="Buscar en tabla..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#12161D] border border-slate-700 text-slate-300 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none w-44"
                          />
                        </div>
                      </div>
                    </div>

                    {/* LIST TABLE CONTAINER */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#12161D] text-slate-300 text-[10px] font-bold font-mono tracking-wider uppercase border-b border-slate-700/50">
                          <tr>
                            <th className="px-3 py-2.5 rounded-l-lg">Severidad</th>
                            <th className="px-3 py-2.5">Tiempo de Alarma</th>
                            <th className="px-3 py-2.5">Estado</th>
                            <th className="px-3 py-2.5">Equipo / Host Zabbix</th>
                            <th className="px-3 py-2.5">Problema Detectado</th>
                            <th className="px-3 py-2.5">Control</th>
                            <th className="px-3 py-2.5 text-right rounded-r-lg">Triaje IA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {filteredProblems.slice(0, 30).map((p, idx) => {
                            const isProblem = p.status === 'PROBLEM';
                            return (
                              <tr key={p.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800">
                                <td className="px-3 py-3 font-semibold">
                                  {getSeverityBadge(p.severity)}
                                </td>
                                <td className="px-3 py-3 text-[10.5px] font-mono text-slate-400 whitespace-nowrap">
                                  {p.time}
                                </td>
                                <td className="px-3 py-3">
                                  <button
                                    onClick={() => handleToggleState(p.id)}
                                    title="Hacer click para alternar estado de simulación"
                                    className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded cursor-pointer border ${
                                      isProblem 
                                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/20' 
                                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                                    }`}
                                  >
                                    {p.status}
                                  </button>
                                </td>
                                <td className="px-3 py-3 shrink-0">
                                  <div className="font-mono text-[11px] text-white font-semibold truncate max-w-[170px]" title={p.host}>
                                    {p.host}
                                  </div>
                                  <div className="text-[10px] text-indigo-400 font-bold">{p.zone}</div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="text-slate-200 font-medium font-sans leading-snug line-clamp-2 max-w-[320px]">
                                    {p.problem}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {p.tags.slice(0, 3).map((tag, i) => (
                                      <span key={i} className="text-[8.5px] bg-[#12161D] text-slate-400 border border-slate-700/50 font-mono px-1 py-0.2 rounded">{tag}</span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-3 py-3 font-mono text-[11px] text-slate-400">
                                  <span className="text-[10px] text-slate-500 block uppercase">Duración</span>
                                  {p.duration || 'N/A'}
                                </td>
                                <td className="px-3 py-3 text-right">
                                  <button
                                    onClick={() => handleAiTroubleshoot(p)}
                                    className="bg-indigo-650/10 hover:bg-indigo-650 text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-500 font-bold text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-1 ml-auto cursor-pointer transition duration-150 shadow-sm"
                                  >
                                    <Bot className="w-3.5 h-3.5" />
                                    <span>IA</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                          {filteredProblems.length === 0 && (
                            <tr>
                              <td colSpan={7} className="text-center py-8 text-slate-500 italic">
                                No se encontraron problemas filtrados que coincidan para esta zona.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {filteredProblems.length > 0 && (
                      <div className="text-[10.5px] text-slate-500 text-right font-mono italic pt-2">
                        Mostrando las primeras {Math.min(filteredProblems.length, 30)} alertas de {filteredProblems.length} coincidentes ({selectedZone === 'all' ? 'Toda Guanacaste' : selectedZone}).
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 3: SIMULATION SANDBOX / DEMO TO JURY */}
            {activeTab === 'sandbox' && (
              <motion.div 
                key="sandbox"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 grow"
              >
                {/* SIMULATION CARD CONTROLLER */}
                <div className="md:col-span-4 space-y-6">
                  <div className="bg-[#12161D] p-5 rounded-xl border border-slate-700/50 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-sm font-bold font-display text-white uppercase">Simulación de Desastres de Red (Hackathon Ready)</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Usa estos botones para demostrarle al jurado cómo el sistema reacciona e interpreta catástrofes en Guanacaste en tiempo real.</p>
                    </div>

                    <div className="space-y-3">
                      {/* Scenario 1 button */}
                      <button
                        onClick={() => handleTriggerOutage('caimital_blackout')}
                        disabled={simulatingOutage !== null}
                        className="w-full text-left p-3.5 rounded-xl border border-red-950 hover:border-red-500 bg-red-950/20 transition flex justify-between items-start gap-3 cursor-pointer group"
                      >
                        <div className="bg-rose-500/20 text-rose-450 border border-rose-500/30 p-2 rounded-lg group-hover:scale-95 transition-transform">
                          <Activity className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div className="grow space-y-1">
                          <div className="text-xs font-bold text-white group-hover:text-rose-400">Blackout OLT Central Caimital</div>
                          <p className="text-[10px] text-slate-355 leading-snug">Dispara la caída eléctrica nominal en Caimital CMTL y desata una avalancha de 12 alertas asociadas en subestaciones secundarias.</p>
                        </div>
                        <Play className="w-3.5 h-3.5 text-rose-400 rotate-0 mt-1 shrink-0" />
                      </button>

                      {/* Scenario 2 button */}
                      <button
                        onClick={() => handleTriggerOutage('vientos_costeros')}
                        disabled={simulatingOutage !== null}
                        className="w-full text-left p-3.5 rounded-xl border border-amber-950 hover:border-amber-500 bg-amber-950/20 transition flex justify-between items-start gap-3 cursor-pointer group"
                      >
                        <div className="bg-amber-500/20 text-amber-450 border border-amber-500/30 p-2 rounded-lg group-hover:scale-95 transition-transform">
                          <WifiOff className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div className="grow space-y-1">
                          <div className="text-xs font-bold text-white group-hover:text-amber-400">Tormenta / Vientos en Playa Coco y Tamarindo</div>
                          <p className="text-[10px] text-slate-355 leading-snug">Degrada la alimentación DC de las fuentes secundarias en los postes de la costa simultáneamente.</p>
                        </div>
                        <Play className="w-3.5 h-3.5 text-amber-400 mt-1 shrink-0" />
                      </button>
                    </div>

                    {/* SIMULON LOG */}
                    {simulatingOutage && (
                      <div className="bg-[#0D1117] text-indigo-400 font-mono text-[10px] p-3 rounded-lg border border-slate-800 space-y-1.5 animate-pulse">
                        <div className="flex items-center gap-1 text-white font-bold text-[11px]"><Terminal className="w-3 h-3 text-indigo-455"/> SIMULATION ENGINE ACTIVATED</div>
                        <div>&gt; Generando ráfagas de pings fallidos...</div>
                        <div>&gt; Desencadenando problem.view alert storm...</div>
                        <div>&gt; Agrupando logs bajo de topología de Coopeguanacaste...</div>
                      </div>
                    )}

                    <div className="border-t border-slate-800 pt-4">
                      <button
                        onClick={() => handleResetData()}
                        className="w-full bg-[#161B22] border border-slate-705 text-slate-350 font-bold text-xs py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-white transition text-center cursor-pointer"
                      >
                        Restaurar Todo al Estado Original
                      </button>
                    </div>
                  </div>
                </div>

                {/* THE DEMONSTRATION DIAGRAM / WORKFLOW CARD */}
                <div className="md:col-span-8 space-y-6">
                  <div className="bg-[#161B22] p-5 rounded-xl border border-slate-700/50 shadow-sm space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Comparación de Enfoques: Tradicional vs AIOps</h4>
                      <h3 className="text-sm font-bold text-white font-display">Cómo convencer al jurado en el Pitch del Hackathon</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Tradicional column */}
                      <div className="border border-red-950 bg-red-950/10 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold mb-3 uppercase">
                          <X className="w-4 h-4" /> Enfoque Tradicional (Zabbix Crudo)
                        </div>
                        <ul className="space-y-2.5 text-xs text-slate-300">
                          <li className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold shrink-0">•</span> 
                            <span>Saturación del NOC por **Fatiga de Alarmas** (+150 en rojo).</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold shrink-0">•</span> 
                            <span>Se pierde tiempo valioso en adivinar el origen (**MTTR elevado**).</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold shrink-0">•</span> 
                            <span>Los ingenieros revisan equipo por equipo sin foco estratégico.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold shrink-0">•</span> 
                            <span>**SLA de Coopeguanacaste en alto riesgo** ($15,000 USD Multas).</span>
                          </li>
                        </ul>
                      </div>

                      {/* AIOps column */}
                      <div className="border border-indigo-950 bg-indigo-950/10 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold mb-3 uppercase">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Enfoque Inteligente (AI-Lab-Rocket)
                        </div>
                        <ul className="space-y-2.5 text-xs text-slate-300">
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">•</span> 
                            <span>Supresión del **94% del ruido**. El sistema de IA consolida todo en una tarjeta limpia.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">•</span> 
                            <span>Identifica el **Paciente Cero** en segundos basándose en topología física.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">•</span> 
                            <span>Genera un **Plan de Acción con comandos Cisco** sugeridos listos para usar.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">•</span> 
                            <span>Ayuda a salvar el SLA guiando la cuadrilla directo al poste desconectado.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-[#12161D] p-4 rounded-xl border border-slate-800 space-y-2">
                       <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5"><Bot className="w-4 h-4 text-indigo-500"/> Lógica de IA Utilizada en Hackathon</h4>
                       <p className="text-xs text-slate-355 leading-relaxed font-sans">
                          Para implementar esto en tu código final, puedes crear un agrupador de problemas por ventana de tiempo (ej. eventos que ocurren con un delta menor a 15 segundos) y alimentarlos a la API de Zabbix. Luego usas el modelo de lenguaje para cruzar las alertas con las dependencias topológicas del manual.
                       </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 4: CODE INTEGRATION TABS (The documentation) */}
            {activeTab === 'api_docs' && (
              <motion.div 
                key="api_docs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 flex flex-col grow"
              >
                
                {/* HEAD INFO */}
                <div className="bg-[#12161D] p-5 rounded-xl border border-slate-700/50 shadow-sm space-y-2">
                  <h3 className="text-sm font-bold font-display text-white uppercase">Endpoints para Conectar con la Vista problem.view de Zabbix</h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Aquí tienes detallados los endpoints solicitados que se utilizan para alimentar este dashboard. Puedes copiarlos e integrarlos directamente en tus scripts de Python, curl, Postman o Insomnia.
                  </p>
                </div>

                {/* THE LIST OF ENDPOINTS IN RAW CODES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* ENDPOINT 1: problem.get API simulated */}
                  <div className="bg-[#12161D] rounded-xl border border-slate-700/50 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="p-4 border-b border-slate-800 bg-[#161B22] flex justify-between items-center">
                      <div>
                        <span className="bg-indigo-650/20 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">GET</span>
                        <h4 className="text-xs font-bold font-mono text-white ml-2 inline-block">/api/zabbix/problems</h4>
                      </div>
                      <button 
                        onClick={() => handleCopyToClipboard("GET /api/zabbix/problems?status=PROBLEM", "copy-p1")}
                        className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                        title="Copiar ruta"
                      >
                        {copiedTextId === 'copy-p1' ? <CheckCircle2 className="w-4 h-4 text-emerald-450" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-3 shrink-0">
                      <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                        Este endpoint simula la API nativa de Zabbix para extraer alertas activas de la vista de problemas en tiempo real. Soporta filtración de variables de consulta.
                      </p>
                      
                      <div className="text-[10px] space-y-1">
                        <span className="font-bold text-slate-400 uppercase tracking-wide">Query Parameters admitidos:</span>
                        <div className="font-mono text-slate-350 bg-[#0D1117] rounded p-2 border border-slate-800">
                          <div>- <span className="text-indigo-400">zone</span>: Nombre de la zona / cantón (ej: Tamarindo)</div>
                          <div>- <span className="text-indigo-400">status</span>: PROBLEMA o RESUELTO</div>
                          <div>- <span className="text-indigo-400">severity</span>: Warning, Average, High</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono font-bold block mb-1">CURL Ejecución Externa:</span>
                      <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto select-all">
                        {`curl -X GET "http://172.28.20.190/zabbix/api_jsonrpc.php" \\
  -H "Content-Type: application/json-rpc" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "problem.get",
    "params": {
      "output": "extend",
      "selectTags": "extend"
    },
    "auth": "a44560bcecf8a08e10bbc827253b18a56649500f52f23f23f23a03d9ed",
    "id": 1
  }'`}
                      </pre>
                    </div>
                  </div>

                  {/* ENDPOINT 2: Gemini Troubleshoot Endpoint */}
                  <div className="bg-[#12161D] rounded-xl border border-slate-700/50 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="p-4 border-b border-slate-800 bg-[#161B22] flex justify-between items-center">
                      <div>
                        <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">POST</span>
                        <h4 className="text-xs font-bold font-mono text-white ml-2 inline-block">/api/gemini/troubleshoot</h4>
                      </div>
                      <button 
                        onClick={() => handleCopyToClipboard("POST /api/gemini/troubleshoot", "copy-p2")}
                        className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                        title="Copiar ruta"
                      >
                        {copiedTextId === 'copy-p2' ? <CheckCircle2 className="w-4 h-4 text-emerald-450" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="p-4 space-y-3 shrink-0">
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Envía los detalles de la alerta de Zabbix al motor de inteligencia artificial (Gemini) en el backend express, devolviendo la receta de triaje y troubleshooting.
                      </p>

                      <div className="text-[10px] space-y-1">
                        <span className="font-bold text-slate-400 uppercase tracking-wide">Payload Requerido (JSON body):</span>
                        <div className="font-mono text-slate-350 bg-[#0D1117] rounded p-2 border border-slate-800">
                          {"{ \"problemText\": \"...\u201c, \"host\": \"...\", \"zone\": \"...\" }"}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#0D1117] border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono font-bold block mb-1">CURL de Triaje IA:</span>
                      <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto select-all">
                        {`curl -X POST "/api/gemini/troubleshoot" \\
  -H "Content-Type: application/json" \\
  -d '{
    "host": "FTX2245G041 CGR Playas del Coco",
    "problemText": "Unavailable by ICMP ping",
    "severity": "High",
    "zone": "Playas del Coco"
  }'`}
                      </pre>
                    </div>
                  </div>

                  {/* ENDPOINT 3: Zone Statistics API */}
                  <div className="bg-[#12161D] rounded-xl border border-slate-700/50 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="p-4 border-b border-slate-800 bg-[#161B22] flex justify-between items-center">
                      <div>
                        <span className="bg-indigo-650/20 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">GET</span>
                        <h4 className="text-xs font-bold font-mono text-white ml-2 inline-block">/api/zabbix/zones</h4>
                      </div>
                      <button 
                        onClick={() => handleCopyToClipboard("GET /api/zabbix/zones", "copy-p3")}
                        className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                        title="Copiar ruta"
                      >
                        {copiedTextId === 'copy-p3' ? <CheckCircle2 className="w-4 h-4 text-emerald-450" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="p-4 space-y-2 shrink-0 text-xs">
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Agrupa las alertas del problem.view devolviendo el conteo de incidentes activos por cantón o distrito eléctrico de Coopeguanacaste. Es ideal para mapas de calor.
                      </p>
                    </div>

                    <div className="p-4 bg-[#05070a] text-slate-350 font-mono text-[11px] border-t border-slate-800">
                      <span className="text-slate-400 block uppercase font-bold text-[9px] mb-1">CÓDIGO PYTHON (Script Hackathon):</span>
                      <pre className="text-[10px] overflow-x-auto select-all font-mono text-sky-400">
                        {`import requests

url = "http://localhost:3000/api/zabbix/problems"
params = {"status": "PROBLEM", "zone": "Tamarindo"}
response = requests.get(url, params=params).json()

for alert in response["result"]:
    print(f"Alerta en {alert['host']}: {alert['problem']}")`}
                      </pre>
                    </div>
                  </div>

                  {/* ENDPOINT 4: Super incident triage */}
                  <div className="bg-[#12161D] rounded-xl border border-slate-700/50 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="p-4 border-b border-slate-800 bg-[#161B22] flex justify-between items-center">
                      <div>
                        <span className="bg-indigo-650/20 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">GET</span>
                        <h4 className="text-xs font-bold font-mono text-white ml-2 inline-block">/api/zabbix/super-incidents</h4>
                      </div>
                      <button 
                        onClick={() => handleCopyToClipboard("GET /api/zabbix/super-incidents", "copy-p4")}
                        className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                        title="Copiar ruta"
                      >
                        {copiedTextId === 'copy-p4' ? <CheckCircle2 className="w-4 h-4 text-emerald-450" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="p-4 space-y-2 shrink-0 text-xs">
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Retorna los clústeres de alertas agrupados por proximidad y topología, deduciendo el causante de falla (Paciente Cero) para evitar la fatiga mental de alertas duplicadas.
                      </p>
                    </div>

                    <div className="p-4 bg-[#05070a] text-slate-350 font-mono text-[11px] border-t border-slate-800">
                      <span className="text-slate-400 block uppercase font-bold text-[9px] mb-1">CÓDIGO NODE.JS:</span>
                      <pre className="text-[10px] overflow-x-auto select-all font-mono text-sky-400">
                        {`// Consultar incidentes mayores correlacionados
const response = await fetch('/api/zabbix/super-incidents');
const data = await response.json();
console.log('Ruido Reducido en un:', data.noiseReductionPercent, '%');
`}
                      </pre>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0B0E14] border-t border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400 font-sans">
        <div>
          <span>© Coopeguanacaste R.L. - Hackathon UNA de Mayo 2026</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-indigo-400" /> Entorno Autorizado Seguro</span>
          <span className="text-slate-700">|</span>
          <span className="font-mono">User: unahackatonapi</span>
        </div>
      </footer>

      {/* AI DIAGNOSTICS DETAILED SLIDEOVER DRAW PANEL */}
      <AnimatePresence>
        {diagnosticOpen && selectedDiagnostic && (
          <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
              
              {/* Back backdrop filter */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setDiagnosticOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
              />

              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="pointer-events-auto w-screen max-w-2xl"
                >
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#12161D] shadow-2xl border-l border-slate-800">
                    
                    {/* Drawer Header */}
                    <div className="bg-[#161B22] border-b border-slate-800 px-6 py-6 text-white text-left relative">
                      <button 
                        onClick={() => setDiagnosticOpen(false)}
                        className="absolute top-5 right-6 text-slate-400 hover:text-white rounded-lg p-1.5 focus:outline-none cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-950/40 text-indigo-400 border border-indigo-900/50 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Mantenimiento Correctivo Inteligente
                          </span>
                          <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                            HostID: {selectedDiagnostic.hostId}
                          </span>
                        </div>
                        <h2 className="text-base font-bold font-display tracking-tight text-white pr-8">
                          Triaje de Evento: {selectedDiagnostic.host.split(" ").slice(1).join(" ")}
                        </h2>
                        <p className="text-xs text-slate-400 font-sans mt-1">Conectándose a Zabbix problem.get & Gemini LLM</p>
                      </div>
                    </div>

                    {/* ALARM SOURCE DETAILS BRIEF */}
                    <div className="bg-[#0D1117] p-6 border-b border-slate-800 text-left space-y-3">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                        <div>
                          <span className="text-slate-500 font-bold text-[9px] uppercase block">Severidad</span>
                          <div className="mt-0.5">{getSeverityBadge(selectedDiagnostic.severity)}</div>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold text-[9px] uppercase block">Estado Evento</span>
                          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-450 font-mono font-bold px-1.5 py-0.5 rounded text-[11px] inline-block mt-0.5">
                            {selectedDiagnostic.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold text-[9px] uppercase block">Tiempo Activación</span>
                          <span className="font-mono text-slate-300 font-medium block mt-1.5">{selectedDiagnostic.time}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold text-[9px] uppercase block">Zona Coopeguanacaste</span>
                          <span className="text-indigo-400 font-bold block mt-1">{selectedDiagnostic.zone}</span>
                        </div>
                      </div>

                      <div className="bg-[#12161D] border border-slate-800 p-3 rounded-lg">
                        <span className="text-slate-500 font-bold text-[9px] uppercase block mb-1">Alerta Original (Zabbix problem.view)</span>
                        <p className="text-slate-300 font-semibold text-xs leading-relaxed">{selectedDiagnostic.problem}</p>
                      </div>
                    </div>

                    {/* Gemini Report Generation Body */}
                    <div className="grow p-6 text-left">
                      {aiLoading ? (
                        <div className="h-44 flex flex-col items-center justify-center gap-3">
                          <Sparkles className="w-8 h-8 text-indigo-450 animate-spin" />
                          <p className="text-xs text-slate-400 font-mono tracking-wider pulse-subtle">Correlacionando micas de fibra y alarmas...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          
                          {/* Engine confirmation */}
                          <div className="bg-indigo-950/40 text-indigo-305 py-2 px-3.5 rounded-lg border border-indigo-900/40 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                              <span className="text-indigo-350">Recomendación estructurada lista</span>
                            </div>
                            <span className="font-mono text-[9px] bg-indigo-950/50 text-indigo-300 border border-indigo-800/30 px-1.5 py-0.5 rounded">
                              MODELO: {aiModelUsed}
                            </span>
                          </div>

                          {/* Markdown formatted print */}
                          <div className="prose prose-sm prose-invert max-w-none text-slate-300">
                            {renderFormattedMarkdown(aiReport)}
                          </div>

                        </div>
                      )}
                    </div>

                    {/* Slideover Footer */}
                    <div className="bg-[#0D1117] px-6 py-4 border-t border-slate-800 flex justify-between items-center shrink-0">
                      <span className="text-slate-400 text-[10px] font-mono">
                        Ubicación física: Subestación {selectedDiagnostic.zone}, Guanacaste, CR.
                      </span>
                      <button
                        onClick={() => setDiagnosticOpen(false)}
                        className="bg-[#161B22] border border-slate-705 text-white font-bold text-xs py-2 px-4 rounded-lg hover:bg-slate-800 cursor-pointer"
                      >
                        Cerrar Diagnóstico
                      </button>
                    </div>

                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
