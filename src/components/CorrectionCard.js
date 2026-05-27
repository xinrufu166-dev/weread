import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

/**
 * Shows grammar/vocabulary corrections below AI response
 * Props:
 *   corrections: Array<{original, corrected, explanation}>
 */
export default function CorrectionCard({ corrections }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const hasErrors = corrections && corrections.length > 0;

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>{hasErrors ? '✏️' : '✅'}</Text>
        <Text style={styles.headerText}>
          {hasErrors ? 'Language Feedback' : 'Great job, no mistakes!'}
        </Text>
      </View>

      {hasErrors && (
        <View style={styles.body}>
          {corrections.map((item, index) => (
            <View
              key={index}
              style={[styles.correctionItem, index < corrections.length - 1 && styles.divider]}
            >
              {/* Original (wrong) */}
              <View style={styles.row}>
                <Text style={styles.label}>Said: </Text>
                <View style={styles.wrongBadge}>
                  <Text style={styles.wrongText}>"{item.original}"</Text>
                </View>
              </View>

              {/* Corrected */}
              <View style={styles.row}>
                <Text style={styles.label}>Better: </Text>
                <View style={styles.correctBadge}>
                  <Text style={styles.correctText}>"{item.corrected}"</Text>
                </View>
              </View>

              {/* Explanation */}
              {item.explanation ? (
                <Text style={styles.explanation}>💡 {item.explanation}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FBD38D',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF3C7',
  },
  headerIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  correctionItem: {
    paddingVertical: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    width: 44,
  },
  wrongBadge: {
    backgroundColor: '#FED7D7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 1,
  },
  wrongText: {
    fontSize: 12,
    color: '#C53030',
    fontStyle: 'italic',
  },
  correctBadge: {
    backgroundColor: '#C6F6D5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 1,
  },
  correctText: {
    fontSize: 12,
    color: '#276749',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  explanation: {
    fontSize: 11,
    color: '#744210',
    marginTop: 4,
    lineHeight: 16,
  },
});
