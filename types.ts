export enum Page {
  Overview = 'overview',
  Agents = 'agents',
  CreateAgent = 'create-agent',
  Reports = 'reports',
  Repositories = 'repositories',
  Settings = 'settings',
  AgentDetail = 'agent-detail',
  ReportDetail = 'report-detail',
}

export interface Agent {
  id: string;
  name: string;
  status: 'running' | 'scanning' | 'idle';
  repo: string;
  role: string;
  lastScan: string;
  p0Issues: number;
  p1Issues: number;
  health: number;
}

export interface Repository {
    id: string;
    name: string;
    url: string;
    mainBranch: string;
    fileCount: number;
    language: string;
    agentCount: number;
}

export type Role = 'developer' | 'tech-lead' | 'architect';

export type Scenario = 'tech-debt' | 'change-risk' | 'project-acceptance';

export type Preference = 'stability' | 'risk' | 'balanced';

export interface Rule {
    id: string;
    code: string;
    name: string;
    description: string;
    priority: 'P0' | 'P1' | 'P2';
    enabled: boolean;
}

export interface LearnedRule {
  id: string;
  icon: string;
  title: string;
  source: string;
  scope: string;
  timestamp: string;
  ruleLogic: string;
  type: 'ignore' | 'misreport' | 'priority-down' | 'priority-up' | 'learning';
}

export interface ReportStat {
    newIssues: number;
    fixedIssues: number;
    healthChange: number;
    p0Issues: number;
}

export interface Issue {
    id: string;
    priority: 'P0' | 'P1' | 'P2';
    file: string;
    description: string;
    category: string;
}

interface BaseReport {
    id: string;
    title: string;
    icon: string;
    agentName: string;
    repoName: string;
    date: string;
    stats: ReportStat;
    createdByRole: Role;
}

// Unified Technical Debt Report - The Single Source of Truth
export interface TechnicalDebtReport extends BaseReport {
    type: '技术债治理';
    health: number;
    // Comprehensive issue list for all roles
    issues: Issue[]; 
    
    // Data for Tech Lead View
    hotspotFiles: { file: string; issueCount: number }[];
    
    // Data for Architect View
    architecturalConcerns?: { title: string; description: string; severity: 'High' | 'Medium' }[];
    techStackRisks?: { library: string; version: string; risk: string }[];
}

export interface ChangeRiskReport extends BaseReport {
    type: '变更风险评估';
    riskLevel: '高' | '中' | '低';
    affectedFiles: string[];
    newIssuesList: Issue[];
}

export type Report = TechnicalDebtReport | ChangeRiskReport;
