# GSD Performance Telemetry

Automated performance tracking for the GSD agent orchestration system.

## Files

- **`metrics.csv`** - Detailed per-agent execution metrics
- **`phase-summary.csv`** - Aggregated phase-level performance
- **`logs/`** - Detailed execution logs for troubleshooting
- **`dashboard.html`** - Visual performance dashboard (generated)

## Metrics Collected

### Per-Agent Metrics (`metrics.csv`)

| Field | Description |
|-------|-------------|
| timestamp | ISO 8601 timestamp of execution start |
| phase_num | Phase number (e.g., 1, 2, 3) |
| phase_name | Phase name (e.g., "authentication") |
| plan_id | Plan identifier (e.g., "02-01") |
| agent_type | Agent that executed (executor, verifier, planner) |
| duration_sec | Execution time in seconds |
| tokens_used | Estimated tokens consumed |
| model_used | Model used (opus, sonnet, haiku) |
| success | true/false execution result |
| error_msg | Error message if failed (empty if success) |
| wave_num | Wave number in parallel execution |
| concurrent_count | Number of agents running concurrently |

### Phase-Level Summary (`phase-summary.csv`)

| Field | Description |
|-------|-------------|
| timestamp | When phase completed |
| phase_num | Phase number |
| phase_name | Phase name |
| total_plans | Total number of plans in phase |
| completed_plans | Successfully completed plans |
| total_duration_min | Total phase execution time (minutes) |
| total_tokens | Total tokens consumed across all plans |
| avg_tokens_per_plan | Average tokens per plan |
| estimated_cost_usd | Estimated cost in USD |
| success_rate | Percentage of successful plans |
| parallel_efficiency | % of time agents were running concurrently |
| optimization_version | Configuration version (baseline, v1, v2, etc.) |

## Usage

### View Recent Performance

``bash
# Last 10 agent executions
tail -10 .gsd/telemetry/metrics.csv

# Last 5 phase summaries
tail -5 .gsd/telemetry/phase-summary.csv

# Windows PowerShell
Get-Content .gsd\telemetry\metrics.csv -Tail 10
Get-Content .gsd\telemetry\phase-summary.csv -Tail 5
``

### Generate Dashboard

``bash
# Create visual dashboard
node .gsd/telemetry/generate-dashboard.js

# Open in browser
start .gsd/telemetry/dashboard.html
``

### View Summary Report

``bash
# Quick performance summary
node .gsd/telemetry/report.js

# Or use PowerShell script
pwsh .gsd/telemetry/report.ps1
``

## Integration

Telemetry is automatically collected when:
1. `/execute-phase.md` orchestrator runs
2. Individual agents execute (via instrumented Task() calls)
3. Phase verification completes

No manual intervention required - metrics are logged transparently.

## Privacy

Telemetry data is stored **locally only** in `.gsd/telemetry/`. It is not transmitted anywhere.

Add to `.gitignore` if you want to exclude from version control:
``
.gsd/telemetry/logs/
.gsd/telemetry/*.csv
``

Or commit for team benchmarking and trend analysis.
