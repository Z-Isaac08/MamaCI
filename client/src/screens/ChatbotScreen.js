// src/screens/ChatbotScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';
import ChatBubble from '../components/ChatBubble';
import { apiPost } from '../api/client';

const SUGGESTIONS = ['Nausées', 'Vaccin', 'Allaitement', 'Mes RDV'];

const INTRO = {
  id: 'intro',
  from: 'bot',
  text:
    "Bonjour, je suis l'assistant MamaCi. Pose-moi une question sur ta grossesse ou ton bébé — " +
    "je t'oriente vers un centre de santé si quelque chose semble sérieux.",
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([INTRO]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    const userMsg = { id: 'u' + Date.now(), from: 'user', text: content };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    const res = await apiPost('/api/chatbot/message', { message: content });
    setSending(false);

    if (res.success) {
      const botMsg = {
        id: 'b' + Date.now(),
        from: 'bot',
        text: res.data.reply,
        variant: res.data.type === 'alert' ? 'alert' : 'normal',
      };
      setMessages((prev) => [...prev, botMsg]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: 'e' + Date.now(),
          from: 'bot',
          text: "Je n'arrive pas à répondre pour le moment. Réessaie dans un instant, ou consulte l'espace conseils.",
        },
      ]);
    }

    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={typography.label}>ASSISTANT MAMACI</Text>
          <Text style={[typography.h1, { marginTop: 2 }]}>Une question ?</Text>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble text={item.text} from={item.from} variant={item.variant} />}
          contentContainerStyle={{ paddingVertical: spacing.md }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {sending && (
          <View style={styles.typingRow}>
            <Text style={styles.typingText}>L'assistant écrit…</Text>
          </View>
        )}

        <View style={styles.suggestionsRow}>
          {SUGGESTIONS.map((s) => (
            <Pressable key={s} onPress={() => send(s)} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Écris ta question…"
            placeholderTextColor={colors.greyLight}
            style={styles.input}
            multiline
          />
          <Pressable onPress={() => send()} style={styles.sendButton}>
            <Feather name="send" size={18} color={colors.white} style={{ marginLeft: -2 }} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  typingRow: { paddingHorizontal: spacing.lg, paddingBottom: 4 },
  typingText: { ...typography.caption, fontStyle: 'italic' },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  suggestionChip: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  suggestionText: { fontSize: 12.5, fontWeight: '600', color: colors.tealDark },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 15.5,
    color: colors.ink,
    backgroundColor: colors.white,
    maxHeight: 100,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 46,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: { color: colors.white, fontSize: 18, marginLeft: 2 },
});
