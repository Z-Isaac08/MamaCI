// src/components/ChatBubble.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { colors, typography, radius, spacing } from '../theme';

export default function ChatBubble({ text, from = 'bot', variant = 'normal' }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const isUser = from === 'user';
  const isAlert = variant === 'alert';

  const handlePlay = () => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      Speech.speak(text, {
        language: 'fr',
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  };

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
        {!isUser && (
          <Pressable onPress={handlePlay} style={styles.playButton}>
            <Feather name={isPlaying ? "square" : "volume-2"} size={16} color={isAlert ? colors.coralDark : colors.teal} />
            <Text style={[styles.playText, { color: isAlert ? colors.coralDark : colors.teal }]}>
              {isPlaying ? "Arrêter" : "Écouter"}
            </Text>
          </Pressable>
        )}
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
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: radius.sm,
  },
  playText: { fontSize: 12, fontWeight: '700' },
});
