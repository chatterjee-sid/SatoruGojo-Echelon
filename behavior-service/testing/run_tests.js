const fs = require('fs');
const path = require('path');
const { analyzeBehavior } = require('../src/services/behaviorService');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

/**
 * Run tests for the behavior service.
 * Iterates over all .json files in the input directory,
 * analyzes the behavior events, and saves the result in the output directory.
 */
const runTests = () => {
    console.log('--- STARTING BEHAVIOR SERVICE TESTS ---\n');

    if (!fs.existsSync(inputDir)) {
        console.error(`Input directory not found: ${inputDir}`);
        return;
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
        console.log('No test files found in input directory.');
        return;
    }

    files.forEach(file => {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file.replace('.json', '_result.json'));

        try {
            const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
            console.log(`Processing: ${file}...`);

            const result = analyzeBehavior(data);

            fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
            console.log(`[PASS] Result saved to: ${path.basename(outputPath)}`);
            if (result.flags.length > 0) {
                console.log(`       Flags: ${result.flags.join(', ')}`);
                console.log(`       Risk Score: ${result.syntheticRiskScore}`);
            } else {
                console.log(`       Status: HEALTHY (Risk Score: ${result.syntheticRiskScore})`);
            }
            console.log('');
        } catch (err) {
            console.error(`[FAIL] Error processing ${file}: ${err.message}\n`);
        }
    });

    console.log('--- BEHAVIOR SERVICE TESTS COMPLETE ---');
};

runTests();
