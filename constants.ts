// @google/genai-api-fix: Add Issue to type import
import type { Agent, Repository, Rule, LearnedRule, Report, TechnicalDebtReport, Issue } from './types';
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
    { id: 'agent-1', name: '支付模块守护者 (负责人)', status: 'running', repo: 'payment-service', role: '技术债治理', lastScan: '2小时前', p0Issues: 8, p1Issues: 23, health: 72 },
    { id: 'agent-2', name: '前端代码卫士 (开发者)', status: 'scanning', repo: 'web-frontend', role: '技术债治理', lastScan: '正在扫描... 35%', p0Issues: 2, p1Issues: 5, health: 91 },
    { id: 'agent-3', name: '订单系统监护 (架构师)', status: 'running', repo: 'order-service', role: '技术债治理', lastScan: '1天前', p0Issues: 1, p1Issues: 4, health: 88 },
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

// @google/genai-api-fix: Add explicit type to TECHNICAL_DEBT_MASTER_DATA to fix type inference issue with issue priorities.
// Single Source of Truth for Technical Debt Data
const TECHNICAL_DEBT_MASTER_DATA: {
    health: number;
    stats: { newIssues: number; fixedIssues: number; healthChange: number; p0Issues: number; };
    hotspotFiles: { file: string; issueCount: number; }[];
    issues: Issue[];
    architecturalConcerns: { title: string; description: string; severity: 'High' | 'Medium'; }[];
    techStackRisks: { library: string; version: string; risk: string; }[];
} = {
    health: 69,
    stats: { newIssues: 13, fixedIssues: 5, healthChange: -3, p0Issues: 2 },
    hotspotFiles: [
        { file: 'payment/PaymentService.java', issueCount: 3 },
        { file: 'order/OrderCreation.java', issueCount: 2 },
        { file: 'components/checkout/Form.tsx', issueCount: 2 },
    ],
    issues: [
        // Tech Lead / General issues
        { id: 'i1', priority: 'P0', file: 'payment/PaymentService.java', description: '锁块内执行RPC调用 - 可能导致死锁', category: '性能' },
        { id: 'i2', priority: 'P1', file: 'payment/TransactionManager.java', description: '事务中捕获异常未回滚 - 可能导致数据不一致', category: '可靠性' },
        { id: 'i3', priority: 'P2', file: 'payment/RefundController.java', description: '使用SELECT *查询', category: '性能' },
        { id: 'i1-1', priority: 'P1', file: 'payment/util/Converter.java', description: '大数计算可能导致精度丢失', category: '可靠性' },
        { id: 'i1-2', priority: 'P1', file: 'payment/PaymentService.java', description: '空指针检查缺失', category: '可靠性' },
        { id: 'i1-3', priority: 'P2', file: 'payment/config/CacheConfig.java', description: '硬编码了密码', category: '安全' },
        { id: 'i1-4', priority: 'P1', file: 'order/OrderCreation.java', description: '方法圈复杂度过高', category: '可维护性' },
        { id: 'i1-5', priority: 'P2', file: 'order/OrderRepository.java', description: '重复代码块', category: '可维护性' },
        // Developer focused issues
        { id: 'd1', priority: 'P0', file: 'components/checkout/Form.tsx', description: '未处理的Promise拒绝可能导致页面崩溃', category: '可靠性' },
        { id: 'd2', priority: 'P1', file: 'components/checkout/Form.tsx', description: 'useEffect存在无限循环依赖', category: '性能' },
        { id: 'd3', priority: 'P1', file: 'utils/currency.ts', description: '大数计算可能导致精度丢失', category: '可靠性' },
        // Architect focused issues
        { id: 'a1', priority: 'P1', file: 'service/OrderCreationService.java', description: '与库存服务存在循环依赖风险', category: '架构' },
        { id: 'a2', priority: 'P2', file: 'repository/OrderRepository.java', description: '技术栈风险：使用了即将废弃的数据库驱动版本', category: '依赖管理' },
    ],
    // Architect specific data fields
    architecturalConcerns: [
        { title: '循环依赖', description: `在 'order-service' 中，'service' 层和 'repository' 层之间检测到循环依赖，破坏了分层架构。`, severity: 'High' },
    ],
    techStackRisks: [
        { library: 'log4j', version: '2.14.0', risk: '存在已知安全漏洞 (Log4Shell)，建议立即升级。' },
    ]
};


export const REPORTS: Report[] = [
    {
        id: 'report-1',
        title: '支付模块守护者 - 技术债周报 (负责人视图)',
        type: '技术债治理',
        icon: '🔧',
        agentName: '支付模块守护者',
        repoName: 'payment-service',
        date: '2025-10-27',
        createdByRole: 'tech-lead',
        ...TECHNICAL_DEBT_MASTER_DATA,
    },
    {
        id: 'report-3',
        title: '前端代码卫士 - 高优问题修复清单 (开发者视图)',
        type: '技术债治理',
        icon: '👨‍💻',
        agentName: '前端代码卫士',
        repoName: 'web-frontend',
        date: '2025-10-27',
        createdByRole: 'developer',
        ...TECHNICAL_DEBT_MASTER_DATA, // Using the same master data
    },
     {
        id: 'report-4',
        title: '订单系统监护 - 系统风险评估 (架构师视图)',
        type: '技术债治理',
        icon: '🏗️',
        agentName: '订单系统监护',
        repoName: 'order-service',
        date: '2025-10-27',
        createdByRole: 'architect',
        ...TECHNICAL_DEBT_MASTER_DATA, // Using the same master data
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
            { id: 'i4', priority: 'P1', file: 'OrderController.java', description: '未对用户输入进行充分校验', category: '安全' },
            { id: 'i5', priority: 'P2', file: 'OrderService.java', description: '方法圈复杂度过高', category: '可维护性' },
            { id: 'i6', priority: 'P2', file: 'OrderService.java', description: '硬编码了超时时间', category: '可维护性' },
        ],
        createdByRole: 'tech-lead',
    },
];