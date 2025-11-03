import React, { useState } from 'react';
import type { Repository, Role, Scenario } from '../types';

interface QuickCreateAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgentCreated: (data: any) => void;
    repositories: Repository[];
}

const STEPS = [
    { id: 1, title: '基本信息' },
    { id: 2, title: '分析场景' },
    { id: 3, title: '选择分析源' },
];

export const QuickCreateAgentModal: React.FC<QuickCreateAgentModalProps> = ({ isOpen, onClose, onAgentCreated, repositories }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [agentName, setAgentName] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role>('developer');
    const [selectedScenario, setSelectedScenario] = useState<Scenario>('project-acceptance');
    const [sourceType, setSourceType] = useState<'repository' | 'jar'>('repository');
    const [selectedRepos, setSelectedRepos] = useState<string[]>(repositories.length > 0 ? [repositories[0].id] : []);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const handleToggleRepo = (repoId: string) => {
        setSelectedRepos(prev =>
            prev.includes(repoId)
                ? prev.filter(id => id !== repoId)
                : [...prev, repoId]
        );
    };

    const handleCreate = () => {
        if (!agentName) {
            alert('请为Agent命名');
            return;
        }
        if (sourceType === 'repository' && selectedRepos.length === 0) {
            alert('请至少选择一个代码库');
            return;
        }
        
        onAgentCreated({
            name: agentName,
            role: selectedRole,
            scenario: selectedScenario,
            source: {
                type: sourceType,
                repos: selectedRepos,
            }
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="agent-name" className="text-sm font-semibold text-slate-700 block mb-2">Agent名称</label>
                            <input id="agent-name" type="text" value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="例如：支付模块压测Agent" className="w-full p-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2">角色定位</label>
                            <div className="grid grid-cols-2 gap-3">
                                <RoleCard icon="👩‍💻" title="测试工程师" selected={selectedRole === 'developer'} onClick={() => setSelectedRole('developer')} />
                                <RoleCard icon="🧑‍⚖️" title="测试负责人" selected={selectedRole === 'tech-lead'} onClick={() => setSelectedRole('tech-lead')} />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-1 gap-4">
                        <ScenarioCard 
                            icon="🚀" 
                            title="项目验收" 
                            description="对即将上线的项目进行全面的非功能测试，确保满足上线标准。" 
                            selected={selectedScenario === 'project-acceptance'} 
                            onClick={() => setSelectedScenario('project-acceptance')} />
                        <ScenarioCard 
                            icon="🎯" 
                            title="非功能精准测试" 
                            description="针对特定模块或业务场景进行深入的专项测试，发现性能瓶颈。" 
                            selected={selectedScenario === 'tech-debt'} 
                            onClick={() => setSelectedScenario('tech-debt')} />
                        <ScenarioCard 
                            icon="🔄" 
                            title="非功能回归测试" 
                            description="对系统进行定期的非功能回归测试，确保版本迭代不引入性能衰退或稳定性问题。" 
                            selected={selectedScenario === 'regression-testing'} 
                            onClick={() => setSelectedScenario('regression-testing')} />
                   </div>
                );
            case 3:
                 return (
                    <div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {repositories.map(repo => (
                            <div key={repo.id} onClick={() => handleToggleRepo(repo.id)} className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${selectedRepos.includes(repo.id) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input type="checkbox" checked={selectedRepos.includes(repo.id)} readOnly className="form-checkbox text-indigo-600 h-5 w-5 rounded"/>
                                <div className="text-xl">📦</div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{repo.name}</div>
                                    <div className="text-xs text-slate-500">{repo.language}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                 );
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800">快速创建Agent</h3>
                        <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600">&times;</button>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center text-sm">
                            {STEPS.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= step.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {currentStep > step.id ? '✓' : step.id}
                                        </div>
                                        <span className={`${currentStep >= step.id ? 'text-indigo-600' : 'text-slate-500'}`}>{step.title}</span>
                                    </div>
                                    {index < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 min-h-[20rem]">
                    {renderStepContent()}
                </div>

                <div className="p-4 bg-slate-50 flex justify-between items-center rounded-b-xl">
                    <button 
                        onClick={prevStep} 
                        disabled={currentStep === 1}
                        className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        上一步
                    </button>
                    {currentStep < STEPS.length ? (
                         <button onClick={nextStep} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                            下一步
                        </button>
                    ) : (
                        <button onClick={handleCreate} className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors">
                            完成创建
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const RoleCard: React.FC<{icon: string, title: string, selected: boolean, onClick: () => void}> = ({icon, title, selected, onClick}) => (
    <div onClick={onClick} className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
        <div className="text-3xl mb-1">{icon}</div>
        <div className="font-bold text-sm text-slate-800">{title}</div>
    </div>
);

const ScenarioCard: React.FC<{icon: string, title: string, description: string, selected: boolean, onClick: () => void}> = ({ icon, title, description, selected, onClick}) => (
    <div onClick={onClick} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
        <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">{icon}</div>
            <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-xs text-slate-500">{description}</p>
    </div>
);