import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Boxes,
  CheckCircle2,
  Code2,
  Cpu,
  Eye,
  FileText,
  GitBranch,
  Layers3,
  Mic,
  Play,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  TestTube2,
  Workflow,
} from "lucide-react";
import "./styles.css";

const api = {
  project: () => fetchJson("/api/project"),
  agents: () => fetchJson("/api/agents"),
  metrics: () => fetchJson("/api/metrics"),
  runs: () => fetchJson("/api/runs"),
  createRun: (payload) =>
    fetchJson("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "请求失败");
  }
  return data;
}

function formatTokens(value) {
  if (!value && value !== 0) return "-";
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)} 亿`;
  if (value >= 10000) return `${(value / 10000).toFixed(1)} 万`;
  return String(value);
}

const agentIcons = {
  requirements: FileText,
  architecture: GitBranch,
  coding: Code2,
  testing: TestTube2,
  review: ShieldCheck,
  delivery: Boxes,
};

const extensionIcons = {
  "screenshot-analysis": Eye,
  "terminal-recording": TerminalSquare,
  "voice-requirement": Mic,
  "mimo-v2-context": Cpu,
};

function App() {
  const [project, setProject] = useState(null);
  const [prototypeStructure, setPrototypeStructure] = useState([]);
  const [multimodalExtensions, setMultimodalExtensions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [routingPolicy, setRoutingPolicy] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [runs, setRuns] = useState([]);
  const [requirement, setRequirement] = useState(
    "为 AI 知识库项目新增材料批量导入、Wiki 自动编译、问答查询和复习提醒，并补充测试与交付说明。",
  );
  const [complexity, setComplexity] = useState("high");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const latestRun = runs[0];

  const refresh = async () => {
    const [projectData, agentData, metricData, runData] = await Promise.all([
      api.project(),
      api.agents(),
      api.metrics(),
      api.runs(),
    ]);
    setProject(projectData.project);
    setPrototypeStructure(projectData.prototypeStructure);
    setMultimodalExtensions(projectData.multimodalExtensions);
    setAgents(agentData.agents);
    setRoutingPolicy(agentData.routingPolicy);
    setMetrics(metricData);
    setRuns(runData.runs);
  };

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
    const timer = setInterval(() => refresh().catch(() => {}), 1200);
    return () => clearInterval(timer);
  }, []);

  const totalDemoTokens = useMemo(() => latestRun?.summary?.totalTokens ?? 0, [latestRun]);

  const startRun = async () => {
    setLoading(true);
    setError("");
    try {
      await api.createRun({ requirement, complexity });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <Sparkles size={24} />
          <div>
            <h1>Agent Pipeline</h1>
            <p>AI 原生全栈开发流水线</p>
          </div>
        </div>
        <nav>
          <a href="#overview">总览</a>
          <a href="#description">项目描述</a>
          <a href="#agents">多 Agent 架构</a>
          <a href="#routing">模型路由</a>
          <a href="#runs">运行日志</a>
        </nav>
      </aside>

      <section className="content">
        <header className="hero" id="overview">
          <div>
            <p className="eyebrow">Claude Code · OpenClaw · OpenCode · GPT-5 · DeepSeek · MiMo</p>
            <h2>{project?.name || "基于多 Agent 协同的 AI 原生全栈开发流水线"}</h2>
            <p className="hero-copy">{project?.description}</p>
          </div>
          <div className="hero-actions">
            <button className="primary" onClick={startRun} disabled={loading}>
              {loading ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
              运行演示任务
            </button>
            <span className="status-pill">{latestRun?.status || "ready"}</span>
          </div>
        </header>

        {error && <div className="error">{error}</div>}

        <section className="metric-grid">
          <Metric label="日均 Token" value="800万-1200万" />
          <Metric label="月均 Token" value="25亿" />
          <Metric label="人工介入率" value="40% → 8%" />
          <Metric label="一次通过率" value="55% → 82%" />
          <Metric label="效率提升" value="3-5x" />
          <Metric label="当前演示 Token" value={formatTokens(totalDemoTokens)} />
        </section>

        <section className="panel" id="description">
          <div className="section-title">
            <h3>项目描述</h3>
            <p>{project?.objective}</p>
          </div>
          <div className="workflow">
            {project?.workflow?.map((stage, index) => (
              <div className="workflow-step" key={stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage}</strong>
              </div>
            ))}
          </div>
          <div className="description-grid">
            <div>
              <h4>核心执行引擎</h4>
              <p>{project?.executionEngine}</p>
            </div>
            <div>
              <h4>编排调度层</h4>
              <p>{project?.orchestrationLayer}</p>
            </div>
            <div>
              <h4>统一上下文</h4>
              <p>PipelineContext 贯穿需求、架构、编码、测试、审查与交付阶段。</p>
            </div>
          </div>
        </section>

        <section className="panel run-control">
          <div>
            <h3>需求输入</h3>
            <p>输入自然语言需求，流水线会生成结构化 Thought → Action → Observation 日志。</p>
          </div>
          <textarea value={requirement} onChange={(event) => setRequirement(event.target.value)} />
          <div className="segmented">
            {["low", "medium", "high"].map((item) => (
              <button key={item} className={complexity === item ? "active" : ""} onClick={() => setComplexity(item)}>
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-title">
            <h3>项目原型结构</h3>
            <p>后端以 BaseAgent 和 PipelineContext 为核心，前端提供 Dashboard、Agent 架构、模型路由和运行日志。</p>
          </div>
          <div className="structure-grid">
            {prototypeStructure.map((item) => (
              <article className="structure-item" key={item.name}>
                <Layers3 size={18} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.type}</span>
                  <p>{item.responsibility}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" id="agents">
          <div className="section-title">
            <h3>多 Agent 协同架构</h3>
            <p>每个 Agent 负责独立阶段，由编排层传递上下文并监控状态。</p>
          </div>
          <div className="agent-grid">
            {agents.map((agent) => {
              const Icon = agentIcons[agent.id] || Activity;
              return (
                <article className="agent-card" key={agent.id}>
                  <div className="agent-head">
                    <Icon size={20} />
                    <div>
                      <h4>{agent.name}</h4>
                      <span>{agent.model}</span>
                    </div>
                  </div>
                  <p>{agent.role}</p>
                  <div className="tag-list">
                    {agent.outputs?.map((output) => (
                      <span key={output}>{output}</span>
                    ))}
                  </div>
                  <div className="token-range">
                    {formatTokens(agent.tokenRange[0])} - {formatTokens(agent.tokenRange[1])} tokens
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel" id="routing">
          <div className="section-title">
            <h3>多模型混合调度策略</h3>
            <p>按复杂度路由模型，兼顾成本、吞吐与推理质量。</p>
          </div>
          <div className="routing-list">
            {routingPolicy.map((item) => (
              <div className="routing-item" key={item.className}>
                <Route size={18} />
                <div>
                  <strong>{item.className}</strong>
                  <span>{item.model}</span>
                  <p>{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-title">
            <h3>多模态扩展接口</h3>
            <p>当前原型预留截图分析、终端日志解析、语音需求输入和 MiMo-V2.5 长上下文推理接口。</p>
          </div>
          <div className="extension-grid">
            {multimodalExtensions.map((item) => {
              const Icon = extensionIcons[item.id] || Workflow;
              return (
                <article className="extension-item" key={item.id}>
                  <div>
                    <Icon size={18} />
                    <span>{item.status}</span>
                  </div>
                  <strong>{item.name}</strong>
                  <p>{item.capability}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel" id="runs">
          <div className="section-title with-action">
            <div>
              <h3>运行日志</h3>
              <p>以下为 demo 运行日志，用于展示 Agent 工作流形态。</p>
            </div>
            <button className="secondary" onClick={refresh}>
              <RefreshCw size={15} />
              刷新
            </button>
          </div>
          <RunLog run={latestRun} />
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function RunLog({ run }) {
  if (!run) {
    return <div className="empty">暂无运行记录</div>;
  }

  return (
    <div className="run-log">
      <div className="run-meta">
        <div>
          <strong>{run.requirement}</strong>
          <span>{run.id}</span>
        </div>
        <span className={`run-status ${run.status}`}>{run.status}</span>
      </div>
      <div className="terminal">
        {run.steps.map((step, index) => (
          <div className="log-entry" key={step.id}>
            <div className="log-line muted">
              <TerminalSquare size={14} /> ROUND {index + 1} · {step.agentName} · {step.model} · {formatTokens(step.tokens)} tokens
            </div>
            <div className="log-line">
              <b>Thought</b>
              <span>{step.thought}</span>
            </div>
            <div className="log-line">
              <b>Action</b>
              <code>
                {step.action.tool}.{step.action.name}
              </code>
            </div>
            <div className="log-line">
              <b>Observation</b>
              <span>{step.observation}</span>
            </div>
            {step.artifact && (
              <div className="log-line">
                <b>Artifact</b>
                <code>{Object.keys(step.artifact).join(", ")}</code>
              </div>
            )}
          </div>
        ))}
        {run.status === "completed" && (
          <div className="complete">
            <CheckCircle2 size={16} /> completed · coverage {(run.summary.coverage * 100).toFixed(1)}% · first pass{" "}
            {(run.summary.firstPassRate * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
