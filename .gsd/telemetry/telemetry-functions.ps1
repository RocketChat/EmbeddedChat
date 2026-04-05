# Telemetry Helper Functions for GSD Agents (PowerShell)
# Usage: . .gsd\telemetry\telemetry-functions.ps1

$TelemetryDir = ".gsd\telemetry"
$MetricsFile = "$TelemetryDir\metrics.csv"
$SummaryFile = "$TelemetryDir\phase-summary.csv"
$LogDir = "$TelemetryDir\logs"

# Initialize telemetry for agent execution
function Start-Telemetry {
    param(
        [string]$PhaseNum,
        [string]$PhaseName,
        [string]$PlanId,
        [string]$AgentType,
        [int]$WaveNum = 1,
        [int]$ConcurrentCount = 1
    )
    
    # Store start time
    $startTime = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $startTime | Out-File "$TelemetryDir\.temp_start_$PlanId" -NoNewline
    
    # Store execution context
    @"
phase_num=$PhaseNum
phase_name=$PhaseName
plan_id=$PlanId
agent_type=$AgentType
wave_num=$WaveNum
concurrent_count=$ConcurrentCount
"@ | Out-File "$TelemetryDir\.temp_context_$PlanId"
    
    # Log start
    $timestamp = Get-Date -Format "o"
    "[$timestamp] START: $AgentType executing $PlanId (Wave $WaveNum)" | 
        Add-Content "$LogDir\execution.log"
}

# End telemetry and record metrics
function Stop-Telemetry {
    param(
        [string]$PlanId,
        [int]$TokensUsed,
        [string]$ModelUsed,
        [bool]$Success,
        [string]$ErrorMsg = ""
    )
    
    # Calculate duration
    $startTime = Get-Content "$TelemetryDir\.temp_start_$PlanId" -ErrorAction SilentlyContinue
    if (!$startTime) { $startTime = 0 }
    $endTime = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $duration = $endTime - $startTime
    
    # Load context
    $context = @{}
    if (Test-Path "$TelemetryDir\.temp_context_$PlanId") {
        Get-Content "$TelemetryDir\.temp_context_$PlanId" | ForEach-Object {
            $key, $value = $_ -split '=', 2
            $context[$key] = $value
        }
    }
    
    # Clean error message
    $ErrorMsg = $ErrorMsg -replace ',', ';' -replace '"', "'"
    if ($ErrorMsg.Length -gt 200) {
        $ErrorMsg = $ErrorMsg.Substring(0, 200)
    }
    
    # Record metric
    $timestamp = Get-Date -Format "o"
    $phaseNum = $context['phase_num']
    $phaseName = $context['phase_name']
    $agentType = $context['agent_type']
    $waveNum = $context['wave_num']
    $concurrentCount = $context['concurrent_count']
    
    "$timestamp,$phaseNum,$phaseName,$PlanId,$agentType,$duration,$TokensUsed,$ModelUsed,$Success,`"$ErrorMsg`",$waveNum,$concurrentCount" |
        Add-Content $MetricsFile
    
    # Log end
    $timestamp = Get-Date -Format "o"
    "[$timestamp] END: $agentType completed $PlanId in ${duration}s ($TokensUsed tokens, $ModelUsed, success=$Success)" |
        Add-Content "$LogDir\execution.log"
    
    # Cleanup temp files
    Remove-Item "$TelemetryDir\.temp_start_$PlanId" -ErrorAction SilentlyContinue
    Remove-Item "$TelemetryDir\.temp_context_$PlanId" -ErrorAction SilentlyContinue
}

# Estimate tokens from text length
function Get-TokenEstimate {
    param([string]$Text)
    
    $charCount = $Text.Length
    # Rough estimate: ~4 characters per token
    return [math]::Floor($charCount / 4)
}

# Record phase-level summary
function Add-PhaseSummary {
    param(
        [string]$PhaseNum,
        [string]$PhaseName,
        [int]$TotalPlans,
        [int]$CompletedPlans,
        [decimal]$TotalDurationMin,
        [int]$TotalTokens,
        [string]$OptimizationVersion = "baseline"
    )
    
    # Calculate derived metrics
    $avgTokensPerPlan = [math]::Floor($TotalTokens / $TotalPlans)
    $successRate = [math]::Round(($CompletedPlans / $TotalPlans) * 100, 2)
    
    # Estimate cost (using average rates)
    # Weighted average: ~$0.015/1K tokens (assuming mostly Sonnet)
    $estimatedCost = [math]::Round(($TotalTokens / 1000) * 0.015, 2)
    
    # Calculate parallel efficiency (placeholder)
    $parallelEfficiency = 50.0  # TODO: Calculate from wave timing data
    
    # Record summary
    $timestamp = Get-Date -Format "o"
    "$timestamp,$PhaseNum,$PhaseName,$TotalPlans,$CompletedPlans,$TotalDurationMin,$TotalTokens,$avgTokensPerPlan,$estimatedCost,$successRate,$parallelEfficiency,$OptimizationVersion" |
        Add-Content $SummaryFile
    
    # Log summary
    @"

=== Phase $PhaseNum Summary ===
Phase: $PhaseName
Plans: $CompletedPlans/$TotalPlans completed
Duration: $TotalDurationMin minutes
Tokens: $TotalTokens (avg: $avgTokensPerPlan/plan)
Cost: `$$estimatedCost USD
Success Rate: $successRate%
Version: $OptimizationVersion
===========================

"@ | Add-Content "$LogDir\execution.log"
}

# Get current optimization version from config
function Get-OptimizationVersion {
    if (Test-Path ".gsd\config.json") {
        $config = Get-Content ".gsd\config.json" -Raw | ConvertFrom-Json
        if ($config.optimization_version) {
            return $config.optimization_version
        }
    }
    return "baseline"
}

# Print telemetry status
function Show-TelemetryStatus {
    Write-Host "📊 Telemetry Status" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    $metricsCount = (Get-Content $MetricsFile -ErrorAction SilentlyContinue | Measure-Object -Line).Lines - 1
    if ($metricsCount -lt 0) { $metricsCount = 0 }
    
    $summaryCount = (Get-Content $SummaryFile -ErrorAction SilentlyContinue | Measure-Object -Line).Lines - 1
    if ($summaryCount -lt 0) { $summaryCount = 0 }
    
    Write-Host "Agent Executions Logged: $metricsCount"
    Write-Host "Phases Completed: $summaryCount"
    Write-Host "Telemetry Directory: $TelemetryDir"
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}
