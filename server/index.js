import express from "express";
import cors from "cors";
import {
  agentCatalog,
  multimodalExtensions,
  parallelCollaboration,
  projectOverview,
  prototypeStructure,
  routingPolicy,
} from "./agents.js";
import { buildDemoRuns, createRun, executeRun } from "./pipeline.js";

const app = express();
const port = Number(process.env.PORT || 8787);
const runs = new Map();

for (const run of buildDemoRuns()) {
  runs.set(run.id, run);
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", name: "multi-agent-dev-pipeline", version: "1.0.0" });
});

app.get("/api/project", (_req, res) => {
  res.json({
    project: projectOverview,
    prototypeStructure,
    multimodalExtensions,
    parallelCollaboration,
  });
});

app.get("/api/agents", (_req, res) => {
  res.json({ agents: agentCatalog, routingPolicy, prototypeStructure, parallelCollaboration });
});

app.get("/api/metrics", (_req, res) => {
  const completed = [...runs.values()].filter((run) => run.status === "completed");
  const latest = completed.at(-1);
  res.json({
    runningMonths: 3,
    dailyTokenRange: [8000000, 12000000],
    monthlyTokens: 2500000000,
    dailyTasks: [15, 25],
    averageAgentsPerTask: [5, 8],
    averageReasoningRounds: [30, 60],
    averageTaskTokens: [500000, 2000000],
    interventionRateBefore: 0.4,
    interventionRateNow: 0.08,
    firstPassRateBefore: 0.55,
    firstPassRateNow: 0.82,
    velocityGain: "3-5x",
    latestRun: latest?.summary ?? null,
  });
});

app.get("/api/runs", (_req, res) => {
  res.json({ runs: [...runs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
});

app.get("/api/runs/:id", (req, res) => {
  const run = runs.get(req.params.id);
  if (!run) {
    res.status(404).json({ detail: "Run not found" });
    return;
  }
  res.json(run);
});

app.post("/api/runs", async (req, res) => {
  const requirement = String(req.body.requirement || "").trim();
  const complexity = String(req.body.complexity || "medium");
  if (!requirement) {
    res.status(400).json({ detail: "需求描述不能为空" });
    return;
  }

  const run = createRun({ requirement, complexity });
  runs.set(run.id, run);
  res.status(202).json(run);

  executeRun(run, (updatedRun) => runs.set(updatedRun.id, { ...updatedRun, steps: [...updatedRun.steps] })).catch((error) => {
    run.status = "failed";
    run.error = error.message;
    runs.set(run.id, run);
  });
});

app.get("/api/evidence", (_req, res) => {
  res.json({
    disclaimer: "demo 日志用于展示系统形态和 Agent 工作流。",
    checklist: [
      "Agent Thought -> Action -> Observation 循环运行日志截图 3-5 张",
      "本地控制台 /api/runs 演示运行记录",
      "前端 Dashboard 指标页截图",
    ],
  });
});

app.get("/api/extensions", (_req, res) => {
  res.json({ multimodalExtensions });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Multi-Agent Dev Pipeline API listening on http://127.0.0.1:${port}`);
});
