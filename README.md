# Multi-Agent Dev Pipeline

基于多 Agent 协同的 AI 原生全栈开发流水线项目原型。项目用于展示“需求输入 → 架构设计 → 编码实现 → 自动化测试 → 代码审查 → 部署交付”的多智能体协同闭环。

## 功能

- 多 Agent 目录：需求解析、架构设计、编码执行、测试生成、代码审查、交付 Agent。
- 类式流水线核心：`BaseAgent`、`RequirementAgent`、`ArchitectureAgent`、`CodingAgent`、`ReviewAgent`、`TestAgent`、`DeliveryAgent` 共享同一个 `PipelineContext`。
- 多模型路由策略：DeepSeek、Claude Sonnet、Claude Opus、GPT-5、MiMo 等模型按任务复杂度调度。
- 运行日志：生成 Thought → Action → Observation 结构化日志。
- 指标 Dashboard：展示 Token、人工介入率、一次通过率、效率提升等关键指标。
- 证明材料清单：用于准备项目申报截图与仓库材料。

## 技术栈

- Frontend: React + Vite + lucide-react
- Backend: Node.js + Express
- Orchestration: demo simulator with replaceable provider adapter

## 快速开始

```bash
npm install
npm run dev
```

默认地址：

- Frontend: http://127.0.0.1:5173
- Backend: http://127.0.0.1:8787

生成 demo 日志：

```bash
npm run demo:run
```

输出位置：

```text
evidence/demo-logs/agent-workflow-demo.md
evidence/demo-logs/agent-workflow-demo.json
```

## API

- `GET /api/health`
- `GET /api/agents`
- `GET /api/metrics`
- `GET /api/runs`
- `POST /api/runs`
- `GET /api/evidence`

## 证明材料建议

1. 过去 30 天 Anthropic/OpenAI/DeepSeek 消费记录截图。
2. Agent Thought → Action → Observation 运行日志截图 3-5 张。
3. GitHub 仓库 README 与代码结构截图。
4. Dashboard 指标页截图。
5. 真实终端运行截图，隐藏 API Key、账号、账单等敏感信息。

## 重要说明

本仓库包含 demo simulator，用于展示系统结构和工作流形态。`evidence/demo-logs` 生成的内容是演示日志，不能作为真实消费账单或真实平台使用记录。正式申报时请使用真实平台账单截图和真实运行日志。
