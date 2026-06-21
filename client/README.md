# 📱 MamaCi - Application Mobile (Frontend)

Ceci est l'application mobile accompagnant les mamans ivoiriennes. Elle a été construite avec React Native et Expo pour pouvoir tourner de manière fluide sur Android, iOS, et même sur le Web.

## ✨ Fonctionnalités UI/UX

- **Design Système** : Thème personnalisé avec couleurs apaisantes (Teal, Coral) et icônes minimalistes (`Feather`).
- **Accessibilité (TTS/STT)** : 
  - Bouton `Écouter` sur le Chatbot et les Conseils pour utiliser la synthèse vocale (`expo-speech`).
  - Bouton `Micro` pour simuler la saisie vocale pour les femmes peu alphabétisées.
- **USSD Interactif** : L'écran *Sans réseau* (`UssdScreen`) simule fidèlement un vieux téléphone portable. L'utilisateur utilise le clavier T9, compose `*134#`, et navigue dans les menus qui appellent le vrai Backend.

## 📁 Structure du code

```text
client/
├── src/
│   ├── api/                # Configuration Axios (client.js) et mock (mockServer.js)
│   ├── components/         # Composants réutilisables (Card, ChatBubble, EmptyState)
│   ├── context/            # Gestion globale de l'état (ProfileContext)
│   ├── navigation/         # Barre de navigation en bas (Bottom Tabs)
│   ├── screens/            # Tous les écrans de l'app (Dashboard, Chatbot, USSD, etc.)
│   └── theme.js            # Design Tokens (couleurs, espacements, typographie)
```

## 🚀 Démarrage

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Configuration Réseau (Très important) :
   Ouvrez le fichier `src/api/client.js`. Modifiez la constante `BASE_URL` pour qu'elle corresponde à l'adresse IP de votre serveur Backend ou à votre lien Localtunnel/Ngrok.
   ```javascript
   const BASE_URL = 'http://192.168.1.X:3000'; // Changez l'IP ici
   ```

3. Lancer l'application :
   ```bash
   npm start
   # ou
   npx expo start -c  # Pour vider le cache en cas de problème
   ```

## 📦 Librairies Principales

- `@react-navigation/bottom-tabs` & `@react-navigation/native` : Routage.
- `axios` : Communication HTTP avec le backend.
- `expo-speech` : Synthèse vocale intégrée hors-ligne.
- `@expo/vector-icons` : Bibliothèque d'icônes standardisées.
