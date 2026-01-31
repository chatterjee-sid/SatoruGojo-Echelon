const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001/api/analyze-behavior';
const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_DIR = path.join(__dirname, 'output');

async function processFiles() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    const files = fs.readdirSync(INPUT_DIR).filter(file => file.endsWith('.json'));

    console.log(`🚀 Starting Bulk Behavioral Analysis... Found ${files.length} files.\n`);

    for (const file of files) {
        const filePath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, `result-${file}`);

        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const scenario = JSON.parse(fileContent);

            const response = await axios.post(API_URL, { events: scenario.events });
            const result = response.data;

            fs.writeFileSync(outputPath, JSON.stringify(result, null, 4));

            console.log(`✅ Processed: ${file}`);
            console.log(`   Score: ${result.behaviorScore}`);
            console.log(`   Flags: ${result.flags.length > 0 ? result.flags.join(', ') : 'None'}`);
            console.log(`   Result saved to: output/result-${file}\n`);
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.response ? error.response.data : error.message);
        }
    }

    console.log('✨ Bulk processing complete.');
}

processFiles();
