# 🎙️ SpeakWise AI — English Speaking Practice App

An AI-powered English conversation practice app built with React Native + Expo.

## Features

- 🎤 **Voice Recording** — Press and hold to record, auto-transcribes with OpenAI Whisper
- 🤖 **AI Conversation** — Claude claude-sonnet-4-20250514 for natural, level-appropriate dialogue
- 🔊 **Text-to-Speech** — AI responses read aloud automatically via expo-speech
- ✏️ **Grammar Corrections** — Every response includes specific grammar/vocabulary feedback
- 🎯 **Personalized** — Adapts to your level (Beginner/Intermediate/Advanced), goal & topics

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up API Keys

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:
```
OPENAI_API_KEY=sk-...          # For Whisper speech-to-text
CLAUDE_API_KEY=sk-ant-...      # For AI conversation
```

- Get OpenAI key: https://platform.openai.com/api-keys
- Get Claude key: https://console.anthropic.com/

### 3. Start the app

```bash
npx expo start
```

Scan the QR code with **Expo Go** (iOS App Store / Google Play).

## App Flow

```
First Launch:
  Onboarding → Select Level / Goal / Topics → Chat

Return Visits:
  Chat (settings loaded from device storage)

Navigation:
  Chat ⚙️ → Settings (update level/goal/topics anytime)
```

## Architecture

```
src/
├── screens/
│   ├── OnboardingScreen.js   # First-launch personalization
│   ├── ChatScreen.js         # Main conversation UI
│   └── SettingsScreen.js     # Update preferences
├── components/
│   ├── RecordButton.js       # Press-and-hold mic button
│   ├── MessageBubble.js      # Chat message display
│   ├── CorrectionCard.js     # Grammar feedback card
│   └── TypingIndicator.js    # AI thinking animation
├── services/
│   ├── whisperService.js     # OpenAI Whisper API
│   └── claudeService.js      # Anthropic Claude API
└── utils/
    └── storage.js            # AsyncStorage helpers
```

## How Corrections Work

After each user message, Claude responds in JSON format:

```json
{
  "response": "Natural conversational reply",
  "corrections": [
    {
      "original": "I go to Paris last year",
      "corrected": "I went to Paris last year",
      "explanation": "Use past tense for completed actions"
    }
  ]
}
```

If no mistakes: `"corrections": []` → shows "Great job, no mistakes! ✅"

## Tech Stack

| Tech | Purpose |
|------|---------|
| React Native + Expo | Cross-platform mobile app |
| expo-av | Audio recording |
| OpenAI Whisper API | Speech-to-text transcription |
| Anthropic Claude claude-sonnet-4-20250514 | AI conversation + corrections |
| expo-speech | Text-to-speech playback |
| AsyncStorage | Local settings persistence |
| React Navigation | Screen routing |