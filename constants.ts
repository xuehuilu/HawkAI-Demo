// @google/genai-api-fix: Add BaseReport to type import to fix type errors.
import type { Agent, Repository, Rule, LearnedRule, Report, PrecisionTestReport, BaseReport, ReliabilityTestReport, Finding, ApiToken } from './types';
import { Page } from './types';

export const NAV_ITEMS = [
    { id: 'main', title: '主要功能', items: [
        { id: Page.Overview, label: '概览', icon: '🏠' },
        { id: Page.Agents, label: '我的Agents', icon: '🤖', badge: 3 },
        { id: Page.CreateAgent, label: '创建Agent', icon: '➕' },
    ]},
    { id: 'data', title: '数据与管理', items: [
        { id: Page.Reports, label: '我的报告', icon: '📊' },
    ]},
    { id: 'system', title: '系统', items: [
        { id: Page.IntegrationCenter, label: '集成中心', icon: '🔗' },
        { id: Page.ApiTokens, label: 'API 令牌', icon: '🔑' },
        { id: Page.Settings, label: '设置', icon: '⚙️' },
    ]}
];

export const AGENTS: Agent[] = [
    { id: 'agent-1', name: '电商平台V3上线-性能压测', status: 'running', repo: 'payment-service', role: '项目验收', lastScan: '3小时前', p0Issues: 5, p1Issues: 18, health: 78 },
    { id: 'agent-2', name: '订单服务-精准测试', status: 'scanning', repo: 'order-service', role: '非功能精准测试', lastScan: '正在扫描... 68%', p0Issues: 1, p1Issues: 7, health: 92 },
    { id: 'agent-3', name: '前端团队-回归测试', status: 'idle', repo: 'web-frontend', role: '非功能回归测试', lastScan: '1天前', p0Issues: 0, p1Issues: 3, health: 95 },
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


// Data for the new Precision Test Report
// @google/genai-api-fix: Simplify complex Omit type with Pick to improve TypeScript inference and fix discriminated union issues.
const PRECISION_TEST_REPORT_DATA: Pick<PrecisionTestReport, 'type' | 'conclusion' | 'stats' | 'kpis' | 'testInfo' | 'bottlenecks' | 'transactionDetails'> = {
    type: '非功能精准测试',
    conclusion: '不通过',
    stats: { newIssues: 2, fixedIssues: 0, healthChange: 0, p0Issues: 1 },
    kpis: {
        avgResponseTime: { value: 850, unit: 'ms', trend: 150 },
        p99ResponseTime: { value: 2500, unit: 'ms' },
        tps: { value: 520, unit: '/s' },
        successRate: { value: 99.8, unit: '%' },
    },
    testInfo: {
        duration: '15 分钟',
        concurrency: 500,
        rampUp: '5 分钟',
        target: '/api/v2/order/create',
    },
    bottlenecks: [
        { id: 'b1', priority: 'P0', description: '数据库连接池耗尽导致大量请求超时', component: 'OrderRepository.java', suggestion: '增加数据库连接池大小，并排查慢SQL查询。' },
        { id: 'b2', priority: 'P1', description: 'GC活动频繁导致应用STW（Stop-The-World）', component: 'JVM anagement', suggestion: '优化内存分配，调整JVM垃圾回收器参数。' },
    ],
    transactionDetails: [
        { id: 't1', endpoint: '/api/v2/order/create', requests: 450000, avg: 850, p95: 1800, p99: 2500, errorRate: 0.2 },
        { id: 't2', endpoint: '/api/v2/order/query', requests: 120000, avg: 120, p95: 250, p99: 400, errorRate: 0 },
        { id: 't3', endpoint: '/api/v2/user/profile', requests: 800000, avg: 50, p95: 90, p99: 150, errorRate: 0 },
    ]
};

// Data for the new Reliability Test Report
// @google/genai-api-fix: Simplify complex Omit type with Pick to improve TypeScript inference and fix discriminated union issues.
const RELIABILITY_TEST_REPORT_DATA: Pick<ReliabilityTestReport, 'type' | 'health' | 'stats' | 'findings' | 'changeSummary' | 'keyFindings' | 'impactAssessment'> = {
    type: '可靠性测试',
    health: 82,
    stats: { newIssues: 7, fixedIssues: 2, healthChange: -5, p0Issues: 1 },
    changeSummary: {
        title: '重构库存服务，并优化了订单创建流程',
        fileCount: 8,
        additions: 256,
        deletions: 98,
    },
    keyFindings: {
        goodNews: [
            `修复了 2 个历史遗留问题`,
            `库存服务 'StockService' 的代码复杂度从 15 降低到 9`,
        ],
        warnings: [
            `在核心服务 'StockService.java' 中发现 1 个 P0 级严重问题`,
            `在 'OrderService.java' 中发现 1 个 P1 级事务风险`,
            `共发现 7 个新问题`,
        ]
    },
    impactAssessment: {
        scope: '变更涉及核心交易链路（库存、订单），影响范围：高',
        recommendation: '建议在上线前重点测试“下单扣减库存”和“并发下单”场景。',
    },
    findings: [
        {
            id: 'f-1',
            code: '1.2.3',
            category: '并发与锁',
            priority: 'P0',
            file: 'services/StockService.java',
            line: 112,
            description: '在锁块（synchronized/Lock）内部执行了RPC调用',
            suggestion: '将RPC调用移出同步代码块，先释放锁再进行网络通信，以避免长时间阻塞和潜在的死锁风险。',
            codeSnippet: `// StockService.java:112
public void decreaseStock(Long productId, int amount) {
    synchronized(this) { // <-- 锁开始
        Stock stock = stockMapper.selectById(productId);
        if (stock.getCount() < amount) {
            // 在锁块内部进行RPC调用，风险极高
            notificationRpcService.sendStockAlert(productId); // <-- 问题代码
        }
        stock.setCount(stock.getCount() - amount);
        stockMapper.updateById(stock);
    } // <-- 锁结束
}`,
            affectedModules: ['库存模块', '订单模块'],
            affectedApis: ['/stock/decrease', '/order/create'],
        },
        {
            id: 'f-2',
            code: '1.3.1',
            category: '事务与数据库',
            priority: 'P1',
            file: 'services/OrderService.java',
            line: 88,
            description: '事务中包含了对外部的RPC调用',
            suggestion: '应先执行数据库事务并提交，再进行RPC调用。若需保证一致性，请采用可靠消息最终一致性方案。',
            codeSnippet: `// OrderService.java:88
@Transactional
public void createOrder(Order order) {
    orderMapper.insert(order);
    // 问题：在数据库事务中进行了外部RPC调用
    // 这会长时间占用数据库连接，降低系统吞吐量
    paymentApiClient.requestPayment(order.getId()); // <-- 问题代码
}`,
            affectedModules: ['订单模块', '支付模块'],
            affectedApis: ['/order/create', '/payment/request'],
        },
        {
            id: 'f-3',
            code: '1.1.3',
            category: '资源管理',
            priority: 'P1',
            file: 'utils/FileProcessor.java',
            line: 45,
            description: '文件IO流等原生资源，未使用 try-with-resources 语句确保关闭',
            suggestion: '将`new FileInputStream(...)`等资源创建语句包裹在`try-with-resources`中，确保流被自动关闭。',
            codeSnippet: `// FileProcessor.java:45
public String processFile(String path) throws IOException {
    // 问题：如果เกิด an exception, inputStream 可能不会被关闭
    FileInputStream inputStream = new FileInputStream(path); // <-- 问题代码
    try {
        // ... 文件处理逻辑 ...
    } finally {
        if (inputStream != null) {
            inputStream.close();
        }
    }
    return "done";
}`,
            affectedModules: ['报表导出模块', '文件上传模块'],
            affectedApis: ['/report/export', '/file/upload'],
        },
        {
            id: 'f-4',
            code: '1.3.5',
            category: '事务与数据库',
            priority: 'P1',
            file: 'services/UserService.java',
            line: 201,
            description: '检测到N+1查询模式',
            suggestion: '在查询用户列表后，循环查询了每个用户的订单。请使用JOIN查询或批量查询一次性获取所有用户的订单数据。',
            codeSnippet: `// UserService.java:201
public List<UserWithOrders> listUsersWithOrders() {
    List<User> users = userMapper.selectAll(); // 第1次查询
    List<UserWithOrders> result = new ArrayList<>();
    for (User user : users) { // 循环
        // N+1 问题：在循环中为每个用户执行一次查询
        List<Order> orders = orderMapper.findByUserId(user.getId()); // <-- 问题代码
        result.add(new UserWithOrders(user, orders));
    }
    return result;
}`,
            affectedModules: ['用户模块', '管理后台'],
            affectedApis: ['/api/v1/users/list-with-orders'],
        },
        {
            id: 'f-5',
            code: '1.2.5',
            category: '并发与锁',
            priority: 'P2',
            file: 'jobs/TaskScheduler.java',
            line: 31,
            description: '禁止使用 Executors.newFixedThreadPool，必须通过 ThreadPoolExecutor 构造函数显式创建',
            suggestion: '使用`new ThreadPoolExecutor(...)`显式指定核心线程数、最大线程数、队列类型和拒绝策略，以避免资源耗尽风险。',
            codeSnippet: `// TaskScheduler.java:31
// 问题：使用Executors工厂类创建线程池，可能导致资源耗尽
// newFixedThreadPool 使用了无界队列 LinkedBlockingQueue
ExecutorService executor = Executors.newFixedThreadPool(10); // <-- 问题代码

public void submit(Runnable task) {
    executor.submit(task);
}`,
            affectedModules: ['异步任务模块', '全局'],
            affectedApis: ['/task/submit-async'],
        },
        {
            id: 'f-6',
            code: '3.2.1',
            category: '外部调用与容错',
            priority: 'P1',
            file: 'clients/PaymentApiClient.java',
            line: 56,
            description: '所有对外部依赖（HTTP/RPC）的调用，必须设置明确的超时时间',
            suggestion: '为HttpClient或RPC客户端配置连接超时（Connect Timeout）和读取超时（Read Timeout）。',
            codeSnippet: `// PaymentApiClient.java:56
public PaymentResponse callPaymentApi(PaymentRequest request) {
    // 问题：HttpClient 未设置超时时间
    // 在网络状况不佳时，可能导致线程长时间阻塞
    HttpClient client = HttpClient.newHttpClient(); // <-- 问题代码
    HttpRequest httpRequest = HttpRequest.newBuilder()
        .uri(URI.create(API_ENDPOINT))
        // 正确做法: .timeout(Duration.ofSeconds(5))
        .POST(BodyPublishers.ofString(toJson(request)))
        .build();
    // ... send request ...
}`,
            affectedModules: ['支付模块', '订单模块'],
            affectedApis: ['/order/create-and-pay'],
        },
        {
            id: 'f-7',
            code: '1.1.1',
            category: '资源管理',
            priority: 'P2',
            file: 'cache/LocalCacheManager.java',
            line: 25,
            description: '所有本地缓存都必须有容量上限',
            suggestion: '推荐使用Caffeine/Guava等专业缓存库，或在手动实现的缓存中添加大小限制和淘汰策略。',
            codeSnippet: `// LocalCacheManager.java:25
// 问题：手动实现的本地缓存没有容量上限
// 可能因数据不断写入而导致内存溢出 (OOM)
private static final Map<String, Object> cache = new HashMap<>(); // <-- 问题代码

public void put(String key, Object value) {
    cache.put(key, value);
}`,
            affectedModules: ['商品信息模块', '用户配置模块'],
            affectedApis: ['/product/get/{id}', '/user/config'],
        },
    ]
};


export const REPORTS: Report[] = [
    {
        id: 'report-6',
        title: '核心交易链路 - 可靠性专项测试报告',
        icon: '🛡️',
        agentName: '电商平台V3上线-性能压测',
        repoName: 'payment-service',
        date: '2025-11-10',
        createdByRole: 'architect',
        ...RELIABILITY_TEST_REPORT_DATA,
    },
];

export const API_TOKENS: ApiToken[] = [
    { id: 'token-1', name: 'GitLab CI Runner', tokenPrefix: 'hawk_a1b2c3d4', lastUsed: '3小时前', created: '2025-11-10', expires: '2026-11-10' },
    { id: 'token-2', name: '本地开发调试', tokenPrefix: 'hawk_e5f6g7h8', lastUsed: '1天前', created: '2025-11-01', expires: '永不过期' },
];