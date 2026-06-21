## **MAMACI** 

## **Documentation Backend** 

API — Express.js & Firebase 

Hackathon 2026 — Équipe MamaCi Document de travail — Juin 2026 

Express.js / Firebase 

MamaCi — Documentation Backend 

## **Sommaire** 

Page 2 / 9 

Express.js / Firebase 

MamaCi — Documentation Backend 

## **1. Stack & setup** 

## **1.1 Choix techniques** 

**Décision d'équipe** 

Express.js pour l'API, Firebase (Firestore + Authentication + Cloud Functions) comme plateforme managée. Ce choix évite toute gestion d'infrastructure et permet de concentrer le temps disponible sur la logique métier plutôt que sur le déploiement. 

Firestore est une base de données documentaire NoSQL — adaptée à des entités relativement simples et peu interconnectées comme celles de MamaCi (profil, calendrier, rappels). 

## **1.2 Initialisation du projet** 

```
mkdir mamaci-api && cd mamaci-api
npm init -y
npm install express cors dotenv firebase-admin
npm install --save-dev nodemon
```

Configuration Firebase : créer un projet sur la console Firebase, activer Firestore, générer une clé de service (compte de service) pour l'accès admin depuis le backend. 

## **1.3 Structure de dossiers** 

```
mamaci-api/
├── server.js              // point d'entrée
├── src/
│   ├── routes/            // un fichier par ressource (profile, calendar, chatbot...)
│   ├── controllers/       // logique de traitement des requêtes
│   ├── services/          // logique métier réutilisable (génération calendrier...)
│   ├── models/            // structure des entités Firestore
│   └── config/            // initialisation Firebase, variables d'environnement
└── .env                   // clés et secrets (non versionné)
```

## **1.4 Dépendances clés** 

|||
|---|---|
|**Bibliothèque**|**Rôle**|
|||
|||
|express|Framework serveur HTTP / définition des routes|
|||
|||
|firebase-admin|Accès à Firestore et Authentication depuis le backend|
|||
|||
|cors|Autoriser les requêtes depuis l'application mobile|
|||
|||
|dotenv|Gestion des variables d'environnement (clés API, config)|
|||



Page 3 / 9 

Express.js / Firebase 

MamaCi — Documentation Backend 

## **2. Modèle de données** 

Trois collections Firestore suffisent pour couvrir l'intégralité du périmètre fonctionnel du MVP. Pas de table d'authentification complexe : l'identifiant CMU sert de clé d'accès simple, une limite assumée du MVP (voir section 6). 

## **2.1 Collection Profile** 

||||
|---|---|---|
|**Champ**|**Type**|**Description**|
||||
||||
|id|string|Identifiant unique du profil (généré par Firestore)|
||||
||||
|cmu_id|string|Identifiant CMU saisi par l'utilisatrice|
||||
||||
|mode|string|« grossesse » ou « nourrisson »|
||||
||||
|date_reference|date|Date de terme (mode grossesse) ou date de naissance (mode<br>nourrisson)|
||||
||||
|created_at|timestamp|Date de création du profil|
||||



## **2.2 Collection CalendarEvent** 

||||
|---|---|---|
|**Champ**|**Type**|**Description**|
||||
||||
|id|string|Identifiant unique de l'événement|
||||
||||
|profile_id|string|Référence vers le profil concerné|
||||
||||
|type|string|Type d'échéance (ex. CPN_1, CPN_2, PEV_BCG, PEV_DTC1...)|
||||
||||
|date_prevue|date|Date calculée de l'échéance|
||||
||||
|statut|string|« a_venir », « fait » ou « manque »|
||||



## **2.3 Collection Reminder** 

||||
|---|---|---|
|**Champ**|**Type**|**Description**|
||||
||||
|id|string|Identifiant unique du rappel|
||||
||||
|event_id|string|Référence vers l'échéance concernée|
||||
||||
|canal|string|« app » (notification locale) — seul canal du MVP|
||||
||||
|declenche|boolean|Indique si le rappel a déjà été déclenché|
||||



_Le canal SMS/USSD réel n'est pas modélisé ici car hors périmètre du MVP (voir section 5.2, perspective post-hackathon)._ 

Page 4 / 9 

Express.js / Firebase 

MamaCi — Documentation Backend 

