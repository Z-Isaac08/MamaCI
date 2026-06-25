// src/components/ConfirmDialog.js
//
// Modale de confirmation custom. Remplace Alert.alert() qui ne fonctionne
// PAS du tout sur web avec react-native-web (aucune popup, aucune erreur —
// juste rien ne se passe). Cette modale fonctionne identiquement sur web,
// iOS et Android.

import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              style={({ pressed }) => [styles.button, styles.cancelButton, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                pressed && { opacity: 0.85 },
                loading && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.confirmText}>{loading ? 'Patiente…' : confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderTopLeftRadius: radius.paperTopLeft,
    padding: spacing.lg,
  },
  title: { ...typography.h2 },
  message: { ...typography.bodySoft, marginTop: spacing.xs },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  cancelButton: {
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  cancelText: { ...typography.bodyStrong, color: colors.inkSoft },
  confirmButton: {
    backgroundColor: colors.teal,
  },
  confirmText: { ...typography.bodyStrong, color: colors.white },
});