// src/components/ScreenHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

export default function ScreenHeader({ eyebrow, title, subtitle, right = null }) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={typography.label}>{eyebrow}</Text> : null}
        <Text style={[typography.h1, { marginTop: 2 }]}>{title}</Text>
        {subtitle ? <Text style={[typography.bodySoft, { marginTop: 4 }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});
