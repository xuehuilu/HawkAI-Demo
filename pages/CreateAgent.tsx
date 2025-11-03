import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import type { Repository, Role, Scenario, Preference, Rule, LearnedRule, Agent } from '../types';
import { RULES, LEARNED_RULES } from '../constants';

const STEPS = [
  { id: 1, title: '基本信息' },
  { id: 2, title: '分析场景' },
  { id: 3, title: '选择分析源' },
  { id: 4, title: '关注范围' },
  { id: 5, title: '工作方式' },
  { id: 6, title: '规则配置' },
  { id: 7, title: '已学习' },
  { id: 8, title: '完成' },
];

interface CreateAgentProps {
  navigateTo: (page: Page) => void;
  repositories: Repository[];
  agentToEdit: Agent | null;
  onFinish: () => void;
  onAgentCreated: (data: any) => void;
}

export const CreateAgent: React.FC<CreateAgentProps> = ({ navigateTo, repositories, agentToEdit, onFinish, onAgentCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agentName, setAgentName] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('project-acceptance');
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  // Store all form data in a single state object
  const [formData, setFormData] = useState({});

   useEffect(() => {
    if (agentToEdit) {
      setAgentName(agentToEdit.name);
      // In a real app, you'd populate state for all steps here
      // For now, just set the name and maybe the repo
      setSelectedRepos([repositories.find(r => r.name === agentToEdit.repo)?.id || '']);
    } else {
      // Reset for "create" mode
      setAgentName('');
      setSelectedRepos(repositories.length > 0 ? [repositories[0].id] : []);
      setCurrentStep(1);
    }
  }, [agentToEdit, repositories]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => {
      if (step < currentStep) {
        setCurrentStep(step);
      }
  };
  
  const createAgent = () => {
     onAgentCreated({
        name: agentName,
        scenario: selectedScenario,
        source: {
            repos: selectedRepos,
        }
     });
    setCurrentStep(8); // Go to the 'Complete' step
  };
  
  const handleFinish = () => {
      onFinish();
      navigateTo(Page.Agents);
  };
  
  const handleCreateAnother = () => {
      onFinish();
      setAgentName('');
      setSelectedRepos(repositories.length > 0 ? [repositories[0].id] : []);
      setCurrentStep(1);
  };

  const handleCancel = () => {
      onFinish();
      navigateTo(Page.Agents);
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step2_BasicInfo agentName={agentName} setAgentName={setAgentName} onNext={nextStep} onCancel={handleCancel} />;
      case 2: return <Step3_Scenario selectedScenario={selectedScenario} setSelectedScenario={setSelectedScenario} onNext={nextStep} onPrev={prevStep} />;
      case 3: return <Step1_SourceSelection repositories={repositories} selectedRepos={selectedRepos} setSelectedRepos={setSelectedRepos} onNext={nextStep} onPrev={prevStep} />;
      case 4: return <Step4_Scope onNext={nextStep} onPrev={prevStep} />;
      case 5: return <Step5_WorkStyle onNext={nextStep} onPrev={prevStep} />;
      case 6: return <Step6_Rules onNext={nextStep} onPrev={prevStep} />;
      case 7: return <Step7_Learning onNext={createAgent} onPrev={prevStep} isEditing={!!agentToEdit} />;
      case 8: return <Step9_Complete agentName={agentName || agentToEdit?.name || ''} onFinish={handleFinish} onCreateAnother={handleCreateAnother} />;
      default: return null;
    }
  };

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[384px_1fr]">
        {/* Left Panel: Stepper and Info */}
        <aside className="bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 lg:p-8 flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800">{agentToEdit ? `编辑 Agent` : '创建新Agent'}</h1>
            <p className="mt-1 text-sm text-slate-500 mb-6">{agentToEdit ? agentToEdit.name : '通过以下步骤配置你的智能非功能测试助手'}</p>
            <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                <WizardStepper currentStep={currentStep} goToStep={goToStep} />
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-400">
                <p>💡 使用左侧导航可以在已完成的步骤间跳转。</p>
            </div>
        </aside>

        {/* Right Panel: Step Content */}
        <main className="overflow-y-auto bg-slate-50">
            <div className="max-w-5xl mx-auto p-6 sm:p-8 lg:p-10">
                {renderStepContent()}
            </div>
        </main>
    </div>
  );
};

