const { refineTranscript } = require('../../services/refine.service');

const getRefinedTranscript = async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required.' });
    }
    try {
        const refinementData = await refineTranscript(transcript);
        res.status(200).json(refinementData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to refine transcript.' });
    }
};

module.exports = { getRefinedTranscript };