import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import { DEFAULT_USER_LOCATION, getNearestHealthCenters } from '../data/healthCenters';
import { colors, radius, spacing, typography } from '../theme';

function formatDistance(value) {
  if (value < 1) return `${Math.round(value * 1000)} m`;
  return `${value.toFixed(1).replace('.', ',')} km`;
}

function openDirections(center) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}&travelmode=driving`;
  Linking.openURL(url);
}

export default function HealthCentersScreen() {
  const [selectedCity, setSelectedCity] = useState('Tout');
  const centers = useMemo(() => getNearestHealthCenters(), []);
  const cities = useMemo(
    () => ['Tout', ...Array.from(new Set(centers.map((center) => center.city))).sort()],
    [centers]
  );
  const filteredCenters = useMemo(
    () =>
      selectedCity === 'Tout'
        ? centers
        : centers.filter((center) => center.city === selectedCity),
    [centers, selectedCity]
  );
  const closest = filteredCenters.slice(0, 5);
  const others = filteredCenters.slice(5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Feather name="map-pin" size={24} color={colors.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={typography.label}>CENTRES DE SANTÉ</Text>
            <Text style={[typography.h1, { marginTop: 2 }]}>Les plus proches</Text>
          </View>
        </View>

        <Card tinted style={styles.locationCard}>
          <View style={styles.locationRow}>
            <Feather name="navigation" size={18} color={colors.tealDark} />
            <Text style={styles.locationText}>
              Position de démo : {DEFAULT_USER_LOCATION.label}
            </Text>
          </View>
          <Text style={[typography.caption, { marginTop: spacing.xs }]}>
            Les distances sont estimées à partir d'une position fixe pour fiabiliser la démo.
          </Text>
        </Card>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {cities.map((city) => (
            <Pressable
              key={city}
              onPress={() => setSelectedCity(city)}
              style={[
                styles.filterChip,
                selectedCity === city && styles.filterChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCity === city && styles.filterChipTextSelected,
                ]}
              >
                {city}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[typography.h3, styles.sectionTitle]}>
          {selectedCity === 'Tout' ? 'À consulter en priorité' : `Centres à ${selectedCity}`}
        </Text>
        {closest.map((center, index) => (
          <CenterCard key={center.id} center={center} rank={index + 1} featured />
        ))}

        {others.length > 0 && (
          <>
            <Text style={[typography.h3, styles.sectionTitle]}>Autres centres</Text>
            {others.map((center, index) => (
              <CenterCard key={center.id} center={center} rank={index + 6} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CenterCard({ center, rank, featured = false }) {
  return (
    <Card style={[styles.centerCard, featured && styles.featuredCard]}>
      <View style={styles.cardTopRow}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={typography.bodyStrong}>{center.name}</Text>
          <Text style={[typography.caption, { marginTop: 2 }]}>
            {center.type} · {center.district}, {center.city}
          </Text>
        </View>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{formatDistance(center.distanceKm)}</Text>
        </View>
      </View>

      <View style={styles.addressRow}>
        <Feather name="map" size={15} color={colors.grey} />
        <Text style={styles.addressText}>{center.address}</Text>
      </View>

      <Pressable onPress={() => openDirections(center)} style={styles.routeButton}>
        <Feather name="corner-up-right" size={17} color={colors.white} />
        <Text style={styles.routeButtonText}>Ouvrir l'itinéraire</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.cardTint,
    borderWidth: 1.5,
    borderColor: colors.lineTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCard: { marginBottom: spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  locationText: { ...typography.bodyStrong, color: colors.tealDark, flex: 1 },
  filterRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
    paddingVertical: spacing.xs,
  },
  filterChip: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  filterChipSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.teal,
  },
  filterChipText: { color: colors.inkSoft, fontSize: 13, fontWeight: '700' },
  filterChipTextSelected: { color: colors.white },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  centerCard: { marginBottom: spacing.sm },
  featuredCard: { borderColor: colors.lineTeal },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal,
  },
  rankText: { color: colors.white, fontSize: 13, fontWeight: '800' },
  distanceBadge: {
    borderRadius: radius.pill,
    backgroundColor: colors.warningBg,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  distanceText: { color: colors.coralDark, fontSize: 12, fontWeight: '800' },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  addressText: { ...typography.caption, flex: 1 },
  routeButton: {
    marginTop: spacing.md,
    backgroundColor: colors.teal,
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  routeButtonText: { color: colors.white, fontWeight: '800', fontSize: 14 },
});
