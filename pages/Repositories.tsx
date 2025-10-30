import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import type { Repository } from '../types';
import { ConnectRepoModal } from '../components/ConnectRepoModal';

interface RepoItemProps {
    repo: Repository;
}

const RepoItem: React.FC<RepoItemProps> = ({ repo }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-4xl">📦</div>
        <div className="flex-1">
            <h3 className="font-bold text-slate-800">{repo.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">{repo.url}</p>
            <div className="text-xs text-slate-500 mt-2 flex items-center flex-wrap gap-x-3 gap-y-1">
                <span>⭐ 主分支: {repo.mainBranch}</span>
                <span className="hidden sm:inline">|</span>
                <span>📁 {repo.fileCount}个文件</span>
                <span className="hidden sm:inline">|</span>
                <span>💻 {repo.language}</span>
                <span className="hidden sm:inline">|</span>
                <span>🤖 {repo.agentCount}个Agent</span>
            </div>
        </div>
        <div className="flex gap-2 self-start sm:self-center">
            <button onClick={() => alert('设置功能开发中...')} className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200">设置</button>
        </div>
    </div>
);


interface RepositoriesProps {
    repositories: Repository[];
}

export const Repositories: React.FC<RepositoriesProps> = ({ repositories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectRepo = (data: { url: string; token: string; branch: string }) => {
    console.log('Connecting new repo:', data);
    alert(`正在连接代码库: ${data.url}`);
    setIsModalOpen(false);
    // Here you would typically add logic to update the list of repositories
  };

  return (
    <div>
      <PageHeader title="代码库管理" subtitle="连接和管理你的Git代码仓库">
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span>➕</span>
            <span>连接新代码库</span>
        </button>
      </PageHeader>
      <div className="p-6 sm:p-8">
        <div className="space-y-4">
            {repositories.map(repo => (
                <RepoItem key={repo.id} repo={repo} />
            ))}
        </div>
      </div>
      <ConnectRepoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnectRepo}
      />
    </div>
  );
};