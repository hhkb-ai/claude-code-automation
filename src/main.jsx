import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Boxes,
  CheckCircle2,
  Code2,
  FileText,
  GitBranch,
  Play,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  TestTube2,
} from "lucide-react";
import "./styles.css";

const api = {
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

function App() {
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
    const [agentData, metricData, runData] = await Promise.all([api.agents(), api.metrics(), api.runs()]);
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
          <a href="#agents">多 Agent 架构</a>
          <a href="#runs">运行日志</a>
          <a href="#evidence">证明材料</a>
        </nav>
      </aside>

      <section className="content">
        <header className="hero" id="overview">
          <div>
            <p className="eyebrow">Claude Code · OpenClaw · OpenCode · GPT-5 · DeepSeek · MiMo</p>
            <h2>基于多 Agent 协同的 AI 原生全栈开发流水线</h2>
            <p className="hero-copy">
              将需求输入、架构设计、编码实现、自动化测试、代码审查、部署交付纳入 AI Agent 自主决策闭环。
            </p>
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
                  <div className="token-range">
                    {formatTokens(agent.tokenRange[0])} - {formatTokens(agent.tokenRange[1])} tokens
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel">
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

        <section className="panel" id="runs">
          <div className="section-title with-action">
            <div>
              <h3>运行日志</h3>
              <p>用于制作 Agent 工作流截图。以下为 demo 运行日志，不替代真实平台账单。</p>
            </div>
            <button className="secondary" onClick={refresh}>
              <RefreshCw size={15} />
              刷新
            </button>
          </div>
          <RunLog run={latestRun} />
        </section>

        <section className="panel" id="evidence">
          <div className="section-title">
            <h3>证明材料清单</h3>
            <p>表单提交前建议准备以下材料，确保指标与截图可以互相印证。</p>
          </div>
          <ul className="checklist">
            <li>过去 30 天 Anthropic/OpenAI/DeepSeek 消费记录截图。</li>
            <li>Agent Thought → Action → Observation 循环运行日志截图 3-5 张。</li>
            <li>GitHub 仓库链接，包含 README、代码结构、启动命令。</li>
            <li>本 Dashboard 指标页与运行日志页截图。</li>
            <li>真实终端任务执行记录，隐藏 API Key、账号、账单敏感信息。</li>
          </ul>
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
