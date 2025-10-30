import React from 'react';
import { PageHeader } from '../components/PageHeader';
import type { Report } from '../types';

interface ReportsProps {
  reports: Report[];
  viewReportDetail: (reportId: string) => void;
}

const ReportStat: React.FC<{label: string, value: string | number, color?: string}> = ({label, value, color = 'text-slate-800'}) => (
    <div className="text-center">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
    </div>
);

const ReportCard: React.FC<{report: Report, onDetailClick: () => void}> = ({report, onDetailClick}) => {
    const healthChange = report.stats.healthChange;
    const healthColor = healthChange > 0 ? 'text-emerald-500' : healthChange < 0 ? 'text-red-500' : 'text-slate-500';

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{report.icon}</span>
                        <h2 className="text-lg font-bold text-slate-800">{report.title}</h2>
                    </div>
                     <p className="text-xs text-slate-500 mt-1 ml-9">
                        <span className="font-semibold">{report.type}</span> | <span>{report.agentName}</span> | <span className="font-mono">{report.repoName}</span>
                    </p>
                </div>
                <p className="text-xs text-slate-400 flex-shrink-0">{report.date}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-200">
                <ReportStat label="新增问题" value={report.stats.newIssues} color="text-amber-600" />
                <ReportStat label="修复问题" value={report.stats.fixedIssues} color="text-emerald-600" />
                <ReportStat label="健康度变化" value={`${healthChange > 0 ? '+' : ''}${healthChange}%`} color={healthColor} />
                <ReportStat label="P0 问题" value={report.stats.p0Issues} color="text-red-600" />
            </div>
            <div className="mt-4 flex justify-end">
                <button onClick={onDetailClick} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">查看详情 →</button>
            </div>
        </div>
    );
};


export const Reports: React.FC<ReportsProps> = ({ reports, viewReportDetail }) => {
  return (
    <div>
      <PageHeader title="我的报告" subtitle="查看所有代码分析报告" />
      <div className="p-6 sm:p-8">
        <div className="space-y-6">
            {reports.map(report => (
                <ReportCard key={report.id} report={report} onDetailClick={() => viewReportDetail(report.id)} />
            ))}
        </div>
      </div>
    </div>
  );
};