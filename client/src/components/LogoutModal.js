// src/components/LogoutModal.js
import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius, elevation } from '../theme';
import Button from './Button';

export default function LogoutModal({ visible, onClose, onConfirm }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Feather name="log-out" size={24} color={colors.danger} />
            </View>
            <Text style={typography.h2}>Déconnexion</Text>
            <Text style={[typography.bodySoft, { textAlign: 'center', marginTop: spacing.sm }]}>
              Es-tu sûre de vouloir te déconnecter de ton espace MamaCi ?
            </Text>
          </View>

          <View style={styles.buttons}>
            <Button
              label="Oui, me déconnecter"
              onPress={onConfirm}
              variant="secondary"
            />
            <View style={{ height: spacing.sm }} />
            <Button
              label="Annuler"
              onPress={onClose}
              variant="ghost"
            />
          </View>
        </View>
      </View>
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
    backgroundColor: colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  buttons: {
    marginTop: spacing.xs,
  },
});
