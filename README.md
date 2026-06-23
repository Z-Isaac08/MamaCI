# MamaCi - Guide de Lancement Local (Branche Demo-Live)

Bienvenue sur le dépôt de **MamaCi**, l'application de suivi de grossesse et de calendrier vaccinal (PEV) pensée pour être accessible, même sans réseau.

Ce guide détaille, étape par étape, comment lancer le projet complet en local sur votre machine après avoir cloné le dépôt. Il est destiné aux développeurs et aux membres du jury de l'hackathon souhaitant tester l'application.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- **[Node.js](https://nodejs.org/)** (version 18 ou supérieure recommandée)
- **[Git](https://git-scm.com/)**
- L'application **Expo Go** installée sur votre smartphone (disponible sur l'App Store ou Google Play), OU un émulateur Android/iOS configuré sur votre PC.

Le projet est divisé en deux parties :

1. `server/` : Le backend (API Express + Base de données locale SQLite gérée par Prisma).
2. `client/` : L'application mobile (React Native / Expo).

---

## 🛠️ Étape 1 : Lancement du Backend (Serveur)

Le backend gère la création des profils et la génération des calendriers médicaux.

1. **Ouvrez un terminal** à la racine du projet cloné.
2. Déplacez-vous dans le dossier du serveur :
   ```bash
   cd server
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Initialisez la base de données locale (SQLite) :
   ```bash
   npx prisma db push
   ```
   _(Cette commande va créer le fichier `dev.db` et appliquer le schéma de la base de données)._
5. Démarrez le serveur en mode développement :
   ```bash
   npm run dev
   ```
6. Vous devriez voir un message indiquant que le serveur écoute sur le port **3000** (ex: `Server is running on port 3000`).
   > ⚠️ **Gardez ce terminal ouvert**, le serveur doit tourner en arrière-plan pour que l'application mobile fonctionne.

---

## 📱 Étape 2 : Configuration et Lancement de l'App Mobile (Client)

Maintenant que l'API tourne, nous allons lancer l'application mobile.

1. **Ouvrez un NOUVEAU terminal** (laissez le premier tourner) à la racine du projet.
2. Déplacez-vous dans le dossier du client :
   ```bash
   cd client
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```

### Connexion au serveur local

Pour que l'application mobile de votre téléphone puisse communiquer avec le backend sur votre ordinateur, elle a besoin de votre adresse IP locale (car `localhost` sur le téléphone ferait référence au téléphone lui-même).

1. Trouvez l'adresse IP locale de votre ordinateur :
   - Sur **Windows** : Tapez `ipconfig` dans un terminal et cherchez "Adresse IPv4" (ex: `192.168.1.x`).
   - Sur **Mac** : Tapez `ipconfig getifaddr en0`.
2. Ouvrez le fichier `client/src/api/client.js` dans votre éditeur de code.
3. Modifiez la variable `BASE_URL` (vers la ligne 16) avec votre adresse IP locale :
   ```javascript
   // Exemple si votre IP est 192.168.1.45
   const BASE_URL = "http://192.168.1.45:3000";
   ```
   _(Assurez-vous que `export const USE_MOCK = false;` pour utiliser le vrai backend)._

### Démarrage de l'application

4. Lancez l'application avec Expo :
   ```bash
   npx expo start
   ```
5. Un grand **QR Code** va s'afficher dans votre terminal.
6. **Pour tester sur votre smartphone :**
   - Assurez-vous que votre téléphone est connecté au **même réseau Wi-Fi** que votre ordinateur.
   - Ouvrez l'application **Expo Go** sur votre téléphone.
   - Scannez le QR Code (ou utilisez l'appareil photo sur iOS).
   - Le téléchargement (bundling) va commencer et l'application va s'ouvrir.

---

## 🧪 Étape 3 : Tester l'Application (Démo)

Félicitations, MamaCi tourne sur votre appareil ! Voici le parcours type pour la démo :

1. Sur l'écran d'accueil, cliquez sur "Commencer".
2. Dans le formulaire :
   - Entrez un CMU fictif (ex: `CMU-123456`).
   - Entrez un nom (ex: `Awa`).
   - Choisissez **"Je suis enceinte"**.
   - Entrez une date de terme (format JJ-MM-AAAA, ex: `15-09-2026`).
3. Vous arrivez sur le **Dashboard** avec le thème "Grossesse" (Teal/Vert).
4. Naviguez dans les différents onglets (Chatbot, Conseils, USSD).
5. Sur le Dashboard, cliquez sur **"Le bébé est arrivé ? Basculer en Mode Nourrisson"**.
6. Une modale s'ouvre : entrez la date de naissance.
7. Observez le changement : l'interface passe automatiquement au thème "Nourrisson" (Lavande/Violet) et le calendrier médical se met à jour pour afficher les rendez-vous de vaccination (PEV) !

---

## ❓ Dépannage fréquent

- **Erreur "Network Error" sur l'application :**
  Vérifiez que `BASE_URL` dans `client.js` utilise bien votre adresse IP locale actuelle, que le port 3000 est correct, et que votre pare-feu Windows/Mac ne bloque pas les connexions sur ce port.
- **Le QR code Expo ne se charge pas :**
  Appuyez sur la touche `c` dans le terminal d'Expo pour effacer le cache, puis relancez.

Bonne démo ! 🎉
