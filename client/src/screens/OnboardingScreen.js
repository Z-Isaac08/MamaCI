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
const DATE_REGEX_DDMMYYYY = /^(\d{2})-(\d{2})-(\d{4})$/;

// Convertit JJ-MM-AAAA en AAAA-MM-JJ (format ISO) pour le backend
function toISODate(ddmmyyyy) {
  const m = ddmmyyyy.match(DATE_REGEX_DDMMYYYY);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

export default function OnboardingScreen({ navigation, route }) {
  const { createProfile, loginProfile } = useProfile();

  const isLogin = route.params?.mode === 'login';

  const [nom, setNom] = useState('');
  const [cmuId, setCmuId] = useState('');
  const [statut, setStatut] = useState('grossesse'); // 'grossesse' | 'nourrisson'
  const [date, setDate] = useState(''); // format JJ-MM-AAAA
  const [cmuError, setCmuError] = useState('');
  const [dateError, setDateError] = useState('');
  const [nomError, setNomError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    let valid = true;
    setCmuError('');
    setDateError('');
    setNomError('');
    setSubmitError('');

    if (!CMU_REGEX.test(cmuId.trim())) {
      setCmuError('Identifiant CMU invalide : au moins 6 caractères, lettres et chiffres.');
      valid = false;
    }

    if (!isLogin) {
      if (!nom.trim()) {
        setNomError('Merci de saisir ton nom.');
        valid = false;
      }

      if (!DATE_REGEX_DDMMYYYY.test(date.trim())) {
        setDateError('Utilise le format JJ-MM-AAAA, par exemple 15-09-2026.');
        valid = false;
      }
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);

    if (isLogin) {
      // Reconnexion par CMU
      const res = await loginProfile(cmuId.trim());
      setLoading(false);
      if (!res.success) {
        setSubmitError(res.error?.message || "Aucun profil trouvé avec cet identifiant.");
        return;
      }
      navigation.replace('MainTabs');
    } else {
      // Création de profil
      const isoDate = toISODate(date.trim());
      const res = await createProfile({
        cmu_id: cmuId.trim(),
        nom: nom.trim(),
        statut,
        date_reference: isoDate,
      });
      setLoading(false);

      if (!res.success) {
        setSubmitError(res.error?.message || "Une erreur est survenue. Réessaie dans un instant.");
        return;
      }
      navigation.replace('MainTabs');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={typography.label}>Bienvenue sur MamaCi</Text>
          <Text style={[typography.h1, { marginTop: 4 }]}>
            {isLogin ? 'Retrouve ton profil' : 'Créons ton profil'}
          </Text>
          <Text style={[typography.bodySoft, { marginTop: spacing.xs, marginBottom: spacing.lg }]}>
            {isLogin
              ? 'Entre ton identifiant CMU pour retrouver ton suivi.'
              : 'Quelques informations suffisent pour démarrer ton suivi personnalisé.'}
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

          {!isLogin && (
            <>
              <TextField
                label="Ton nom"
                placeholder="ex. Awa Konaté"
                value={nom}
                onChangeText={setNom}
                error={nomError}
                autoCapitalize="words"
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
                placeholder="15-09-2026"
                value={date}
                onChangeText={setDate}
                error={dateError}
                helper="Format JJ-MM-AAAA"
                keyboardType="numbers-and-punctuation"
              />
            </>
          )}

          {submitError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{submitError}</Text>
            </View>
          ) : null}

          <View style={{ marginTop: spacing.md }}>
            <Button
              label={isLogin ? 'Me connecter' : 'Créer mon profil'}
              onPress={handleSubmit}
              loading={loading}
            />
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
