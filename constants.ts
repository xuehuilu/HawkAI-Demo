import type { Agent, Repository, Rule, LearnedRule, Report } from './types';
import { Page } from './types';

export const NAV_ITEMS = [
    { id: 'main', title: '主要功能', items: [
        { id: Page.Overview, label: '概览', icon: '🏠' },
        { id: Page.Agents, label: '我的Agents', icon: '🤖', badge: 3 },
        { id: Page.CreateAgent, label: '创建Agent', icon: '➕' },
    ]},
    { id: 'data', title: '数据与管理', items: [
        { id: Page.Reports, label: '我的报告', icon: '📊' },
        { id: Page.Repositories, label: '代码库管理', icon: '📦', badge: 5 },
    ]},
    { id: 'system', title: '系统', items: [
        { id: Page.Settings, label: '设置', icon: '⚙️' },
    ]}
];

export const AGENTS: Agent[] = [
    { id: 'agent-1', name: '支付模块守护者', status: 'running', repo: 'payment-service', role: '技术债治理', lastScan: '2小时前', p0Issues: 8, p1Issues: 23, health: 72 },
    { id: 'agent-2', name: '前端代码卫士', status: 'scanning', repo: 'web-frontend', role: '版本发布门禁', lastScan: '正在扫描... 35%', p0Issues: 2, p1Issues: 12, health: 85 },
    { id: 'agent-3', name: '订单系统监护', status: 'running', repo: 'order-service', role: '变更风险评估', lastScan: '1天前', p0Issues: 3, p1Issues: 15, health: 78 },
];

export const REPOSITORIES: Repository[] = [
    { id: 'repo-1', name: 'payment-service', url: 'https://github.com/company/payment-service.git', mainBranch: 'main', fileCount: 500, language: 'Java', agentCount: 1 },
    { id: 'repo-2', name: 'web-frontend', url: 'https://github.com/company/web-frontend.git', mainBranch: 'master', fileCount: 320, language: 'TypeScript', agentCount: 1 },
    { id: 'repo-3', name: 'order-service', url: 'https://gitlab.com/company/order-service.git', mainBranch: 'main', fileCount: 420, language: 'Java', agentCount: 1 },
    { id: 'repo-4', name: 'user-service', url: 'https://github.com/company/user-service.git', mainBranch: 'develop', fileCount: 280, language: 'Python', agentCount: 0 },
    { id: 'repo-5', name: 'data-analytics', url: 'https://github.com/company/data-analytics.git', mainBranch: 'main', fileCount: 180, language: 'Python', agentCount: 0 },
];

export const RULES: Rule[] = [
    { id: 'rule-1', code: '1.2.3', name: '锁块内执行RPC调用', description: '在持有锁的代码块内执行远程调用，可能导致死锁或长时间阻塞', priority: 'P1', enabled: true },
    { id: 'rule-2', code: '2.1.2', name: '事务中捕获异常未回滚', description: '在事务方法中捕获异常但未处理回滚，可能导致数据不一致', priority: 'P1', enabled: true },
    { id: 'rule-3', code: '3.1.5', name: '使用SELECT *', description: 'SQL查询使用SELECT *，影响性能且字段变更时容易出错', priority: 'P2', enabled: true },
    { id: 'rule-4', code: '4.2.1', name: '空指针检查缺失', description: '方法参数或返回值可能为null，但未进行检查', priority: 'P2', enabled: false },
];

export const LEARNED_RULES: LearnedRule[] = [
    {
        id: 'lr-1',
        icon: '🚫',
        title: '忽略测试文件中的"空指针检查缺失"',
        source: '你标记了3次忽略',
        scope: '*Test.java 文件中的规则 4.2.1',
        timestamp: '2025-10-20',
        ruleLogic: 'IF 文件匹配 "*Test.java" THEN 忽略规则 "4.2.1"',
        type: 'ignore',
    },
    {
        id: 'lr-2',
        icon: '⚠️',
        title: '标记为误报："配置类中的SELECT *"',
        source: '你标记了5次误报',
        scope: 'Config.java 中的规则 3.1.5',
        timestamp: '2025-10-18',
        ruleLogic: 'IF 文件路径包含 "config/" AND 规则=="3.1.5" THEN 标记为误报',
        type: 'misreport',
    },
    {
        id: 'lr-3',
        icon: '🔇',
        title: '降低优先级：工具类中的代码复杂度警告',
        source: '你总是跳过这类问题',
        scope: 'utils/ 目录下的 P2 问题',
        timestamp: '2025-10-15',
        ruleLogic: 'IF 文件路径以 "utils/" 开头 AND 严重性=="P2" THEN 降低推荐优先级',
        type: 'priority-down',
    },
    {
        id: 'lr-4',
        icon: '✅',
        title: '优先关注：支付模块中的事务问题',
        source: '你优先修复了这类问题',
        scope: 'payment/ 目录下的规则 2.1.2',
        timestamp: '2025-10-10',
        ruleLogic: 'IF 文件路径包含 "payment/" AND 规则=="2.1.2" THEN 提升推荐优先级 ×1.5',
        type: 'priority-up',
    },
    {
        id: 'lr-5',
        icon: '🔄',
        title: '正在学习中：生成代码的忽略模式',
        source: '你标记了2次忽略（需要3次以上）',
        scope: '待确认',
        timestamp: '2/3 次',
        ruleLogic: '学习中，尚未形成规则...',
        type: 'learning',
    },
];

export const REPORTS: Report[] = [
    {
        id: 'report-1',
        title: '支付模块守护者 - 技术债周报',
        type: '技术债治理',
        icon: '🔧',
        agentName: '支付模块守护者',
        repoName: 'payment-service',
        date: '2025-10-27',
        stats: { newIssues: 15, fixedIssues: 8, healthChange: -2, p0Issues: 2 },
        health: 70,
        hotspotFiles: [
            { file: 'PaymentService.java', issueCount: 5 },
            { file: 'TransactionManager.java', issueCount: 3 },
            { file: 'RefundController.java', issueCount: 2 },
        ],
        newIssuesList: [
            { id: 'i1', priority: 'P0', file: 'PaymentService.java', description: '锁块内执行RPC调用 - 可能导致死锁' },
            { id: 'i2', priority: 'P1', file: 'TransactionManager.java', description: '事务中捕获异常未回滚 - 可能导致数据不一致' },
            { id: 'i3', priority: 'P2', file: 'RefundController.java', description: '使用SELECT *查询' },
        ],
    },
    {
        id: 'report-2',
        title: '订单系统监护 - 变更风险评估 #PR-125',
        type: '变更风险评估',
        icon: '📊',
        agentName: '订单系统监护',
        repoName: 'order-service',
        date: '2025-10-26',
        stats: { newIssues: 3, fixedIssues: 0, healthChange: 0, p0Issues: 0 },
        riskLevel: '高',
        affectedFiles: [
            'OrderController.java',
            'OrderService.java',
            'schema.sql'
        ],
        newIssuesList: [
            { id: 'i4', priority: 'P1', file: 'OrderController.java', description: '未对用户输入进行充分校验' },
            { id: 'i5', priority: 'P2', file: 'OrderService.java', description: '方法圈复杂度过高' },
            { id: 'i6', priority: 'P2', file: 'OrderService.java', description: '硬编码了超时时间' },
        ]
    },
];