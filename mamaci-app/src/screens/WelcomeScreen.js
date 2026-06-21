// src/screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import Button from '../components/Button';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.glowTop} />

      <View style={styles.content}>
        <View style={styles.markWrap}>
          <View style={styles.markCircleOuter}>
            <View style={styles.markCircleInner}>
              <Text style={styles.markGlyph}>+</Text>
            </View>
          </View>
        </View>

        <Text style={styles.wordmark}>MamaCi</Text>
        <Text style={styles.tagline}>
          Le carnet de santé qui ne se perd{'\n'}jamais, et qui pense à toi.
        </Text>

        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Marche sans internet</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Rappels automatiques</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Commencer" onPress={() => navigation.navigate('Onboarding')} />
        <Text style={styles.footnote}>
          Conçu pour accompagner les mamans et les bébés de Côte d'Ivoire, CPN et PEV inclus.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.teal },
  glowTop: {
    position: 'absolute',
    top: -120,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: colors.tealDark,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  markWrap: { marginBottom: spacing.lg },
  markCircleOuter: {
    width: 96,
    height: 96,
    borderRadius: 96,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markCircleInner: {
    width: 72,
    height: 72,
    borderRadius: 72,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markGlyph: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '800',
    marginTop: -2,
  },
  wordmark: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: spacing.sm,
    fontSize: 16,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  pill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  pillText: {
    color: colors.white,
    fontSize: 12.5,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footnote: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});
