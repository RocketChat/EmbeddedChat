# Telemetry Integration Guide

This guide shows how to integrate telemetry collection into GSD agents and orchestrators.

## Quick Start

### For execute-phase orchestrator (Bash)

Add to `.github/skills/execute-phase/SKILL.md`:

```bash
# At the top of the script
source .gsd/telemetry/telemetry-functions.sh

# Get optimization version
OPT_VERSION=$(telemetry_get_version)

# Track phase start
PHASE_START_TIME=$(date +%s)

# ... existing phase execution logic ...

# After all plans complete
PHASE_END_TIME=$(date +%s)
PHASE_DURATION_MIN=$(( (PHASE_END_TIME - PHASE_START_TIME) / 60 ))

# Collect totals
TOTAL_TOKENS=$(grep "$PHASE_NUM" .gsd/telemetry/metrics.csv | awk -F, '{sum+=$7} END {print sum}')
COMPLETED_PLANS=$(ls "$PHASE_DIR"/*-SUMMARY.md 2>/dev/null | wc -l)
TOTAL_PLANS=$(ls "$PHASE_DIR"/*-PLAN.md 2>/dev/null | wc -l)

# Record phase summary
telemetry_phase_summary "$PHASE_NUM" "$PHASE_NAME" "$TOTAL_PLANS" "$COMPLETED_PLANS" \
                        "$PHASE_DURATION_MIN" "$TOTAL_TOKENS" "$OPT_VERSION"
```

### For individual agent execution (PowerShell)

Add to `.github/agents/gsd-executor.agent.md`:

```powershell
# At the top
. .gsd\telemetry\telemetry-functions.ps1

# Before plan execution
Start-Telemetry -PhaseNum $PhaseNum `
                -PhaseName $PhaseName `
                -PlanId $PlanId `
                -AgentType "executor" `
                -WaveNum $WaveNum `
                -ConcurrentCount $ConcurrentCount

# ... execute the plan ...

# After completion
$tokensUsed = Get-TokenEstimate $planContent
$modelUsed = "sonnet"  # or dynamic selection
$success = $?  # PowerShell success indicator

Stop-Telemetry -PlanId $PlanId `
               -TokensUsed $tokensUsed `
               -ModelUsed $modelUsed `
               -Success $success `
               -ErrorMsg $errorMessage
```

## Integration Points

### 1. Execute-Phase Orchestrator

**File:** `.github/skills/execute-phase/SKILL.md`

**When:** Phase starts and completes

**What to track:**
- Phase start/end time
- Total tokens consumed
- Number of plans completed
- Success rate
- Optimization version

**Code location:** After `<step name="execute_waves">` completes

```bash
# Record phase-level telemetry
telemetry_phase_summary \
    "$PHASE_NUM" \
    "$PHASE_NAME" \
    "$TOTAL_PLANS" \
    "$COMPLETED_PLANS" \
    "$TOTAL_DURATION_MIN" \
    "$TOTAL_TOKENS" \
    "$OPT_VERSION"
```

### 2. GSD Executor Agent

**File:** `.github/agents/gsd-executor.agent.md`

**When:** Individual plan execution

**What to track:**
- Plan start/end time
- Tokens consumed
- Model used
- Success/failure
- Wave number
- Concurrent agent count

**Code locations:**

```markdown
<step name="load_plan">
# Add after loading plan
source .gsd/telemetry/telemetry-functions.sh

# Extract plan metadata
PLAN_ID=$(basename "$PLAN_FILE" | sed 's/-PLAN.md//')
WAVE_NUM=$(grep "^wave:" "$PLAN_FILE" | cut -d: -f2 | tr -d ' ')

# Start tracking
telemetry_start "$PHASE_NUM" "$PHASE_NAME" "$PLAN_ID" "executor" "$WAVE_NUM" "$CONCURRENT_COUNT"
</step>

<step name="create_summary">
# Add before creating SUMMARY.md

# Estimate tokens used
PLAN_TOKENS=$(telemetry_estimate_tokens "$(cat $PLAN_FILE)")
CONTEXT_TOKENS=$(telemetry_estimate_tokens "$(cat .gsd/STATE.md 2>/dev/null)")
TOTAL_TOKENS=$((PLAN_TOKENS + CONTEXT_TOKENS))

# Determine model used
MODEL_USED="sonnet"  # Or from dynamic selection

# Check success
if [ -f "$SUMMARY_FILE" ]; then
    SUCCESS="true"
    ERROR_MSG=""
else
    SUCCESS="false"
    ERROR_MSG="Failed to create SUMMARY.md"
fi

# Record telemetry
telemetry_end "$PLAN_ID" "$TOTAL_TOKENS" "$MODEL_USED" "$SUCCESS" "$ERROR_MSG"
</step>
```

### 3. GSD Verifier Agent

**File:** `.github/agents/gsd-verifier.agent.md`

**Code:**

```bash
# At start
telemetry_start "$PHASE_NUM" "$PHASE_NAME" "${PHASE_NUM}-verify" "verifier" "0" "1"

