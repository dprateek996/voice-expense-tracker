const { refineTranscriptWithSarvam } = require('./sarvam.service');

const refineTranscript = async (transcript) => refineTranscriptWithSarvam(transcript);

module.exports = { refineTranscript };
