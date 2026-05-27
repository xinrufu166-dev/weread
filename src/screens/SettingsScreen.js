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
import { clearAllData, saveSettings } from '../utils/storage';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const GOALS = ['Daily conversation', 'Business', 'Academic'];
const TOPICS = ['Travel', 'Food', 'Sports', 'Technology', 'Movies'];

const LEVEL_DESCRIPTIONS = {
  Beginner: 'Simple vocabulary & short sentences',
  Intermediate: 'Natural speech with some idioms',
  Advanced: 'Complex grammar & rich vocabulary',
};

const GOAL_DESCRIPTIONS = {
  'Daily conversation': 'Everyday chat, greetings, small talk',
  Business: 'Meetings, emails, professional settings',
  Academic: 'Essays, presentations, formal language',
};

export default function SettingsScreen({ navigation, route }) {
  const currentSettings = route.params?.settings;
  const onSave = route.params?.onSave;

  const [level, setLevel] = useState(currentSettings?.level || 'Intermediate');
  const [goal, setGoal] = useState(currentSettings?.goal || 'Daily conversation');
  const [selectedTopics, setSelectedTopics] = useState(
    currentSettings?.topics || ['Travel', 'Food']
  );

  function toggleTopic(topic) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }

  async function handleSave() {
    if (selectedTopics.length === 0) {
      Alert.alert('Select Topics', 'Please select at least one topic.');
      return;
    }
    const newSettings = { level, goal, topics: selectedTopics };
    await saveSettings(newSettings);
    if (onSave) onSave(newSettings);
    Alert.alert('Saved! ✅', 'Your settings have been updated. The AI will adjust from your next message.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  async function handleReset() {
    Alert.alert(
      'Reset App',
      'This will clear all settings and conversation history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            navigation.replace('Onboarding');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Nav header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Level */}
        <SectionHeader title="📊 English Level" />
        {LEVELS.map((l) => (
          <SelectRow
            key={l}
            label={l}
            description={LEVEL_DESCRIPTIONS[l]}
            selected={level === l}
            onPress={() => setLevel(l)}
          />
        ))}

        {/* Goal */}
        <SectionHeader title="🎯 Practice Goal" />
        {GOALS.map((g) => (
          <SelectRow
            key={g}
            label={g}
            description={GOAL_DESCRIPTIONS[g]}
            selected={goal === g}
            onPress={() => setGoal(g)}
          />
        ))}

        {/* Topics */}
        <SectionHeader title="✨ Favorite Topics" subtitle="Select all that interest you" />
        <View style={styles.topicsGrid}>
          {TOPICS.map((t) => (
            <TopicChip
              key={t}
              label={t}
              selected={selectedTopics.includes(t)}
              onPress={() => toggleTopic(t)}
            />
          ))}
        </View>

        {/* Danger zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>🗑  Reset App & Clear Data</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

function SelectRow({ label, description, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>{label}</Text>
        {description && <Text style={styles.rowDesc}>{description}</Text>}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

function TopicChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.topicChip, selected && styles.topicChipSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={styles.topicEmoji}>{topicEmoji(label)}</Text>
      <Text style={[styles.topicLabel, selected && styles.topicLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function topicEmoji(topic) {
  const map = { Travel: '✈️', Food: '🍜', Sports: '⚽', Technology: '💻', Movies: '🎬' };
  return map[topic] || '⭐';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, color: '#4A90D9', fontWeight: '600' },
  navTitle: { fontSize: 17, fontWeight: '700', color: '#1A202C' },
  saveBtn: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
  },
  saveText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  sectionHeader: { marginTop: 20, marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2D3748' },
  sectionSubtitle: { fontSize: 12, color: '#A0AEC0', marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  rowSelected: {
    borderColor: '#4A90D9',
    backgroundColor: '#EBF4FF',
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 15, color: '#2D3748', fontWeight: '600' },
  rowLabelSelected: { color: '#2B6CB0' },
  rowDesc: { fontSize: 12, color: '#A0AEC0', marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioSelected: { borderColor: '#4A90D9' },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90D9',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  topicChipSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#4A90D9',
  },
  topicEmoji: { fontSize: 16 },
  topicLabel: { fontSize: 14, color: '#4A5568', fontWeight: '600' },
  topicLabelSelected: { color: '#2B6CB0' },
  dangerSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEB2B2',
  },
  dangerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C53030',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resetButton: {
    backgroundColor: '#FED7D7',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetText: { fontSize: 14, color: '#C53030', fontWeight: '600' },
});
