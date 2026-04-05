#!/bin/bash
# Agent Result Caching for GSD System
# Source: source .gsd/telemetry/result-cache.sh

CACHE_DIR=".gsd/cache"
CACHE_ENABLED=$(cat .gsd/config.json 2>/dev/null | grep -o '"caching"[^}]*"enabled"[[:space:]]*:[[:space:]]*true' >/dev/null && echo "true" || echo "false")

# Initialize cache directory
init_cache() {
    mkdir -p "$CACHE_DIR/verification"
    mkdir -p "$CACHE_DIR/research"
    mkdir -p "$CACHE_DIR/discovery"
}

# Generate cache key from content hash
get_cache_key() {
    local content="$1"
    local prefix="$2"
    
    # Generate SHA-256 hash of content
    local hash=$(echo "$content" | sha256sum | cut -d' ' -f1 | head -c 16)
    echo "${prefix}_${hash}"
}

# Check if cache entry is valid (not expired)
is_cache_valid() {
    local cache_file="$1"
    local ttl_hours="${2:-24}"  # Default 24 hours
    
    if [ ! -f "$cache_file" ]; then
        return 1
    fi
    
    # Check file age
    local file_age_sec=$(( $(date +%s) - $(stat -c %Y "$cache_file" 2>/dev/null || stat -f %m "$cache_file" 2>/dev/null) ))
    local ttl_sec=$((ttl_hours * 3600))
    
    [ "$file_age_sec" -lt "$ttl_sec" ]
}

# Check if code has changed since cache was created
has_code_changed() {
    local cache_file="$1"
    local monitored_paths="$2"  # Comma-separated paths to monitor
    
    if [ ! -f "$cache_file" ]; then
        return 0  # No cache file = assume changed
    fi
    
    # Get cache timestamp
    local cache_time=$(stat -c %Y "$cache_file" 2>/dev/null || stat -f %m "$cache_file" 2>/dev/null)
    
    # Check if any monitored files changed after cache
    IFS=',' read -ra PATHS <<< "$monitored_paths"
    for path in "${PATHS[@]}"; do
        if [ -f "$path" ]; then
            local file_time=$(stat -c %Y "$path" 2>/dev/null || stat -f %m "$path" 2>/dev/null)
            if [ "$file_time" -gt "$cache_time" ]; then
                return 0  # Code changed
            fi
        elif [ -d "$path" ]; then
            # Check directory for any recent changes
            local latest=$(find "$path" -type f -newer "$cache_file" 2>/dev/null | head -1)
            if [ -n "$latest" ]; then
                return 0  # Code changed
            fi
        fi
    done
    
    return 1  # No changes detected
}

# Cache verification result
cache_verification() {
    local phase_num="$1"
    local component="$2"
    local result_file="$3"
    
    if [ "$CACHE_ENABLED" != "true" ]; then
        return 0
    fi
    
    init_cache
    
    local cache_key=$(get_cache_key "${phase_num}_${component}" "verify")
    local cache_file="$CACHE_DIR/verification/${cache_key}.md"
    
    cp "$result_file" "$cache_file"
    
    # Store metadata
    cat > "${cache_file}.meta" <<EOF
phase=$phase_num
component=$component
timestamp=$(date -Iseconds)
source=$result_file
EOF
    
    echo "Cached verification: $component" >&2
}

# Get cached verification result
get_cached_verification() {
    local phase_num="$1"
    local component="$2"
    local monitored_paths="$3"
    
    if [ "$CACHE_ENABLED" != "true" ]; then
        return 1
    fi
    
    local cache_key=$(get_cache_key "${phase_num}_${component}" "verify")
    local cache_file="$CACHE_DIR/verification/${cache_key}.md"
    
    # Check if cache exists and is valid
    if ! is_cache_valid "$cache_file" 24; then
        return 1
    fi
    
    # Check if code changed
    if has_code_changed "$cache_file" "$monitored_paths"; then
        echo "Cache invalidated: code changed" >&2
        return 1
    fi
    
    # Return cached result
    cat "$cache_file"
    echo "Used cached verification: $component" >&2
    return 0
}

