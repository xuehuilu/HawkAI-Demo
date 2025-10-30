import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Page } from '../types';
import type { Report, TechnicalDebtReport, ChangeRiskReport, Issue } from '../types';

interface ReportDetailProps {
  report: Report;
  navigateTo: (page: Page) => void;
}

const priorityClasses: {[key in Issue['priority']]: string} = {
    P0: 'bg-red-500 text-white',
    P1: 'bg-amber-500 text-white',
    P2: 'bg-slate-500 text-white',
};

const IssueRow: React.FC<{issue: Issue}> = ({ issue }) => (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
        <td className="p-3"><span className={`px-2 py-0.5 text-xs font-bold rounded ${priorityClasses[issue.priority]}`}>{issue.priority}</span></td>
        <td className="p-3 text-sm font-mono text-slate-700">{issue.file}</td>
        <td className="p-3 text-sm text-slate-600">{issue.description}</td>
        <td className="p-3 text-sm text-slate-600">{issue.category}</td>
        <td className="p-3 text-center">
            <button className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200">修复建议</button>
        </td>
    </tr>
)

// --- Role-based Views for Technical Debt Report ---

const DeveloperView: React.FC<{report: TechnicalDebtReport}> = ({ report }) => {
    // Developer view now FILTERS the master list of issues
    const myIssues = report.issues.filter(i => i.priority === 'P0' || i.priority === 'P1');
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">🎯 我的高优先级问题 ({myIssues.length})</h3>
                <p className="text-sm text-slate-500 mb-4">这是系统根据代码提交记录，为你筛选出的需要优先关注和修复的问题。</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                                <th className="p-3 font-semibold">优先级</th>
                                <th className="p-3 font-semibold">文件</th>
                                <th className="p-3 font-semibold">描述</th>
                                <th className="p-3 font-semibold">分类</th>
                                <th className="p-3 font-semibold text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myIssues.length > 0 ? (
                                myIssues.map(issue => <IssueRow key={issue.id} issue={issue} />)
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-slate-500">🎉 恭喜！没有需要你立即处理的高优问题。</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">🔥 我最近修改过的热点文件</h3>
                <p className="text-sm text-slate-500 mb-4">这些文件问题集中且你近期有过修改，修复它们能带来最大收益。</p>
                <ul className="space-y-2">
                    {report.hotspotFiles.slice(0, 2).map(hf => (
                        <li key={hf.file} className="flex justify-between items-center text-sm p-3 rounded-md bg-slate-50 border border-slate-200">
                            <span className="font-mono text-slate-700">{hf.file}</span>
                            <span className="font-bold text-red-600">{hf.issueCount} 个问题</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ModuleStats: React.FC<{ report: TechnicalDebtReport }> = ({ report }) => {
    // Mocking module data based on file paths for this prototype
    const moduleData = [
        { name: '支付模块', pathPrefix: 'payment/', isCore: true },
        { name: '订单模块', pathPrefix: 'order/', isCore: true },
        { name: '前端组件', pathPrefix: 'components/', isCore: false },
        { name: '前端工具', pathPrefix: 'utils/', isCore: false },
    ];

    const stats = moduleData.map(mod => {
        const issues = report.issues.filter(i => i.file.startsWith(mod.pathPrefix));
        return {
            ...mod,
            p0: issues.filter(i => i.priority === 'P0').length,
            p1: issues.filter(i => i.priority === 'P1').length,
            p2: issues.filter(i => i.priority === 'P2').length,
            total: issues.length,
        };
    }).sort((a, b) => b.total - a.total);

    const maxIssues = Math.max(...stats.map(s => s.total), 1); // Avoid division by zero

    return (
        <div>
            <h4 className="font-bold text-slate-700 mb-3">业务模块风险分布</h4>
            <div className="space-y-4">
                {stats.map(mod => (
                    <div key={mod.name}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <div className="font-semibold text-slate-600 flex items-center gap-2">
                                {mod.name}
                                {mod.isCore && <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">核心模块</span>}
                            </div>
                            <div className="font-mono text-xs text-slate-500">
                                <span className="text-red-500 font-bold">{mod.p0} P0</span> / <span>{mod.p1} P1</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4 relative overflow-hidden" title={`${mod.total} issues`}>
                            <div className="bg-gradient-to-r from-amber-400 to-red-500 h-4 rounded-full" style={{ width: `${(mod.total / maxIssues) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryStats: React.FC<{ report: TechnicalDebtReport }> = ({ report }) => {
    const categorySummary = report.issues.reduce((acc, issue) => {
        if (!acc[issue.category]) {
            acc[issue.category] = { p0: 0, p1: 0, p2: 0, total: 0 };
        }
        if (issue.priority === 'P0') acc[issue.category].p0++;
        else if (issue.priority === 'P1') acc[issue.category].p1++;
        else acc[issue.category].p2++;
        acc[issue.category].total++;
        return acc;
    }, {} as Record<string, { p0: number, p1: number, p2: number, total: number }>);
    
    const sortedCategories = Object.entries(categorySummary).sort(([, a], [, b]) => b.total - a.total);
    
    return (
        <div>
            <h4 className="font-bold text-slate-700 mb-3">问题类型分布</h4>
            <div className="space-y-4">
                {sortedCategories.map(([category, counts]) => {
                    const isSevere = counts.p0 > 0;
                    return (
                        <div key={category}>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <div className="font-semibold text-slate-600 flex items-center gap-2">
                                    {category}
                                    {isSevere && <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">严重问题</span>}
                                </div>
                                <span className="font-mono text-xs text-slate-500">{counts.total} 个</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-4 flex overflow-hidden" title={`P0: ${counts.p0}, P1: ${counts.p1}, P2: ${counts.p2}`}>
                                <div className="bg-red-500 h-full" style={{ width: `${(counts.p0 / counts.total) * 100}%` }}></div>
                                <div className="bg-amber-500 h-full" style={{ width: `${(counts.p1 / counts.total) * 100}%` }}></div>
                                <div className="bg-slate-400 h-full" style={{ width: `${(counts.p2 / counts.total) * 100}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const TechLeadView: React.FC<{report: TechnicalDebtReport}> = ({ report }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                <p className="text-sm text-slate-500">代码健康度</p>
                <p className="text-5xl font-bold text-emerald-600">{report.health}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                <p className="text-sm text-slate-500">本周新增</p>
                <p className="text-5xl font-bold text-amber-600">{report.stats.newIssues}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                <p className="text-sm text-slate-500">P0 严重问题</p>
                <p className="text-5xl font-bold text-red-600">{report.stats.p0Issues}</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">多维度统计分析</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
                <ModuleStats report={report} />
                <CategoryStats report={report} />
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">风险详情</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                            <th className="p-3 font-semibold">优先级</th>
                            <th className="p-3 font-semibold">文件</th>
                            <th className="p-3 font-semibold">描述</th>
                            <th className="p-3 font-semibold">分类</th>
                            <th className="p-3 font-semibold text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.issues.map(issue => <IssueRow key={issue.id} issue={issue} />)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const ArchitectView: React.FC<{report: TechnicalDebtReport}> = ({ report }) => {
    // Architect view now FILTERS the master list for relevant categories
    const architecturalIssues = report.issues.filter(i => ['架构', '依赖管理'].includes(i.category));

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">🏛️</span> 架构风险
                </h3>
                {report.architecturalConcerns && report.architecturalConcerns.length > 0 ? (
                     <ul className="space-y-3">
                        {report.architecturalConcerns.map(c => (
                            <li key={c.title} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-semibold text-slate-800">{c.title} <span className={`text-xs font-bold ${c.severity === 'High' ? 'text-red-600' : 'text-amber-600'}`}>({c.severity})</span></p>
                                <p className="text-sm text-slate-600">{c.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">未发现明确的架构模式风险。</p>
                )}
            </div>
           
             <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <span className="text-xl">📦</span> 技术栈风险
                </h3>
                 {report.techStackRisks && report.techStackRisks.length > 0 ? (
                    <ul className="space-y-2">
                        {report.techStackRisks.map(r => (
                            <li key={r.library} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="font-semibold text-slate-800">过时的库: <span className="font-mono text-red-700">{r.library}:{r.version}</span></p>
                                <p className="text-sm text-red-600">{r.risk}</p>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="text-sm text-slate-500">未发现已知的高危技术栈漏洞。</p>
                 )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">架构相关问题列表 ({architecturalIssues.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead>
                            <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                                <th className="p-3 font-semibold">优先级</th>
                                <th className="p-3 font-semibold">文件</th>
                                <th className="p-3 font-semibold">描述</th>
                                <th className="p-3 font-semibold">分类</th>
                                <th className="p-3 font-semibold text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {architecturalIssues.length > 0 ? (
                                architecturalIssues.map(issue => <IssueRow key={issue.id} issue={issue} />)
                             ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-slate-500">未发现与架构直接相关的问题。</td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MasterView: React.FC<{ report: TechnicalDebtReport }> = ({ report }) => (
    <div className="space-y-6">
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-sm text-center">
             <h2 className="text-xl font-bold text-indigo-800">母报告详情 (Master Report)</h2>
             <p className="text-sm text-indigo-600 mt-1">这是未经筛选的原始数据，包含了本次扫描发现的所有信息。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">🏛️</span> 架构风险
                </h3>
                {report.architecturalConcerns && report.architecturalConcerns.length > 0 ? (
                     <ul className="space-y-3">
                        {report.architecturalConcerns.map(c => (
                            <li key={c.title} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-semibold text-slate-800">{c.title} <span className={`text-xs font-bold ${c.severity === 'High' ? 'text-red-600' : 'text-amber-600'}`}>({c.severity})</span></p>
                                <p className="text-sm text-slate-600">{c.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">未发现明确的架构模式风险。</p>
                )}
            </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <span className="text-xl">📦</span> 技术栈风险
                </h3>
                 {report.techStackRisks && report.techStackRisks.length > 0 ? (
                    <ul className="space-y-2">
                        {report.techStackRisks.map(r => (
                            <li key={r.library} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="font-semibold text-slate-800">过时的库: <span className="font-mono text-red-700">{r.library}:{r.version}</span></p>
                                <p className="text-sm text-red-600">{r.risk}</p>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="text-sm text-slate-500">未发现已知的高危技术栈漏洞。</p>
                 )}
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">📋 全部问题列表 ({report.issues.length})</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                            <th className="p-3 font-semibold">优先级</th>
                            <th className="p-3 font-semibold">文件</th>
                            <th className="p-3 font-semibold">描述</th>
                            <th className="p-3 font-semibold">分类</th>
                            <th className="p-3 font-semibold text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.issues.map(issue => <IssueRow key={issue.id} issue={issue} />)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);


// --- Main Components ---

const TechnicalDebtDetail: React.FC<{report: TechnicalDebtReport}> = ({ report }) => {
    const [viewMode, setViewMode] = useState<'role' | 'master'>('role');

    const renderRoleView = () => {
        switch (report.createdByRole) {
            case 'developer':
                return <DeveloperView report={report} />;
            case 'architect':
                return <ArchitectView report={report} />;
            case 'tech-lead':
            default:
                return <TechLeadView report={report} />;
        }
    };

    return (
        <div>
            <div className="mb-6 flex justify-end">
                <button 
                    onClick={() => setViewMode(prev => prev === 'role' ? 'master' : 'role')}
                    className="text-sm font-semibold bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                    {viewMode === 'role' ? '📄 查看母报告详情' : '👤 返回角色视图'}
                </button>
            </div>

            {viewMode === 'role' ? renderRoleView() : <MasterView report={report} />}
        </div>
    );
};

const ChangeRiskDetail: React.FC<{report: ChangeRiskReport}> = ({ report }) => {
    const riskColor = { '高': 'text-red-600', '中': 'text-amber-600', '低': 'text-emerald-600'}[report.riskLevel];
    return (
        <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
                <p className="text-sm text-slate-500">综合风险等级</p>
                <p className={`text-5xl font-bold ${riskColor}`}>{report.riskLevel}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">影响范围</h3>
                <div className="flex flex-wrap gap-2">
                    {report.affectedFiles.map(file => (
                        <span key={file} className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">{file}</span>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">本次变更发现的问题</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead>
                            <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                                <th className="p-3 font-semibold">优先级</th>
                                <th className="p-3 font-semibold">文件</th>
                                <th className="p-3 font-semibold">描述</th>
                                <th className="p-3 font-semibold">分类</th>
                                <th className="p-3 font-semibold text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.newIssuesList.map(issue => <IssueRow key={issue.id} issue={issue} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export const ReportDetail: React.FC<ReportDetailProps> = ({ report, navigateTo }) => {
  return (
    <div>
        <PageHeader title={report.title} subtitle={`${report.type} | ${report.date}`}>
            <button onClick={() => navigateTo(Page.Reports)} className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200 flex items-center gap-2">
                <span>←</span>
                <span>返回报告列表</span>
            </button>
        </PageHeader>
        <div className="p-6 sm:p-8">
            {report.type === '技术债治理' 
                ? <TechnicalDebtDetail report={report as TechnicalDebtReport} />
                : <ChangeRiskDetail report={report as ChangeRiskReport} />
            }
        </div>
    </div>
  );
};