// src/data/calendarRules.js
//
// Version simplifiée du calendrier CPN/PEV pour la démo (doc Backend §4.1 :
// "figer une version simplifiée, 4 à 5 échéances clés, suffisante pour la
// démo, plutôt que de chercher l'exhaustivité médicale en 4 jours").
//
// ⚠️ À valider avec une source médicale officielle ivoirienne avant toute
// utilisation au-delà du MVP — voir cahier des charges, note section 7.

// offsetDays est relatif à la date de terme (CPN) ou de naissance (PEV).
// Négatif = avant la date de référence.
export const CPN_SCHEDULE = [
  { type: 'CPN_1', label: '1ère consultation prénatale', offsetDays: -210 },
  { type: 'CPN_2', label: '2ème consultation prénatale', offsetDays: -150 },
  { type: 'CPN_3', label: '3ème consultation prénatale', offsetDays: -90 },
  { type: 'CPN_4', label: '4ème consultation prénatale', offsetDays: -30 },
  { type: 'CPN_ACCOUCHEMENT', label: "Préparation à l'accouchement", offsetDays: -7 },
];

export const PEV_SCHEDULE = [
  { type: 'PEV_BCG', label: 'BCG + Polio 0', offsetDays: 0 },
  { type: 'PEV_PENTA1', label: 'Penta 1 + Polio 1', offsetDays: 42 },
  { type: 'PEV_PENTA2', label: 'Penta 2 + Polio 2', offsetDays: 70 },
  { type: 'PEV_PENTA3', label: 'Penta 3 + Polio 3', offsetDays: 98 },
  { type: 'PEV_ROUGEOLE', label: 'Rougeole + Fièvre jaune', offsetDays: 270 },
];
