export interface ZabbixProblem {
  id: string;
  severity: 'Warning' | 'Average' | 'High' | 'Disaster' | 'Information' | 'Not classified';
  time: string;
  recoveryTime: string;
  status: 'PROBLEM' | 'RESOLVED';
  host: string;
  problem: string;
  duration: string;
  ack: 'Yes' | 'No';
  actions: string;
  tags: string[];
  zone: string;
  hostId: string;
}

export interface ZoneSummary {
  name: string;
  activeProblems: number;
  resolvedProblems: number;
  warnings: number;
  highSeverity: number;
  averageSeverity: number;
  totalProblems: number;
}

export interface SuperIncident {
  id: string;
  title: string;
  status: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  detectedAt: string;
  rootCauseHost: string;
  rootCauseDevice: string;
  description: string;
  suppressedAlertsCount: number;
  impact: string;
  mitigationAction: string;
  correlatedProblems: ZabbixProblem[];
}
