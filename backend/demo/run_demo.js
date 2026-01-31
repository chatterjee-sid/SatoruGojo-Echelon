const fs = require('fs');
const path = require('path');
const DetectionEngine = require('../services/detectionEngine');

// Paths
const INPUT_FILE = path.join(__dirname, 'input', 'test_cases.json');
const OUTPUT_FILE = path.join(__dirname, 'output', 'results.json');
const SUMMARY_FILE = path.join(__dirname, 'output', 'summary.txt');

// Ensure output directory exists (redundant if already checked, but good practice)
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Initialize Engine
console.log('--- Initializing Detection Engine ---');
const engine = new DetectionEngine();

// Optional: Mock some fraud embeddings or existing data if we wanted to test cross-reference 
// with a pre-existing database. But here we are testing the "batch" capability where 
// the batch itself creates the context (for velocity/density).

// 2. Read Input Data
console.log(`Reading input from: ${INPUT_FILE}`);
if (!fs.existsSync(INPUT_FILE)) {
    console.error('Input file not found!');
    process.exit(1);
}

const inputData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
console.log(`Loaded ${inputData.length} records.`);

// 3. Run Analysis
console.log('--- Running Analysis ---');
const startTime = Date.now();

// We analyze the batch. The engine's analyze() method automatically uses the batch
// to checking for overlaps (velocity/density) within the batch itself.
const results = engine.analyze(inputData);

const duration = Date.now() - startTime;
console.log(`Analysis complete in ${duration}ms.`);

// 4. Generate Output and Summary
console.log('--- Generating Output ---');

const summaryStats = {
    totalRecords: results.length,
    syntheticCount: results.filter(r => r.analysis.isSynthetic).length,
    flagsTriggered: {}
};

// Console Report
console.log('\n=== Analysis Report ===\n');
results.forEach(result => {
    const isFraud = result.analysis.isSynthetic;
    const score = result.analysis.riskScore;
    const reasons = result.analysis.reasons.map(r => `${r.rule} (${r.severity})`).join(', ');

    console.log(`ID: ${result.id}`);
    console.log(`   Result: ${isFraud ? '🚨 SYNTHETIC' : '✅ CLEAN'} (Score: ${score})`);
    if (reasons) {
        console.log(`   Flags:  ${reasons}`);
    }
    console.log('------------------------------------------------');

    // Stats
    result.analysis.reasons.forEach(r => {
        const rule = r.rule.split('(')[0].trim(); // Group loosely
        summaryStats.flagsTriggered[rule] = (summaryStats.flagsTriggered[rule] || 0) + 1;
    });
});

console.log(`\nTotal Records: ${summaryStats.totalRecords}`);
console.log(`Identified Synthetics: ${summaryStats.syntheticCount}`);
console.log(`Analysis saved to: ${OUTPUT_FILE}`);

// Write JSON output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

// Write text summary
const summaryText = `
Detection Demo Summary
======================
Date: ${new Date().toISOString()}
Total Records: ${summaryStats.totalRecords}
Synthetic Detected: ${summaryStats.syntheticCount}

Top Flags:
${Object.entries(summaryStats.flagsTriggered).map(([k, v]) => `- ${k}: ${v}`).join('\n')}
`;
fs.writeFileSync(SUMMARY_FILE, summaryText);

console.log('Demo completed successfully.');
