// src/components/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import Button from './Button';

export default function EmptyState({ emoji = '🌿', title, message, actionLabel, onAction }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel ? (
        <View style={{ marginTop: spacing.md, width: '100%' }}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emoji: { fontSize: 38, marginBottom: spacing.sm },
  title: { ...typography.h3, textAlign: 'center' },
  message: {
    ...typography.bodySoft,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
