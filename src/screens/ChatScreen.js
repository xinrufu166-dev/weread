import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CorrectionCard from '../components/CorrectionCard';
import MessageBubble from '../components/MessageBubble';
import RecordButton from '../components/RecordButton';
import TypingIndicator from '../components/TypingIndicator';
import { sendMessage } from '../services/claudeService';
import { transcribeAudio } from '../services/whisperService';
import { loadSettings } from '../utils/storage';

// Audio recording configuration for Whisper compatibility
const RECORDING_OPTIONS = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

export default function ChatScreen({ navigation, route }) {
  const [settings, setSettings] = useState(route.params?.settings || null);
  const [messages, setMessages] = useState([]); // {role, content, timestamp, corrections?}
  const [history, setHistory] = useState([]); // Claude API format [{role, content}]
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recordingRef = useRef(null);
  const scrollViewRef = useRef(null);

  // Load settings if not passed via params
  useEffect(() => {
    async function init() {
      if (!settings) {
        const saved = await loadSettings();
        setSettings(saved);
      }
    }
    init();
  }, []);

  // Request audio permissions on mount
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Microphone Permission',
          'SpeakWise AI needs microphone access to record your speech. Please enable it in Settings.',
          [{ text: 'OK' }]
        );
      }
    }
    requestPermissions();
  }, []);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isProcessing]);

  // Welcome message
  useEffect(() => {
    if (settings) {
      const welcome = {
        role: 'assistant',
        content: `Hi! I'm SpeakWise, your English conversation coach 👋\n\nI see you're a ${settings.level.toLowerCase()} learner focused on ${settings.goal.toLowerCase()}. I'll tailor our conversation to your level and interests.\n\nPress and hold the mic button to start speaking. I'll chat with you and give feedback on any mistakes. Let's go! 🚀`,
        timestamp: new Date(),
        corrections: null,
      };
      setMessages([welcome]);
    }
  }, [settings]);

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Start recording error:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  }

  async function stopRecordingAndProcess() {
    if (!recordingRef.current) return;

    setIsRecording(false);
    setIsProcessing(true);

    try {
      // Stop and get recording URI
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      // Reset audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      if (!uri) {
        throw new Error('No audio recorded. Please try again.');
      }

      // Step 1: Transcribe with Whisper
      const transcription = await transcribeAudio(uri);

      // Add user message to display
      const userMessage = {
        role: 'user',
        content: transcription,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Step 2: Send to Claude
      const updatedHistory = [...history];
      const result = await sendMessage(transcription, updatedHistory, settings);

      // Step 3: Update conversation history for next turn
      setHistory((prev) => [
        ...prev,
        { role: 'user', content: transcription },
        { role: 'assistant', content: result.response },
      ]);

      // Step 4: Add AI response to display
      const aiMessage = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        corrections: result.corrections || [],
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Step 5: Speak the response
      await speakText(result.response);
    } catch (error) {
      console.error('Processing error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `⚠️ ${error.message || 'Something went wrong. Please try again.'}`,
        timestamp: new Date(),
        corrections: null,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }

  async function speakText(text) {
    // Stop any current speech
    Speech.stop();
    setIsSpeaking(true);

    return new Promise((resolve) => {
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          setIsSpeaking(false);
          resolve();
        },
        onError: () => {
          setIsSpeaking(false);
          resolve();
        },
        onStopped: () => {
          setIsSpeaking(false);
          resolve();
        },
      });
    });
  }

  function stopSpeaking() {
    Speech.stop();
    setIsSpeaking(false);
  }

  const getLevelColor = () => {
    if (!settings) return '#4A90D9';
    const colors = { Beginner: '#48BB78', Intermediate: '#4A90D9', Advanced: '#9F7AEA' };
    return colors[settings.level] || '#4A90D9';
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>SpeakWise AI</Text>
          {settings && (
            <View style={styles.badge}>
              <View style={[styles.badgeDot, { backgroundColor: getLevelColor() }]} />
              <Text style={styles.badgeText}>
                {settings.level} · {settings.goal}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          {isSpeaking && (
            <TouchableOpacity style={styles.stopSpeakBtn} onPress={stopSpeaking}>
              <Text style={styles.stopSpeakText}>🔇 Mute</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings', { settings, onSave: setSettings })}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <View key={index}>
              <MessageBubble message={msg} />
              {/* Show correction card below AI messages */}
              {msg.role === 'assistant' && msg.corrections !== null && (
                <CorrectionCard corrections={msg.corrections} />
              )}
            </View>
          ))}

          {/* Typing indicator */}
          {isProcessing && <TypingIndicator />}
        </ScrollView>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          {isSpeaking && (
            <View style={styles.speakingBanner}>
              <Text style={styles.speakingText}>🔊 AI is speaking...</Text>
            </View>
          )}
          <RecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onPressIn={startRecording}
            onPressOut={stopRecordingAndProcess}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
    letterSpacing: -0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgeText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopSpeakBtn: {
    backgroundColor: '#FED7D7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stopSpeakText: {
    fontSize: 12,
    color: '#C53030',
    fontWeight: '600',
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 16,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 8,
  },
  speakingBanner: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 0,
  },
  speakingText: {
    fontSize: 12,
    color: '#4A90D9',
    fontWeight: '500',
  },
});
