// src/theme/index.js
//
// Système de design MamaCi.
// Palette validée en équipe (doc Frontend §6.2) : teal principal, corail
// d'accent, charcoal pour le texte. On évite volontairement le look
// "appli santé corporate" : les surfaces évoquent le papier d'un carnet
// de santé (coins doux, bordures marquées plutôt que des ombres floues),
// et les statuts se lisent comme des tampons plutôt que des badges plats.

export const colors = {
  // Palette principale (doc Frontend)
  teal: '#0F766E',
  tealDark: '#0B5C56',
  tealDeep: '#073B37',
  coral: '#F97316',
  coralDark: '#C2540A',
  charcoal: '#1F2937',
  grey: '#6B7280',
  greyLight: '#9CA3AF',
  cardTint: '#F0FDFA',

  // Extensions nécessaires pour une UI complète, dérivées de la palette
  paper: '#FFFBF5',       // fond général — blanc cassé "papier", pas blanc pur
  paperDeep: '#FBF4E7',   // variante plus chaude pour sections distinctes
  ink: '#1F2937',         // = charcoal, alias sémantique
  inkSoft: '#4B5563',
  line: '#E2DCC9',        // lignes de séparation ton papier
  lineTeal: 'rgba(15, 118, 110, 0.18)',
  success: '#1A7A4C',
  successBg: '#E7F5ED',
  warning: '#C2540A',
  warningBg: '#FDEEE2',
  danger: '#B42318',
  dangerBg: '#FBEAE8',
  white: '#FFFFFF',
  overlay: 'rgba(15, 33, 31, 0.55)',
};

export const typography = {
  // Police système uniquement (doc Frontend §6.3) : pas de police custom
  // à charger pour limiter le setup. La personnalité vient de l'échelle
  // et des graisses, pas de la fonte.
  display: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.ink,
    lineHeight: 23,
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 23,
  },
  bodySoft: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.inkSoft,
    lineHeight: 23,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.grey,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.teal,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
  // léger angle "coin de page" asymétrique pour les cartes signature
  paperTopLeft: 4,
};

// Bordures marquées plutôt qu'ombres floues — cohérent avec l'esthétique
// "carnet papier" du produit, et plus lisible sur device d'entrée de gamme
// (les ombres portées rendent souvent mal sur écrans bas de gamme).
export const elevation = {
  card: {
    borderWidth: 1.5,
    borderColor: colors.line,
    shadowColor: colors.tealDeep,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  raised: {
    borderWidth: 1.5,
    borderColor: colors.line,
    shadowColor: colors.tealDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
};

const theme = { colors, typography, spacing, radius, elevation };
export default theme;
