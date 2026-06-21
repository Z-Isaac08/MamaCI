// src/screens/AdviceScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';
import Card from '../components/Card';
import { useProfile } from '../context/ProfileContext';
import { apiGet } from '../api/client';

const TAG_COLORS = {
  Nutrition: colors.teal,
  Prévention: colors.coral,
  Suivi: colors.teal,
  Allaitement: colors.coral,
  Vaccination: colors.teal,
  Alerte: colors.danger,
};

export default function AdviceScreen({ navigation }) {
  const { profile } = useProfile();
  const mode = profile?.mode || 'grossesse';
  const [fiches, setFiches] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await apiGet(`/api/advice?mode=${mode}`);
      if (res.success) setFiches(res.data);
    })();
  }, [mode]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.teal} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={typography.label}>ESPACE CONSEILS</Text>
        <Text style={[typography.h1, { marginTop: 2, marginBottom: spacing.xs }]}>
          Pensé pour ton quotidien
        </Text>
        <Text style={[typography.bodySoft, { marginBottom: spacing.lg }]}>
          {mode === 'grossesse'
            ? 'Des repères concrets pour ta grossesse, avec des aliments et habitudes locales.'
            : 'Des repères concrets pour les premiers mois de ton bébé.'}
        </Text>

        {fiches.map((fiche) => (
          <Pressable key={fiche.id} onPress={() => setSelected(fiche)}>
            <Card style={styles.ficheCard}>
              <View style={[styles.tag, { backgroundColor: (TAG_COLORS[fiche.tag] || colors.teal) + '1A' }]}>
                <Text style={[styles.tagText, { color: TAG_COLORS[fiche.tag] || colors.teal }]}>
                  {fiche.tag}
                </Text>
              </View>
              <Text style={[typography.h3, { marginTop: spacing.sm }]}>{fiche.title}</Text>
              <Text style={[typography.bodySoft, { marginTop: 4 }]}>{fiche.summary}</Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        {selected && (
          <SafeAreaView style={styles.modalSafe}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={[styles.tag, { backgroundColor: (TAG_COLORS[selected.tag] || colors.teal) + '1A' }]}>
                <Text style={[styles.tagText, { color: TAG_COLORS[selected.tag] || colors.teal }]}>
                  {selected.tag}
                </Text>
              </View>
              <Text style={[typography.h1, { marginTop: spacing.sm }]}>{selected.title}</Text>
              <Text style={[typography.body, { marginTop: spacing.md }]}>{selected.body}</Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable onPress={() => setSelected(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scroll: { padding: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.xxl },
  ficheCard: { marginBottom: spacing.sm },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  tagText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
  modalSafe: { flex: 1, backgroundColor: colors.paper },
  modalScroll: { padding: spacing.lg, paddingBottom: spacing.xl },
  modalFooter: { padding: spacing.lg },
  closeButton: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: { color: colors.teal, fontWeight: '700', fontSize: 16 },
});
