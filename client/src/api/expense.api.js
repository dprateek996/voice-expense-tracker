import apiClient from './axios.config';

const buildApiError = (error, fallbackMessage) => {
  const message = error?.response?.data?.error || fallbackMessage;
  const apiError = new Error(message);
  apiError.status = error?.response?.status || 500;
  apiError.code = error?.response?.data?.error_code || 'REQUEST_FAILED';
  apiError.details = error?.response?.data?.details || null;
  return apiError;
};

const expenseApi = {
  addFromVoice: async (transcript) => {
    try {
      const { data } = await apiClient.post('/expense/voice', { transcript });
      return data;
    } catch (error) {
      throw buildApiError(error, 'Failed to add expense');
    }
  },

  transcribeAudio: async (audioBlob, fallbackTranscript = '', languageCode = 'unknown') => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, `voice-${Date.now()}.webm`);
      if (fallbackTranscript?.trim()) {
        formData.append('fallback_transcript', fallbackTranscript.trim());
      }
      formData.append('language_code', languageCode);

      const { data } = await apiClient.post('/expense/transcribe', formData);
      return data;
    } catch (error) {
      throw buildApiError(error, 'Failed to transcribe audio');
    }
  },

  getAll: async () => {
    try {
      const { data } = await apiClient.get('/expense');
      return data;
    } catch (error) {
      throw buildApiError(error, 'Failed to fetch expenses');
    }
  }
};

export { expenseApi };
export default expenseApi;
