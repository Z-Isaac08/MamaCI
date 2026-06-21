# 🖥️ MamaCi - Backend Server

Ce dossier contient l'API et la base de données de l'application MamaCi. Il gère l'authentification (basée sur le CMU-ID), la logique métier du chatbot, le catalogue de conseils, les rappels médicaux, et les requêtes USSD.

## 🛠️ Stack Technique

- **Framework** : Node.js avec Express
- **ORM** : Prisma
- **Base de données** : SQLite (fichier local `dev.db` parfait pour le développement)

## 📁 Structure du code

```text
server/
├── prisma/
│   ├── schema.prisma       # Modèle de base de données (Profile, Event, Advice)
│   └── seed.js             # Script de remplissage (Génère Awa Konaté et Fatou Diop)
├── src/
│   ├── controllers/        # Logique métier (chatbotController, ussdController, etc.)
│   ├── middlewares/        # Formatage des réponses (res.success, res.error)
│   ├── routes/             # Définition des endpoints API
│   ├── services/           # Logique de génération (ex: création automatique du calendrier)
│   └── server.js           # Point d'entrée de l'application Express
```

## 🚀 Démarrage

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Initialiser la base de données (crée la BDD et insère les données de test) :
   ```bash
   npm run seed
   ```
   *Les profils de test créés sont `CMU-123456` (Awa, Grossesse) et `CMU-654321` (Fatou, Nourrisson).*

3. Lancer le serveur en mode développement :
   ```bash
   npm run dev
   ```
   *Le serveur écoutera sur le port 3000.*

## 🔗 Endpoints Principaux

- `POST /api/profiles` : Inscription ou reconnexion d'une maman.
- `GET /api/profiles/:id/reminders` : Récupère l'historique des rappels (plats) d'un profil.
- `POST /api/chatbot/message` : Envoie une phrase au bot. Il analyse les mots-clés et renvoie un statut (normal/alert).
- `GET /api/advice?mode=grossesse` : Récupère les fiches conseils adaptées au statut de la maman.
- `POST /api/ussd` : Simule l'endpoint Webhook que taperait un agrégateur télécom (Africa's Talking) pour fournir le menu USSD de MamaCi.
