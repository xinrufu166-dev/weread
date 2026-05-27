import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * Press-and-hold microphone button for recording
 * Props:
 *   isRecording: bool
 *   isProcessing: bool
 *   onPressIn: function
 *   onPressOut: function
 */
export default function RecordButton({ isRecording, isProcessing, onPressIn, onPressOut }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  useEffect(() => {
    if (isRecording) {
      // Pulsing animation while recording
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.current.start();
    } else {
      if (pulseLoop.current) {
        pulseLoop.current.stop();
      }
      Animated.spring(pulseAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  const buttonColor = isRecording ? '#E53E3E' : isProcessing ? '#718096' : '#4A90D9';
  const label = isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Hold to speak';

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>{label}</Text>

      {/* Outer pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: isRecording ? 'rgba(229,62,62,0.15)' : 'transparent',
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Main button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPressIn={isProcessing ? null : onPressIn}
        onPressOut={isProcessing ? null : onPressOut}
        activeOpacity={0.85}
        disabled={isProcessing}
      >
        <MicIcon isRecording={isRecording} isProcessing={isProcessing} />
      </TouchableOpacity>
    </View>
  );
}

// Simple SVG-like mic icon using View elements
function MicIcon({ isRecording, isProcessing }) {
  if (isProcessing) {
    return <Text style={styles.icon}>⏳</Text>;
  }
  return (
    <Text style={[styles.icon, isRecording && styles.iconRecording]}>
      {isRecording ? '⏹' : '🎤'}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  hint: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  pulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    bottom: 16,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    fontSize: 28,
  },
  iconRecording: {
    fontSize: 24,
  },
});
