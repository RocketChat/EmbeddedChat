#!/bin/bash
# Context Compression Helper for GSD Agents
# Source: source .gsd/telemetry/context-compression.sh

# Extract only relevant sections from STATE.md
compress_state_md() {
    local phase_num="$1"
    local state_file="${2:-.gsd/STATE.md}"
    
    if [ ! -f "$state_file" ]; then
        echo ""
        return
    fi
    
    # Extract current phase section + recent decisions
    {
        # Current status section
        sed -n '/^## Current/,/^##/p' "$state_file" | head -n -1
        
        # Phase-specific section if exists
        grep -A 15 "Phase $phase_num" "$state_file" 2>/dev/null || true
        
        # Recent decisions (last 10 lines of decisions section)
        sed -n '/^## Decisions/,/^##/p' "$state_file" | head -n -1 | tail -n 10
    } | head -c 10000  # Limit to 10KB (~2500 tokens)
}

# Extract only objective and tasks from PLAN.md (remove verbose examples)
compress_plan_md() {
    local plan_file="$1"
    
    if [ ! -f "$plan_file" ]; then
        echo ""
        return
    fi
    
    # Extract frontmatter + objective + tasks + verification + success
    # Skip verbose discovery, research, and example sections
    awk '
        BEGIN { in_keep_section=0; in_skip_section=0 }
        /^---$/ { frontmatter++; print; next }
        frontmatter == 1 { print; next }
        /^## (Objective|Tasks|Verification|Success Criteria|Output)/ { in_keep_section=1; in_skip_section=0; print; next }
        /^## (Discovery|Research|Examples|Background|Context)/ { in_keep_section=0; in_skip_section=1; next }
        /^##/ { in_keep_section=0; in_skip_section=0 }
        in_keep_section { print }
        !in_keep_section && !in_skip_section && frontmatter == 2 { print }
    ' "$plan_file"
}

# Check if file is large and should be compressed
should_compress_file() {
    local file="$1"
    local threshold_kb="${2:-10}"  # Default 10KB threshold
    
    if [ ! -f "$file" ]; then
        return 1
    fi
    
    local size_kb=$(du -k "$file" | cut -f1)
    [ "$size_kb" -gt "$threshold_kb" ]
}

# Extract specific line range from file
extract_file_range() {
    local file="$1"
    local start_line="$2"
    local end_line="$3"
    
    if [ ! -f "$file" ]; then
        echo ""
        return
    fi
    
    if [ -z "$end_line" ] || [ "$end_line" = "end" ]; then
        tail -n +$start_line "$file"
    else
        sed -n "${start_line},${end_line}p" "$file"
    fi
}

# Estimate tokens from text
estimate_tokens() {
    local text="$1"
    local char_count=$(echo "$text" | wc -c)
    echo $((char_count * 10 / 35))  # ~3.5 chars per token
}

# Smart file content loading with compression
load_file_smart() {
    local file="$1"
    local compression_enabled="${2:-true}"
    
    if [ ! -f "$file" ]; then
        echo ""
        return
    fi
    
    # Check if compression needed
    if [ "$compression_enabled" = "true" ] && should_compress_file "$file" 10; then
        case "$file" in
            *STATE.md)
                # For STATE.md, extract current phase section
                local phase_num=$(basename $(dirname "$file") | grep -o '^[0-9]*')
                compress_state_md "$phase_num" "$file"
                ;;
            *PLAN.md)
                # For PLAN.md, remove verbose sections
                compress_plan_md "$file"
                ;;
            *)
                # For other files, just truncate if very large
                if should_compress_file "$file" 50; then
                    echo "# File truncated for context - full version: $file"
                    head -c 50000 "$file"
                    echo ""
                    echo "# ... (truncated) ..."
                else
                    cat "$file"
                fi
                ;;
        esac
    else
        cat "$file"
    fi
}

# Report compression savings
report_compression_savings() {
    local original_size="$1"
    local compressed_size="$2"
    
    local savings=$((original_size - compressed_size))
    local percent=$((savings * 100 / original_size))
    
    echo "Context compression: $original_size → $compressed_size chars (-$percent%)" >&2
}
