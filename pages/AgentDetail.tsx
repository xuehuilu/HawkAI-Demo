import React from 'react';
import { PageHeader } from '../components/PageHeader';
import type { Agent } from '../types';
import { Page } from '../types';

interface AgentDetailProps {
  agent: Agent;
  navigateTo: (page: Page) => void;
  onEdit: (agent: Agent) => void;
}

const DetailStatCard: React.FC<{label: string, value: string | number, icon: string, colorClass: string}> = ({label, value, icon, colorClass}) => (
    <div className={`bg-white p-6 rounded-xl border-l-4 ${colorClass} shadow-sm`}>
        <div className="flex justify-between items-start">
            <div className="text-3xl">{icon}</div>
        </div>
        <div className="mt-4">
            <p className="text-4xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
);


const InfoItem: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <div className="text-sm font-semibold text-slate-800">{children}</div>
    </div>
);

export const AgentDetail: React.FC<AgentDetailProps> = ({ agent, navigateTo, onEdit }) => {
    
    const statusClasses = {
        running: 'bg-emerald-100 text-emerald-800',
        scanning: 'bg-blue-100 text-blue-800',
        idle: 'bg-slate-100 text-slate-800'
    };

    return (
    <div>
      <PageHeader title={agent.name} subtitle="Agent详情与配置管理">
        <button onClick={() => navigateTo(Page.Agents)} className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200 flex items-center gap-2">
            <span>←</span>
            <span>返回Agent列表</span>
        </button>
        <button className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span>▶️</span>
            <span>立即执行扫描</span>
        </button>
         <button onClick={() => onEdit(agent)} className="bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <span>✏️</span>
            <span>编辑配置</span>
        </button>
      </PageHeader>
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DetailStatCard label="P0问题" value={agent.p0Issues} icon="🚨" colorClass="border-red-500" />
            <DetailStatCard label="P1问题" value={agent.p1Issues} icon="⚠️" colorClass="border-amber-500" />
            <DetailStatCard label="P2问题" value={45} icon="ℹ️" colorClass="border-blue-500" />
            <DetailStatCard label="代码健康度" value={`${agent.health}%`} icon="✅" colorClass="border-emerald-500" />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">基本信息</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <InfoItem label="代码库">{agent.repo}</InfoItem>
                <InfoItem label="角色定位">{agent.role}</InfoItem>
                <InfoItem label="创建时间">2025-10-15 10:30</InfoItem>
                <InfoItem label="上次扫描">{agent.lastScan}</InfoItem>
                <InfoItem label="扫描次数">156次</InfoItem>
                <InfoItem label="状态">
                     <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClasses[agent.status]}`}>
                        {agent.status === 'running' ? '✓ 运行中' : agent.status === 'scanning' ? '⟳ 扫描中' : '- 空闲'}
                    </span>
                </InfoItem>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">最近发现的问题</h3>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">查看完整报告</button>
            </div>
             <div className="space-y-3">
                 <div className="border-l-4 border-red-500 p-4 bg-slate-50 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">P0</span>
                        <span className="font-semibold font-mono text-sm text-slate-700">PaymentService.java</span>
                    </div>
                    <p className="text-sm text-slate-600">锁块内执行RPC调用 - 可能导致死锁</p>
                 </div>
                 <div className="border-l-4 border-amber-500 p-4 bg-slate-50 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded">P1</span>
                        <span className="font-semibold font-mono text-sm text-slate-700">OrderController.java</span>
                    </div>
                    <p className="text-sm text-slate-600">事务中捕获异常未回滚 - 可能导致数据不一致</p>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};