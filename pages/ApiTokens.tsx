import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { API_TOKENS } from '../constants';
import type { ApiToken } from '../types';

// Modal for generating a new token
const GenerateTokenModal: React.FC<{
    onClose: () => void;
    onGenerate: (name: string, expires: string) => void;
}> = ({ onClose, onGenerate }) => {
    const [name, setName] = useState('');
    const [expires, setExpires] = useState('30');

    const handleGenerate = () => {
        if (!name.trim()) {
            alert('请为令牌命名。');
            return;
        }
        onGenerate(name, expires);
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">生成新令牌</h3>
                    <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="token-name" className="text-sm font-semibold text-slate-700 block mb-2">令牌名称</label>
                        <input
                            id="token-name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="例如：GitLab CI Runner"
                            className="w-full p-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                         <p className="text-xs text-slate-500 mt-1">为令牌指定一个描述性名称，方便识别其用途。</p>
                    </div>
                    <div>
                        <label htmlFor="token-expires" className="text-sm font-semibold text-slate-700 block mb-2">有效期</label>
                        <select
                            id="token-expires"
                            value={expires}
                            onChange={e => setExpires(e.target.value)}
                            className="w-full p-2 border-2 border-slate-200 rounded-lg bg-white"
                        >
                            <option value="7">7天</option>
                            <option value="30">30天</option>
                            <option value="90">90天</option>
                            <option value="-1">永不过期</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50">取消</button>
                    <button onClick={handleGenerate} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700">生成令牌</button>
                </div>
            </div>
        </div>
    );
};


// Modal to display the newly generated token
const DisplayTokenModal: React.FC<{
    token: string;
    onClose: () => void;
}> = ({ token, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">令牌已生成</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 text-sm">
                        <p><strong>请复制您的新令牌。</strong>为安全起见，您将无法再次看到它。</p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={token}
                            readOnly
                            className="w-full p-2 pr-20 border-2 border-slate-200 rounded-lg bg-slate-100 font-mono text-sm"
                        />
                        <button onClick={handleCopy} className="absolute top-1/2 right-2 -translate-y-1/2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-md">
                            {copied ? '✓ 已复制' : '复制'}
                        </button>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end rounded-b-xl">
                    <button onClick={onClose} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700">完成</button>
                </div>
            </div>
        </div>
    );
};


export const ApiTokens: React.FC = () => {
    const [tokens, setTokens] = useState<ApiToken[]>(API_TOKENS);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [newToken, setNewToken] = useState<string | null>(null);

    const handleGenerate = (name: string, expires: string) => {
        const fullToken = `hawk_${[...Array(32)].map(() => Math.random().toString(36)[2]).join('')}`;
        
        const expiryDate = new Date();
        const days = parseInt(expires, 10);
        let expiresString;
        if (days > 0) {
            expiryDate.setDate(expiryDate.getDate() + days);
            expiresString = expiryDate.toISOString().split('T')[0];
        } else {
            expiresString = '永不过期';
        }
        
        const newTokenData: ApiToken = {
            id: `token-${Date.now()}`,
            name,
            tokenPrefix: `${fullToken.substring(0, 9)}...`,
            lastUsed: '从未使用',
            created: new Date().toISOString().split('T')[0],
            expires: expiresString,
        };

        setTokens(prev => [newTokenData, ...prev]);
        setNewToken(fullToken);
        setIsGenerateModalOpen(false);
    };

    const handleRevoke = (tokenId: string) => {
        if (window.confirm('您确定要撤销此令牌吗？此操作不可逆。')) {
            setTokens(prev => prev.filter(t => t.id !== tokenId));
        }
    };

    return (
        <div>
            <PageHeader title="API 令牌" subtitle="管理用于访问 HawkAI API 的令牌">
                <button onClick={() => setIsGenerateModalOpen(true)} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <span>➕</span>
                    <span>生成新令牌</span>
                </button>
            </PageHeader>
            <div className="p-6 sm:p-8">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                                    <th className="p-4 font-semibold">名称</th>
                                    <th className="p-4 font-semibold">令牌前缀</th>
                                    <th className="p-4 font-semibold">上次使用</th>
                                    <th className="p-4 font-semibold">创建日期</th>
                                    <th className="p-4 font-semibold">过期时间</th>
                                    <th className="p-4 font-semibold text-center">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokens.map(token => (
                                    <tr key={token.id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="p-4 font-bold text-slate-800">{token.name}</td>
                                        <td className="p-4 text-sm text-slate-600 font-mono">{token.tokenPrefix}</td>
                                        <td className="p-4 text-sm text-slate-500">{token.lastUsed}</td>
                                        <td className="p-4 text-sm text-slate-500">{token.created}</td>
                                        <td className="p-4 text-sm text-slate-500">{token.expires}</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => handleRevoke(token.id)} className="text-sm font-semibold text-red-600 hover:text-red-800">
                                                撤销
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isGenerateModalOpen && (
                <GenerateTokenModal
                    onClose={() => setIsGenerateModalOpen(false)}
                    onGenerate={handleGenerate}
                />
            )}
            {newToken && (
                <DisplayTokenModal
                    token={newToken}
                    onClose={() => setNewToken(null)}
                />
            )}
        </div>
    );
};
