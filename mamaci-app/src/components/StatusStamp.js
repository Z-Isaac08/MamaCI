// src/components/StatusStamp.js
//
// Le badge de statut (à venir / fait / manqué) est traité comme un tampon
// de carnet de santé — bordure épaisse, lettres capitales, légère rotation —
// plutôt qu'un chip Material plat. C'est le "signature element" de l'app :
// l'idée qu'un rendez-vous "fait" porte une marque, comme un vrai cachet
// médical sur un carnet papier.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

const CONFIG = {
  a_venir: { label: 'À venir', color: colors.teal, bg: colors.cardTint, rotate: '0deg' },
  fait: { label: 'Fait', color: colors.success, bg: colors.successBg, rotate: '-3deg' },
  manque: { label: 'Manqué', color: colors.danger, bg: colors.dangerBg, rotate: '2deg' },
};

export default function StatusStamp({ status }) {
  const cfg = CONFIG[status] || CONFIG.a_venir;
  return (
    <View
      style={[
        styles.stamp,
        { borderColor: cfg.color, backgroundColor: cfg.bg, transform: [{ rotate: cfg.rotate }] },
      ]}
    >
      <Text style={[styles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
