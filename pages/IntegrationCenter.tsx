import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ConnectRepoModal, Platform } from '../components/ConnectRepoModal';

interface IntegrationCardProps {
  icon: string;
  name: string;
  description: string;
  isConnected: boolean;
  onClick: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ icon, name, description, isConnected, onClick }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
    <div className="flex justify-between items-start">
      <div className="text-4xl">{icon}</div>
      <div className={`text-xs font-bold px-2 py-1 rounded-full ${isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
        {isConnected ? '✓ 已连接' : '未连接'}
      </div>
    </div>
    <div className="mt-4 flex-1">
      <h3 className="font-bold text-slate-800">{name}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
    <div className="mt-6">
      <button 
        onClick={onClick}
        className={`w-full font-semibold px-4 py-2 rounded-lg transition-colors ${
          isConnected 
            ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50' 
            : 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
        }`}
      >
        {isConnected ? '配置' : '连接'}
      </button>
    </div>
  </div>
);

export const IntegrationCenter: React.FC = () => {
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);

  const handleConnectRepo = (data: { platform: Platform; url: string; token: string; branch: string }) => {
    console.log('Connecting new repo:', data);
    alert(`正在连接 ${data.platform} 代码库: ${data.url}`);
    setConnectingPlatform(null);
    // Here you would typically add logic to add the new repository
  };

  const integrations = [
    {
      id: 'github',
      icon: '📦',
      name: 'GitHub',
      description: '连接GitHub代码库，支持私有和公共仓库，进行代码分析。',
      isConnected: true,
      isGitProvider: true,
    },
    {
      id: 'gitlab',
      icon: '🦊',
      name: 'GitLab',
      description: '连接GitLab代码库，支持自建和SaaS实例，进行代码分析。',
      isConnected: false,
      isGitProvider: true,
    },
    {
      id: 'gitee',
      icon: ' G ',
      name: 'Gitee',
      description: '连接Gitee码云代码库，为国内开发者提供代码托管集成。',
      isConnected: false,
      isGitProvider: true,
    },
    {
      id: 'jira',
      icon: '🔵',
      name: 'Jira',
      description: '将HawkAI发现的问题一键同步到Jira，创建或更新Issue，实现问题跟踪闭环。',
      isConnected: false,
      isGitProvider: false,
    },
    {
      id: 'zentao',
      icon: '✅',
      name: '禅道',
      description: '将发现的风险点直接推送到禅道项目管理平台，方便团队统一跟进和管理。',
      isConnected: false,
      isGitProvider: false,
    },
    {
      id: 'lark',
      icon: '💬',
      name: '飞书 / 钉钉',
      description: '当扫描完成或发现严重问题时，通过飞书或钉钉机器人发送实时通知。',
      isConnected: true,
      isGitProvider: false,
    },
    {
      id: 'webhook',
      icon: '🔔',
      name: 'Webhook',
      description: '通过自定义Webhook将报告和告警推送到任何支持的第三方系统。',
      isConnected: false,
      isGitProvider: false,
    }
  ];

  return (
    <div>
      <PageHeader
        title="集成中心"
        subtitle="连接外部工具，构建一体化的研运效能平台"
      />
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map(item => (
            <IntegrationCard 
              key={item.name} 
              {...item} 
              onClick={item.isGitProvider ? () => setConnectingPlatform(item.id as Platform) : () => alert(`正在配置 ${item.name} 集成...`)}
            />
          ))}
        </div>
      </div>
      {connectingPlatform && (
        <ConnectRepoModal 
            isOpen={!!connectingPlatform}
            onClose={() => setConnectingPlatform(null)}
            onConnect={handleConnectRepo}
            platform={connectingPlatform}
        />
      )}
    </div>
  );
};