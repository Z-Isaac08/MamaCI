// src/screens/DashboardScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import {
  MessageCircle,
  BookOpen,
  WifiOff,
  CalendarClock,
  Bell,
  CircleCheckBig,
  Baby,
  HeartHandshake,
  ArrowRight,
  CalendarX,
} from 'lucide-react-native';
import { colors, typography, spacing, radius } from '../theme';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusStamp from '../components/StatusStamp';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import { useProfile } from '../context/ProfileContext';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function daysUntil(iso) {
  const today = new Date();
  const target = new Date(iso);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function DashboardScreen({ navigation }) {
  const {
    profile,
    calendar,
    calendarFromCache,
    refreshCalendar,
    triggerReminder,
    switchToNourrisson,
  } = useProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [reminderSentFor, setReminderSentFor] = useState(null);
  const [switchingMode, setSwitchingMode] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', variant: 'success' });

  useEffect(() => {
    refreshCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshCalendar();
    setRefreshing(false);
  }, [refreshCalendar]);

  const upcoming = calendar.filter((e) => e.statut === 'a_venir');
  const nextEvent = upcoming[0];
  const mode = profile?.mode;

  function showToast(message, variant = 'success') {
    setToast({ visible: true, message, variant });
  }

  async function handleTriggerReminder() {
    if (!nextEvent) return;
    const res = await triggerReminder(nextEvent.id);
    if (res.success) {
      setReminderSentFor(nextEvent.id);
      showToast(`Rappel envoyé : ${nextEvent.label}`, 'success');
    } else {
      showToast("Le rappel n'a pas pu être envoyé. Réessaie.", 'error');
    }
  }

  function handleSwitchMode() {
    setConfirmVisible(true);
  }

  async function confirmSwitchMode() {
    setSwitchingMode(true);
    const today = new Date().toISOString().split('T')[0];
    const res = await switchToNourrisson(today);
    setSwitchingMode(false);
    setConfirmVisible(false);
    if (res.success) {
      showToast('Profil basculé en Mode Nourrisson', 'success');
    } else {
      showToast("Le changement de mode n'a pas pu être enregistré. Réessaie.", 'error');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal} />}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={typography.label}>
              {mode === 'grossesse' ? 'Mode Grossesse' : 'Mode Nourrisson'}
            </Text>
            <Text style={[typography.h1, { marginTop: 2 }]}>Bonjour</Text>
          </View>
          <View style={styles.modeChip}>
            {mode === 'grossesse' ? (
              <HeartHandshake size={22} color={colors.teal} strokeWidth={2} />
            ) : (
              <Baby size={22} color={colors.teal} strokeWidth={2} />
            )}
          </View>
        </View>

        {calendarFromCache && (
          <View style={styles.cacheNotice}>
            <WifiOff size={16} color={colors.coralDark} strokeWidth={2.2} />
            <Text style={styles.cacheNoticeText}>
              Pas de connexion — dernière mise à jour connue affichée.
            </Text>
          </View>
        )}

        {/* Carte prochain rendez-vous */}
        <Card raised style={styles.heroCard}>
          {nextEvent ? (
            <>
              <View style={styles.heroLabelRow}>
                <CalendarClock size={14} color="rgba(255,255,255,0.85)" strokeWidth={2.4} />
                <Text style={styles.heroLabel}>PROCHAIN RENDEZ-VOUS</Text>
              </View>
              <Text style={styles.heroTitle}>{nextEvent.label}</Text>
              <Text style={styles.heroDate}>{formatDate(nextEvent.date_prevue)}</Text>
              <Text style={styles.heroCountdown}>
                {daysUntil(nextEvent.date_prevue) >= 0
                  ? `Dans ${daysUntil(nextEvent.date_prevue)} jour(s)`
                  : 'Échéance dépassée'}
              </Text>
              <View style={{ marginTop: spacing.md }}>
                <Button
                  label={reminderSentFor === nextEvent.id ? 'Rappel envoyé' : 'Déclencher le rappel'}
                  onPress={handleTriggerReminder}
                  variant="secondary"
                  disabled={reminderSentFor === nextEvent.id}
                  icon={
                    reminderSentFor === nextEvent.id ? (
                      <CircleCheckBig size={18} color={colors.teal} strokeWidth={2.2} />
                    ) : (
                      <Bell size={18} color={colors.teal} strokeWidth={2.2} />
                    )
                  }
                />
              </View>
            </>
          ) : (
            <EmptyState
              Icon={CalendarX}
              title="Aucune échéance à venir"
              message="Ton calendrier est à jour, rien à signaler pour le moment."
            />
          )}
        </Card>

        {/* Accès rapides */}
        <Text style={[typography.h3, styles.sectionTitle]}>Accès rapide</Text>
        <View style={styles.quickRow}>
          <QuickAction
            Icon={MessageCircle}
            label="Assistant"
            onPress={() => navigation.navigate('Chatbot')}
          />
          <QuickAction
            Icon={BookOpen}
            label="Conseils"
            onPress={() => navigation.navigate('Conseils')}
          />
          <QuickAction
            Icon={WifiOff}
            label="Sans réseau"
            onPress={() => navigation.navigate('USSD')}
          />
        </View>

        {/* Calendrier complet */}
        <Text style={[typography.h3, styles.sectionTitle]}>
          {mode === 'grossesse' ? 'Calendrier CPN' : 'Calendrier PEV'}
        </Text>

        {calendar.length === 0 ? (
          <Card>
            <EmptyState
              Icon={CalendarClock}
              title="Calendrier non généré"
              message="Reviens dans un instant, ton calendrier est en cours de préparation."
            />
          </Card>
        ) : (
          calendar.map((event) => (
            <Card key={event.id} style={styles.eventCard}>
              <View style={styles.eventRow}>
                <View style={{ flex: 1 }}>
                  <Text style={typography.bodyStrong}>{event.label}</Text>
                  <Text style={[typography.caption, { marginTop: 2 }]}>{formatDate(event.date_prevue)}</Text>
                </View>
                <StatusStamp status={event.statut} />
              </View>
            </Card>
          ))
        )}

        {mode === 'grossesse' && (
          <Pressable
            onPress={handleSwitchMode}
            disabled={switchingMode}
            style={({ pressed }) => [
              styles.switchModeButton,
              pressed && { opacity: 0.85 },
              switchingMode && { opacity: 0.6 },
            ]}
          >
            <View style={styles.switchModeIconWrap}>
              <Baby size={20} color={colors.coral} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchModeTitle}>Le bébé est arrivé ?</Text>
              <Text style={styles.switchModeSubtitle}>
                {switchingMode ? 'Mise à jour en cours…' : 'Basculer en Mode Nourrisson'}
              </Text>
            </View>
            <ArrowRight size={20} color={colors.coral} strokeWidth={2.2} />
          </Pressable>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={confirmVisible}
        title="Confirmer la naissance"
        message="Veux-tu basculer ton profil en Mode Nourrisson ? Le calendrier sera mis à jour avec le PEV."
        confirmLabel="Confirmer"
        cancelLabel="Annuler"
        loading={switchingMode}
        onConfirm={confirmSwitchMode}
        onCancel={() => setConfirmVisible(false)}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </SafeAreaView>
  );
}

function QuickAction({ Icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.8 }]}>
      <View style={styles.quickIconWrap}>
        <Icon size={24} color={colors.teal} strokeWidth={2} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modeChip: {
    width: 48,
    height: 48,
    borderRadius: 48,
    backgroundColor: colors.cardTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cacheNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  cacheNoticeText: { color: colors.coralDark, fontSize: 13, fontWeight: '600', flex: 1 },
  heroCard: {
    backgroundColor: colors.tealDark,
    borderColor: colors.tealDeep,
    marginBottom: spacing.lg,
  },
  heroLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  heroTitle: { color: colors.white, fontSize: 21, fontWeight: '800', marginTop: 6 },
  heroDate: { color: 'rgba(255,255,255,0.92)', fontSize: 15, marginTop: 4, fontWeight: '600' },
  heroCountdown: { color: colors.coral, fontSize: 13, marginTop: 6, fontWeight: '700' },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quickAction: { flex: 1, alignItems: 'center' },
  quickIconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: { ...typography.caption, fontWeight: '600', color: colors.ink },
  eventCard: { marginBottom: spacing.sm },
  eventRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    minHeight: 64,
  },
  switchModeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: colors.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchModeTitle: { ...typography.bodyStrong, fontSize: 15 },
  switchModeSubtitle: { ...typography.caption, color: colors.coralDark, fontWeight: '700', marginTop: 1 },
});