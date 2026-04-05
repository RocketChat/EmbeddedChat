# GSD Telemetry Report Generator (PowerShell)
# Usage: pwsh .gsd\telemetry\report.ps1

$TelemetryDir = ".gsd\telemetry"
$MetricsFile = "$TelemetryDir\metrics.csv"
$SummaryFile = "$TelemetryDir\phase-summary.csv"

# Parse CSV file
function Import-TelemetryCSV {
    param([string]$Path)
    
    if (!(Test-Path $Path)) {
        return @()
    }
    
    $data = Import-Csv $Path
    return $data
}

# Calculate statistics
function Get-Stats {
    param($Metrics)
    
    if ($Metrics.Count -eq 0) { return $null }
    
    $durations = $Metrics | ForEach-Object { [double]$_.duration_sec }
    $tokens = $Metrics | ForEach-Object { [int]$_.tokens_used }
    $successes = ($Metrics | Where-Object { $_.success -eq 'true' -or $_.success -eq 'True' }).Count
    
    return @{
        Count = $Metrics.Count
        AvgDuration = ($durations | Measure-Object -Average).Average
        MaxDuration = ($durations | Measure-Object -Maximum).Maximum
        MinDuration = ($durations | Measure-Object -Minimum).Minimum
        TotalDuration = ($durations | Measure-Object -Sum).Sum
        AvgTokens = ($tokens | Measure-Object -Average).Average
        TotalTokens = ($tokens | Measure-Object -Sum).Sum
        SuccessRate = ($successes / $Metrics.Count) * 100
    }
}

# Generate report
function Show-TelemetryReport {
    Write-Host ""
    Write-Host "📊 GSD Performance Telemetry Report" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    
    # Load data
    $metrics = Import-TelemetryCSV $MetricsFile
    $phaseSummaries = Import-TelemetryCSV $SummaryFile
    
    if ($metrics.Count -eq 0 -and $phaseSummaries.Count -eq 0) {
        Write-Host "⚠️  No telemetry data found. Run some phases first!" -ForegroundColor Yellow
        Write-Host ""
        return
    }
    
    # Overall Stats
    if ($metrics.Count -gt 0) {
        $overall = Get-Stats $metrics
        Write-Host "## Overall Metrics" -ForegroundColor Green
        Write-Host ""
        Write-Host "Total Agent Executions: $($overall.Count)"
        Write-Host "Success Rate:           $($overall.SuccessRate.ToString('F1'))%"
        Write-Host "Total Execution Time:   $(($overall.TotalDuration / 60).ToString('F1')) min"
        Write-Host "Average Duration:       $($overall.AvgDuration.ToString('F1'))s per agent"
        Write-Host "Total Tokens Used:      $($overall.TotalTokens.ToString('N0'))"
        Write-Host "Average Tokens:         $([Math]::Round($overall.AvgTokens).ToString('N0')) per agent"
        Write-Host ""
    }
    
    # By Agent Type
    if ($metrics.Count -gt 0) {
        Write-Host "## Performance by Agent Type" -ForegroundColor Green
        Write-Host ""
        
        $byAgent = $metrics | Group-Object agent_type
        
        Write-Host "| Agent Type             | Executions | Avg Duration | Avg Tokens | Success Rate |"
        Write-Host "|------------------------|------------|--------------|------------|--------------|"
        
        foreach ($group in $byAgent) {
            $stats = Get-Stats $group.Group
            $agentType = $group.Name.PadRight(22)
            $count = $stats.Count.ToString().PadLeft(10)
            $duration = ($stats.AvgDuration.ToString('F1') + 's').PadLeft(12)
            $tokens = ([Math]::Round($stats.AvgTokens)).ToString().PadLeft(10)
            $success = ($stats.SuccessRate.ToString('F1') + '%').PadLeft(12)
            
            Write-Host "| $agentType | $count | $duration | $tokens | $success |"
        }
        Write-Host ""
    }
    
    # By Model
    if ($metrics.Count -gt 0) {
        Write-Host "## Usage by Model" -ForegroundColor Green
        Write-Host ""
        
        $byModel = $metrics | Group-Object model_used
        
        Write-Host "| Model  | Executions | Total Tokens | Avg Tokens | Est. Cost |"
        Write-Host "|--------|------------|--------------|------------|-----------|"
        
        $modelCosts = @{
            'opus' = 0.030
            'sonnet' = 0.015
            'haiku' = 0.0025
        }
        
        foreach ($group in $byModel) {
            $stats = Get-Stats $group.Group
            $model = $group.Name.PadRight(6)
            $count = $stats.Count.ToString().PadLeft(10)
            $totalTokens = $stats.TotalTokens.ToString().PadLeft(12)
            $avgTokens = ([Math]::Round($stats.AvgTokens)).ToString().PadLeft(10)
            $cost = (($stats.TotalTokens / 1000) * ($modelCosts[$group.Name] ?? 0.015)).ToString('F2')
            $costStr = ('$' + $cost).PadLeft(9)
            
            Write-Host "| $model | $count | $totalTokens | $avgTokens | $costStr |"
        }
        Write-Host ""
    }
    
    # Phase Summaries
    if ($phaseSummaries.Count -gt 0) {
        Write-Host "## Phase Execution Summary" -ForegroundColor Green
        Write-Host ""
        Write-Host "| Phase | Plans | Duration | Tokens | Cost   | Success | Version  |"
        Write-Host "|-------|-------|----------|--------|--------|---------|----------|"
        
        foreach ($p in $phaseSummaries) {
            $phase = $p.phase_num.PadRight(5)
            $plans = ("$($p.completed_plans)/$($p.total_plans)").PadRight(5)
            $duration = ([double]$p.total_duration_min).ToString('F1') + 'm'
            $duration = $duration.PadLeft(8)
            $tokens = ([int]$p.total_tokens).ToString('N0').PadLeft(6)
            $cost = ('$' + ([double]$p.estimated_cost_usd).ToString('F2')).PadLeft(6)
            $success = ([double]$p.success_rate).ToString('F0') + '%'
            $success = $success.PadLeft(7)
            $version = ($p.optimization_version ?? 'baseline').PadRight(8)
            
            Write-Host "| $phase | $plans | $duration | $tokens | $cost | $success | $version |"
        }
        Write-Host ""
    }
    
    # Recent Failures
    $failures = $metrics | Where-Object { $_.success -eq 'false' -or $_.success -eq 'False' }
    if ($failures.Count -gt 0) {
        Write-Host "## Recent Failures" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "⚠️  $($failures.Count) failed executions:" -ForegroundColor Yellow
        Write-Host ""
        
        $failures | Select-Object -Last 5 | ForEach-Object {
            Write-Host "• $($_.timestamp) - $($_.agent_type) ($($_.plan_id))"
            if ($_.error_msg) {
                $errorMsg = $_.error_msg.Substring(0, [Math]::Min(100, $_.error_msg.Length))
                Write-Host "  Error: $errorMsg" -ForegroundColor DarkGray
            }
        }
        Write-Host ""
    }
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📁 Data: .gsd\telemetry\metrics.csv" -ForegroundColor DarkGray
    Write-Host ""
}

# Run report
Show-TelemetryReport
