// src/screens/DashboardScreen.js
import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import BirthDateModal from "../components/BirthDateModal";
import Button from "../components/Button";
import LogoutModal from "../components/LogoutModal";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import StatusStamp from "../components/StatusStamp";
import { useProfile } from "../context/ProfileContext";
import { colors, radius, spacing, typography } from "../theme";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
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
    resetProfile,
  } = useProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [reminderSentFor, setReminderSentFor] = useState(null);
  const [birthModalVisible, setBirthModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    refreshCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshCalendar();
    setRefreshing(false);
  }, [refreshCalendar]);

  const upcoming = calendar.filter((e) => e.statut === "a_venir");
  const nextEvent = upcoming[0];
  const mode = profile?.mode;
  const prenom = profile?.nom ? profile.nom.split(" ")[0] : "";

  async function handleTriggerReminder() {
    if (!nextEvent) return;
    const res = await triggerReminder(nextEvent.id);
    if (res.success) {
      setReminderSentFor(nextEvent.id);
      Alert.alert(
        "Rappel envoyé",
        `Notification déclenchée pour : ${nextEvent.label}`,
      );
    }
  }

  function handleSwitchMode() {
    setBirthModalVisible(true);
  }

  async function handleConfirmBirth(isoDate) {
    const res = await switchToNourrisson(isoDate);
    if (res && res.success) {
      setBirthModalVisible(false);
    }
    return res;
  }

  function handleLogout() {
    setLogoutModalVisible(true);
  }

  async function handleConfirmLogout() {
    setLogoutModalVisible(false);
    await resetProfile();
    navigation.reset({
      index: 0,
      routes: [{ name: "Onboarding" }],
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.teal}
          />
        }
      >
        <View style={styles.headerRow}>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Image
                source={require("../../assets/logo_mama.png")}
                style={{ width: 20, height: 20, marginRight: 6 }}
                resizeMode="contain"
              />
              <Text style={typography.label}>
                {mode === "grossesse" ? "Mode Grossesse" : "Mode Nourrisson"}
              </Text>
            </View>
            <Text style={[typography.h1, { marginTop: 2 }]}>
              Bienvenue {prenom}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.modeChip}>
              <Feather
                name={mode === "grossesse" ? "user" : "smile"}
                size={24}
                color={colors.tealDark}
              />
            </View>
            <Pressable onPress={handleLogout} style={{ marginLeft: 12, padding: 8 }}>
              <Feather name="log-out" size={24} color={colors.danger} />
            </Pressable>
          </View>
        </View>

        {calendarFromCache && (
          <View style={styles.cacheNotice}>
            <Text style={styles.cacheNoticeText}>
              Pas de connexion — dernière mise à jour connue affichée.
            </Text>
          </View>
        )}

        {/* Carte prochain rendez-vous */}
        <Card raised style={styles.heroCard}>
          {nextEvent ? (
            <>
              <Text style={styles.heroLabel}>PROCHAIN RENDEZ-VOUS</Text>
              <Text style={styles.heroTitle}>{nextEvent.label}</Text>
              <Text style={styles.heroDate}>
                {formatDate(nextEvent.date_prevue)}
              </Text>
              <Text style={styles.heroCountdown}>
                {daysUntil(nextEvent.date_prevue) >= 0
                  ? `Dans ${daysUntil(nextEvent.date_prevue)} jour(s)`
                  : "Échéance dépassée"}
              </Text>
              <View style={{ marginTop: spacing.md }}>
                <Button
                  label={
                    reminderSentFor === nextEvent.id
                      ? "Rappel envoyé ✓"
                      : "Déclencher le rappel"
                  }
                  onPress={handleTriggerReminder}
                  variant="secondary"
                  disabled={reminderSentFor === nextEvent.id}
                />
              </View>
            </>
          ) : (
            <EmptyState
              icon="calendar"
              title="Aucune échéance à venir"
              message="Ton calendrier est à jour, rien à signaler pour le moment."
            />
          )}
        </Card>

        {/* Accès rapides */}
        <Text style={[typography.h3, styles.sectionTitle]}>Accès rapide</Text>
        <View style={styles.quickRow}>
          <QuickAction
            icon="message-circle"
            label="Chatbot"
            onPress={() => navigation.navigate("Chatbot")}
          />
          <QuickAction
            icon="book-open"
            label="Conseils"
            onPress={() => navigation.navigate("Conseils")}
          />
          <QuickAction
            icon="bell"
            label="Rappels"
            onPress={() => navigation.navigate("Reminders")}
          />
          <QuickAction
            icon="map-pin"
            label="Centres"
            onPress={() => navigation.navigate("HealthCenters")}
          />
          <QuickAction
            icon="smartphone"
            label="Sans réseau"
            onPress={() => navigation.navigate("USSD")}
          />
        </View>

        {/* Calendrier complet */}
        <Text style={[typography.h3, styles.sectionTitle]}>
          {mode === "grossesse" ? "Calendrier CPN" : "Calendrier PEV"}
        </Text>

        {calendar.length === 0 ? (
          <Card>
            <EmptyState
              icon="list"
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
                  <Text style={[typography.caption, { marginTop: 2 }]}>
                    {formatDate(event.date_prevue)}
                  </Text>
                </View>
                <StatusStamp status={event.statut} />
              </View>
            </Card>
          ))
        )}

        {mode === "grossesse" && (
          <Pressable onPress={handleSwitchMode} style={styles.switchModeLink}>
            <Text style={styles.switchModeText}>
              Le bébé est arrivé ? Basculer en Mode Nourrisson →
            </Text>
          </Pressable>
        )}

        <BirthDateModal
          visible={birthModalVisible}
          onClose={() => setBirthModalVisible(false)}
          onConfirm={handleConfirmBirth}
        />
        <LogoutModal
          visible={logoutModalVisible}
          onClose={() => setLogoutModalVisible(false)}
          onConfirm={handleConfirmLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.quickAction}>
      <View style={styles.quickIconWrap}>
        <Feather name={icon} size={24} color={colors.teal} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  modeChip: {
    width: 44,
    height: 44,
    borderRadius: 44,
    backgroundColor: colors.cardTint,
    alignItems: "center",
    justifyContent: "center",
  },
  modeChipText: { fontSize: 20 },
  cacheNotice: {
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  cacheNoticeText: { color: colors.coralDark, fontSize: 13, fontWeight: "600" },
  heroCard: {
    backgroundColor: colors.tealDark,
    borderColor: colors.tealDeep,
    marginBottom: spacing.lg,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 6,
  },
  heroDate: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    marginTop: 4,
    fontWeight: "600",
  },
  heroCountdown: {
    color: colors.coral,
    fontSize: 13,
    marginTop: 6,
    fontWeight: "700",
  },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  quickAction: { flexBasis: "30%", flexGrow: 1, alignItems: "center" },
  quickIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickEmoji: { fontSize: 22 },
  quickLabel: { ...typography.caption, fontWeight: "600", color: colors.ink },
  eventCard: { marginBottom: spacing.sm },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchModeLink: {
    marginTop: spacing.lg,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  switchModeText: { color: colors.teal, fontWeight: "700", fontSize: 13.5 },
});
