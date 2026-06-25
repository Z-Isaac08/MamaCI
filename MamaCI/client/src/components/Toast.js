// src/components/Toast.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

export default function Toast({ visible, message, variant = 'success', onHide, duration = 2600 }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 12, duration: 200, useNativeDriver: true }),
      ]).start(() => onHide?.());
    }, duration);
    return () => clearTimeout(timer);
  }, [visible, message]);

  if (!visible) return null;

  const isError = variant === 'error';
  const icon = isError ? '❌' : '✅';

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        isError ? styles.wrapError : styles.wrapSuccess,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  wrapSuccess: { backgroundColor: colors.tealDark },
  wrapError: { backgroundColor: colors.danger },
  text: { ...typography.bodyStrong, color: colors.white, flex: 1 },
});