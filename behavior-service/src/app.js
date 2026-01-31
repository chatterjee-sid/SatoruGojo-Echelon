const express = require('express');
const cors = require('cors');
require('dotenv').config();
const behaviorRoutes = require('./routes/behavior');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', behaviorRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'behavior-analysis' });
});

app.listen(PORT, () => {
    console.log(`Behavioral Analysis Service running on port ${PORT}`);
});
