// Servicio Zabbix optimizado para versiones modernas de Zabbix (Bearer Token)
const getRuntimeConfig = () => {
  const isNode = typeof process !== 'undefined' && !!(process as any).versions?.node;
  const viteEnv = (typeof import.meta !== 'undefined') ? (import.meta as any).env : undefined;

  const apiUrl = isNode
    ? (process.env.ZABBIX_API_URL || 'http://172.28.20.190/zabbix/api_jsonrpc.php')
    : (viteEnv?.VITE_ZABBIX_API_URL || '/zabbix-api');

  // Limpiamos posibles comillas accidentales de los strings
  const cleanEnvStr = (val: string | undefined) => val ? val.replace(/['"]/g, '') : '';

  const token = isNode ? process.env.ZABBIX_TOKEN : viteEnv?.VITE_ZABBIX_TOKEN;
  const user = isNode ? process.env.ZABBIX_USER : viteEnv?.VITE_ZABBIX_USER;
  const password = isNode ? process.env.ZABBIX_PASSWORD : viteEnv?.VITE_ZABBIX_PASSWORD;

  return { 
    isNode, 
    apiUrl, 
    token: cleanEnvStr(token) || "a44560bcecf8a08e10bbc827253b18a56649500f52f23f4ed039b2832a03d9ed", 
    user: cleanEnvStr(user) || "unahackatonapi", 
    password: cleanEnvStr(password) || "72f)£O69Yl" 
  };
};

export interface ZabbixProblem {
  id: string;
  name: string;
  severity: 'Warning' | 'Average' | 'High' | 'Disaster' | 'Information' | 'No clasificado';
  severityCode: number;
  clock: string;
  zone: string;
  status?: 'PROBLEM' | 'RESOLVED';
  time?: string;
  recoveryTime?: string;
  host?: string;
  problem?: string;
  duration?: string;
  ack?: 'Yes' | 'No';
  actions?: string;
  tags?: string[];
  hostId?: string;
}

export const obtenerProblemasRealesZabbix = async (): Promise<ZabbixProblem[]> => {
  const { apiUrl, token } = getRuntimeConfig();

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'problem.get',
        params: {
          output: ['eventid', 'name', 'severity', 'clock'],
          // FIX AQUÍ: Zabbix exige estrictamente ordenar por 'eventid' en problem.get
          sortfield: ['eventid'], 
          sortorder: 'DESC',
        },
        id: 1
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Error devuelto por la API de Zabbix:", data.error);
      return [];
    }

    const severidades: Record<number, 'Warning' | 'Average' | 'High' | 'Disaster' | 'Information' | 'No clasificado'> = {
      0: "No clasificado",
      1: "Information",
      2: "Warning",
      3: "Average",
      4: "High",
      5: "Disaster"
    };

    const zonasDisponibles = ["Zona Nicoya", "Zona Santa Cruz", "Zona Liberia", "Zona Carrillo"];

    return (data.result || []).map((item: any, index: number) => {
      const severityNum = parseInt(item.severity);
      const severity = severidades[severityNum] || "No clasificado";
      
      let asignadaZone = zonasDisponibles[index % zonasDisponibles.length];
      const lowerName = (item.name || "").toLowerCase();
      
      if (lowerName.includes("cisco") || lowerName.includes("router") || lowerName.includes("cgr")) {
        asignadaZone = "Zona Nicoya";
      } else if (lowerName.includes("power") || lowerName.includes("fuente") || lowerName.includes("supply")) {
        asignadaZone = "Zona Santa Cruz";
      } else if (lowerName.includes("icmp") || lowerName.includes("ping") || lowerName.includes("link")) {
        asignadaZone = "Zona Liberia";
      }

      const timestamp = new Date(parseInt(item.clock) * 1000).toLocaleString('es-CR', {
        timeZone: 'America/Costa_Rica'
      });

      return {
        id: item.eventid || `zb-${index}`,
        name: item.name || "Incidente sin nombre",
        severity: severity,
        severityCode: severityNum,
        clock: timestamp,
        zone: asignadaZone,
        status: "PROBLEM",
        time: timestamp,
        recoveryTime: "",
        host: "Nodo Coopeguanacaste",
        problem: item.name || "Sin descripción",
        duration: "Activo",
        ack: "No",
        actions: "",
        tags: [],
        hostId: "CGR"
      };
    });

  } catch (error) {
    console.error("Error crítico de red conectando al servidor Zabbix:", error);
    return [];
  }
};