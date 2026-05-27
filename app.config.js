import 'dotenv/config';

export default {
  expo: {
    name: 'SpeakWise AI',
    slug: 'speakwise-ai',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#4A90D9',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      infoPlist: {
        NSMicrophoneUsageDescription:
          'SpeakWise AI needs microphone access to record your speech for English practice.',
        NSSpeechRecognitionUsageDescription:
          'SpeakWise AI uses speech recognition to transcribe your English practice sessions.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#4A90D9',
      },
      permissions: ['RECORD_AUDIO'],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      claudeApiKey: process.env.CLAUDE_API_KEY || '',
      openaiApiKey: process.env.OPENAI_API_KEY || '',
    },
  },
};
