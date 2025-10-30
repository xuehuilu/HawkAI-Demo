import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Page } from '../types';
import type { Report, PrecisionTestReport, ReliabilityTestReport, Finding, FindingFeedbackStatus } from '../types';


const KpiCard: React.FC<{label: string, value: string, trend?: string, trendColor?: string, icon: string}> = ({label, value, trend, trendColor, icon}) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-slate-600">{label}</span>
            <span className="text-xl">{icon}</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
             <p className="text-3xl font-bold text-slate-800">{value}</p>
             {trend && <p className={`text-sm font-bold ${trendColor}`}>{trend}</p>}
        </div>
    </div>
);

const ChartPlaceholder: React.FC<{title: string}> = ({ title }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-bold text-slate-700 mb-2 text-sm">{title}</h4>
        <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
            图表加载中...
        </div>
    </div>
);

const PrecisionTestDetail: React.FC<{report: PrecisionTestReport}> = ({ report }) => {
    const { kpis, testInfo, bottlenecks, transactionDetails } = report;
    const conclusionColor = report.conclusion === '通过' ? 'bg-emerald-500' : 'bg-red-500';
    const trendColor = (kpis.avgResponseTime.trend ?? 0) > 0 ? 'text-red-500' : 'text-emerald-500';
    const priorityClasses: {[key in 'P0' | 'P1'] : string} = {
      P0: 'bg-red-500 text-white',
      P1: 'bg-amber-500 text-white',
    }
    
    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className={`p-4 rounded-lg text-white text-center flex flex-col justify-center items-center col-span-2 lg:col-span-1 ${conclusionColor}`}>
                    <span className="text-sm">测试结论</span>
                    <span className="text-3xl font-bold">{report.conclusion}</span>
                </div>
                <KpiCard label="平均响应时间" value={`${kpis.avgResponseTime.value}${kpis.avgResponseTime.unit}`} trend={`${(kpis.avgResponseTime.trend ?? 0) > 0 ? '+' : ''}${kpis.avgResponseTime.trend}ms`} trendColor={trendColor} icon="⏱️" />
                <KpiCard label="P99响应时间" value={`${kpis.p99ResponseTime.value}${kpis.p99ResponseTime.unit}`} icon="🐢" />
                <KpiCard label="TPS" value={`${kpis.tps.value}${kpis.tps.unit}`} icon="🚀" />
                <KpiCard label="成功率" value={`${kpis.successRate.value}${kpis.successRate.unit}`} icon="✅" />
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">性能曲线</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ChartPlaceholder title="响应时间 (Avg/P95/P99)" />
                    <ChartPlaceholder title="TPS (每秒事务数)" />
                    <ChartPlaceholder title="并发用户数" />
                </div>
            </div>

            {/* Test Info & Bottlenecks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">测试场景</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span className="text-slate-500">持续时长:</span> <span className="font-semibold text-slate-700">{testInfo.duration}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">并发用户数:</span> <span className="font-semibold text-slate-700">{testInfo.concurrency}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">预热时间:</span> <span className="font-semibold text-slate-700">{testInfo.rampUp}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">测试目标:</span> <span className="font-semibold text-slate-700 font-mono text-xs">{testInfo.target}</span></li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">性能瓶颈分析</h3>
                    <ul className="space-y-3">
                        {bottlenecks.map(b => (
                             <li key={b.id} className={`p-3 rounded-lg border-l-4 ${b.priority === 'P0' ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'}`}>
                                <p className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${priorityClasses[b.priority]}`}>{b.priority}</span>
                                    {b.description}
                                </p>
                                <p className="text-xs text-slate-500 mt-1"><strong>影响组件:</strong> <span className="font-mono">{b.component}</span></p>
                                <p className="text-xs text-slate-500"><strong>建议:</strong> {b.suggestion}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            {/* Transaction Details */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">详细事务数据</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-300 bg-slate-50 text-xs text-slate-500 uppercase">
                                <th className="p-3 font-semibold">事务/API</th>
                                <th className="p-3 font-semibold text-right">请求数</th>
                                <th className="p-3 font-semibold text-right">Avg (ms)</th>
                                <th className="p-3 font-semibold text-right">P95 (ms)</th>
                                <th className="p-3 font-semibold text-right">P99 (ms)</th>
                                <th className="p-3 font-semibold text-right">成功率 (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionDetails.map(t => (
                                <tr key={t.id} className="border-b border-slate-200 hover:bg-slate-50 text-sm">
                                    <td className="p-3 font-mono text-slate-700">{t.endpoint}</td>
                                    <td className="p-3 text-right text-slate-600">{t.requests.toLocaleString()}</td>
                                    <td className="p-3 text-right text-slate-600">{t.avg}</td>
                                    <td className="p-3 text-right text-slate-600">{t.p95}</td>
                                    <td className="p-3 text-right font-bold text-slate-800">{t.p99}</td>
                                    <td className="p-3 text-right font-bold">{t.errorRate > 0 ? <span className="text-red-600">{100 - t.errorRate}</span> : <span className="text-emerald-600">100.00</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};


const FindingDetailModal: React.FC<{ finding: Finding | null; onClose: () => void }> = ({ finding, onClose }) => {
    if (!finding) return null;

    const priorityClasses: Record<Finding['priority'], string> = {
        P0: 'bg-red-100 text-red-800 border-red-300',
        P1: 'bg-amber-100 text-amber-800 border-amber-300',
        P2: 'bg-slate-100 text-slate-800 border-slate-300',
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 border-b border-slate-200 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${priorityClasses[finding.priority]}`}>
                                {finding.priority}
                            </span>
                            <h3 className="text-lg font-bold text-slate-800 mt-2">{finding.description}</h3>
                        </div>
                        <button onClick={onClose} className="text-3xl text-slate-400 hover:text-slate-600">&times;</button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5 overflow-y-auto">
                    {/* Overview */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700 mb-3">问题概览</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div className="flex"><span className="w-20 text-slate-500 flex-shrink-0">严重等级:</span> <span className="font-semibold text-slate-800">{finding.priority}</span></div>
                            <div className="flex"><span className="w-20 text-slate-500 flex-shrink-0">风险类别:</span> <span className="font-semibold text-slate-800">{finding.category}</span></div>
                            <div className="flex"><span className="w-20 text-slate-500 flex-shrink-0">规范来源:</span> <span className="font-mono text-slate-800">{finding.code}</span></div>
                            <div className="flex"><span className="w-20 text-slate-500 flex-shrink-0">代码位置:</span> <span className="font-mono text-indigo-600">{finding.file}:{finding.line}</span></div>
                        </div>
                    </div>

                    {/* Impact Assessment */}
                    {(finding.affectedModules?.length || finding.affectedApis?.length) && (
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">影响范围评估</h4>
                            <div className="space-y-3">
                                {finding.affectedModules && finding.affectedModules.length > 0 && (
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold mb-2">影响模块:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {finding.affectedModules.map((mod) => (
                                                <span key={mod} className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                    {mod}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {finding.affectedApis && finding.affectedApis.length > 0 && (
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold mb-2">影响接口:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {finding.affectedApis.map((api) => (
                                                <span key={api} className="bg-violet-100 text-violet-800 text-xs font-semibold font-mono px-2.5 py-1 rounded-full">
                                                    {api}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Code Snippet */}
                    {finding.codeSnippet && (
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">问题代码 (证据链)</h4>
                            <pre className="bg-slate-800 text-white text-xs p-4 rounded-lg overflow-x-auto">
                                <code>{finding.codeSnippet.trim()}</code>
                            </pre>
                        </div>
                    )}

                    {/* Suggestion */}
                     <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700 mb-3">修复建议</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">{finding.suggestion}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 rounded-b-xl flex-shrink-0">
                    <button
                        onClick={() => alert(`问题 '${finding.id}' 已同步到Jira项目 'PROJ-123'。`)}
                        className="bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={finding.feedbackStatus !== 'accepted'}
                    >
                        <span>🔗</span>
                        <span>同步到Jira</span>
                    </button>
                    <button onClick={onClose} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700">关闭</button>
                </div>
            </div>
        </div>
    );
};


const FindingPriorityBadge: React.FC<{ priority: Finding['priority'] }> = ({ priority }) => {
    const priorityClasses: Record<Finding['priority'], string> = {
        P0: 'bg-red-100 text-red-800 border-red-300',
        P1: 'bg-amber-100 text-amber-800 border-amber-300',
        P2: 'bg-slate-100 text-slate-800 border-slate-300',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${priorityClasses[priority]}`}>
            {priority}
        </span>
    );
};


const FindingRow: React.FC<{ finding: Finding, onDetailClick: (finding: Finding) => void, onFeedback: (id: string, status: FindingFeedbackStatus, reason?: string) => void }> = ({ finding, onDetailClick, onFeedback }) => {
    const [isRejectionMenuOpen, setIsRejectionMenuOpen] = useState(false);
    const rejectionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rejectionMenuRef.current && !rejectionMenuRef.current.contains(event.target as Node)) {
                setIsRejectionMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const handleReject = (reason: string) => {
        let reasonText = '';
        switch(reason) {
            case 'ignore_once': reasonText = "不需要当前这个规则"; break;
            case 'ignore_file': reasonText = "当前文件不需要此规则"; break;
            case 'false_positive': reasonText = "风险是错误的"; break;
        }
        onFeedback(finding.id, 'rejected', reasonText);
        setIsRejectionMenuOpen(false);
        alert(`反馈已收到: ${reasonText}。Agent将学习此模式。`);
    };

    const handleAccept = () => {
        onFeedback(finding.id, 'accepted');
        alert(`风险已接受。您可以在“查看详情”中将其同步到Jira。`);
    };

    return (
        <div className={`p-4 border border-slate-200 rounded-lg bg-white transition-all ${finding.feedbackStatus === 'rejected' ? 'bg-slate-50 opacity-60' : 'hover:shadow-md'}`}>
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <FindingPriorityBadge priority={finding.priority} />
                        <h4 className={`font-semibold text-slate-800 ${finding.feedbackStatus === 'rejected' ? 'line-through' : ''}`}>{finding.description}</h4>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1 pl-8">
                        <p><strong>规范来源：</strong><span className="font-mono">{finding.code}</span></p>
                        <p><strong>代码位置：</strong><span className="font-mono text-indigo-600">{finding.file}:{finding.line}</span></p>
                        <div className="pt-1">
                            <p><strong>修复建议：</strong><span className="text-slate-600">{finding.suggestion}</span></p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                    {finding.feedbackStatus === 'pending' ? (
                        <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                            <button onClick={handleAccept} className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-100 transition-colors">✓ 接受</button>
                            <div className="relative" ref={rejectionMenuRef}>
                                <button onClick={() => setIsRejectionMenuOpen(p => !p)} className="text-xs font-semibold text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors">✕ 拒绝</button>
                                {isRejectionMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-10 py-1">
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleReject('ignore_once'); }} className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">不需要当前这个规则</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleReject('ignore_file'); }} className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">当前文件不需要此规则</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleReject('false_positive'); }} className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">风险是错误的</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="border-r border-slate-200 pr-3">
                            {finding.feedbackStatus === 'accepted' && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">✓ 已接受</span>}
                            {finding.feedbackStatus === 'rejected' && <span className="text-xs font-bold text-slate-500 flex items-center gap-1">✕ 已拒绝</span>}
                        </div>
                    )}
                    <button 
                        onClick={() => onDetailClick(finding)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                        查看详情
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReliabilityTestDetail: React.FC<{ report: ReliabilityTestReport }> = ({ report }) => {
    const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
    const [localFindings, setLocalFindings] = useState<Finding[]>(() => 
        report.findings.map(f => ({ ...f, feedbackStatus: f.feedbackStatus || 'pending' }))
    );

    const { health } = report;
    const p0Count = localFindings.filter(f => f.priority === 'P0').length;
    const p1Count = localFindings.filter(f => f.priority === 'P1').length;
    const p2Count = localFindings.filter(f => f.priority === 'P2').length;

    const handleFeedback = (findingId: string, status: FindingFeedbackStatus, reason?: string) => {
        setLocalFindings(prev => 
            prev.map(f => f.id === findingId ? { ...f, feedbackStatus: status } : f)
        );
        console.log(`Feedback for finding ${findingId}: ${status}, reason: ${reason || 'N/A'}`);
    };
    
    const handleDetailClick = (finding: Finding) => {
        const currentFindingState = localFindings.find(f => f.id === finding.id);
        setSelectedFinding(currentFindingState || finding);
    };

    const findingsByCategory = localFindings.reduce((acc, finding) => {
        if (!acc[finding.category]) {
            acc[finding.category] = [];
        }
        acc[finding.category].push(finding);
        return acc;
    }, {} as Record<string, Finding[]>);

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                    <p className="text-sm text-slate-500">代码健康度</p>
                    <p className={`text-5xl font-bold ${health > 80 ? 'text-emerald-600' : health > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {health}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                    <p className="text-sm text-slate-500">严重/高危问题 (P0/P1)</p>
                    <p className="text-5xl font-bold">
                        <span className="text-red-600">{p0Count}</span>
                        <span className="text-slate-300 mx-2">/</span>
                        <span className="text-amber-600">{p1Count}</span>
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 text-center shadow-sm">
                    <p className="text-sm text-slate-500">中风险问题 (P2)</p>
                    <p className="text-5xl font-bold text-slate-600">{p2Count}</p>
                </div>
            </div>

            {/* Findings by Category */}
            <div className="space-y-6">
                {Object.entries(findingsByCategory).map(([category, findings]) => (
                    <div key={category} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{category} ({findings.length}个问题)</h3>
                        <div className="space-y-3">
                            {findings.map(finding => (
                                <FindingRow key={finding.id} finding={finding} onDetailClick={handleDetailClick} onFeedback={handleFeedback} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <FindingDetailModal finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
        </div>
    );
};


interface ReportDetailProps {
  report: Report;
  navigateTo: (page: Page) => void;
}

export const ReportDetail: React.FC<ReportDetailProps> = ({ report, navigateTo }) => {
    
  const renderReportContent = () => {
    switch(report.type) {
        case '非功能精准测试':
            return <PrecisionTestDetail report={report as PrecisionTestReport} />;
        case '可靠性测试':
            return <ReliabilityTestDetail report={report as ReliabilityTestReport} />;
        default:
            // This will error if a case is missed, ensuring type safety
            const _exhaustiveCheck: never = report;
            return <p>未知的报告类型</p>;
    }
  }

  return (
    <div>
        <PageHeader title={report.title} subtitle={`${report.type} | ${report.date}`}>
            <button onClick={() => navigateTo(Page.Reports)} className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200 flex items-center gap-2">
                <span>←</span>
                <span>返回报告列表</span>
            </button>
        </PageHeader>
        <div className="p-6 sm:p-8">
            {renderReportContent()}
        </div>
    </div>
  );
};