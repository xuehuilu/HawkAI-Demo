import React from 'react';
import { PageHeader } from '../components/PageHeader';
import type { Agent } from '../types';
import { Page } from '../types';

interface AgentCardProps {
    agent: Agent;
    onClick: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
    const statusClasses = {
        running: 'bg-emerald-100 text-emerald-800',
        scanning: 'bg-blue-100 text-blue-800',
        idle: 'bg-slate-100 text-slate-800'
    };

    const healthColor = agent.health > 80 ? 'text-emerald-500' : agent.health > 60 ? 'text-amber-500' : 'text-red-500';

    return (
        <div 
            onClick={onClick}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer transition-all hover:shadow-lg hover:border-indigo-400 hover:-translate-y-1"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                    🤖
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">{agent.name}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClasses[agent.status]}`}>
                        {agent.status === 'running' ? '✓ 运行中' : agent.status === 'scanning' ? '⟳ 扫描中' : '- 空闲'}
                    </span>
                </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2"><span>📦</span><span className="font-mono text-xs">{agent.repo}</span></div>
                <div className="flex items-center gap-2"><span>👔</span><span>角色: {agent.role}</span></div>
                <div className="flex items-center gap-2"><span>⏰</span><span>上次巡检: {agent.lastScan}</span></div>
            </div>

            <div className="flex pt-4 border-t border-slate-200 text-center">
                <div className="flex-1">
                    <p className="text-2xl font-bold text-red-500">{agent.p0Issues}</p>
                    <p className="text-xs text-slate-500">P0问题</p>
                </div>
                <div className="flex-1">
                    <p className="text-2xl font-bold text-amber-500">{agent.p1Issues}</p>
                    <p className="text-xs text-slate-500">P1问题</p>
                </div>
                <div className="flex-1">
                    <p className={`text-2xl font-bold ${healthColor}`}>{agent.health}%</p>
                    <p className="text-xs text-slate-500">代码健康度</p>
                </div>
            </div>
        </div>
    );
}


interface AgentsProps {
  agents: Agent[];
  viewAgentDetail: (agentId: string) => void;
  navigateTo: (page: Page) => void;
}

export const Agents: React.FC<AgentsProps> = ({ agents, viewAgentDetail, navigateTo }) => {
  return (
    <div>
      <PageHeader title="我的Agents" subtitle="管理你的代码分析助手">
        <button onClick={() => navigateTo(Page.CreateAgent)} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span>➕</span>
            <span>创建新Agent</span>
        </button>
      </PageHeader>
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} onClick={() => viewAgentDetail(agent.id)} />
            ))}
        </div>
      </div>
    </div>
  );
};
