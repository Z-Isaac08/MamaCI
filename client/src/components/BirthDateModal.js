// src/components/BirthDateModal.js
//
// Modal « bottom sheet » pour saisir la date de naissance du bébé avant de
// basculer en mode Nourrisson. La mère peut avoir accouché un autre jour
// que le jour où elle appuie sur le bouton — on ne peut pas présumer.

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius, elevation } from '../theme';
import TextField from './TextField';
import Button from './Button';

const DATE_REGEX_DDMMYYYY = /^(\d{2})-(\d{2})-(\d{4})$/;

function toISODate(ddmmyyyy) {
  const m = ddmmyyyy.match(DATE_REGEX_DDMMYYYY);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function isDateValid(isoDate) {
  const d = new Date(isoDate);
  return !isNaN(d.getTime());
}

function isFutureDate(isoDate) {
  const d = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d > today;
}

export default function BirthDateModal({ visible, onClose, onConfirm }) {
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function resetState() {
    setDate('');
    setDateError('');
    setSubmitError('');
    setLoading(false);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function validate() {
    setDateError('');
    setSubmitError('');

    if (!date.trim()) {
      setDateError('Merci de saisir la date de naissance.');
      return false;
    }

    if (!DATE_REGEX_DDMMYYYY.test(date.trim())) {
      setDateError('Utilise le format JJ-MM-AAAA, par exemple 15-06-2026.');
      return false;
    }

    const isoDate = toISODate(date.trim());
    if (!isoDate || !isDateValid(isoDate)) {
      setDateError("Cette date n'est pas valide.");
      return false;
    }

    if (isFutureDate(isoDate)) {
      setDateError('La date de naissance ne peut pas être dans le futur.');
      return false;
    }

    return true;
  }

  async function handleConfirm() {
    if (!validate()) return;

    setLoading(true);
    const isoDate = toISODate(date.trim());

    const res = await onConfirm(isoDate);

    if (res && !res.success) {
      setSubmitError(
        res.error?.message ||
          'Impossible de basculer en mode nourrisson. Réessaie plus tard.',
      );
      setLoading(false);
      return;
    }

    // Succès — fermer le modal
    setLoading(false);
    resetState();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Poignée */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Feather name="heart" size={24} color={colors.coral} />
            </View>
            <View style={styles.titleRow}>
              <Text style={typography.h2}>Félicitations </Text>
              <Feather name="gift" size={22} color={colors.coral} />
            </View>
            <Text style={[typography.bodySoft, { textAlign: 'center', marginTop: spacing.xs }]}>
              Indique la date de naissance de ton bébé pour que ton calendrier PEV soit précis.
            </Text>
          </View>

          {/* Champ de saisie */}
          <TextField
            label="Date de naissance du bébé"
            placeholder="15-06-2026"
            value={date}
            onChangeText={(text) => {
              setDate(text);
              if (dateError) setDateError('');
              if (submitError) setSubmitError('');
            }}
            error={dateError}
            helper="Format JJ-MM-AAAA"
            keyboardType="numbers-and-punctuation"
          />

          {/* Erreur serveur */}
          {submitError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{submitError}</Text>
            </View>
          ) : null}

          {/* Boutons */}
          <View style={styles.buttons}>
            <Button
              label="Confirmer la naissance"
              onPress={handleConfirm}
              loading={loading}
            />
            <View style={{ height: spacing.sm }} />
            <Button
              label="Annuler"
              onPress={handleClose}
              variant="ghost"
              disabled={loading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
    ...elevation.raised,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 52,
    backgroundColor: colors.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  errorBoxText: {
    color: colors.danger,
    fontSize: 13.5,
    fontWeight: '600',
  },
  buttons: {
    marginTop: spacing.sm,
  },
});
