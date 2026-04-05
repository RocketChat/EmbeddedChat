#!/bin/bash
# Telemetry Helper Functions for GSD Agents
# Source this file in agent scripts: source .gsd/telemetry/telemetry-functions.sh

TELEMETRY_DIR=".gsd/telemetry"
METRICS_FILE="$TELEMETRY_DIR/metrics.csv"
SUMMARY_FILE="$TELEMETRY_DIR/phase-summary.csv"
LOG_DIR="$TELEMETRY_DIR/logs"

# Initialize telemetry for agent execution
# Usage: telemetry_start "phase_num" "phase_name" "plan_id" "agent_type" "wave_num" "concurrent_count"
telemetry_start() {
    local phase_num="$1"
    local phase_name="$2"
    local plan_id="$3"
    local agent_type="$4"
    local wave_num="${5:-1}"
    local concurrent_count="${6:-1}"
    
    # Store start time in temp file
    echo "$(date +%s)" > "$TELEMETRY_DIR/.temp_start_${plan_id}"
    
    # Store execution context
    cat > "$TELEMETRY_DIR/.temp_context_${plan_id}" <<EOF
phase_num=$phase_num
phase_name=$phase_name
plan_id=$plan_id
agent_type=$agent_type
wave_num=$wave_num
concurrent_count=$concurrent_count
EOF
    
    # Log start
    echo "[$(date -Iseconds)] START: $agent_type executing $plan_id (Wave $wave_num)" \
        >> "$LOG_DIR/execution.log"
}

# End telemetry and record metrics
# Usage: telemetry_end "plan_id" "tokens_used" "model_used" "success" ["error_msg"]
telemetry_end() {
    local plan_id="$1"
    local tokens_used="$2"
    local model_used="$3"
    local success="$4"
    local error_msg="${5:-}"
    
    # Calculate duration
    local start_time=$(cat "$TELEMETRY_DIR/.temp_start_${plan_id}" 2>/dev/null || echo "0")
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Load context
    source "$TELEMETRY_DIR/.temp_context_${plan_id}" 2>/dev/null || true
    
    # Clean error message (escape commas and quotes)
    error_msg=$(echo "$error_msg" | tr ',' ';' | tr '"' "'" | head -c 200)
    
    # Record metric
    local timestamp=$(date -Iseconds)
    echo "$timestamp,$phase_num,$phase_name,$plan_id,$agent_type,$duration,$tokens_used,$model_used,$success,\"$error_msg\",$wave_num,$concurrent_count" \
        >> "$METRICS_FILE"
    
    # Log end
    echo "[$(date -Iseconds)] END: $agent_type completed $plan_id in ${duration}s (${tokens_used} tokens, $model_used, success=$success)" \
        >> "$LOG_DIR/execution.log"
    
    # Cleanup temp files
    rm -f "$TELEMETRY_DIR/.temp_start_${plan_id}"
    rm -f "$TELEMETRY_DIR/.temp_context_${plan_id}"
}

# Estimate tokens from text length (rough approximation)
# Usage: tokens=$(telemetry_estimate_tokens "$text")
telemetry_estimate_tokens() {
    local text="$1"
    local char_count=$(echo "$text" | wc -c)
    # Rough estimate: ~4 characters per token
    echo $((char_count / 4))
}

# Record phase-level summary
# Usage: telemetry_phase_summary "phase_num" "phase_name" "total_plans" "completed_plans" \
#                                 "total_duration_min" "total_tokens" "optimization_version"
telemetry_phase_summary() {
    local phase_num="$1"
    local phase_name="$2"
    local total_plans="$3"
    local completed_plans="$4"
    local total_duration_min="$5"
    local total_tokens="$6"
    local optimization_version="${7:-baseline}"
    
    # Calculate derived metrics
    local avg_tokens_per_plan=$((total_tokens / total_plans))
    local success_rate=$(awk "BEGIN {printf \"%.2f\", ($completed_plans / $total_plans) * 100}")
    
    # Estimate cost (using average rates)
    # Weighted average: ~$0.015/1K tokens (assuming mostly Sonnet)
    local estimated_cost=$(awk "BEGIN {printf \"%.2f\", ($total_tokens / 1000) * 0.015}")
    
    # Calculate parallel efficiency (placeholder - requires detailed timing)
    local parallel_efficiency="50.0"  # TODO: Calculate from wave timing data
    
    # Record summary
    local timestamp=$(date -Iseconds)
    echo "$timestamp,$phase_num,$phase_name,$total_plans,$completed_plans,$total_duration_min,$total_tokens,$avg_tokens_per_plan,$estimated_cost,$success_rate,$parallel_efficiency,$optimization_version" \
        >> "$SUMMARY_FILE"
    
    # Log summary
    cat >> "$LOG_DIR/execution.log" <<EOF

=== Phase $phase_num Summary ===
Phase: $phase_name
Plans: $completed_plans/$total_plans completed
Duration: $total_duration_min minutes
Tokens: $total_tokens (avg: $avg_tokens_per_plan/plan)
Cost: \$$estimated_cost USD
Success Rate: $success_rate%
Version: $optimization_version
===========================

EOF
}

# Get current optimization version from config
# Usage: version=$(telemetry_get_version)
telemetry_get_version() {
    if [ -f ".gsd/config.json" ]; then
        grep -o '"optimization_version"[[:space:]]*:[[:space:]]*"[^"]*"' .gsd/config.json 2>/dev/null \
            | cut -d'"' -f4 \
            || echo "baseline"
    else
        echo "baseline"
    fi
}

# Print telemetry status
telemetry_status() {
    echo "📊 Telemetry Status"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    local metrics_count=$(wc -l < "$METRICS_FILE" 2>/dev/null || echo "1")
    metrics_count=$((metrics_count - 1))  # Subtract header
    
    local summary_count=$(wc -l < "$SUMMARY_FILE" 2>/dev/null || echo "1")
    summary_count=$((summary_count - 1))  # Subtract header
    
    echo "Agent Executions Logged: $metrics_count"
    echo "Phases Completed: $summary_count"
    echo "Telemetry Directory: $TELEMETRY_DIR"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}
