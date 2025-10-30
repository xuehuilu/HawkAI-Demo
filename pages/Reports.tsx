import React from 'react';
import { PageHeader } from '../components/PageHeader';
import type { Report, PrecisionTestReport, ReliabilityTestReport } from '../types';

interface ReportsProps {
  reports: Report[];
  viewReportDetail: (reportId: string) => void;
}

const ReportRow: React.FC<{report: Report, onDetailClick: () => void}> = ({report, onDetailClick}) => {
    let conclusion, conclusionClass;
    if (report.type === '非功能精准测试') {
        conclusion = (report as PrecisionTestReport).conclusion;
        conclusionClass = conclusion === '通过' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800';
    } else if (report.type === '可靠性测试') {
        const reliabilityReport = report as ReliabilityTestReport;
        const p0Issues = reliabilityReport.stats.p0Issues;
        const p1Issues = reliabilityReport.findings.filter(f => f.priority === 'P1').length;
        
        if (p0Issues > 0) {
            conclusion = `发现 ${p0Issues} 个严重问题`;
            conclusionClass = 'bg-red-100 text-red-800';
        } else if (p1Issues > 0) {
            conclusion = `发现 ${p1Issues} 个高危问题`;
            conclusionClass = 'bg-amber-100 text-amber-800';
        } else {
            conclusion = `健康度 ${reliabilityReport.health}%`;
            conclusionClass = 'bg-emerald-100 text-emerald-800';
        }
    } else {
        conclusion = 'N/A';
        conclusionClass = 'bg-slate-100 text-slate-800';
    }


    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <span className="text-xl">{report.icon}</span>
                    <div>
                        <a href="#" onClick={(e) => { e.preventDefault(); onDetailClick(); }} className="font-bold text-slate-800 hover:text-indigo-600">{report.title}</a>
                        <p className="text-xs text-slate-500">{report.agentName}</p>
                    </div>
                </div>
            </td>
            <td className="p-4 text-sm text-slate-600">{report.type}</td>
            <td className="p-4 text-sm text-slate-600 font-mono">{report.repoName}</td>
            <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${conclusionClass}`}>
                    {conclusion}
                </span>
            </td>
            <td className="p-4 text-sm text-slate-500">{report.date}</td>
            <td className="p-4 text-center">
                <button onClick={onDetailClick} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                    查看详情
                </button>
            </td>
        </tr>
    );
};


export const Reports: React.FC<ReportsProps> = ({ reports, viewReportDetail }) => {
  return (
    <div>
      <PageHeader title="我的报告" subtitle="查看所有代码分析报告" />
      <div className="p-6 sm:p-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                            <th className="p-4 font-semibold">报告名称</th>
                            <th className="p-4 font-semibold">测试类型</th>
                            <th className="p-4 font-semibold">测试对象</th>
                            <th className="p-4 font-semibold">结论</th>
                            <th className="p-4 font-semibold">执行日期</th>
                            <th className="p-4 font-semibold text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <ReportRow key={report.id} report={report} onDetailClick={() => viewReportDetail(report.id)} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};