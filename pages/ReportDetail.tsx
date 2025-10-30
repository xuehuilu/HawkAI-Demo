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
    </tr>
)

const TechnicalDebtDetail: React.FC<{report: TechnicalDebtReport}> = ({ report }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
                <p className="text-sm text-slate-500">代码健康度</p>
                <p className="text-5xl font-bold text-emerald-600">{report.health}%</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
                <p className="text-sm text-slate-500">新增问题</p>
                <p className="text-5xl font-bold text-amber-600">{report.stats.newIssues}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
                <p className="text-sm text-slate-500">已修复问题</p>
                <p className="text-5xl font-bold text-slate-800">{report.stats.fixedIssues}</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">热点文件 (问题最多)</h3>
            <ul className="space-y-2">
                {report.hotspotFiles.map(hf => (
                    <li key={hf.file} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-slate-50">
                        <span className="font-mono text-slate-700">{hf.file}</span>
                        <span className="font-bold text-red-600">{hf.issueCount} 个问题</span>
                    </li>
                ))}
            </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">本周新增问题</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                            <th className="p-3 font-semibold">优先级</th>
                            <th className="p-3 font-semibold">文件</th>
                            <th className="p-3 font-semibold">描述</th>
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
                ? <TechnicalDebtDetail report={report} />
                : <ChangeRiskDetail report={report} />
            }
        </div>
    </div>
  );
};