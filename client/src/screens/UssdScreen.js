// src/screens/UssdScreen.js
//
// Mockup visuel uniquement pour le MVP (doc Frontend §3.6 : "pas
// d'intégration réelle à un agrégateur USSD"). Lit le même calendrier que
// le Tableau de bord — même source de vérité (doc Backend §2.3 commentaire).
// 100% local, aucune dépendance réseau.

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { useProfile } from '../context/ProfileContext';

function formatShort(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const SCREENS = {
  MENU: 'MENU',
  NEXT_RDV: 'NEXT_RDV',
  CONFIRMED: 'CONFIRMED',
  POSTPONED: 'POSTPONED',
};

export default function UssdScreen() {
  const { calendar } = useProfile();
  const [screen, setScreen] = useState(SCREENS.MENU);

  const upcoming = calendar.filter((e) => e.statut === 'a_venir');
  const next = upcoming[0];

  function renderBody() {
    switch (screen) {
      case 'NEXT_RDV':
        return (
          <>
            <UText>MAMACI</UText>
            <UText dim>-----------------</UText>
            {next ? (
              <>
                <UText>{next.label}</UText>
                <UText>Le {formatShort(next.date_prevue)}</UText>
              </>
            ) : (
              <UText>Aucun RDV a venir</UText>
            )}
            <UText dim> </UText>
            <UText>1. Confirmer</UText>
            <UText>2. Reporter</UText>
            <UText>0. Retour</UText>
          </>
        );
      case 'CONFIRMED':
        return (
          <>
            <UText>MAMACI</UText>
            <UText dim>-----------------</UText>
            <UText>Rendez-vous confirme.</UText>
            <UText>Merci.</UText>
            <UText dim> </UText>
            <UText>0. Retour au menu</UText>
          </>
        );
      case 'POSTPONED':
        return (
          <>
            <UText>MAMACI</UText>
            <UText dim>-----------------</UText>
            <UText>Demande de report</UText>
            <UText>enregistree.</UText>
            <UText>Un agent te contactera.</UText>
            <UText dim> </UText>
            <UText>0. Retour au menu</UText>
          </>
        );
      default:
        return (
          <>
            <UText>MAMACI</UText>
            <UText dim>-----------------</UText>
            <UText>1. Voir mon prochain RDV</UText>
            <UText>2. Confirmer le RDV</UText>
            <UText>3. Reporter</UText>
            <UText>0. Quitter</UText>
          </>
        );
    }
  }

  function handleKey(key) {
    if (screen === SCREENS.MENU) {
      if (key === '1') setScreen(SCREENS.NEXT_RDV);
      if (key === '2') setScreen(SCREENS.CONFIRMED);
      if (key === '3') setScreen(SCREENS.POSTPONED);
      return;
    }
    if (key === '0') {
      if (screen === SCREENS.NEXT_RDV) setScreen(SCREENS.MENU);
      else setScreen(SCREENS.MENU);
      return;
    }
    if (screen === SCREENS.NEXT_RDV) {
      if (key === '1') setScreen(SCREENS.CONFIRMED);
      if (key === '2') setScreen(SCREENS.POSTPONED);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.intro}>
        <Text style={styles.introLabel}>MODE SANS RÉSEAU</Text>
        <Text style={styles.introTitle}>Simulation USSD</Text>
        <Text style={styles.introText}>
          Aperçu de l'expérience *xxx# — fonctionne sans connexion internet, même sur téléphone basique.
        </Text>
      </View>

      <View style={styles.phoneShell}>
        <View style={styles.phoneNotch} />
        <View style={styles.screenArea}>{renderBody()}</View>
        <View style={styles.keypad}>
          {['1', '2', '3', '0'].map((k) => (
            <Pressable key={k} onPress={() => handleKey(k)} style={styles.key}>
              <Text style={styles.keyText}>{k}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.demoNote}>
        Démonstration visuelle — l'intégration réelle à un agrégateur USSD est documentée comme prochaine étape technique.
      </Text>
    </SafeAreaView>
  );
}

function UText({ children, dim = false }) {
  return <Text style={[styles.uText, dim && styles.uTextDim]}>{children}</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paperDeep, alignItems: 'center', paddingTop: spacing.lg },
  intro: { paddingHorizontal: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
  introLabel: { color: colors.coralDark, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  introTitle: { color: colors.ink, fontSize: 22, fontWeight: '800', marginTop: 4 },
  introText: { color: colors.inkSoft, fontSize: 13.5, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  phoneShell: {
    width: 240,
    backgroundColor: '#0D0D0D',
    borderRadius: 28,
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#2A2A2A',
  },
  phoneNotch: {
    width: 50,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#3A3A3A',
    marginBottom: 14,
  },
  screenArea: {
    width: '100%',
    minHeight: 160,
    backgroundColor: '#1B2B1F',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  uText: {
    color: '#9CF7B0',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 19,
  },
  uTextDim: { color: '#4F7D5C' },
  keypad: { flexDirection: 'row', gap: 10 },
  key: {
    width: 42,
    height: 42,
    borderRadius: 42,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { color: '#E5E5E5', fontWeight: '700', fontSize: 16 },
  demoNote: {
    color: colors.grey,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
    lineHeight: 17,
  },
});
