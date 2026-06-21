// src/screens/OnboardingScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { useProfile } from '../context/ProfileContext';

const CMU_REGEX = /^[A-Za-z0-9-]{6,}$/;

export default function OnboardingScreen({ navigation }) {
  const { createProfile } = useProfile();

  const [cmuId, setCmuId] = useState('');
  const [statut, setStatut] = useState('grossesse'); // 'grossesse' | 'nourrisson'
  const [date, setDate] = useState(''); // format simple AAAA-MM-JJ pour la démo
  const [cmuError, setCmuError] = useState('');
  const [dateError, setDateError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    let valid = true;
    setCmuError('');
    setDateError('');
    setSubmitError('');

    // Validation locale du format CMU avant tout appel réseau — doc Frontend §3.2
    if (!CMU_REGEX.test(cmuId.trim())) {
      setCmuError('Identifiant CMU invalide : au moins 6 caractères, lettres et chiffres.');
      valid = false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      setDateError('Utilise le format AAAA-MM-JJ, par exemple 2026-09-15.');
      valid = false;
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    const res = await createProfile({
      cmu_id: cmuId.trim(),
      statut,
      date_reference: date.trim(),
    });
    setLoading(false);

    if (!res.success) {
      setSubmitError(res.error?.message || "Une erreur est survenue. Réessaie dans un instant.");
      return;
    }
    navigation.replace('MainTabs');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={typography.label}>Bienvenue sur MamaCi</Text>
          <Text style={[typography.h1, { marginTop: 4 }]}>Créons ton profil</Text>
          <Text style={[typography.bodySoft, { marginTop: spacing.xs, marginBottom: spacing.lg }]}>
            Quelques informations suffisent pour démarrer ton suivi personnalisé.
          </Text>

          <TextField
            label="Identifiant CMU"
            placeholder="ex. CMU-204871"
            value={cmuId}
            onChangeText={setCmuId}
            error={cmuError}
            helper="Ton identifiant figure sur ta carte CMU."
            autoCapitalize="characters"
          />

          <Text style={[typography.label, { marginBottom: spacing.sm }]}>Ta situation</Text>
          <View style={styles.statutRow}>
            <StatutOption
              label="Je suis enceinte"
              selected={statut === 'grossesse'}
              onPress={() => setStatut('grossesse')}
            />
            <StatutOption
              label="J'ai déjà accouché"
              selected={statut === 'nourrisson'}
              onPress={() => setStatut('nourrisson')}
            />
          </View>

          <TextField
            label={statut === 'grossesse' ? 'Date de terme prévue' : 'Date de naissance du bébé'}
            placeholder="2026-09-15"
            value={date}
            onChangeText={setDate}
            error={dateError}
            helper="Format AAAA-MM-JJ"
            keyboardType="numbers-and-punctuation"
          />

          {submitError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{submitError}</Text>
            </View>
          ) : null}

          <View style={{ marginTop: spacing.md }}>
            <Button label="Créer mon profil" onPress={handleSubmit} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StatutOption({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.statutOption, selected && styles.statutOptionSelected]}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.statutLabel, selected && styles.statutLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  statutRow: { gap: spacing.sm, marginBottom: spacing.md },
  statutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  statutOptionSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.cardTint,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  radioOuterSelected: { borderColor: colors.teal },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: colors.teal,
  },
  statutLabel: { ...typography.body },
  statutLabelSelected: { fontWeight: '700', color: colors.tealDark },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  errorBoxText: { color: colors.danger, fontSize: 13.5, fontWeight: '600' },
});