# ... verification logic ...

# At end
TOKENS_USED=$(telemetry_estimate_tokens "$(cat $VERIFICATION_FILE)")
telemetry_end "${PHASE_NUM}-verify" "$TOKENS_USED" "sonnet" "$SUCCESS" "$ERROR_MSG"
```

### 4. GSD Planner Agent

**File:** `.github/agents/gsd-planner.agent.md`

**Code:**

```bash
# At start
telemetry_start "$PHASE_NUM" "$PHASE_NAME" "${PHASE_NUM}-plan" "planner" "0" "1"

# ... planning logic ...

# At end
TOKENS_USED=$(telemetry_estimate_tokens "$(cat $ROADMAP_CONTENT)")
telemetry_end "${PHASE_NUM}-plan" "$TOKENS_USED" "opus" "$SUCCESS" "$ERROR_MSG"
```

## Token Estimation

The telemetry functions include a simple token estimator (~4 chars per token), but you can improve accuracy:

### Option 1: Use actual API responses (if available)

```bash
# If you have access to API response headers
TOKENS_USED=$(echo "$API_RESPONSE" | jq '.usage.total_tokens')
```

### Option 2: Use tiktoken (Python)

```python
import tiktoken

def estimate_tokens(text, model="gpt-4"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))
```

### Option 3: Improved character-based estimate

```bash
# More accurate: ~3.5 chars per token for English, varies by language
telemetry_estimate_tokens() {
    local text="$1"
    local char_count=$(echo "$text" | wc -c)
    echo $((char_count * 10 / 35))  # = char_count / 3.5
}
```

## Error Handling

Always wrap telemetry calls in try-catch to prevent telemetry failures from breaking execution:

```bash
# Bash
telemetry_end "$PLAN_ID" "$TOKENS" "$MODEL" "$SUCCESS" "$ERROR" 2>/dev/null || true

# Or with explicit error handling
if ! telemetry_end "$PLAN_ID" "$TOKENS" "$MODEL" "$SUCCESS" "$ERROR"; then
    echo "Warning: Failed to record telemetry" >&2
fi
```

```powershell
# PowerShell
try {
    Stop-Telemetry -PlanId $PlanId -TokensUsed $tokens -ModelUsed $model -Success $success
} catch {
    Write-Warning "Failed to record telemetry: $_"
}
```

## Optimization Version Tracking

Add to `.gsd/config.json`:

```json
{
  "optimization_version": "baseline",
  "parallelization": {
    "max_concurrent_agents": 3
  }
}
```

Update version when making optimizations:

```bash
# After implementing OPT-01 (increase max_concurrent)
jq '.optimization_version = "v1-concurrent8"' .gsd/config.json > temp.json
mv temp.json .gsd/config.json
```

This allows comparing before/after performance in reports.

## Testing Integration

### Test 1: Verify functions load

```bash
source .gsd/telemetry/telemetry-functions.sh
telemetry_status
```

Expected output:
```
📊 Telemetry Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agent Executions Logged: 0
Phases Completed: 0
Telemetry Directory: .gsd/telemetry
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Test 2: Simulate agent execution

```bash
source .gsd/telemetry/telemetry-functions.sh

# Start
telemetry_start "1" "test-phase" "01-01" "executor" "1" "1"

# Simulate work
sleep 2

# End
telemetry_end "01-01" "5000" "sonnet" "true" ""

# Verify recorded
tail -1 .gsd/telemetry/metrics.csv
```

### Test 3: Generate report

```bash
node .gsd/telemetry/report.js
```

Should show the test execution.

## Rollout Strategy

1. **Phase 1:** Add telemetry to execute-phase orchestrator (phase-level tracking)
2. **Phase 2:** Add to executor agent (per-plan tracking)
3. **Phase 3:** Add to verifier, planner (complete coverage)
4. **Phase 4:** Run a few phases and validate data quality
5. **Phase 5:** Enable continuous monitoring

## Troubleshooting

### Issue: Telemetry files not created

**Solution:** Ensure telemetry directory exists:
```bash
mkdir -p .gsd/telemetry/logs
```

### Issue: CSV format broken

**Solution:** Check for unescaped commas in error messages:
```bash
# In telemetry_end function
error_msg=$(echo "$error_msg" | tr ',' ';')
```

### Issue: Negative durations

**Solution:** Ensure start time file exists before end:
```bash
if [ ! -f "$TELEMETRY_DIR/.temp_start_${plan_id}" ]; then
    echo "Warning: No start time found for $plan_id" >&2
    return 1
fi
```

## Next Steps

1. ✅ Telemetry infrastructure created
2. ⏳ Integrate into execute-phase orchestrator
3. ⏳ Integrate into executor agent
4. ⏳ Test with a single phase execution
5. ⏳ Validate report generation
6. ⏳ Enable continuous monitoring

Ready to start integration? Begin with the execute-phase orchestrator for quick wins!
