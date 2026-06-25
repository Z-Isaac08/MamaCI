// src/components/Card.js
//
// Carte signature de l'app : coin supérieur-gauche légèrement carré (comme
// un coin de page de carnet), les autres arrondis — un détail discret qui
// rappelle l'objet central du problème adressé par MamaCi (le carnet de
// santé papier), sans être un gadget décoratif.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, elevation, spacing } from '../theme';

export default function Card({ children, style, tinted = false, raised = false }) {
  return (
    <View
      style={[
        styles.base,
        raised ? elevation.raised : elevation.card,
        tinted && styles.tinted,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderTopLeftRadius: radius.paperTopLeft,
    padding: spacing.md,
  },
  tinted: {
    backgroundColor: colors.cardTint,
  },
});
