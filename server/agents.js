export const projectOverview = {
  name: "基于多 Agent 协同的 AI 原生全栈开发流水线",
  executionEngine: "Claude Code",
  orchestrationLayer: "OpenClaw/OpenCode",
  workflow: ["需求输入", "架构设计", "编码实现", "自动化测试", "代码审查", "部署交付"],
  objective:
    "把复杂软件开发任务拆解为多个专业 Agent 的连续协作流程，并通过统一日志、指标与任务状态管理形成可观测、可复盘、可扩展的研发自动化基础设施。",
  description:
    "本项目构建了一套以 Claude Code 为核心执行引擎、OpenClaw/OpenCode 为编排调度层的 AI 原生全栈开发流水线，将需求输入、架构设计、编码实现、自动化测试、代码审查、部署交付纳入多 Agent 自主协同闭环。",
};

export const prototypeStructure = [
  {
    name: "BaseAgent",
    type: "core class",
    responsibility: "封装模型调用、Token 估算、结构化日志写入和 Artifact 输出。",
  },
  {
    name: "PipelineContext",
    type: "shared state",
    responsibility: "在 Requirement、Architecture、Coding、Test、Review、Delivery 等 Agent 之间传递任务树、设计、实现、测试、审查与交付状态。",
  },
  {
    name: "Orchestration Runtime",
    type: "OpenClaw/OpenCode layer",
    responsibility: "负责队列管理、上下文传递、执行状态监控、异常回滚与人工介入点记录。",
  },
  {
    name: "Evidence Kit",
    type: "submission material",
    responsibility: "生成 demo 运行日志和证明材料清单，辅助准备 Thought → Action → Observation 截图。",
  },
];

export const multimodalExtensions = [
  {
    id: "screenshot-analysis",
    name: "截图分析",
    status: "reserved",
    capability: "读取 UI 截图并检查页面还原度、组件遮挡、布局偏差与视觉回归风险。",
  },
  {
    id: "terminal-recording",
    name: "终端录屏解析",
    status: "reserved",
    capability: "解析终端执行过程，用于 Bug 复现定位、失败命令追踪与异常路径归因。",
  },
  {
    id: "voice-requirement",
    name: "语音需求输入",
    status: "reserved",
    capability: "通过 TTS/ASR 预处理把语音需求转换为可拆解的结构化任务输入。",
  },
  {
    id: "mimo-v2-context",
    name: "MiMo-V2.5 长上下文",
    status: "planned",
    capability: "探索 128K+ 上下文窗口，用于大型代码仓库全量上下文注入和自动化 UI 修复。",
  },
];

export const agentCatalog = [
  {
    id: "requirements",
    name: "需求解析 Agent",
    model: "DeepSeek-V4",
    role: "基于 DeepSeek 将自然语言需求拆解为结构化任务树，识别模块边界、依赖关系与执行优先级。",
    tokenRange: [90000, 150000],
    actions: ["parse_requirement", "build_task_tree", "detect_dependencies"],
    outputs: ["TaskTree", "ModuleBoundary", "DependencyGraph"],
  },
  {
    id: "architecture",
    name: "架构设计 Agent",
    model: "Claude Opus 4.5",
    role: "基于 Claude Opus 生成系统架构、数据模型、API 设计与组件规划，并自动完成设计评审。",
    tokenRange: [120000, 260000],
    actions: ["draft_architecture", "define_api", "review_design"],
    outputs: ["ArchitecturePlan", "ApiContract", "ComponentTree", "DesignReview"],
  },
  {
    id: "coding",
    name: "编码执行 Agent",
    model: "Claude Code + Claude Sonnet 4.5",
    role: "基于 Claude Code 与 Claude Sonnet，通过 tool-use 机制操作文件系统、执行 Shell 命令、跨文件重构并运行测试。",
    tokenRange: [180000, 520000],
    actions: ["edit_files", "run_shell", "refactor_modules"],
    outputs: ["ChangedFiles", "CommandTrace", "BuildResult"],
  },
  {
    id: "testing",
    name: "测试生成 Agent",
    model: "Claude Haiku + DeepSeek",
    role: "自动生成单元测试、集成测试与端到端测试用例，覆盖边界条件和异常路径。",
    tokenRange: [70000, 180000],
    actions: ["generate_unit_tests", "generate_e2e_tests", "run_test_suite"],
    outputs: ["UnitTests", "IntegrationTests", "E2ETests", "CoverageReport"],
  },
  {
    id: "review",
    name: "代码审查 Agent",
    model: "GPT-5 + Claude Opus",
    role: "结合 GPT-5 与 Claude Opus 进行安全漏洞扫描、性能瓶颈识别、规范检查与潜在 Bug 预警。",
    tokenRange: [110000, 240000],
    actions: ["scan_security", "inspect_performance", "produce_review_report"],
    outputs: ["SecurityReport", "PerformanceFindings", "StyleFindings", "BugWarnings"],
  },
  {
    id: "delivery",
    name: "交付 Agent",
    model: "OpenClaw/OpenCode",
    role: "汇总结果、生成交付包、输出变更说明，并记录人工介入点。",
    tokenRange: [30000, 90000],
    actions: ["summarize_delivery", "package_artifacts", "emit_metrics"],
    outputs: ["DeliveryPackage", "ChangeSummary", "InterventionLog"],
  },
];

export const routingPolicy = [
  {
    className: "简单 CRUD",
    model: "DeepSeek",
    reason: "低成本高吞吐，适合模板化接口、常规数据操作和低风险重复任务。",
  },
  {
    className: "中等复杂业务逻辑",
    model: "Claude Sonnet / GPT-5",
    reason: "平衡推理质量、上下文能力与响应速度。",
  },
  {
    className: "架构设计与安全审查",
    model: "Claude Opus / GPT-5",
    reason: "需要更强长链推理、风险识别、跨模块一致性判断与审查可信度。",
  },
  {
    className: "大仓库长上下文任务",
    model: "MiMo-V2.5",
    reason: "用于探索 128K+ 上下文注入、大型仓库全量分析、UI 自动修复与视觉回归测试。",
  },
];
