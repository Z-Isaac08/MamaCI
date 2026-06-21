// src/components/Button.js
import React from 'react';
import { Pressable, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';

export default function Button({
  label,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  disabled = false,
  loading = false,
  fullWidth = true,
  icon = null,
}) {
  const variantStyle = styles[variant] || styles.primary;
  const labelStyle = variant === 'secondary' || variant === 'ghost' ? styles.labelDark : styles.labelLight;

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.white : colors.teal} />
        ) : (
          <>
            {icon}
            <Text style={[typography.button, labelStyle, icon && { marginLeft: spacing.sm }]}>{label}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primary: {
    backgroundColor: colors.teal,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
  labelLight: { color: colors.white },
  labelDark: { color: colors.teal },
});