# Cache research output
cache_research() {
    local topic="$1"
    local result_file="$2"
    
    if [ "$CACHE_ENABLED" != "true" ]; then
        return 0
    fi
    
    init_cache
    
    local cache_key=$(get_cache_key "$topic" "research")
    local cache_file="$CACHE_DIR/research/${cache_key}.md"
    
    cp "$result_file" "$cache_file"
    
    # Store metadata
    cat > "${cache_file}.meta" <<EOF
topic=$topic
timestamp=$(date -Iseconds)
source=$result_file
EOF
    
    echo "Cached research: $topic" >&2
}

# Get cached research output
get_cached_research() {
    local topic="$1"
    local ttl_hours="${2:-168}"  # Default 7 days for research
    
    if [ "$CACHE_ENABLED" != "true" ]; then
        return 1
    fi
    
    local cache_key=$(get_cache_key "$topic" "research")
    local cache_file="$CACHE_DIR/research/${cache_key}.md"
    
    # Check if cache exists and is valid
    if ! is_cache_valid "$cache_file" "$ttl_hours"; then
        return 1
    fi
    
    # Return cached result
    cat "$cache_file"
    echo "Used cached research: $topic" >&2
    return 0
}

# Cache discovery output
cache_discovery() {
    local scope="$1"
    local result_file="$2"
    
    if [ "$CACHE_ENABLED" != "true" ]; then
        return 0
    fi
    
    init_cache
    
    local cache_key=$(get_cache_key "$scope" "discovery")
    local cache_file="$CACHE_DIR/discovery/${cache_key}.md"
    
    cp "$result_file" "$cache_file"
    
    # Store metadata
    cat > "${cache_file}.meta" <<EOF
scope=$scope
timestamp=$(date -Iseconds)
source=$result_file
EOF
    
    echo "Cached discovery: $scope" >&2
}

# Get cached discovery output
get_cached_discovery() {
    local scope="$1"
    local monitored_paths="$2"
    
    if [ "$CACHE_ENABLED" != "true" ]; then
        return 1
    fi
    
    local cache_key=$(get_cache_key "$scope" "discovery")
    local cache_file="$CACHE_DIR/discovery/${cache_key}.md"
    
    # Check if cache exists and is valid
    if ! is_cache_valid "$cache_file" 72; then  # 3 days TTL
        return 1
    fi
    
    # Check if code changed
    if has_code_changed "$cache_file" "$monitored_paths"; then
        echo "Cache invalidated: code changed" >&2
        return 1
    fi
    
    # Return cached result
    cat "$cache_file"
    echo "Used cached discovery: $scope" >&2
    return 0
}

# Clear expired cache entries
cleanup_cache() {
    if [ "$CACHE_ENABLED" != "true" ]; then
        return 0
    fi
    
    local cleaned=0
    
    # Remove entries older than TTL
    find "$CACHE_DIR" -name "*.md" -type f -mtime +7 -delete 2>/dev/null && cleaned=1
    find "$CACHE_DIR" -name "*.meta" -type f -mtime +7 -delete 2>/dev/null
    
    if [ "$cleaned" -eq 1 ]; then
        echo "Cleaned expired cache entries" >&2
    fi
}

# Clear all cache
clear_cache() {
    if [ -d "$CACHE_DIR" ]; then
        rm -rf "$CACHE_DIR"
        echo "Cache cleared" >&2
    fi
}

# Show cache statistics
cache_stats() {
    if [ ! -d "$CACHE_DIR" ]; then
        echo "Cache: empty"
        return 0
    fi
    
    local verify_count=$(find "$CACHE_DIR/verification" -name "*.md" 2>/dev/null | wc -l)
    local research_count=$(find "$CACHE_DIR/research" -name "*.md" 2>/dev/null | wc -l)
    local discovery_count=$(find "$CACHE_DIR/discovery" -name "*.md" 2>/dev/null | wc -l)
    local total=$((verify_count + research_count + discovery_count))
    
    echo "Cache Statistics:"
    echo "  Verification: $verify_count"
    echo "  Research: $research_count"
    echo "  Discovery: $discovery_count"
    echo "  Total: $total entries"
    
    if [ "$total" -gt 0 ]; then
        local cache_size=$(du -sh "$CACHE_DIR" 2>/dev/null | cut -f1)
        echo "  Size: $cache_size"
    fi
}
