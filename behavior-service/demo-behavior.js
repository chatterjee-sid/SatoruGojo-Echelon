const axios = require('axios');

const API_URL = 'http://localhost:3001/api/analyze-behavior';

const scenarios = [
    {
        name: '✅ Healthy Human Interaction',
        events: [
            { type: 'keydown', fieldId: 'fullName', timestamp: 1000 },
            { type: 'keyup', fieldId: 'fullName', timestamp: 1100 },
            { type: 'keydown', fieldId: 'fullName', timestamp: 1350 },
            { type: 'keyup', fieldId: 'fullName', timestamp: 1480 },
            { type: 'keydown', fieldId: 'fullName', timestamp: 1700 }, // Natural variance
            { type: 'keyup', fieldId: 'fullName', timestamp: 1850 },
            { type: 'keydown', fieldId: 'email', timestamp: 2500 },
            { type: 'keyup', fieldId: 'email', timestamp: 2620 }
        ]
    },
    {
        name: '🤖 Bot Detection: Regular Typing (Low Variance)',
        events: [
            { type: 'keydown', fieldId: 'fullName', timestamp: 1000 },
            { type: 'keyup', fieldId: 'fullName', timestamp: 1100 },
            { type: 'keydown', fieldId: 'fullName', timestamp: 1200 },
            { type: 'keyup', fieldId: 'fullName', timestamp: 1300 },
            { type: 'keydown', fieldId: 'fullName', timestamp: 1400 }, // Exactly 100ms apart
            { type: 'keyup', fieldId: 'fullName', timestamp: 1500 }
        ]
    },
    {
        name: '🔀 Bot Detection: Suspicious Navigation',
        events: [
            { type: 'keydown', fieldId: 'fullName', timestamp: 1000 },
            { type: 'keyup', fieldId: 'fullName', timestamp: 1100 },
            { type: 'keydown', fieldId: 'ssn', timestamp: 1500 }, // Skipped 'email' and 'phone'
            { type: 'keyup', fieldId: 'ssn', timestamp: 1600 }
        ]
    },
    {
        name: '📋 Warning: PII Paste Detected',
        events: [
            { type: 'keydown', fieldId: 'fullName', timestamp: 1000 },
            { type: 'keyup', fieldId: 'fullName', timestamp: 1100 },
            { type: 'paste', fieldId: 'ssn', timestamp: 2000 } // Pasting sensitive info
        ]
    }
];

async function runDemo() {
    console.log('🚀 Starting Behavioral Analysis Demo...\n');

    for (const scenario of scenarios) {
        try {
            const response = await axios.post(API_URL, { events: scenario.events });
            const { behaviorScore, flags } = response.data;

            console.log(`Scenario: ${scenario.name}`);
            console.log(`Score: ${behaviorScore}`);
            console.log(`Flags: ${flags.length > 0 ? flags.join(', ') : 'None'}`);
            console.log('-'.repeat(40));
        } catch (error) {
            console.error(`❌ Error in ${scenario.name}:`, error.response ? error.response.data : error.message);
        }
    }
}

runDemo();
