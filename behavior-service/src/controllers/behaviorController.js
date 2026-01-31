const behaviorService = require('../services/behaviorService');

exports.analyze = (req, res) => {
    try {
        const { events } = req.body;
        if (!events || !Array.isArray(events)) {
            return res.status(400).json({ error: 'Invalid input. Expected an array of events.' });
        }

        const result = behaviorService.analyzeBehavior(events);
        res.json(result);
    } catch (error) {
        console.error('Error analyzing behavior:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
