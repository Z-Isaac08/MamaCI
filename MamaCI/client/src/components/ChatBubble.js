// src/components/ChatBubble.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';

export default function ChatBubble({ text, from = 'bot', variant = 'normal' }) {
  const isUser = from === 'user';
  const isAlert = variant === 'alert';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowBot]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleBot,
          isAlert && styles.bubbleAlert,
        ]}
      >
        {isAlert && <Text style={styles.alertLabel}>⚠ ORIENTATION RECOMMANDÉE</Text>}
        <Text style={[styles.text, isUser ? styles.textUser : styles.textBot]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: spacing.sm, paddingHorizontal: spacing.md },
  rowUser: { justifyContent: 'flex-end' },
  rowBot: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
  },
  bubbleUser: {
    backgroundColor: colors.teal,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderBottomLeftRadius: 4,
  },
  bubbleAlert: {
    backgroundColor: colors.warningBg,
    borderColor: colors.coral,
  },
  text: { ...typography.body, fontSize: 15.5 },
  textUser: { color: colors.white },
  textBot: { color: colors.ink },
  alertLabel: {
    ...typography.caption,
    color: colors.coralDark,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.4,
  },
});
