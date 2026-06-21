# 🤰 MamaCi - Plateforme de Santé Maternelle

MamaCi est une solution numérique conçue pour accompagner les femmes enceintes et les jeunes mamans en Côte d'Ivoire. L'objectif est de réduire la mortalité maternelle et infantile en facilitant l'accès à l'information (conseils médicaux, rappels de vaccination, chatbot) et en assurant un suivi proactif, y compris dans les zones sans couverture internet grâce à la technologie USSD.

## ✨ Fonctionnalités Principales

- **Suivi Personnalisé** : Tableau de bord adapté au profil (femme enceinte ou jeune maman) avec le calendrier des prochains rendez-vous médicaux.
- **Chatbot Intelligent** : Assistant virtuel capable de répondre aux questions courantes, de détecter les mots-clés d'urgence (saignements, fièvre) et d'orienter vers les urgences si nécessaire.
- **Inclusivité (Accessibilité)** :
  - **Text-to-Speech (TTS)** : L'application lit à voix haute les conseils et les réponses du chatbot pour les personnes peu alphabétisées.
  - **Saisie Vocale (STT)** : Interface permettant de dicter sa question au chatbot.
- **Mode Sans Réseau (USSD)** : Un simulateur interactif connecté au vrai backend pour démontrer comment les patientes sans smartphone ni internet peuvent accéder à leurs rappels et confirmer leurs rendez-vous via `*134#`.

## 🏗️ Architecture du Projet

Le projet est divisé en deux parties principales (monorepo) :
- **`/client`** : Application mobile développée avec React Native & Expo.
- **`/server`** : Backend API développé avec Node.js, Express, et Prisma ORM (SQLite).

## 🚀 Guide de Démarrage Rapide

### 1. Démarrer le Backend (Serveur)
```bash
cd server
npm install
npm run seed  # Pour initialiser la base de données avec des profils de test
npm run dev   # Lance le serveur sur http://localhost:3000
```

### 2. Démarrer le Frontend (Application Mobile)
Ouvrez un nouveau terminal :
```bash
cd client
npm install
npm start
```
Vous pouvez ensuite scanner le QR Code avec l'application **Expo Go** sur votre téléphone (Android/iOS) ou appuyer sur `w` pour ouvrir la version web.

## 📱 Tester avec Expo Tunnel (Optionnel)
Pour partager l'application avec vos collègues ou le jury sans héberger le backend :
1. Créez un tunnel local pour le backend : `npx localtunnel --port 3000 --subdomain mamaci`
2. Mettez à jour `BASE_URL` dans `client/src/api/client.js` avec l'URL générée.
3. Lancez Expo avec la commande : `npx expo start --tunnel`.

## 🛠️ Stack Technique
- **Frontend** : React Native, Expo, React Navigation, Axios, Expo Speech.
- **Backend** : Node.js, Express, Prisma ORM, SQLite.
- **UI/UX** : Composants sur mesure, icônes Feather (`@expo/vector-icons`).

---
*Projet développé dans le cadre du Hackathon pour la santé maternelle en Côte d'Ivoire.*
