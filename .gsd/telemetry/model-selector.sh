#!/bin/bash
# Dynamic Model Selection for GSD Agents
# Source: source .gsd/telemetry/model-selector.sh

# Estimate task complexity and select appropriate model
# Returns: "haiku", "sonnet", or "opus"
select_model_for_task() {
    local task_description="$1"
    local files_modified="${2:-}"
    
    # Convert to lowercase for matching
    local desc_lower=$(echo "$task_description" | tr '[:upper:]' '[:lower:]')
    
    # ALWAYS use Opus for architecture/security/critical tasks
    local architecture_keywords=(
        "architecture" "refactor" "redesign" "restructure"
        "security" "authentication" "authorization" "crypto"
        "critical" "breaking change" "migrate" "migration"
        "payment" "billing" "transaction" "audit"
        "schema change" "database migration" "data migration"
    )
    
    for keyword in "${architecture_keywords[@]}"; do
        if echo "$desc_lower" | grep -q "$keyword"; then
            echo "opus"
            return 0
        fi
    done
    
    # Use Haiku for simple, low-risk tasks
    local simple_keywords=(
        "update version" "change config" "add comment" "remove comment"
        "format code" "update readme" "fix typo" "update docs"
        "add log" "update import" "rename variable" "add todo"
        "update dependency" "bump version" "update changelog"
    )
    
    for keyword in "${simple_keywords[@]}"; do
        if echo "$desc_lower" | grep -q "$keyword"; then
            echo "haiku"
            return 0
        fi
    done
    
    # File count heuristic
    if [ -n "$files_modified" ]; then
        local file_count=$(echo "$files_modified" | tr ',' '\n' | wc -l | tr -d ' ')
        
        if [ "$file_count" -eq 1 ]; then
            # Single file changes are usually simple
            echo "haiku"
            return 0
        elif [ "$file_count" -gt 5 ]; then
            # Multi-file refactors need more power
            echo "opus"
            return 0
        fi
    fi
    
    # Medium complexity keywords → Sonnet
    local medium_keywords=(
        "implement" "add feature" "create component" "new endpoint"
        "add test" "fix bug" "update logic" "add validation"
        "integrate" "connect" "setup" "configure"
    )
    
    for keyword in "${medium_keywords[@]}"; do
        if echo "$desc_lower" | grep -q "$keyword"; then
            echo "sonnet"
            return 0
        fi
    done
    
    # Default: Sonnet (balanced choice)
    echo "sonnet"
}

# Select model for entire plan based on plan type
select_model_for_plan() {
    local plan_file="$1"
    
    if [ ! -f "$plan_file" ]; then
        echo "sonnet"
        return 0
    fi
    
    # Extract plan type from frontmatter
    local plan_type=$(grep "^type:" "$plan_file" | cut -d: -f2 | tr -d ' ')
    
    # Map plan types to models
    case "$plan_type" in
        security|auth|payment|critical|data-migration)
            echo "opus"
            ;;
        docs|tests|ui-polish|formatting)
            echo "haiku"
            ;;
        feature|implementation|integration)
            echo "sonnet"
            ;;
        *)
            # No type specified, analyze objectives
            local objective=$(sed -n '/<objective>/,/<\/objective>/p' "$plan_file")
            select_model_for_task "$objective" ""
            ;;
    esac
}

# Get model cost per 1K tokens (input pricing)
get_model_cost() {
    local model="$1"
    
    case "$model" in
        opus)
            echo "0.030"
            ;;
        sonnet)
            echo "0.015"
            ;;
        haiku)
            echo "0.0025"
            ;;
        *)
            echo "0.015"  # Default to sonnet pricing
            ;;
    esac
}

# Estimate cost savings from model selection
estimate_cost_savings() {
    local original_model="$1"
    local selected_model="$2"
    local token_count="$3"
    
    local original_cost=$(get_model_cost "$original_model")
    local selected_cost=$(get_model_cost "$selected_model")
    
    local original_total=$(awk "BEGIN {printf \"%.2f\", ($token_count / 1000) * $original_cost}")
    local selected_total=$(awk "BEGIN {printf \"%.2f\", ($token_count / 1000) * $selected_cost}")
    local savings=$(awk "BEGIN {printf \"%.2f\", $original_total - $selected_total}")
    
    echo "$savings"
}

# Print model selection reasoning (for debugging)
explain_model_selection() {
    local task="$1"
    local model="$2"
    
    case "$model" in
        opus)
            echo "Selected Opus: Critical/architecture task requiring highest quality"
            ;;
        haiku)
            echo "Selected Haiku: Simple task suitable for fast, cost-effective execution"
            ;;
        sonnet)
            echo "Selected Sonnet: Balanced choice for standard implementation work"
            ;;
    esac
}
