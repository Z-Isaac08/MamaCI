# MamaCi — Application mobile (React Native / Expo)

Implémentation du parcours complet décrit dans la doc Frontend de l'équipe :
Bienvenue → Onboarding → Tableau de bord → Chatbot → Conseils → Simulation USSD.

## Démarrer en local

```bash
npm install
npx expo start
```

Scanner le QR code avec l'app **Expo Go** sur un téléphone réel (le plus fiable pour la démo), ou taper `i` / `a` dans le terminal pour un simulateur iOS/Android si configuré.

## Données : mock activé par défaut

L'app tourne actuellement avec un **serveur mock en mémoire** (`src/api/mockServer.js`), qui reproduit fidèlement les endpoints et le format de réponse (`{success, data}` / `{success, error}`) du backend Express documenté. Ça permet de travailler et de répéter le pitch même si le backend n'est pas encore en ligne.

### Brancher le vrai backend

Dans `src/api/client.js` :

```js
export const USE_MOCK = false; // était true
const BASE_URL = 'http://<ip-du-backend>:3000'; // remplacer
```

Aucun autre fichier à toucher : tous les écrans passent par `apiGet` / `apiPost` / `apiPatch`, qui basculent automatiquement entre mock et réseau réel. Les routes appelées (`/api/profiles`, `/api/profiles/:id/calendar`, `/api/events/:id/trigger-reminder`, `/api/chatbot/message`, `/api/advice`, etc.) correspondent exactement à la doc Backend §3.

## Structure du projet

Reprend exactement l'arborescence définie dans la doc Frontend §1.3 :

```
src/
├── screens/      un fichier par écran
├── components/   Button, Card, TextField, StatusStamp, ChatBubble...
├── navigation/    Stack (Bienvenue→Onboarding) puis Tabs (Tableau/Chatbot/Conseils)
├── context/      ProfileContext — state global profil + calendrier
├── api/          client.js (point d'entrée unique) + mockServer.js
├── theme/        couleurs, typographie, espacements
└── data/         calendrier CPN/PEV, fiches conseils, règles chatbot — contenu statique embarqué
```

## Points d'attention avant la démo

Repris de la checklist de la doc Frontend §7 — à vérifier avant mardi/mercredi :

- [ ] Profil de démo créé à l'avance (éviter la saisie en direct)
- [ ] Testé sur un device réel, idéalement celui du jour J
- [ ] Testé en connexion dégradée (Wi-Fi coupé) — le mock fonctionne 100% hors-ligne par nature
- [ ] Notification de rappel déclenchée et vérifiée en live (bouton sur le Tableau de bord)
- [ ] Écran Simulation USSD testé indépendamment (100% local, aucun appel réseau)
- [ ] Si le vrai backend est branché : plan B prêt si le chatbot externe ne répond pas

## Notes de conception

- **Calendrier CPN/PEV simplifié** (`src/data/calendarRules.js`) : 5 échéances clés par mode, à valider avec une source médicale officielle ivoirienne avant toute utilisation au-delà du MVP (voir cahier des charges).
- **Chatbot mock** (`src/data/chatbotRules.js`) : reproduit la politique du futur backend (détection de signaux d'alerte en priorité, honnêteté si hors périmètre) en attendant le relais vers le vrai modèle de langage.
- **Identité visuelle** : la palette teal/corail de l'équipe est conservée telle quelle ; la signature du design est le badge de statut traité comme un tampon de carnet de santé plutôt qu'un chip plat — un clin d'œil discret à l'objet (le carnet papier) que MamaCi remplace.
