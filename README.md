# Multi-Agent Dev Pipeline

基于多 Agent 协同的 AI 原生全栈开发流水线项目原型。项目以 Claude Code 为核心执行引擎、OpenClaw/OpenCode 为编排调度层，用于展示“需求输入 → 架构设计 → 编码实现 → 自动化测试 → 代码审查 → 部署交付”的多智能体协同闭环。

系统目标是把复杂软件开发任务拆解为多个专业 Agent 的连续协作流程，并通过统一日志、指标与任务状态管理形成可观测、可复盘、可扩展的研发自动化基础设施。

## 功能

- 多 Agent 目录：需求解析、架构设计、编码执行、测试生成、代码审查、交付 Agent。
- 类式流水线核心：`BaseAgent`、`RequirementAgent`、`ArchitectureAgent`、`CodingAgent`、`TestAgent`、`ReviewAgent`、`DeliveryAgent` 共享同一个 `PipelineContext`。
- 编排调度层：模拟 OpenClaw/OpenCode 的任务队列、上下文传递、执行状态监控、异常回滚与人工介入点记录。
- 多模型路由策略：DeepSeek、Claude Sonnet、Claude Opus、GPT-5、MiMo 等模型按任务复杂度调度。
- 运行日志：生成 Thought → Action → Observation 结构化日志。
- 指标 Dashboard：展示 Token、人工介入率、一次通过率、效率提升等关键指标。
- 多模态扩展接口：预留截图分析、终端录屏解析、语音需求输入和 MiMo-V2.5 长上下文入口。

## 技术栈

- Frontend: React + Vite + lucide-react
- Backend: Node.js + Express
- Orchestration: OpenClaw/OpenCode-style demo simulator with replaceable provider adapter

## 项目结构

```text
server/
  agents.js       Agent 目录、项目描述、模型路由、多模态扩展配置
  pipeline.js     BaseAgent、PipelineContext 和流水线执行逻辑
  index.js        Express API
src/
  main.jsx        Dashboard、Agent 架构、模型路由、运行日志
  styles.css      前端样式
scripts/
  generate-demo-log.js
evidence/
  demo-logs/      Thought -> Action -> Observation demo 日志
```

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
- `GET /api/project`
- `GET /api/agents`
- `GET /api/metrics`
- `GET /api/runs`
- `POST /api/runs`
- `GET /api/extensions`

## 重要说明

本仓库包含 demo simulator，用于展示系统结构和工作流形态。`evidence/demo-logs` 生成的内容是演示日志。