## **3. Endpoints API** 

Liste des routes nécessaires pour couvrir le parcours utilisateur complet (section 9 du cahier des charges). 

## **3.1 Profil & onboarding** 

||||
|---|---|---|
|**Méthode**|**Route**|**Description**|
||||
||||
|POST|/api/profiles|Crée un profil à partir de l'identifiant CMU, du statut et<br>de la date associée|
||||
||||
|GET|/api/profiles/:id|Récupère un profil existant|
||||
||||
|PATCH|/api/profiles/:id/mode|Confirme la bascule Grossesse → Nourrisson<br>(déclenchée manuellement, pas par cron)|
||||



## **3.2 Calendrier de suivi** 

||||
|---|---|---|
|**Méthode**|**Route**|**Description**|
||||
||||
|GET|/api/profiles/:id/calendar|Retourne la liste des échéances générées pour ce<br>profil|
||||
||||
|POST|/api/profiles/:id/calendar/generate|Déclenche la génération du calendrier (appelé<br>automatiquement après onboarding)|
||||
||||
|PATCH|/api/events/:id/status|Met à jour le statut d'une échéance (fait /<br>manqué)|
||||



## **3.3 Rappels** 

||||
|---|---|---|
|**Méthode**|**Route**|**Description**|
||||
||||
|POST|/api/events/:id/trigger-reminder|Déclenche manuellement un rappel pour une<br>échéance — utilisé pour la démo en direct|
||||
||||
|GET|/api/profiles/:id/reminders|Liste les rappels déclenchés pour un profil|
||||



## **3.4 Chatbot** 

