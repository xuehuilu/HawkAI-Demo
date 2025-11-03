import React, { useState } from 'react';

interface ConnectRepoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (data: { platform: Platform; url: string; token: string; branch: string }) => void;
    platform?: Platform;
}

export type Platform = 'github' | 'gitlab' | 'gitee';

export const ConnectRepoModal: React.FC<ConnectRepoModalProps> = ({ isOpen, onClose, onConnect, platform }) => {
    const [url, setUrl] = useState('');
    const [token, setToken] = useState('');
    const [branch, setBranch] = useState('main');
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>(platform || 'github');

    const handleConnectClick = () => {
        if (!url || !token) {
            alert('请填写仓库URL和访问令牌');
            return;
        }
        onConnect({ platform: platform || selectedPlatform, url, token, branch });
    };

    if (!isOpen) {
        return null;
    }

    const platforms: { id: Platform; icon: string; name: string }[] = [
        { id: 'github', icon: '📦', name: 'GitHub' },
        { id: 'gitlab', icon: '🦊', name: 'GitLab' },
        { id: 'gitee', icon: ' G ', name: 'Gitee' },
    ];
    
    const platformInfo = platforms.find(p => p.id === (platform || selectedPlatform));

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        {platform && platformInfo && <span className="text-2xl">{platformInfo.icon}</span>}
                        <h3 className="text-lg font-bold text-slate-800">
                            {platform && platformInfo ? `连接到 ${platformInfo.name}` : '连接新代码库'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    {!platform && (
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2">Git平台</label>
                            <div className="grid grid-cols-3 gap-3">
                                {platforms.map(p => (
                                    <button 
                                        key={p.id}
                                        onClick={() => setSelectedPlatform(p.id)}
                                        className={`flex items-center justify-center gap-2 p-2 border-2 rounded-lg transition-colors ${
                                            selectedPlatform === p.id 
                                                ? 'border-indigo-500 bg-indigo-50' 
                                                : 'border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>{p.icon}</span>
                                        <span className={`font-semibold ${selectedPlatform === p.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                                            {p.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                     <div>
                        <label htmlFor="repo-url" className="text-sm font-semibold text-slate-700 block mb-2">仓库URL</label>
                        <input id="repo-url" type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://github.com/your-org/your-repo.git" className="w-full p-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                        <p className="text-xs text-slate-500 mt-1">支持 GitHub、GitLab、Gitee 等主流平台</p>
                    </div>
                     <div>
                        <label htmlFor="repo-token" className="text-sm font-semibold text-slate-700 block mb-2">访问令牌</label>
                        <input id="repo-token" type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" className="w-full p-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                        <p className="text-xs text-slate-500 mt-1">需要具有读取代码权限的访问令牌</p>
                    </div>
                     <div>
                        <label htmlFor="repo-branch" className="text-sm font-semibold text-slate-700 block mb-2">主分支</label>
                        <input id="repo-branch" type="text" value={branch} onChange={e => setBranch(e.target.value)} placeholder="main" className="w-full p-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50">取消</button>
                    <button onClick={handleConnectClick} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700">连接代码库</button>
                </div>
            </div>
        </div>
    );
};