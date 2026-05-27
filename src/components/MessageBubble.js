import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Chat message bubble
 * Props:
 *   message: { role: 'user'|'assistant', content: string, timestamp: Date }
 */
export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAssistant]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>
          {message.content}
        </Text>
        <Text style={[styles.time, isUser ? styles.timeUser : styles.timeAssistant]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {isUser && (
        <View style={[styles.avatar, styles.avatarUser]}>
          <Text style={styles.avatarText}>You</Text>
        </View>
      )}
    </View>
  );
}

function formatTime(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  wrapperUser: {
    justifyContent: 'flex-end',
  },
  wrapperAssistant: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    flexShrink: 0,
  },
  avatarUser: {
    backgroundColor: '#48BB78',
  },
  avatarText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: '#4A90D9',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: '#FFFFFF',
  },
  textAssistant: {
    color: '#2D3748',
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  timeUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  timeAssistant: {
    color: '#A0AEC0',
  },
});
