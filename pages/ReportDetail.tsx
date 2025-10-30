import React from 'react';
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
        <td className="p-3 text-center">
            <button className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200">修复建议</button>
        </td>
    </tr>
)

// --- Role-based Views for Technical Debt Report ---

const DeveloperView: React.FC<{report: TechnicalDebtReport}> = ({ report }) => {
    const myIssues = report.newIssuesList.filter(i => i.priority === 'P0' || i.priority === 'P1');
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
                                <th className="p-3 font-semibold text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myIssues.length > 0 ? (
                                myIssues.map(issue => <IssueRow key={issue.id} issue={issue} />)
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-slate-500">🎉 恭喜！没有需要你立即处理的高优问题。</td>
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

const TechLeadView: React.FC<{report: TechnicalDebtReport}> = ({ report }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                <p className="text-sm text-slate-500">代码健康度</p>
                <p className="text-5xl font-bold text-emerald-600">{report.health}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                <p className="text-sm text-slate-500">新增问题</p>
                <p className="text-5xl font-bold text-amber-600">{report.stats.newIssues}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                <p className="text-sm text-slate-500">已修复问题</p>
                <p className="text-5xl font-bold text-slate-800">{report.stats.fixedIssues}</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">问题热点模块 (Top 3)</h3>
            <ul className="space-y-2">
                {report.hotspotFiles.map(hf => (
                    <li key={hf.file} className="flex justify-between items-center text-sm p-3 rounded-md hover:bg-slate-50">
                        <span className="font-mono text-slate-700">{hf.file}</span>
                        <span className="font-bold text-red-600">{hf.issueCount} 个问题</span>
                    </li>
                ))}
            </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">本周新增问题列表</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                            <th className="p-3 font-semibold">优先级</th>
                            <th className="p-3 font-semibold">文件</th>
                            <th className="p-3 font-semibold">描述</th>
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

const ArchitectView: React.FC<{report: TechnicalDebtReport}> = ({ report }) => {
    // Mock data for demonstration, in a real scenario this would come from the report object itself.
    const architectData = {
        concerns: [
            { title: '循环依赖', description: `在 ${report.repoName} 中，'service' 层和 'repository' 层之间检测到循环依赖，破坏了分层架构。`, severity: 'High' },
            { title: '核心组件过度耦合', description: '`common-utils` 模块与多个业务模块存在双向依赖，建议重构为单向依赖。', severity: 'Medium' },
        ],
        duplication: [
            { file1: 'PaymentController.java', file2: 'RefundController.java', lines: 45, module: 'payment-service' },
        ],
        stackRisks: [
            { library: 'log4j', version: '2.14.0', risk: '存在已知安全漏洞 (Log4Shell)，建议立即升级。' },
        ]
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">🏛️</span> 架构风险
                </h3>
                <ul className="space-y-3">
                    {architectData.concerns.map(c => (
                        <li key={c.title} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="font-semibold text-slate-800">{c.title} <span className={`text-xs font-bold ${c.severity === 'High' ? 'text-red-600' : 'text-amber-600'}`}>({c.severity})</span></p>
                            <p className="text-sm text-slate-600">{c.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <span className="text-xl">✂️</span> 跨模块重复代码
                </h3>
                <p className="text-sm text-slate-500 mb-2">在以下文件之间发现大量重复代码，建议提取公共服务或工具类。</p>
                 <ul className="space-y-2">
                    {architectData.duplication.map(d => (
                         <li key={d.file1} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p><span className="font-mono text-xs bg-slate-200 p-1 rounded">{d.file1}</span></p>
                            <p className="my-1 ml-4">与</p>
                            <p><span className="font-mono text-xs bg-slate-200 p-1 rounded">{d.file2}</span></p>
                            <p className="text-right text-sm font-bold text-amber-700">{d.lines} 行重复</p>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <span className="text-xl">📦</span> 技术栈风险
                </h3>
                 <ul className="space-y-2">
                    {architectData.stackRisks.map(r => (
                         <li key={r.library} className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="font-semibold text-slate-800">过时的库: <span className="font-mono text-red-700">{r.library}:{r.version}</span></p>
                            <p className="text-sm text-red-600">{r.risk}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


// --- Main Components ---

const TechnicalDebtDetail: React.FC<{report: TechnicalDebtReport}> = ({ report }) => {
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