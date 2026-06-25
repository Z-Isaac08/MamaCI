export const DEFAULT_USER_LOCATION = {
  latitude: 5.348,
  longitude: -4.004,
  label: 'Abidjan Plateau',
};

export const HEALTH_CENTERS = [
  {
    id: 'chu-treichville',
    name: 'CHU de Treichville',
    type: 'CHU',
    city: 'Abidjan',
    district: 'Treichville',
    address: 'Boulevard de Marseille, Treichville',
    latitude: 5.2975,
    longitude: -3.9972,
  },
  {
    id: 'chu-cocody',
    name: 'CHU de Cocody',
    type: 'CHU',
    city: 'Abidjan',
    district: 'Cocody',
    address: "Boulevard de l'Université, Cocody",
    latitude: 5.3459,
    longitude: -3.9874,
  },
  {
    id: 'hopital-general-port-bouet',
    name: 'Hôpital Général de Port-Bouet',
    type: 'Hôpital général',
    city: 'Abidjan',
    district: 'Port-Bouet',
    address: 'Port-Bouet',
    latitude: 5.2611,
    longitude: -3.9267,
  },
  {
    id: 'hopital-general-yopougon',
    name: 'Hôpital Général de Yopougon Attié',
    type: 'Hôpital général',
    city: 'Abidjan',
    district: 'Yopougon',
    address: 'Yopougon Attie',
    latitude: 5.3326,
    longitude: -4.0804,
  },
  {
    id: 'centre-sante-marcory',
    name: 'Centre de Santé Urbain de Marcory',
    type: 'Centre de santé',
    city: 'Abidjan',
    district: 'Marcory',
    address: 'Marcory résidentiel',
    latitude: 5.3027,
    longitude: -3.9821,
  },
  {
    id: 'centre-sante-abobo',
    name: 'Centre de Santé Urbain Abobo Sud',
    type: 'Centre de santé',
    city: 'Abidjan',
    district: 'Abobo',
    address: 'Abobo Sud',
    latitude: 5.4169,
    longitude: -4.0159,
  },
  {
    id: 'chu-bouake',
    name: 'CHU de Bouaké',
    type: 'CHU',
    city: 'Bouaké',
    district: 'Kennedy',
    address: 'Bouaké',
    latitude: 7.6896,
    longitude: -5.0284,
  },
  {
    id: 'chr-yamoussoukro',
    name: 'CHR de Yamoussoukro',
    type: 'CHR',
    city: 'Yamoussoukro',
    district: 'Quartier administratif',
    address: 'Yamoussoukro',
    latitude: 6.8276,
    longitude: -5.2893,
  },
  {
    id: 'chr-san-pedro',
    name: 'CHR de San-Pedro',
    type: 'CHR',
    city: 'San-Pedro',
    district: 'Bardot',
    address: 'San-Pedro',
    latitude: 4.7574,
    longitude: -6.6367,
  },
  {
    id: 'chr-korhogo',
    name: 'CHR de Korhogo',
    type: 'CHR',
    city: 'Korhogo',
    district: 'Centre-ville',
    address: 'Korhogo',
    latitude: 9.458,
    longitude: -5.6319,
  },
  {
    id: 'chr-man',
    name: 'CHR de Man',
    type: 'CHR',
    city: 'Man',
    district: 'Centre-ville',
    address: 'Man',
    latitude: 7.4125,
    longitude: -7.5538,
  },
  {
    id: 'chr-daloa',
    name: 'CHR de Daloa',
    type: 'CHR',
    city: 'Daloa',
    district: 'Tazibouo',
    address: 'Daloa',
    latitude: 6.8774,
    longitude: -6.4503,
  },
];

export function getDistanceKm(from, to) {
  const earthRadiusKm = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearestHealthCenters(origin = DEFAULT_USER_LOCATION) {
  return HEALTH_CENTERS.map((center) => ({
    ...center,
    distanceKm: getDistanceKm(origin, center),
  })).sort((a, b) => a.distanceKm - b.distanceKm);
}
