// src/screens/RemindersScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import { useProfile } from '../context/ProfileContext';

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} à ${hours}:${minutes}`;
}

export default function RemindersScreen({ navigation }) {
  const { reminders, refreshReminders } = useProfile();

  useEffect(() => {
    refreshReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderItem({ item }) {
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.label}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.canal === 'sms' ? 'SMS' : 'APP'}</Text>
          </View>
        </View>
        <Text style={styles.cardDate}>Envoyé le {formatDateTime(item.triggered_at)}</Text>
      </Card>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </Pressable>
        <Text style={typography.h2}>Historique des rappels</Text>
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off"
            title="Aucun rappel"
            message="Tu n'as pas encore reçu de rappel pour tes rendez-vous."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backButton: { marginBottom: spacing.sm },
  backText: { color: colors.teal, fontWeight: '600', fontSize: 16 },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  card: { marginBottom: spacing.md, padding: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { ...typography.bodyStrong, flex: 1, marginRight: 8 },
  badge: {
    backgroundColor: colors.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: { color: colors.tealDark, fontSize: 10, fontWeight: '700' },
  cardDate: { ...typography.caption, color: colors.grey },
});
