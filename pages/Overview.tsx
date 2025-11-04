import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Page, Repository } from '../types';
import { QuickCreateAgentModal } from '../components/QuickCreateAgentModal';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, trendDirection }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="text-3xl">{icon}</div>
      <div className={`text-xs font-bold flex items-center ${trendDirection === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendDirection === 'up' ? '↑' : '↓'} {trend}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-4xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

interface QuickStartCardProps {
    icon: string;
    label: string;
    onClick: () => void;
}

const QuickStartCard: React.FC<QuickStartCardProps> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all flex flex-col items-center justify-center gap-3">
        <div className="text-4xl">{icon}</div>
        <span className="font-semibold">{label}</span>
    </button>
)

interface OverviewProps {
  navigateTo: (page: Page) => void;
  repositories: Repository[];
  onAgentCreated: (data: any) => void;
}

export const Overview: React.FC<OverviewProps> = ({ navigateTo, repositories, onAgentCreated }) => {
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="概览"
        subtitle="欢迎使用 HawkAI - 稳定性左移，守护每一次提交"
      />
      <div className="p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="🤖" label="运行中的Agents" value="3" trend="2" trendDirection="up" />
          <StatCard icon="📦" label="已连接代码库" value="5" trend="1" trendDirection="up" />
          <StatCard icon="🚨" label="待修复问题" value="42" trend="15" trendDirection="down" />
          <StatCard icon="✅" label="本周已修复" value="128" trend="12" trendDirection="up" />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">快速开始</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <QuickStartCard icon="⚡️" label="快速创建Agent" onClick={() => setIsQuickCreateOpen(true)} />
                <QuickStartCard icon="➕" label="高级创建" onClick={() => navigateTo(Page.CreateAgent)} />
                <QuickStartCard icon="📦" label="连接代码库" onClick={() => navigateTo(Page.IntegrationCenter)} />
                <QuickStartCard icon="📊" label="查看报告" onClick={() => navigateTo(Page.Reports)} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">最近活动</h3>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">查看全部</button>
            </div>
            <div className="text-slate-500 text-center py-16">
                最近24小时内的扫描活动和发现...
            </div>
        </div>
      </div>
      {isQuickCreateOpen && (
        <QuickCreateAgentModal
            isOpen={isQuickCreateOpen}
            onClose={() => setIsQuickCreateOpen(false)}
            repositories={repositories}
            onAgentCreated={(agentData) => {
                onAgentCreated(agentData);
                setIsQuickCreateOpen(false);
                navigateTo(Page.Agents);
            }}
        />
      )}
    </div>
  );
};