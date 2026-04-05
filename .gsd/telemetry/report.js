#!/usr/bin/env node
/**
 * GSD Telemetry Report Generator
 * Generates a summary report from telemetry data
 */

const fs = require('fs');
const path = require('path');

const TELEMETRY_DIR = '.gsd/telemetry';
const METRICS_FILE = path.join(TELEMETRY_DIR, 'metrics.csv');
const SUMMARY_FILE = path.join(TELEMETRY_DIR, 'phase-summary.csv');

// Parse CSV file
function parseCSV(filepath) {
    if (!fs.existsSync(filepath)) {
        return [];
    }
    
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.trim().split('\n');
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const obj = {};
        headers.forEach((header, i) => {
            let value = (values[i] || '').trim().replace(/^"|"$/g, '');
            obj[header] = value;
        });
        return obj;
    });
    
    return rows;
}

// Calculate statistics
function calculateStats(metrics) {
    if (metrics.length === 0) return null;
    
    const durations = metrics.map(m => parseFloat(m.duration_sec) || 0);
    const tokens = metrics.map(m => parseInt(m.tokens_used) || 0);
    const successes = metrics.filter(m => m.success === 'true' || m.success === 'True').length;
    
    const sum = arr => arr.reduce((a, b) => a + b, 0);
    const avg = arr => arr.length ? sum(arr) / arr.length : 0;
    const max = arr => arr.length ? Math.max(...arr) : 0;
    const min = arr => arr.length ? Math.min(...arr) : 0;
    
    return {
        count: metrics.length,
        avgDuration: avg(durations),
        maxDuration: max(durations),
        minDuration: min(durations),
        totalDuration: sum(durations),
        avgTokens: avg(tokens),
        totalTokens: sum(tokens),
        successRate: (successes / metrics.length) * 100
    };
}

// Generate report
function generateReport() {
    console.log('\n📊 GSD Performance Telemetry Report');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Load data
    const metrics = parseCSV(METRICS_FILE);
    const phaseSummaries = parseCSV(SUMMARY_FILE);
    
    if (metrics.length === 0 && phaseSummaries.length === 0) {
        console.log('⚠️  No telemetry data found. Run some phases first!\n');
        return;
    }
    
    // Overall Stats
    if (metrics.length > 0) {
        const overall = calculateStats(metrics);
        console.log('## Overall Metrics\n');
        console.log(`Total Agent Executions: ${overall.count}`);
        console.log(`Success Rate:           ${overall.successRate.toFixed(1)}%`);
        console.log(`Total Execution Time:   ${(overall.totalDuration / 60).toFixed(1)} min`);
        console.log(`Average Duration:       ${overall.avgDuration.toFixed(1)}s per agent`);
        console.log(`Total Tokens Used:      ${overall.totalTokens.toLocaleString()}`);
        console.log(`Average Tokens:         ${Math.round(overall.avgTokens).toLocaleString()} per agent\n`);
    }
    
    // By Agent Type
    if (metrics.length > 0) {
        console.log('## Performance by Agent Type\n');
        const byAgent = {};
        metrics.forEach(m => {
            const type = m.agent_type || 'unknown';
            if (!byAgent[type]) byAgent[type] = [];
            byAgent[type].push(m);
        });
        
        console.log('| Agent Type | Executions | Avg Duration | Avg Tokens | Success Rate |');
        console.log('|------------|------------|--------------|------------|--------------|');
        
        Object.entries(byAgent).forEach(([type, data]) => {
            const stats = calculateStats(data);
            console.log(`| ${type.padEnd(22)} | ${String(stats.count).padStart(10)} | ${(stats.avgDuration + 's').padStart(12)} | ${String(Math.round(stats.avgTokens)).padStart(10)} | ${(stats.successRate.toFixed(1) + '%').padStart(12)} |`);
        });
        console.log();
    }
    
    // By Model
    if (metrics.length > 0) {
        console.log('## Usage by Model\n');
        const byModel = {};
        metrics.forEach(m => {
            const model = m.model_used || 'unknown';
            if (!byModel[model]) byModel[model] = [];
            byModel[model].push(m);
        });
        
        console.log('| Model  | Executions | Total Tokens | Avg Tokens | Est. Cost |');
        console.log('|--------|------------|--------------|------------|-----------|');
        
        const modelCosts = {
            'opus': 0.030,
            'sonnet': 0.015,
            'haiku': 0.0025
        };
        
        Object.entries(byModel).forEach(([model, data]) => {
            const stats = calculateStats(data);
            const cost = (stats.totalTokens / 1000) * (modelCosts[model] || 0.015);
            console.log(`| ${model.padEnd(6)} | ${String(stats.count).padStart(10)} | ${String(stats.totalTokens).padStart(12)} | ${String(Math.round(stats.avgTokens)).padStart(10)} | $${cost.toFixed(2).padStart(8)} |`);
        });
        console.log();
    }
    
    // Phase Summaries
    if (phaseSummaries.length > 0) {
        console.log('## Phase Execution Summary\n');
        console.log('| Phase | Plans | Duration | Tokens | Cost | Success | Version |');
        console.log('|-------|-------|----------|--------|------|---------|---------|');
        
        phaseSummaries.forEach(p => {
            const phaseLabel = `${p.phase_num}`;
            const plansLabel = `${p.completed_plans}/${p.total_plans}`;
            const durationLabel = `${parseFloat(p.total_duration_min).toFixed(1)}m`;
            const tokensLabel = parseInt(p.total_tokens).toLocaleString();
            const costLabel = `$${parseFloat(p.estimated_cost_usd).toFixed(2)}`;
            const successLabel = `${parseFloat(p.success_rate).toFixed(0)}%`;
            const versionLabel = p.optimization_version || 'baseline';
            
            console.log(`| ${phaseLabel.padEnd(5)} | ${plansLabel.padEnd(5)} | ${durationLabel.padStart(8)} | ${tokensLabel.padStart(6)} | ${costLabel.padStart(4)} | ${successLabel.padStart(7)} | ${versionLabel.padEnd(7)} |`);
        });
        console.log();
    }
    
    // Recent Failures
    const failures = metrics.filter(m => m.success === 'false' || m.success === 'False');
    if (failures.length > 0) {
        console.log('## Recent Failures\n');
        console.log(`⚠️  ${failures.length} failed executions:\n`);
        
        failures.slice(-5).forEach(f => {
            console.log(`• ${f.timestamp} - ${f.agent_type} (${f.plan_id})`);
            if (f.error_msg) {
                console.log(`  Error: ${f.error_msg.substring(0, 100)}`);
            }
        });
        console.log();
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 Tip: Run with --json for machine-readable output');
    console.log('📁 Data: .gsd/telemetry/metrics.csv\n');
}

// Main
if (require.main === module) {
    generateReport();
}

module.exports = { parseCSV, calculateStats, generateReport };
