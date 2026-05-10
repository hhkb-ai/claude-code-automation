export const agentCatalog = [
  {
    id: "requirements",
    name: "需求解析 Agent",
    model: "DeepSeek-V4",
    role: "将自然语言需求拆解为结构化任务树，识别模块边界、依赖关系与执行优先级。",
    tokenRange: [90000, 150000],
    actions: ["parse_requirement", "build_task_tree", "detect_dependencies"],
  },
  {
    id: "architecture",
    name: "架构设计 Agent",
    model: "Claude Opus 4.5",
    role: "生成系统架构、数据模型、API 契约与组件树，并执行设计评审。",
    tokenRange: [120000, 260000],
    actions: ["draft_architecture", "define_api", "review_design"],
  },
  {
    id: "coding",
    name: "编码执行 Agent",
    model: "Claude Code + Claude Sonnet 4.5",
    role: "通过 tool-use 操作文件系统、执行 Shell 命令、跨文件重构并运行测试。",
    tokenRange: [180000, 520000],
    actions: ["edit_files", "run_shell", "refactor_modules"],
  },
  {
    id: "testing",
    name: "测试生成 Agent",
    model: "Claude Haiku + DeepSeek",
    role: "生成单元测试、集成测试和端到端测试，覆盖边界条件与异常路径。",
    tokenRange: [70000, 180000],
    actions: ["generate_unit_tests", "generate_e2e_tests", "run_test_suite"],
  },
  {
    id: "review",
    name: "代码审查 Agent",
    model: "GPT-5 + Claude Opus",
    role: "从安全、性能、规范、潜在 Bug 四个维度做交叉审查。",
    tokenRange: [110000, 240000],
    actions: ["scan_security", "inspect_performance", "produce_review_report"],
  },
  {
    id: "delivery",
    name: "交付 Agent",
    model: "OpenClaw/OpenCode",
    role: "汇总结果、生成交付包、输出变更说明，并记录人工介入点。",
    tokenRange: [30000, 90000],
    actions: ["summarize_delivery", "package_artifacts", "emit_metrics"],
  },
];

export const routingPolicy = [
  {
    className: "简单 CRUD",
    model: "DeepSeek",
    reason: "低成本高吞吐，适合模板化接口和常规数据操作。",
  },
  {
    className: "中等复杂业务逻辑",
    model: "Claude Sonnet / GPT-5",
    reason: "平衡推理质量、上下文能力与响应速度。",
  },
  {
    className: "架构设计与安全审查",
    model: "Claude Opus / GPT-5",
    reason: "需要更强长链推理、风险识别与跨模块一致性判断。",
  },
  {
    className: "大仓库长上下文任务",
    model: "MiMo-V2.5",
    reason: "用于探索 128K+ 上下文注入、UI 自动修复与视觉回归测试。",
  },
];