||||
|---|---|---|
|**Méthode**|**Route**|**Description**|
||||
||||
|POST|/api/chatbot/message|Envoie un message utilisatrice, retourne la<br>réponse du modèle de langage (ou redirection si<br>signal d'alerte)|
||||



## **3.5 Conseils** 

Page 5 / 9 

Express.js / Firebase 

MamaCi — Documentation Backend 

||||
|---|---|---|
|**Méthode**|**Route**|**Description**|
||||
||||
|GET|/api/advice?mode=grossesse|Retourne les fiches conseils filtrées selon le mode<br>actif du profil|
||||



## **3.6 Format de réponse et erreurs** 

Convention commune à tous les endpoints, pour que le frontend puisse traiter les réponses de façon uniforme : 

```
// Succès
```

```
{ "success": true, "data": { ... } }
```

```
// Erreur
{ "success": false, "error": { "code": "INVALID_FORMAT", "message": "..." } }
```

- 400 — Requête invalide (format incorrect, champ manquant) 

- 404 — Ressource introuvable (profil, événement) 

- 500 — Erreur serveur ou service externe indisponible (chatbot) 

## **4. Logique métier clé** 

## **4.1 Génération du calendrier CPN / PEV** 

À partir d'une date de référence (terme ou naissance), le backend calcule automatiquement la liste des échéances standard. 

- Mode Grossesse (CPN) : calcul des dates de consultation à partir de la date de terme, en remontant selon l'espacement standard recommandé (à confirmer avec une source médicale officielle ivoirienne pour les intervalles exacts) 

- Mode Nourrisson (PEV) : calcul des dates de vaccination à partir de la date de naissance, selon le calendrier vaccinal national 

## **Point à valider en équipe** 

Le document source ne précise pas les intervalles exacts du calendrier CPN/PEV ivoirien. Il est recommandé de figer une version simplifiée (ex. 4 à 5 échéances clés) suffisante pour la démo, plutôt que de chercher l'exhaustivité médicale en 4 jours. 

## **4.2 Bascule de mode (Grossesse → Nourrisson)** 

Comme décidé en réflexion d'équipe, la bascule n'est pas automatique via un job planifié (cron), mais confirmée par l'utilisatrice à l'ouverture de l'app après la date de terme. 

Page 6 / 9 

Express.js / Firebase 

MamaCi — Documentation Backend 

- Avantage : contrôle total du moment du déclenchement, important pour une démo en direct 

- Avantage : pas de dépendance à un scheduler externe à mettre en place et tester en 4 jours 

- Implémentation : un appel explicite à PATCH /api/profiles/:id/mode, déclenché depuis l'app après confirmation utilisatrice 

## **4.3 Déclenchement du rappel** 

Pour le MVP, le rappel n'est pas déclenché par un job planifié en tâche de fond, mais via un appel explicite à l'endpoint dédié — ce qui permet de le démontrer de façon fiable et contrôlée pendant le pitch. 

**Pour la démo** 

Prévoir un bouton ou une action cachée dans l'app permettant de déclencher manuellement le rappel au moment voulu pendant la présentation, plutôt que d'attendre une échéance réelle ou un cron. 

## **5. Intégrations externes** 

## **5.1 API du chatbot (modèle de langage)** 

Le backend relaie les messages de l'utilisatrice vers une API de modèle de langage externe, en encadrant strictement sa réponse via un prompt système. 

- Le prompt système limite le périmètre du chatbot à la santé maternelle et infantile 

- Détection de mots-clés associés à un signal d'alerte (ex. saignement, douleur intense) → réponse de redirection systématique vers un centre de santé, sans tentative de diagnostic 

- En cas de question hors périmètre, le chatbot doit répondre honnêtement qu'il ne peut pas traiter la demande plutôt que d'inventer une réponse 

Prévoir un comportement de repli si l'API externe est indisponible (timeout, erreur) : message d'erreur clair côté app plutôt qu'un écran bloqué — un point à tester avant la démo. 

## **5.2 USSD réel — perspective post-hackathon** 

**Décision d'équipe : hors périmètre du MVP** 

Au vu du délai critique, l'intégration USSD réelle n'est pas développée pour le MVP. Le concept est démontré côté frontend via un mockup visuel (voir doc Frontend, section 3.6). 

Une vraie intégration a été identifiée comme faisable techniquement pour une phase ultérieure, via un agrégateur proposant un environnement sandbox gratuit (ex. Africa's Talking), permettant de construire un véritable endpoint USSD sans dépendre d'un accord avec un opérateur télécom ni d'une démarche réglementaire. 

Page 7 / 9 

Express.js / Firebase 

MamaCi — Documentation Backend 

Présenter ce point au jury comme une prochaine étape technique déjà identifiée et documentée, et non comme une vague intention — cela renforce la crédibilité technique sans avoir nécessité de temps de développement dédié. 

## **6. Sécurité minimale viable** 

Le document source ne prévoit pas de gestion complète de la conformité sur les données de santé pour le MVP. Ce qui suit distingue ce qui est fait de ce qui est assumé comme limite, à présenter clairement au jury si la question est posée. 

## **6.1 Ce qui est mis en place** 

- Validation systématique des entrées côté backend (format, champs requis), en plus de la validation locale côté app 

- Configuration CORS limitant les origines autorisées à appeler l'API 

- Variables sensibles (clés API, identifiants Firebase) en variables d'environnement, jamais en dur dans le code ni versionnées 

## **6.2 Limites assumées du MVP** 

- Pas d'authentification forte (mot de passe, OTP) — l'identifiant CMU sert de clé d'accès simple 

- Pas de chiffrement applicatif dédié au-delà de ce que Firebase fournit nativement 

- Pas de conformité réglementaire complète sur les données de santé (à anticiper en architecture pour une version ultérieure, non implémentée pour le MVP) 

## **Pour le pitch** 

Si le jury interroge l'équipe sur ce point, la meilleure réponse est l'honnêteté assumée : ce sont des choix de priorisation délibérés pour un MVP de 4 jours, déjà identifiés comme premiers chantiers d'une version de production. 

## **7. Checklist avant démo** 

À valider impérativement avant la présentation de mardi et mercredi. 

- Données de seed (profils, calendriers de démonstration) préchargées dans Firestore 

Page 8 / 9 

Express.js / Firebase 

MamaCi — Documentation Backend 

- Tous les endpoints testés individuellement (via Postman ou équivalent) avant le test d'intégration avec l'app 

- Comportement de repli vérifié si l'API du chatbot externe est indisponible le jour J 

- Variables d'environnement de production (clés Firebase, clé API LLM) configurées sur l'environnement utilisé pour la démo, pas seulement en local 

- Endpoint de déclenchement manuel du rappel testé et fiable pour la démonstration en direct 

- Logs serveur consultables rapidement en cas d'incident pendant le pitch, pour diagnostiquer vite sans bloquer la présentation 

Page 9 / 9 

