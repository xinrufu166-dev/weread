import Constants from 'expo-constants';

const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

/**
 * Transcribes audio using OpenAI Whisper API
 * @param {string} audioUri - Local URI of the recorded audio file
 * @returns {Promise<string>} - Transcribed text
 */
export async function transcribeAudio(audioUri) {
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey;

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.');
  }

  // Build multipart form data
  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  });
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Whisper API error: ${message}`);
  }

  const data = await response.json();
  const text = data.text?.trim();

  if (!text) {
    throw new Error("Couldn't understand the audio. Please try speaking more clearly.");
  }

  return text;
}
