# 项目描述

**项目名称：** 基于多 Agent 协同的 AI 原生全栈开发流水线

**项目描述：**  
本项目构建了一套以 Claude Code 为核心执行引擎、OpenClaw/OpenCode 为编排调度层的 AI 原生全栈开发流水线，将“需求输入 → 架构设计 → 编码实现 → 自动化测试 → 代码审查 → 部署交付”纳入多 Agent 自主协同闭环。系统目标是把复杂软件开发任务拆解为多个专业 Agent 的连续协作流程，并通过统一日志、指标与任务状态管理形成可观测、可复盘、可扩展的研发自动化基础设施。

流水线由多个专业 Agent 组成：需求解析 Agent 基于 DeepSeek 将自然语言需求拆解为结构化任务树，识别模块边界、依赖关系与执行优先级；架构设计 Agent 基于 Claude Opus 生成系统架构、数据模型、API 设计与组件规划，并自动完成设计评审；编码执行 Agent 基于 Claude Code 与 Claude Sonnet，通过 tool-use 机制直接操作文件系统、执行 Shell 命令、跨文件重构并运行测试；测试生成 Agent 自动生成单元测试、集成测试与端到端测试用例，覆盖边界条件和异常路径；代码审查 Agent 结合 GPT-5 与 Claude Opus 进行安全漏洞扫描、性能瓶颈识别、规范检查与潜在 Bug 预警；交付 Agent 汇总结果、生成交付包、输出变更说明并记录人工介入点。

系统采用多模型混合调度策略：简单 CRUD 任务路由至低成本高吞吐模型，中等复杂业务逻辑路由至 Claude Sonnet/GPT-5，架构设计与安全审查路由至强推理模型。当前原型还预留截图分析、终端日志解析、语音需求输入等多模态扩展接口，可用于 UI 还原度验证、Bug 复现定位与视觉回归测试。后续计划引入 MiMo-V2.5 系列作为长上下文推理引擎，强化大型代码仓库全量上下文处理与自动化 UI 修复能力。

本仓库提供可运行的项目原型：后端以 `BaseAgent` 和 `PipelineContext` 为核心，定义 Requirement、Architecture、Coding、Review、Test、Delivery 等 Agent 类，每个 Agent 读取并更新统一上下文，输出结构化 Artifact；前端提供 Dashboard、Agent 架构、模型路由、运行日志和证明材料清单。`evidence/` 目录可生成 demo 日志，用于展示 Thought → Action → Observation 工作流形态。正式提交时，应补充真实平台消费账单截图和真实终端运行截图，并对 API Key、账号、账单敏感信息进行打码。
