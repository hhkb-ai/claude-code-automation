# 项目描述

**项目名称：** 基于多 Agent 协同的 AI 原生全栈开发流水线

**项目描述：**  
本项目构建了一套以 Claude Code 为核心执行引擎、OpenClaw/OpenCode 为编排调度层的 AI 原生全栈开发流水线，将“需求输入 → 架构设计 → 编码实现 → 自动化测试 → 代码审查 → 部署交付”纳入多 Agent 自主协同闭环。系统目标是把复杂软件开发任务拆解为多个专业 Agent 的连续协作流程，并通过统一日志、指标与任务状态管理形成可观测、可复盘、可扩展的研发自动化基础设施。

流水线由多个专业 Agent 组成：需求解析 Agent 基于 DeepSeek 将自然语言需求拆解为结构化任务树，识别模块边界、依赖关系与执行优先级；架构设计 Agent 基于 Claude Opus 生成系统架构、数据模型、API 设计与组件规划，并自动完成设计评审；编码执行 Agent 基于 Claude Code 与 Claude Sonnet，通过 tool-use 机制直接操作文件系统、执行 Shell 命令、跨文件重构并运行测试；测试生成 Agent 自动生成单元测试、集成测试与端到端测试用例，覆盖边界条件和异常路径；代码审查 Agent 结合 GPT-5 与 Claude Opus 进行安全漏洞扫描、性能瓶颈识别、规范检查与潜在 Bug 预警；交付 Agent 汇总结果、生成交付包、输出变更说明并记录人工介入点。

为满足多个 AI 同时处理同一项目的要求，系统增加并行协作规范：需求解析后先生成任务泳道和文件 writeSet，前端实现、后端契约、测试生成、交叉审查等泳道可在依赖满足后并行执行；每个 Agent 开始前声明 owner、写入范围、依赖关系和交付 Artifact，编排层阻止两个 Agent 同时改写同一文件。跨 Agent 上下文只通过 `PipelineContext` 和 Artifact 索引同步，避免局部结论互相覆盖。合并阶段采用 owner-first patch merge，若出现 writeSet 冲突或上下文不一致，冲突泳道暂停并交由 Review Agent 生成合并决策。所有并行产出必须通过构建、demo run、测试摘要和审查评分后才进入交付阶段。

系统采用多模型混合调度策略：简单 CRUD 任务路由至低成本高吞吐模型，中等复杂业务逻辑路由至 Claude Sonnet/GPT-5，架构设计与安全审查路由至强推理模型。当前原型还预留截图分析、终端日志解析、语音需求输入等多模态扩展接口，可用于 UI 还原度验证、Bug 复现定位与视觉回归测试。后续计划引入 MiMo-V2.5 系列作为长上下文推理引擎，强化大型代码仓库全量上下文处理与自动化 UI 修复能力。

本仓库提供可运行的项目原型：后端以 `BaseAgent` 和 `PipelineContext` 为核心，定义 Requirement、Architecture、Coding、Review、Test、Delivery 等 Agent 类，每个 Agent 读取并更新统一上下文，输出结构化 Artifact；前端提供 Dashboard、并行协作、Agent 架构、模型路由和运行日志。`evidence/` 目录可生成 demo 日志，用于展示 Thought → Action → Observation 工作流形态。
