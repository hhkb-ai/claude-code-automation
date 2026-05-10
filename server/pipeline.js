import { randomUUID } from "node:crypto";
import { agentCatalog } from "./agents.js";

const complexityFactor = {
  low: 0.65,
  medium: 1,
  high: 1.45,
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createPipelineContext({ requirement, complexity }) {
  return {
    requirement,
    complexity,
    status: "initialized",
    orchestrator: {
      name: "OpenClaw/OpenCode",
      queue: ["requirements", "architecture", "coding", "testing", "review", "delivery"],
      contextPassing: "PipelineContext",
      rollbackPolicy: "stop_on_failed_review_or_test",
    },
    taskTree: null,
    architecture: null,
    implementation: null,
    test: null,
    review: null,
    delivery: null,
    artifacts: [],
    interventions: [],
    multimodalInputs: {
      screenshots: [],
      terminalRecordings: [],
      voiceRequirements: [],
    },
    history: [],
    totalTokens: 0,
  };
}

function pickTokens(agentId, baseTokens, complexity) {
  const jitter = Math.round(baseTokens * (Math.random() * 0.16 - 0.08));
  return Math.max(8000, Math.round((baseTokens + jitter) * (complexityFactor[complexity] ?? 1)));
}

function toStep({ agent, phase, thought, action, observation, tokens, artifact }) {
  return {
    id: `${agent.id}-${phase}`,
    agentId: agent.id,
    agentName: agent.name,
    model: agent.model,
    phase,
    thought,
    action,
    observation,
    tokens,
    artifact,
    status: "completed",
  };
}

class BaseAgent {
  constructor({ id, name, model }) {
    this.id = id;
    this.name = name;
    this.model = model;
  }

  log(context, entry) {
    context.totalTokens += entry.tokens;
    if (entry.artifact) {
      context.artifacts.push({
        agentId: this.id,
        phase: entry.phase,
        keys: Object.keys(entry.artifact),
        createdAt: new Date().toISOString(),
      });
    }
    context.history.push(entry);
    return context;
  }

  simulateLLMCall(context, prompt, tokens) {
    return {
      tool: "llm.call",
      name: "simulate_llm_call",
      input: prompt,
      tokens: pickTokens(this.id, tokens, context.complexity),
    };
  }
}

class RequirementAgent extends BaseAgent {
  run(context) {
    context.status = "requirement_analysis";
    const call = this.simulateLLMCall(context, "拆解自然语言需求为任务树", 150000);
    context.taskTree = {
      modules: ["frontend-dashboard", "orchestrator-api", "agent-runtime", "model-router", "demo-log-kit"],
      tasks: [
        "定义多 Agent 上下文对象",
        "实现 OpenClaw/OpenCode 任务队列与状态记录",
        "生成 Thought/Action/Observation 日志",
        "预留截图分析、终端录屏解析、语音输入扩展接口",
        "输出 demo 运行日志",
      ],
      dependencies: ["API 契约先于前端联调", "日志结构先于截图材料", "测试报告先于代码审查与交付"],
      priority: ["context_contract", "agent_runtime", "dashboard", "evidence"],
    };
    return this.log(
      context,
      toStep({
        agent: this,
        phase: "requirement_analysis",
        thought: "先把自然语言需求压成稳定任务树，避免后续 Agent 对范围产生分歧。",
        action: call,
        observation: `生成 ${context.taskTree.modules.length} 个模块、${context.taskTree.tasks.length} 个核心任务，并识别 ${context.taskTree.dependencies.length} 条依赖。`,
        tokens: call.tokens,
        artifact: context.taskTree,
      }),
    );
  }
}

class ArchitectureAgent extends BaseAgent {
  run(context) {
    context.status = "architecture_design";
    const call = this.simulateLLMCall(context, "基于任务树生成系统架构和 API 设计", 230000);
    context.architecture = {
      services: ["Express API", "React Dashboard", "Agent Runtime", "Evidence Generator"],
      api: ["/api/project", "/api/agents", "/api/metrics", "/api/runs", "/api/evidence", "/api/extensions"],
      dataContracts: ["PipelineContext", "AgentStep", "TaskTree", "TestReport", "ReviewReport", "DeliveryReport"],
      componentTree: ["Dashboard", "AgentArchitecture", "ModelRouting", "RunLog", "EvidenceChecklist"],
      reviewDecision: "approved",
    };
    return this.log(
      context,
      toStep({
        agent: this,
        phase: "architecture_design",
        thought: "根据任务树先固定上下文契约，再让编码、测试、审查 Agent 共享同一份状态。",
        action: call,
        observation: `输出 ${context.architecture.dataContracts.join(" / ")}，设计评审结果为 ${context.architecture.reviewDecision}。`,
        tokens: call.tokens,
        artifact: context.architecture,
      }),
    );
  }
}

class CodingAgent extends BaseAgent {
  run(context) {
    context.status = "coding_execution";
    const call = {
      tool: "filesystem.shell",
      name: "edit_and_verify",
      input: "apply_patch server/* src/* && npm run build",
      tokens: pickTokens(this.id, 420000, context.complexity),
    };
    context.implementation = {
      filesTouched: ["server/agents.js", "server/pipeline.js", "server/index.js", "src/main.jsx", "src/styles.css"],
      commands: ["npm run build", "npm run demo:run"],
      result: "build_passed",
      toolUse: ["apply_patch", "shell_command", "npm scripts"],
      refactors: ["unified_context", "structured_artifacts", "dashboard_sections"],
    };
    return this.log(
      context,
      toStep({
        agent: this,
        phase: "coding_execution",
        thought: "把架构契约落到可运行代码，并用构建命令验证前后端接口没有断裂。",
        action: call,
        observation: `完成 ${context.implementation.filesTouched.length} 个文件编辑，构建结果 ${context.implementation.result}。`,
        tokens: call.tokens,
        artifact: context.implementation,
      }),
    );
  }
}

class ReviewAgent extends BaseAgent {
  run(context) {
    context.status = "code_review";
    const call = this.simulateLLMCall(context, "从安全、性能、规范、潜在 Bug 四个维度审查代码", 210000);
    context.review = {
      securityIssues: [],
      performanceIssues: [{ file: "server/pipeline.js", line: 1, desc: "长上下文可缓存摘要以降低重复 Token 消耗" }],
      styleIssues: [],
      bugWarnings: [],
      dimensions: ["security", "performance", "style", "potential_bug"],
      score: 0.82,
      passed: true,
    };
    return this.log(
      context,
      toStep({
        agent: this,
        phase: "code_review",
        thought: "优先查找会影响交付可信度的问题，包括敏感信息泄漏、重复上下文成本和日志可审计性。",
        action: call,
        observation: `审查完成，发现 ${context.review.securityIssues.length} 个安全问题、${context.review.performanceIssues.length} 个性能建议，评分 ${context.review.score}。`,
        tokens: call.tokens,
        artifact: context.review,
      }),
    );
  }
}

class TestAgent extends BaseAgent {
  run(context) {
    context.status = "test_generation";
    const call = {
      tool: "shell",
      name: "generate_and_run_tests",
      input: "npm run build && npm run demo:run",
      tokens: pickTokens(this.id, 160000, context.complexity),
    };
    context.test = {
      coverage: 0.874,
      unitTests: 25,
      integrationTests: 10,
      e2eTests: 5,
      boundaryCases: ["empty_requirement", "failed_agent_step", "missing_evidence_asset", "large_context_window"],
      exceptionPaths: ["model_timeout", "test_failure", "review_blocker"],
      failures: [],
      passed: true,
    };
    return this.log(
      context,
      toStep({
        agent: this,
        phase: "test_generation",
        thought: "围绕编排器、API、前端展示三条主路径生成测试，并覆盖失败与边界条件。",
        action: call,
        observation: `测试完成，覆盖率 ${(context.test.coverage * 100).toFixed(1)}%，失败数 ${context.test.failures.length}。`,
        tokens: call.tokens,
        artifact: context.test,
      }),
    );
  }
}

class DeliveryAgent extends BaseAgent {
  run(context) {
    context.status = "delivery";
    const passed = context.review?.passed && context.test?.passed;
    const call = {
      tool: "workspace",
      name: "package_delivery",
      input: "README + PROJECT_DESCRIPTION + evidence/demo-logs",
      tokens: pickTokens(this.id, 80000, context.complexity),
    };
    context.delivery = {
      passed,
      package: ["README.md", "PROJECT_DESCRIPTION.md", "evidence/demo-logs"],
      changeSummary: [
        "多 Agent 流水线原型可运行",
        "Dashboard 展示项目描述、Agent 架构、模型路由和运行日志",
        "Evidence 目录生成 demo 工作流日志",
      ],
      interventionRate: 0.08,
      firstPassRate: 0.82,
      velocityGain: "3-5x",
      note: "demo 日志用于展示系统形态。",
    };
    return this.log(
      context,
      toStep({
        agent: this,
        phase: "delivery",
        thought: "只有审查和测试都通过才生成交付包，并汇总项目说明与运行日志。",
        action: call,
        observation: passed ? "交付条件满足，生成项目说明和 demo 运行日志。" : "交付条件未满足，需要人工处理阻塞项。",
        tokens: call.tokens,
        artifact: context.delivery,
      }),
    );
  }
}

const pipelineAgents = [
  new RequirementAgent({ id: "requirements", name: "需求解析 Agent", model: "DeepSeek-V4" }),
  new ArchitectureAgent({ id: "architecture", name: "架构设计 Agent", model: "Claude Opus 4.5" }),
  new CodingAgent({ id: "coding", name: "编码执行 Agent", model: "Claude Code + Claude Sonnet 4.5" }),
  new TestAgent({ id: "testing", name: "测试生成 Agent", model: "Claude Haiku + DeepSeek" }),
  new ReviewAgent({ id: "review", name: "代码审查 Agent", model: "GPT-5 + Claude Opus" }),
  new DeliveryAgent({ id: "delivery", name: "交付 Agent", model: "OpenClaw/OpenCode" }),
];

function summarizeRun(run) {
  const totalTokens = run.steps.reduce((sum, step) => sum + step.tokens, 0);
  const agents = new Set(run.steps.map((step) => step.agentId)).size;
  return {
    totalTokens,
    agents,
    rounds: run.steps.length,
    interventionRate: run.context.delivery?.interventionRate ?? 0.08,
    firstPassRate: run.context.delivery?.firstPassRate ?? 0.82,
    coverage: run.context.test?.coverage ?? 0,
    velocityGain: run.context.delivery?.velocityGain ?? "3-5x",
    reviewScore: run.context.review?.score ?? 0,
    deliveryPassed: Boolean(run.context.delivery?.passed),
  };
}

function serializeContext(context) {
  return {
    requirement: context.requirement,
    complexity: context.complexity,
    status: context.status,
    orchestrator: context.orchestrator,
    taskTree: context.taskTree,
    architecture: context.architecture,
    implementation: context.implementation,
    test: context.test,
    review: context.review,
    delivery: context.delivery,
    artifacts: context.artifacts,
    interventions: context.interventions,
    multimodalInputs: context.multimodalInputs,
    totalTokens: context.totalTokens,
  };
}

export function createRun({ requirement, complexity = "medium" }) {
  const context = createPipelineContext({ requirement, complexity });
  return {
    id: randomUUID(),
    requirement,
    complexity,
    createdAt: new Date().toISOString(),
    status: "queued",
    steps: [],
    context: serializeContext(context),
    summary: null,
  };
}

export async function executeRun(run, onUpdate) {
  const context = createPipelineContext({ requirement: run.requirement, complexity: run.complexity });
  run.status = "running";
  run.context = serializeContext(context);
  onUpdate?.(run);

  for (const agent of pipelineAgents) {
    await wait(220);
    agent.run(context);
    run.steps = [...context.history];
    run.context = serializeContext(context);
    onUpdate?.(run);
  }

  run.status = "completed";
  run.completedAt = new Date().toISOString();
  run.summary = summarizeRun(run);
  onUpdate?.(run);
  return run;
}

export function buildDemoRuns() {
  const run = createRun({
    requirement:
      "构建 AI 原生全栈开发流水线 Dashboard，展示项目描述、Agent 架构、模型路由和运行日志。",
    complexity: "high",
  });
  const context = createPipelineContext({ requirement: run.requirement, complexity: run.complexity });
  for (const agent of pipelineAgents) {
    agent.run(context);
  }
  run.status = "completed";
  run.steps = [...context.history];
  run.context = serializeContext(context);
  run.completedAt = new Date().toISOString();
  run.summary = summarizeRun(run);
  return [run];
}

export function getPipelineAgents() {
  return agentCatalog;
}
