import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildDemoRuns } from "../server/pipeline.js";

const outDir = join(process.cwd(), "evidence", "demo-logs");
mkdirSync(outDir, { recursive: true });

const [run] = buildDemoRuns();
const lines = [
  "# Demo Agent Workflow Log",
  "",
  "> This is a generated demo log for project demonstration. It is not a billing record.",
  "",
  `Run ID: ${run.id}`,
  `Requirement: ${run.requirement}`,
  `Status: ${run.status}`,
  "",
];

for (const [index, step] of run.steps.entries()) {
  lines.push(`## Round ${index + 1} · ${step.agentName} · ${step.model}`);
  lines.push(`Thought: ${step.thought}`);
  lines.push(`Action: ${step.action.tool}.${step.action.name}`);
  lines.push(`Observation: ${step.observation}`);
  lines.push(`Tokens: ${step.tokens}`);
  lines.push("");
}

lines.push("## Summary");
lines.push(`Total Tokens: ${run.summary.totalTokens}`);
lines.push(`Agents: ${run.summary.agents}`);
lines.push(`Rounds: ${run.summary.rounds}`);
lines.push(`Coverage: ${(run.summary.coverage * 100).toFixed(1)}%`);
lines.push(`First Pass Rate: ${(run.summary.firstPassRate * 100).toFixed(0)}%`);
lines.push(`Intervention Rate: ${(run.summary.interventionRate * 100).toFixed(0)}%`);

writeFileSync(join(outDir, "agent-workflow-demo.md"), lines.join("\n"), "utf-8");
writeFileSync(join(outDir, "agent-workflow-demo.json"), JSON.stringify(run, null, 2), "utf-8");

console.log(`Generated demo logs in ${outDir}`);