// WizardStepper Component
interface WizardStepperProps {
  currentStep: number;
  goToStep: (step: number) => void;
}
const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep, goToStep }) => (
  <nav className="space-y-1">
    {STEPS.map(step => {
      const isCompleted = currentStep > step.id;
      const isActive = currentStep === step.id;
      const isClickable = isCompleted;

      return (
        <button
          key={step.id}
          onClick={() => isClickable && goToStep(step.id)}
          disabled={!isClickable && !isActive}
          className={`w-full text-left p-3 rounded-lg flex items-center gap-4 transition-colors ${
            isActive ? 'bg-indigo-100 text-indigo-700' : 
            isCompleted ? 'hover:bg-slate-100 text-slate-700' : 'text-slate-400'
          } ${isClickable ? 'cursor-pointer' : isActive ? '' : 'cursor-not-allowed'}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
              isActive ? 'bg-indigo-600 text-white' : 
              isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {isCompleted ? '✓' : step.id}
          </div>
          <span className="font-semibold">{step.title}</span>
        </button>
      );
    })}
  </nav>
);


// ActionButtons Component
interface ActionButtonsProps {
  onNext?: () => void;
  onPrev?: () => void;
  onCancel?: () => void;
  nextText?: string;
  isCreating?: boolean;
  nextDisabled?: boolean;
}
const ActionButtons: React.FC<ActionButtonsProps> = ({ onNext, onPrev, onCancel, nextText = '下一步 →', isCreating, nextDisabled }) => (
  <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
    <div>
        {onCancel && <button onClick={onCancel} className="text-sm font-semibold text-slate-600 hover:text-slate-800">取消</button>}
    </div>
    <div className="flex gap-3">
      {onPrev && <button onClick={onPrev} className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors">← 上一步</button>}
      {onNext && (
        <button 
            onClick={onNext} 
            disabled={nextDisabled}
            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? '保存并创建' : nextText}
        </button>
      )}
    </div>
  </div>
);

// TabButton Component
const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            isActive
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
        }`}
    >
        {children}
    </button>
);


// FileUpload Component
const FileUpload: React.FC<{ onFileChange: (file: File | null) => void }> = ({ onFileChange }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (selectedFile: File | undefined) => {
        if (selectedFile && selectedFile.name.endsWith('.jar')) {
            setFile(selectedFile);
            onFileChange(selectedFile);
        } else if (selectedFile) {
            alert('请只上传 .jar 文件');
            setFile(null);
            onFileChange(null);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        onFileChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div>
            {!file ? (
                 <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                >
                    <input type="file" ref={inputRef} onChange={handleChange} accept=".jar" className="hidden" />
                    <div className="flex flex-col items-center justify-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <p className="font-semibold">拖拽 .jar 文件到这里，或 <span className="text-indigo-600">点击上传</span></p>
                        <p className="text-xs mt-1">仅支持单个 .jar 文件</p>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-emerald-500 bg-emerald-50 rounded-lg p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-3xl">📦</div>
                        <div>
                            <p className="font-bold text-slate-800">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button onClick={handleRemoveFile} className="text-slate-500 hover:text-red-600 font-bold text-xl">&times;</button>
                </div>
            )}
        </div>
    );
};


// Step 1: Source Selection
const Step1_SourceSelection: React.FC<{ repositories: Repository[], selectedRepos: string[], setSelectedRepos: (repos: string[]) => void, onNext: () => void, onPrev: () => void }> = ({ repositories, selectedRepos, setSelectedRepos, onNext, onPrev }) => {
    const [sourceType, setSourceType] = useState<'repository' | 'jar'>('repository');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleToggleRepo = (repoId: string) => {
        setSelectedRepos(
            selectedRepos.includes(repoId)
                ? selectedRepos.filter(id => id !== repoId)
                : [...selectedRepos, repoId]
        );
    };

    const isNextDisabled = (sourceType === 'repository' && selectedRepos.length === 0) || (sourceType === 'jar' && !uploadedFile);

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">📦 选择分析源</h2>
            <p className="mt-1 text-sm text-slate-500 mb-6">选择一个或多个代码库，或上传一个JAR包，Agent将对其进行深度分析。</p>
            
            <div className="flex border-b border-slate-200 mb-6">
                <TabButton isActive={sourceType === 'repository'} onClick={() => setSourceType('repository')}>
                    选择代码库
                </TabButton>
                <TabButton isActive={sourceType === 'jar'} onClick={() => setSourceType('jar')}>
                    上传JAR包
                </TabButton>
            </div>

            {sourceType === 'repository' && (
                <>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {repositories.map(repo => (
                            <div key={repo.id} onClick={() => handleToggleRepo(repo.id)} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedRepos.includes(repo.id) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <div className="flex items-center gap-4">
                                    <input type="checkbox" name="repo-selection" value={repo.id} checked={selectedRepos.includes(repo.id)} readOnly className="form-checkbox text-indigo-600 h-5 w-5 rounded"/>
                                    <div className="text-2xl">📦</div>
                                    <div>
                                        <div className="font-bold text-slate-800">{repo.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{repo.url}</div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-x-2 divide-x divide-slate-300">
                                            <span className="pr-2">⭐ 主分支: {repo.mainBranch}</span>
                                            <span className="px-2">{repo.fileCount}个文件</span>
                                            <span className="pl-2">{repo.language}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="mt-6 p-4 bg-slate-100 rounded-lg text-sm text-slate-600 border-l-4 border-indigo-400">
                        💡 你可以选择一个或多个代码库，Agent将同时对它们进行分析。如果没有看到你的代码库，请先在 "代码库管理" 页面连接。
                    </div>
                </>
            )}
            
            {sourceType === 'jar' && (
                <>
                    <FileUpload onFileChange={setUploadedFile} />
                    <div className="mt-6 p-4 bg-slate-100 rounded-lg text-sm text-slate-600 border-l-4 border-indigo-400">
                        💡 上传的JAR包将在Agent创建后进行分析。请确保JAR包包含了需要分析的字节码。
                    </div>
                </>
            )}

            <ActionButtons onNext={onNext} onPrev={onPrev} nextDisabled={isNextDisabled} />
        </div>
    );
};

// Step 2: Basic Info
const Step2_BasicInfo: React.FC<{ agentName: string, setAgentName: (name: string) => void, onNext: () => void, onCancel: () => void }> = ({ agentName, setAgentName, onNext, onCancel }) => {
    const [selectedRole, setSelectedRole] = useState<Role>('developer');
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">📝 基本信息</h2>
            <p className="mt-1 text-sm text-slate-500 mb-6">给你的Agent起个名字，并选择它的角色定位。</p>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                    <label htmlFor="agent-name" className="text-sm font-semibold text-slate-700 md:text-right md:pt-2">Agent名称</label>
                    <div className="md:col-span-2">
                        <input id="agent-name" type="text" value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="例如：支付模块压测Agent" className="w-full p-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                        <p className="text-xs text-slate-500 mt-1">💡 建议使用能反映其测试范围与目的的名称</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                    <label className="text-sm font-semibold text-slate-700 md:text-right md:pt-2">角色定位</label>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <RoleCard icon="👩‍💻" title="测试工程师" description="负责执行具体的测试任务" selected={selectedRole === 'developer'} onClick={() => setSelectedRole('developer')} />
                        <RoleCard icon="🧑‍⚖️" title="测试负责人" description="负责规划和管理整体测试活动" selected={selectedRole === 'tech-lead'} onClick={() => setSelectedRole('tech-lead')} />
                    </div>
                </div>
            </div>
            <ActionButtons onNext={onNext} onCancel={onCancel} nextDisabled={!agentName} />
        </div>
    );
};
const RoleCard: React.FC<{icon: string, title: string, description: string, selected: boolean, onClick: () => void}> = ({icon, title, description, selected, onClick}) => (
    <div onClick={onClick} className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-all ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
        <div className="text-4xl mb-2">{icon}</div>
        <div className="font-bold text-slate-800">{title}</div>
        <div className="text-xs text-slate-500">{description}</div>
    </div>
);


// Step 3: Scenario
const Step3_Scenario: React.FC<{ selectedScenario: Scenario, setSelectedScenario: (s: Scenario) => void, onNext: () => void, onPrev: () => void }> = ({ selectedScenario, setSelectedScenario, onNext, onPrev }) => {
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">🎯 选择分析场景</h2>
            <p className="mt-1 text-sm text-slate-500 mb-6">根据你的测试目标选择Agent的工作模式。</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 <ScenarioCard 
                     icon="🚀" 
                     title="项目验收" 
                     description="对即将上线的项目进行全面的非功能测试，确保满足上线标准。" 
                     features={['性能压测', 'API健壮性测试', '安全漏洞扫描']} 
                     selected={selectedScenario === 'project-acceptance'} 
                     onClick={() => setSelectedScenario('project-acceptance')} />
                 <ScenarioCard 
                     icon="🎯" 
                     title="非功能精准测试" 
                     description="针对特定模块或业务场景进行深入的专项测试，发现性能瓶颈。" 
                     features={['精准性能测试', '可靠性专项测试', '自定义测试场景']} 
                     selected={selectedScenario === 'tech-debt'} 
                     onClick={() => setSelectedScenario('tech-debt')} />
                 <ScenarioCard 
                     icon="🔄" 
                     title="非功能回归测试" 
                     description="对系统进行定期的非功能回归测试，确保版本迭代不引入性能衰退或稳定性问题。" 
                     features={['性能基准对比', '可靠性指标监控', '自动化回归报告']} 
                     selected={selectedScenario === 'regression-testing'} 
                     onClick={() => setSelectedScenario('regression-testing')} />
            </div>
            <ActionButtons onNext={onNext} onPrev={onPrev} />
        </div>
    );
};
const ScenarioCard: React.FC<{icon: string, title: string, description: string, features: string[], selected: boolean, onClick: () => void}> = ({ icon, title, description, features, selected, onClick}) => (
    <div onClick={onClick} className={`p-6 border-2 rounded-lg cursor-pointer transition-all h-full flex flex-col ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
        <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">{icon}</div>
            <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-xs text-slate-500 mb-3 flex-1">{description}</p>
        <ul className="space-y-1 text-xs text-slate-600">
            {features.map(f => <li key={f} className="flex items-center gap-2"><span>✓</span> {f}</li>)}
        </ul>
    </div>
);

// Step 4: Scope
const MODULES = [
    { id: 'mod1', path: 'payment/', name: '支付模块', fileCount: 28, recommended: true },
    { id: 'mod2', path: 'order/', name: '订单模块', fileCount: 35, recommended: true },
    { id: 'mod3', path: 'user/', name: '用户模块', fileCount: 12, recommended: false },
    { id: 'mod4', path: 'notification/', name: '通知模块', fileCount: 8, recommended: false },
];

const ModuleItem: React.FC<{module: typeof MODULES[0], isSelected: boolean, onToggle: () => void}> = ({ module, isSelected, onToggle }) => (
    <div onClick={onToggle} className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-4 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
        <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-white ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-2 border-slate-300'}`}>
            {isSelected && '✓'}
        </div>
        <div className="flex-1">
            <div className="font-semibold text-slate-800 flex items-center gap-2">
                <span>{module.path}</span> 
                {module.recommended && <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">系统推荐</span>}
            </div>
            <p className="text-xs text-slate-500">{module.name} ({module.fileCount}个文件)</p>
        </div>
    </div>
);

const Step4_Scope: React.FC<{ onNext: () => void, onPrev: () => void }> = ({ onNext, onPrev }) => {
    const [selectedModules, setSelectedModules] = useState<string[]>(['mod1', 'mod2']);

    const handleToggleModule = (moduleId: string) => {
        setSelectedModules(prev => 
            prev.includes(moduleId) 
                ? prev.filter(id => id !== moduleId) 
                : [...prev, moduleId]
        );
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">📦 关注范围</h2>
            <p className="mt-1 text-sm text-slate-500 mb-6">选择要重点关注的业务模块（基于所选代码库自动识别）。</p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {MODULES.map(module => (
                    <ModuleItem 
                        key={module.id} 
                        module={module} 
                        isSelected={selectedModules.includes(module.id)} 
                        onToggle={() => handleToggleModule(module.id)} 
                    />
                ))}
            </div>
            <div className="mt-6 p-4 bg-slate-100 rounded-lg text-sm text-slate-600 border-l-4 border-indigo-400">
            💡 选择核心模块后，Agent会优先监控这些区域（权重×2），其他区域也会扫描但优先级较低。
            </div>
            <ActionButtons onNext={onNext} onPrev={onPrev} />
        </div>
    );
};

// Step 5: Work Style
const PreferenceCard: React.FC<{icon:string, title: string, description: string, selected: boolean, onClick: () => void}> = ({icon, title, description, selected, onClick}) => (
    <div onClick={onClick} className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-start gap-4 ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
        <div className="text-2xl mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-slate-800">{title}</h4>
            <p className="text-xs text-slate-500">{description}</p>
        </div>
    </div>
);
const Step5_WorkStyle: React.FC<{ onNext: () => void, onPrev: () => void }> = ({ onNext, onPrev }) => {
    const [preference, setPreference] = useState<Preference>('balanced');
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">⚙️ 工作方式</h2>
            <p className="mt-1 text-sm text-slate-500 mb-6">告诉Agent如何确定测试任务的优先级，以最高效地发现潜在问题。</p>
            <div className="space-y-4">
                <PreferenceCard icon="📈" title="业务优先级优化" description="优先测试核心业务模块，保障关键业务流程的性能与稳定。" selected={preference === 'business'} onClick={() => setPreference('business')} />
                <PreferenceCard icon="🚨" title="风险影响程度优先" description="优先关注高风险模块与高危漏洞，优先消除可能导致生产事故的风险点。" selected={preference === 'risk-impact'} onClick={() => setPreference('risk-impact')} />
                <PreferenceCard icon="⚖️" title="智能平衡（推荐）" description="综合考虑业务重要性、风险等级、变更频率等多个维度，智能规划测试优先级。" selected={preference === 'balanced'} onClick={() => setPreference('balanced')} />
            </div>
            <ActionButtons onNext={onNext} onPrev={onPrev} />
        </div>
    );
};

// Step 6: Rules
const priorityClasses: {[key in Rule['priority']]: string} = {
    P0: 'bg-red-100 text-red-800',
    P1: 'bg-amber-100 text-amber-800',
    P2: 'bg-slate-100 text-slate-800',
};

const RuleModal: React.FC<{rule: Rule | null, onSave: (rule: Rule) => void, onClose: () => void}> = ({ rule, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Rule, 'id' | 'enabled'>>({
        code: '', name: '', description: '', priority: 'P2'
    });

    useEffect(() => {
        if (rule) {
            setFormData({ code: rule.code, name: rule.name, description: rule.description, priority: rule.priority });
        } else {
            setFormData({ code: '', name: '', description: '', priority: 'P2' });
        }
    }, [rule]);

    const handleSave = () => {
        const finalRule: Rule = {
            id: rule?.id || `rule-${Date.now()}`,
            enabled: rule?.enabled ?? true,
            ...formData,
        };
        onSave(finalRule);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">{rule ? '修改规则' : '添加自定义规则'}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="sm:col-span-1">
                            <label htmlFor="code" className="text-xs font-semibold text-slate-600 block mb-1">规则编号</label>
                            <input type="text" name="code" value={formData.code} onChange={handleChange} className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm"/>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="text-xs font-semibold text-slate-600 block mb-1">规则名称</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="priority" className="text-xs font-semibold text-slate-600 block mb-1">优先级</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm">
                            <option value="P0">P0 - 严重</option>
                            <option value="P1">P1 - 高</option>
                            <option value="P2">P2 - 中</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="text-xs font-semibold text-slate-600 block mb-1">描述</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm"></textarea>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50">取消</button>
                    <button onClick={handleSave} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700">保存规则</button>
                </div>
            </div>
        </div>
    )
};

const RuleItem: React.FC<{rule: Rule, isEnabled: boolean, onToggle: () => void, onEdit: () => void}> = ({ rule, isEnabled, onToggle, onEdit }) => (
    <div className="p-4 border border-slate-200 rounded-lg transition-shadow hover:shadow-md">
        <div className="flex items-start gap-4">
            <div onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`w-10 h-6 rounded-full flex-shrink-0 p-1 cursor-pointer transition-colors ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-4' : ''}`} />
            </div>
            <div className="flex-1 cursor-pointer" onClick={onEdit}>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${priorityClasses[rule.priority]}`}>{rule.priority}</span>
                            <h4 className="font-semibold text-slate-800">{rule.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500">{rule.description}</p>
                    </div>
                    <span className="text-slate-400 hover:text-indigo-600 text-xs p-2">✏️ 编辑</span>
                </div>
            </div>
        </div>
    </div>
);

const Step6_Rules: React.FC<{ onNext: () => void, onPrev: () => void }> = ({ onNext, onPrev }) => {
    const [rules, setRules] = useState<Rule[]>(RULES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);

    const handleToggleRule = (ruleId: string) => {
        setRules(prev => prev.map(r => r.id === ruleId ? {...r, enabled: !r.enabled} : r));
    };

    const handleOpenModal = (rule: Rule | null) => {
        setEditingRule(rule);
        setIsModalOpen(true);
    }
    
    const handleSaveRule = (savedRule: Rule) => {
        if(rules.some(r => r.id === savedRule.id)) {
            // Edit
            setRules(prev => prev.map(r => r.id === savedRule.id ? savedRule : r));
        } else {
            // Add
            setRules(prev => [...prev, savedRule]);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            {isModalOpen && <RuleModal rule={editingRule} onSave={handleSaveRule} onClose={() => setIsModalOpen(false)} />}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">📋 规则配置</h2>
                    <p className="mt-1 text-sm text-slate-500">管理Agent使用的检查规则，可以启用/禁用或调整严重性。</p>
                </div>
                <button onClick={() => handleOpenModal(null)} className="bg-white border border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
                    <span>+</span>
                    <span>添加自定义规则</span>
                </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {rules.map(rule => <RuleItem key={rule.id} rule={rule} isEnabled={rule.enabled} onToggle={() => handleToggleRule(rule.id)} onEdit={() => handleOpenModal(rule)} />)}
            </div>
            <ActionButtons onNext={onNext} onPrev={onPrev} />
        </div>
    );
};

// Step 7: Learning
const LearningStat: React.FC<{value: number, label: string}> = ({value, label}) => (
    <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
        <p className="text-3xl font-bold text-indigo-600">{value}</p>
        <p className="text-xs text-slate-500 font-semibold">{label}</p>
    </div>
);

const LearnedItem: React.FC<{item: LearnedRule}> = ({ item }) => {
    const isLearning = item.type === 'learning';
    return (
        <div className={`p-4 border border-slate-200 rounded-lg flex items-start gap-4 ${isLearning ? 'bg-slate-50 opacity-70' : 'bg-white'}`}>
            <div className={`text-2xl mt-1 flex-shrink-0 ${isLearning ? 'opacity-50' : ''}`}>{item.icon}</div>
            <div className="flex-1 min-w-0">
                <h4 className={`font-bold ${isLearning ? 'text-slate-500' : 'text-slate-800'}`}>{item.title}</h4>
                <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <p><strong>学习来源：</strong>{item.source}</p>
                    <p><strong>应用范围：</strong>{item.scope}</p>
                    <p><strong>{isLearning ? '学习进度' : '学习时间'}：</strong>{item.timestamp}</p>
                </div>
                <div className="mt-2 p-2 bg-slate-100 rounded">
                    <code className={`text-xs ${isLearning ? 'text-slate-400' : 'text-slate-700'}`}>{item.ruleLogic}</code>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <button 
                    disabled={isLearning}
                    className="text-xs font-semibold bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLearning ? '学习中' : '编辑'}
                </button>
                {!isLearning && <button className="text-xs font-semibold text-red-600 hover:text-red-800">删除</button>}
            </div>
        </div>
    );
};

const Step7_Learning: React.FC<{ onNext: () => void, onPrev: () => void, isEditing: boolean }> = ({ onNext, onPrev, isEditing }) => {
    if (!isEditing) {
        return (
            <div>
                 <h2 className="text-xl font-bold text-slate-800">🎓 已学习的规则</h2>
                <p className="mt-1 text-sm text-slate-500 mb-6">Agent从你的反馈中学习，避免重复推荐相似的问题。</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <LearningStat value={0} label="学习记录" />
                    <LearningStat value={0} label="误报模式" />
                    <LearningStat value={0} label="忽略规则" />
                </div>
                 <div className="p-4 bg-slate-100 rounded-lg text-sm text-slate-600 border-l-4 border-indigo-400 space-y-2">
                    <p className="font-bold">💡 学习机制说明：</p>
                    <ul className="list-disc list-inside text-xs space-y-1">
                        <li>当你对相同模式的问题执行3次以上相同操作（忽略/误报），Agent会自动总结规则。</li>
                        <li>学习到的规则会自动应用到后续扫描中，避免重复打扰。</li>
                        <li>如果学习的规则不符合预期，可以随时在Agent详情页编辑或删除。</li>
                    </ul>
                </div>
                <div className="text-center py-10 text-slate-400 text-sm">
                    这是一个新Agent，还没有学习记录。<br/>随着你的使用，Agent会逐渐学习你的偏好。
                </div>
                <ActionButtons onNext={onNext} onPrev={onPrev} nextText="创建/保存 Agent" isCreating={true} />
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800">🎓 已学习的规则</h2>
            <p className="mt-1 text-sm text-slate-500 mb-6">Agent从你的反馈中学习，避免重复推荐相似的问题。</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
                <LearningStat value={12} label="学习记录" />
                <LearningStat value={8} label="误报模式" />
                <LearningStat value={4} label="忽略规则" />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-6">
                {LEARNED_RULES.map(rule => <LearnedItem key={rule.id} item={rule} />)}
            </div>

            <div className="p-4 bg-slate-100 rounded-lg text-sm text-slate-600 border-l-4 border-indigo-400 space-y-2">
                <p className="font-bold">💡 学习机制说明：</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                    <li><strong>自动学习：</strong>当你对相同模式的问题执行3次以上相同操作（忽略/误报），Agent会自动总结规则。</li>
                    <li><strong>应用范围：</strong>学习到的规则会自动应用到后续扫描中，避免重复打扰。</li>
                    <li><strong>可撤销：</strong>如果学习的规则不符合预期，可以随时编辑或删除。</li>
                    <li><strong>优先级调整：</strong>Agent还会学习你的修复偏好，自动调整推荐优先级。</li>
                </ul>
            </div>
             <div className="mt-6 flex gap-3">
                <button className="text-sm font-semibold bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300">+ 手动添加学习规则</button>
                <button className="text-sm font-semibold text-red-600 hover:text-red-800">清空所有学习记录</button>
            </div>

            <ActionButtons onNext={onNext} onPrev={onPrev} nextText="创建/保存 Agent" isCreating={true} />
        </div>
    );
};

// Step 9: Complete
const Step9_Complete: React.FC<{ agentName: string, onFinish: () => void, onCreateAnother: () => void }> = ({ agentName, onFinish, onCreateAnother }) => (
  <div className="text-center flex flex-col items-center justify-center h-full py-12">
    <div className="text-7xl mb-4">✅</div>
    <h2 className="text-2xl font-bold text-slate-800">Agent创建成功！</h2>
    <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
      你的Agent "<span className="font-bold text-indigo-600">{agentName || '我的代码助手'}</span>" 已经创建成功，正在进行首次代码扫描...
      预计需要 3-5 分钟，你可以先去做其他事情。
    </p>
    <div className="mt-8 flex gap-3">
        <button onClick={onFinish} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">查看我的Agents</button>
        <button onClick={onCreateAnother} className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors">创建另一个Agent</button>
    </div>
  </div>
);