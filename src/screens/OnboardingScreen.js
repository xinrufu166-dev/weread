import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { markOnboardingDone, saveSettings } from '../utils/storage';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const GOALS = ['Daily conversation', 'Business', 'Academic'];
const TOPICS = ['Travel', 'Food', 'Sports', 'Technology', 'Movies'];

export default function OnboardingScreen({ navigation }) {
  const [level, setLevel] = useState('Intermediate');
  const [goal, setGoal] = useState('Daily conversation');
  const [selectedTopics, setSelectedTopics] = useState(['Travel', 'Food']);

  function toggleTopic(topic) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }

  async function handleStart() {
    if (selectedTopics.length === 0) {
      Alert.alert('Select Topics', 'Please select at least one topic you are interested in.');
      return;
    }

    const settings = { level, goal, topics: selectedTopics };
    await saveSettings(settings);
    await markOnboardingDone();
    navigation.replace('Chat', { settings });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🎙️</Text>
          <Text style={styles.heroTitle}>SpeakWise AI</Text>
          <Text style={styles.heroSub}>Your personal English conversation coach</Text>
        </View>

        <Text style={styles.sectionTitle}>Let's personalize your experience</Text>

        {/* Level */}
        <View style={styles.section}>
          <Text style={styles.label}>📊 Your English Level</Text>
          <View style={styles.chips}>
            {LEVELS.map((l) => (
              <ChoiceChip
                key={l}
                label={l}
                selected={level === l}
                onPress={() => setLevel(l)}
              />
            ))}
          </View>
        </View>

        {/* Goal */}
        <View style={styles.section}>
          <Text style={styles.label}>🎯 Practice Goal</Text>
          <View style={styles.chips}>
            {GOALS.map((g) => (
              <ChoiceChip
                key={g}
                label={g}
                selected={goal === g}
                onPress={() => setGoal(g)}
              />
            ))}
          </View>
        </View>

        {/* Topics */}
        <View style={styles.section}>
          <Text style={styles.label}>✨ Favorite Topics</Text>
          <Text style={styles.subLabel}>Select all that interest you</Text>
          <View style={styles.chips}>
            {TOPICS.map((t) => (
              <ChoiceChip
                key={t}
                label={t}
                selected={selectedTopics.includes(t)}
                onPress={() => toggleTopic(t)}
                multi
              />
            ))}
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.startButtonText}>Start Practicing →</Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>You can change these settings anytime</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChoiceChip({ label, selected, onPress, multi }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {multi && selected && <Text style={styles.chipCheck}>✓ </Text>}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 15,
    color: '#718096',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#EDF2F7',
    borderWidth: 2,
    borderColor: '#EDF2F7',
  },
  chipSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#4A90D9',
  },
  chipCheck: {
    color: '#4A90D9',
    fontWeight: '700',
    fontSize: 13,
  },
  chipText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#2B6CB0',
    fontWeight: '700',
  },
  startButton: {
    backgroundColor: '#4A90D9',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footnote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 8,
  },
});
