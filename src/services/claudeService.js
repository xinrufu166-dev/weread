import Constants from 'expo-constants';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_HISTORY = 10; // Keep last 10 exchanges to avoid token limits

/**
 * Build system prompt based on user's personalization settings
 */
function buildSystemPrompt(settings) {
  const { level, goal, topics } = settings;
  const topicList = Array.isArray(topics) ? topics.join(', ') : topics;

  return `You are SpeakWise, a friendly and encouraging English conversation practice partner.

Student Profile:
- English Level: ${level}
- Practice Goal: ${goal}
- Preferred Topics: ${topicList}

Your conversation style:
- Match complexity to the student's level (${level}):
  * Beginner: simple vocabulary, short sentences, slow pace
  * Intermediate: natural speech, some idioms, moderate complexity
  * Advanced: rich vocabulary, complex grammar, idiomatic expressions
- Focus conversations on ${goal} scenarios
- Naturally weave in topics related to ${topicList} when appropriate
- Be warm, patient, and encouraging
- Keep responses conversational and concise (2-4 sentences)

CRITICAL: You MUST always respond with valid JSON in this exact format:
{
  "response": "Your conversational reply here",
  "corrections": [
    {
      "original": "exact phrase the student said incorrectly",
      "corrected": "the correct version",
      "explanation": "brief, friendly explanation (max 15 words)"
    }
  ]
}

Grammar correction rules:
- Only correct errors that actually appeared in the student's message
- Be specific: quote the exact incorrect phrase
- If the message has NO errors, return: "corrections": []
- Focus on grammar and vocabulary errors, not pronunciation
- Be encouraging in explanations

Example with no errors:
{
  "response": "That's great! I love traveling too. What's your favorite destination?",
  "corrections": []
}

Example with errors:
{
  "response": "Nice! Paris is beautiful. When did you visit?",
  "corrections": [
    {
      "original": "I go to Paris last year",
      "corrected": "I went to Paris last year",
      "explanation": "Use past tense 'went' for completed past actions"
    }
  ]
}`;
}

/**
 * Send message to Claude API and get AI response with corrections
 * @param {string} userMessage - The transcribed user speech
 * @param {Array} conversationHistory - Previous messages [{role, content}]
 * @param {Object} settings - User personalization settings
 * @returns {Promise<{response: string, corrections: Array}>}
 */
export async function sendMessage(userMessage, conversationHistory, settings) {
  const apiKey = Constants.expoConfig?.extra?.claudeApiKey;

  if (!apiKey) {
    throw new Error('Claude API key is not configured. Please add CLAUDE_API_KEY to your .env file.');
  }

  // Trim history to avoid token overflow
  const trimmedHistory = conversationHistory.slice(-MAX_HISTORY * 2);

  const messages = [
    ...trimmedHistory,
    { role: 'user', content: userMessage },
  ];

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(settings),
      messages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Claude API error: ${message}`);
  }

  const data = await response.json();
  const rawContent = data.content?.[0]?.text || '';

  return parseClaudeResponse(rawContent);
}

/**
 * Robustly parse Claude's JSON response with fallback
 */
function parseClaudeResponse(content) {
  try {
    // Try direct parse first
    return JSON.parse(content);
  } catch {
    // Try to extract JSON from response (handles markdown code blocks etc.)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // fall through
      }
    }
  }

  // Final fallback: treat entire content as plain response
  return {
    response: content || "I'm sorry, I couldn't process that. Please try again.",
    corrections: [],
  };
}
