import apiClient from './axios.config';

const buildApiError = (error, fallbackMessage) => {
  const message = error?.response?.data?.error || fallbackMessage;
  const apiError = new Error(message);
  apiError.status = error?.response?.status || 500;
  apiError.code = error?.response?.data?.error_code || 'REQUEST_FAILED';
  apiError.details = error?.response?.data?.details || null;
  apiError.responseData = error?.response?.data || null;
  return apiError;
};

const expenseApi = {
  addFromVoice: async (transcript, options = {}) => {
    try {
      const payload = {
        transcript,
        ...(options.forceSave ? { forceSave: true } : {}),
        ...(options.draft ? { draft: options.draft } : {}),
      };
      const { data } = await apiClient.post('/expense/voice', payload);
      return data;
    } catch (error) {
      throw buildApiError(error, 'Failed to add expense');
    }
  },

  previewFromVoice: async (transcript) => {
    try {
      const { data } = await apiClient.post('/expense/voice/preview', { transcript });
      return data;
    } catch (error) {
      throw buildApiError(error, 'Failed to preview expense parse');
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
  },

  deleteExpense: async (id) => {
    try {
      const { data } = await apiClient.delete(`/expense/${id}`);
      return data;
    } catch (error) {
      throw buildApiError(error, 'Failed to delete expense');
    }
  },

  updateExpense: async (id, updates) => {
    try {
      const { data } = await apiClient.put(`/expense/${id}`, updates);
      return data;
    } catch (error) {
      throw buildApiError(error, 'Failed to update expense');
    }
  },
};

export { expenseApi };
export default expenseApi;
