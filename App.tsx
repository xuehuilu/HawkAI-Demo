import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Overview } from './pages/Overview';
import { Agents } from './pages/Agents';
import { CreateAgent } from './pages/CreateAgent';
import { Repositories } from './pages/Repositories';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { AgentDetail } from './pages/AgentDetail';
import { ReportDetail } from './pages/ReportDetail';
import { Page } from './types';
import type { Agent, Repository, Report, Scenario } from './types';
import { AGENTS, REPOSITORIES, REPORTS } from './constants';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Overview);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);

  const navigateTo = useCallback((page: Page) => {
    // When navigating away from create/edit, clear the editing agent
    if (activePage === Page.CreateAgent && page !== Page.CreateAgent) {
        setAgentToEdit(null);
    }
    setActivePage(page);
    window.scrollTo(0, 0);
  }, [activePage]);

  const handleAddAgent = useCallback((newAgentData: { name: string; scenario: Scenario; source: { repos: string[] } }) => {
    const scenarioMap: Record<Scenario, string> = {
        'tech-debt': '非功能精准测试',
        'change-risk': '变更风险评估',
        'project-acceptance': '项目上线',
        'risk-radar': '风险雷达',
        'regression-testing': '非功能回归测试',
    };
    
    const repoName = REPOSITORIES.find(r => r.id === newAgentData.source.repos[0])?.name || 'unknown-repo';

    const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: newAgentData.name,
        status: 'running',
        repo: repoName,
        role: scenarioMap[newAgentData.scenario] || '未知场景',
        lastScan: '刚刚',
        p0Issues: 0,
        p1Issues: 0,
        health: 100,
    };
    setAgents(prevAgents => [newAgent, ...prevAgents]);
  }, []);

  const viewAgentDetail = useCallback((agentId: string) => {
    setSelectedAgentId(agentId);
    navigateTo(Page.AgentDetail);
  }, [navigateTo]);
  
  const viewReportDetail = useCallback((reportId: string) => {
    setSelectedReportId(reportId);
    navigateTo(Page.ReportDetail);
  }, [navigateTo]);

  const handleEditAgent = useCallback((agent: Agent) => {
    setAgentToEdit(agent);
    navigateTo(Page.CreateAgent);
  }, [navigateTo]);

  const renderPage = () => {
    switch (activePage) {
      case Page.Overview:
        return <Overview navigateTo={navigateTo} repositories={REPOSITORIES} onAgentCreated={handleAddAgent} />;
      case Page.Agents:
        return <Agents agents={agents} viewAgentDetail={viewAgentDetail} navigateTo={navigateTo} />;
      case Page.CreateAgent:
        return <CreateAgent 
                    navigateTo={navigateTo} 
                    repositories={REPOSITORIES} 
                    onAgentCreated={handleAddAgent}
                    agentToEdit={agentToEdit} 
                    onFinish={() => setAgentToEdit(null)}
                />;
      case Page.Repositories:
        return <Repositories repositories={REPOSITORIES} />;
      case Page.Reports:
        return <Reports reports={REPORTS} viewReportDetail={viewReportDetail} />;
      case Page.Settings:
        return <Settings />;
      case Page.AgentDetail:
        const agent = agents.find(a => a.id === selectedAgentId);
        return agent ? <AgentDetail agent={agent} navigateTo={navigateTo} onEdit={handleEditAgent} /> : <Agents agents={agents} viewAgentDetail={viewAgentDetail} navigateTo={navigateTo} />;
      case Page.ReportDetail:
        const report = REPORTS.find(r => r.id === selectedReportId);
        return report ? <ReportDetail report={report} navigateTo={navigateTo} /> : <Reports reports={REPORTS} viewReportDetail={viewReportDetail} />;
      default:
        return <Overview navigateTo={navigateTo} repositories={REPOSITORIES} onAgentCreated={handleAddAgent} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar activePage={activePage} navigateTo={navigateTo} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;