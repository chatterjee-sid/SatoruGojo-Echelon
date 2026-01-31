const { std } = require('mathjs');

const FIELD_SEQUENCE = ['fullName', 'email', 'phone', 'ssn'];
const PII_FIELDS = ['fullName', 'ssn'];

const analyzeBehavior = (events) => {
    const flags = [];
    let behaviorScore = 1.0;

    // 1. Typing Rhythm Analysis
    const rhythms = analyzeTypingRhythm(events);
    if (rhythms.isBot) {
        flags.push('Bot_Rhythm');
        behaviorScore -= 0.4;
    } else if (rhythms.isInconsistent) {
        flags.push('Inconsistent_Rhythm');
        behaviorScore -= 0.1;
    }

    // 2. Navigation Flow Analysis
    const navigation = analyzeNavigation(events);
    if (navigation.isSuspicious) {
        flags.push('Bot_Navigation');
        behaviorScore -= 0.3;
    }

    // 3. Paste Detection
    const pastes = detectPastes(events);
    if (pastes.hasPIIPaste) {
        flags.push('PII_Paste_Detected');
        behaviorScore -= 0.2;
    }

    return {
        behaviorScore: Math.max(0, behaviorScore).toFixed(2),
        flags,
        details: {
            rhythms,
            navigation,
            pastes
        }
    };
};

const analyzeTypingRhythm = (events) => {
    const keyEvents = events.filter(e => e.type === 'keydown' || e.type === 'keyup');
    if (keyEvents.length < 4) return { isBot: false, isInconsistent: false };

    const dwells = [];
    const flights = [];
    const downTimes = {};

    for (let i = 0; i < keyEvents.length; i++) {
        const e = keyEvents[i];
        if (e.type === 'keydown') {
            downTimes[e.fieldId] = e.timestamp;
            if (i > 0) {
                flights.push(e.timestamp - keyEvents[i - 1].timestamp);
            }
        } else if (e.type === 'keyup' && downTimes[e.fieldId]) {
            dwells.push(e.timestamp - downTimes[e.fieldId]);
            delete downTimes[e.fieldId];
        }
    }

    if (dwells.length < 2) return { isBot: false, isInconsistent: false };

    const dwellStd = std(dwells);
    const flightStd = flights.length > 1 ? std(flights) : 100;

    // If variance is near zero, it's likely a bot
    const isBot = dwellStd < 5 || flightStd < 5;
    const isInconsistent = dwellStd > 200 || flightStd > 300;

    return { dwellStd, flightStd, isBot, isInconsistent };
};

const analyzeNavigation = (events) => {
    const fieldVisits = events
        .filter(e => e.fieldId)
        .reduce((acc, e) => {
            if (acc.length === 0 || acc[acc.length - 1] !== e.fieldId) {
                acc.push(e.fieldId);
            }
            return acc;
        }, []);

    let isSuspicious = false;
    for (let i = 1; i < fieldVisits.length; i++) {
        const prevIdx = FIELD_SEQUENCE.indexOf(fieldVisits[i - 1]);
        const currIdx = FIELD_SEQUENCE.indexOf(fieldVisits[i]);

        // If they skip fields or go backwards in a way that suggests automated filling
        if (currIdx - prevIdx > 1 || currIdx === -1) {
            isSuspicious = true;
            break;
        }
    }

    return { fieldSequence: fieldVisits, isSuspicious };
};

const detectPastes = (events) => {
    const pasteEvents = events.filter(e => e.type === 'paste');
    const hasPIIPaste = pasteEvents.some(e => PII_FIELDS.includes(e.fieldId));
    return { pasteCount: pasteEvents.length, hasPIIPaste };
};

module.exports = { analyzeBehavior };
