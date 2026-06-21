## **MAMACI** 

## **Documentation Frontend** 

Application mobile — React Native (Expo) 

Hackathon 2026 — Équipe MamaCi Document de travail — Juin 2026 

React Native / Expo 

MamaCi — Documentation Frontend 

## **Sommaire** 

Page 2 / 9 

React Native / Expo 

MamaCi — Documentation Frontend 

## **1. Stack & setup** 

## **1.1 Choix techniques** 

**Décision d'équipe** 

React Native via Expo. Expo permet de tester l'application sur un téléphone réel en quelques minutes (via Expo Go), sans configuration Xcode ou Android Studio — un atout déterminant sur un délai de 4 jours. 

Expo simplifie également la gestion des permissions, des notifications et du build final, ce qui réduit les frictions techniques en fin de parcours, au moment où l'équipe a le moins de marge. 

## **1.2 Initialisation du projet** 

```
npx create-expo-app@latest mamaci-app
cd mamaci-app
npx expo install react-navigation expo-notifications
```

Pour tester sur device réel : installer l'application Expo Go sur le téléphone, puis lancer : 

```
npx expo start
```

Le QR code généré permet un rechargement à chaud (hot reload) directement sur le téléphone — utile pour itérer vite pendant les 4 jours. 

## **1.3 Structure de dossiers** 

```
mamaci-app/
├── App.js
├── src/
│   ├── screens/        // un fichier par écran
│   ├── components/     // composants réutilisables (Bouton, Carte, Champ...)
│   ├── navigation/      // configuration de la navigation
│   ├── context/         // state global (ProfileContext, etc.)
│   ├── api/             // client HTTP + appels au backend
│   ├── theme/           // couleurs, typographie, espacements
│   └── data/            // contenu statique (fiches conseils, données démo)
└── assets/              // images, icônes, polices
```

## **1.4 Dépendances clés** 

|||
|---|---|
|**Bibliothèque**|**Rôle**|
|||
|||
|@react-navigation/native|Navigation entre écrans|
|||
|||
|@react-navigation/native-stack|Navigation de type pile (stack)|
|||



Page 3 / 9 

React Native / Expo 

MamaCi — Documentation Frontend 

|||
|---|---|
|**Bibliothèque**|**Rôle**|
|||
|||
|axios (ou fetch natif)|Appels HTTP vers le backend Express|
|||
|||
|expo-notifications|Notifications locales simulant les rappels|
|||
|||
|@react-native-async-storage/async-storage|Persistance locale légère (session, dernier calendrier<br>connu)|
|||



## **2. Architecture de navigation** 

## **2.1 Arborescence des écrans** 

Le parcours principal suit une logique linéaire à l'entrée (onboarding), puis s'ouvre sur une navigation par onglets une fois le profil créé. 

**1.** Bienvenue — écran d'entrée, premier lancement uniquement 

**2.** Onboarding — saisie identifiant CMU + statut + date clé 

**3.** Tableau de bord — écran d'accueil après onboarding (Tab) 

**4.** Chatbot — assistant conversationnel (Tab) 

**5.** Espace conseils — fiches pratiques (Tab) 

**6.** Simulation USSD — écran dédié, accessible depuis le tableau de bord 

## **2.2 Stack vs Tab navigation** 

## **Recommandation** 

Stack Navigator pour Bienvenue → Onboarding (flux linéaire, pas de retour en arrière logique). Puis bascule vers un Tab Navigator pour Tableau de bord / Chatbot / Conseils, une fois le profil créé — c'est la structure la plus naturelle pour un usage quotidien de l'app. 

## **2.3 Gestion de la session locale** 

Au lancement de l'application, avant d'afficher quoi que ce soit, l'app doit vérifier si un profil existe déjà localement (AsyncStorage). 

- Si un profil existe → redirection directe vers le Tableau de bord (pas de re-onboarding à chaque ouverture) 

- Si aucun profil → écran Bienvenue 

Cette vérification doit être purement locale, sans appel réseau bloquant — important pour ne pas pénaliser une utilisatrice en connexion instable au lancement de l'app. 

Page 4 / 9 

React Native / Expo 

MamaCi — Documentation Frontend 

## **3. Écran par écran — specs UI** 

Pour chaque écran du parcours : composants nécessaires, données affichées, et états à gérer (chargement, erreur, vide). 

## **3.1 Bienvenue** 

|||
|---|---|
|**Élément**|**Détail**|
|||
|||
|Composants|Logo MamaCi, accroche courte, bouton « Commencer »|
|||
|||
|Données|Aucune (statique)|
|||
|||
|États|Aucun état réseau — écran 100% local|
|||



## **3.2 Onboarding** 

|||
|---|---|
|**Élément**|**Détail**|
|||
|||
|Composants|Champ identifiant CMU, sélecteur de statut (Enceinte / Déjà mère), champ date<br>(terme ou naissance), bouton de validation|
|||
|||
|Données envoyées|cmu_id, statut, date associée|
|||
|||
|États|Erreur de format (validation locale avant tout appel réseau), chargement<br>pendant la création du profil, erreur réseau si le backend ne répond pas|
|||
|||
|**Point d'attention**<br>Toujours valider le format de l'identifiant CMU en local (expression régulière) avant le moindre appel au<br>backend. Cela évite un aller-retour réseau évitable pour une simple erreur de saisie — un réflexe<br>important vu la connectivité instable de la cible utilisatrice.||
|||



## **3.3 Tableau de bord** 

|||
|---|---|
|**Élément**|**Détail**|
|||
|||
|Composants|Carte « Prochain rendez-vous », liste du calendrier généré (CPN ou PEV selon le<br>mode actif), accès rapide au chatbot et à l'espace conseils, accès à la simulation<br>USSD|
|||
|||
|Données affichées|Mode actif (Grossesse / Nourrisson), liste des échéances avec statut (à venir / fait<br>/ manqué)|
|||
|||
|États|Chargement initial, liste vide (calendrier non encore généré), erreur réseau avec<br>affichage du dernier calendrier connu en cache|
|||



## **3.4 Chatbot** 

Page 5 / 9 

React Native / Expo 

MamaCi — Documentation Frontend 

|||
|---|---|
|**Élément**|**Détail**|
|||
|||
|Composants|Fil de conversation (bulles), champ de saisie, indicateur de frappe pendant la<br>réponse|
|||
|||
|Données|Historique de la session en cours (pas de persistance long terme nécessaire pour<br>le MVP)|
|||
|||
|États|Envoi en cours, erreur si l'API du modèle de langage ne répond pas (message de<br>repli explicite), affichage spécifique pour un message de redirection vers un<br>centre de santé|
|||



## **3.5 Espace conseils** 

|||
|---|---|
|**Élément**|**Détail**|
|||
|||
|Composants|Liste de fiches (carte avec titre + image/icône), écran de détail au clic|
|||
|||
|Données|Fiches filtrées selon le mode actif du profil (Grossesse ou Nourrisson)|
|||
|||
|États|Contenu pouvant être statique (embarqué dans l'app) pour fiabiliser la démo,<br>sans dépendance réseau|
|||



## **3.6 Simulation USSD** 

## **Périmètre confirmé** 

Mockup visuel uniquement pour le MVP — pas d'intégration réelle à un agrégateur USSD. Une vraie intégration (type Africa's Talking sandbox) est documentée comme perspective dans le document Backend, mais reste hors scope du MVP au vu du délai. 

|||
|---|---|
|**Élément**|**Détail**|
|||
|||
|Composants|Écran simulant l'apparence d'un téléphone basique (fond sombre, texte simple),<br>menu numéroté|
|||
|||
|Exemple de menu|1. Voir mon prochain RDV — 2. Confirmer le RDV — 3. Reporter — 0. Quitter|
|||
|||
|Données|Lecture du même calendrier que le Tableau de bord (même source de vérité)|
|||
|||
|États|Écran 100% local pour le MVP, aucune dépendance réseau externe|
|||



## **4. Gestion des appels API** 

## **4.1 Convention d'appel** 

Centraliser tous les appels au backend dans un seul module (src/api/client.js), avec une base URL configurable selon l'environnement (local / démo). 

Page 6 / 9 

React Native / Expo 

MamaCi — Documentation Frontend 

```
// src/api/client.js
const BASE_URL = 'http://<ip-locale>:3000';
export async function apiGet(path) { ... }
export async function apiPost(path, body) { ... }
```

## **4.2 Gestion des erreurs réseau** 

Chaque appel API doit prévoir un comportement explicite en cas d'échec, plutôt qu'un écran bloqué ou un crash — la connectivité instable n'est pas un cas limite ici, c'est une condition normale d'usage. 

- Timeout court (quelques secondes) pour ne pas bloquer l'interface 

- Message d'erreur clair et vulgarisé, jamais un message technique brut 

- Possibilité de réessayer sans recharger toute l'application 

## **4.3 Stratégie offline minimale** 

**Pour le MVP** 

Stocker en local (AsyncStorage) le dernier calendrier reçu avec succès. En cas d'échec réseau au chargement du Tableau de bord, afficher ce dernier calendrier connu avec une mention discrète « dernière mise à jour le... » plutôt qu'un écran d'erreur vide. 

## **5. State management** 

## **5.1 Choix : Context API** 

Pour le périmètre du MVP, la Context API native de React suffit largement — l'ajout d'une librairie comme Redux apporterait de la complexité sans bénéfice réel sur 4 jours de développement. 

## **5.2 Répartition global vs local** 

||||
|---|---|---|
|**Donnée**|**Portée**|**Raison**|
||||
||||
|Profil utilisatrice (mode, identifiant, dates)|Global (Context)|Utilisé sur quasiment tous les écrans|
||||
||||
|Calendrier de suivi|Global (Context)|Affiché sur Tableau de bord et Simulation<br>USSD|
||||
||||
|État des formulaires (onboarding, chatbot)|Local (useState)|Propre à l'écran, pas besoin de partage|
||||
||||
|Historique de conversation chatbot|Local (useState)|Session uniquement, pas de persistance<br>nécessaire|
||||



## **6. Style & charte graphique** 

Page 7 / 9 

React Native / Expo 

MamaCi — Documentation Frontend 

## **6.1 Lien avec le travail UI/UX** 

Cette section pose une base de système de design minimal, à ajuster avec les maquettes produites par Bamba Noura (UI/UX). L'objectif est d'avoir une cohérence visuelle dès le Jour 1, sans attendre une maquette complète pour commencer à coder. 

## **6.2 Palette de couleurs proposée** 

||||
|---|---|---|
|**Usage**|**Couleur**|**Code**|
||||
||||
|Couleur principale (actions, accents)|Teal moderne|#0F766E|
||||
||||
|Couleur secondaire (alertes, accroche)|Corail doux|#F97316|
||||
||||
|Texte principal|Charcoal|#1F2937|
||||
||||
|Texte secondaire / discret|Gris moyen|#6B7280|
||||
||||
|Fond de carte / section|Teal très pâle|#F0FDFA|
||||



_Le choix d'un teal plutôt qu'un bleu corporate classique distingue MamaCi visuellement tout en restant associé au registre santé/bien-être — à valider avec Bamba Noura selon la direction artistique retenue._ 

## **6.3 Typographie** 

- Police système par défaut (San Francisco sur iOS, Roboto sur Android) — pas de police custom à charger, pour limiter le temps de setup 

- Titres d'écran : taille large, gras 

- Corps de texte : taille confortable, jamais en dessous de 16px — important pour la lisibilité auprès du persona Mariam, peu à l'aise avec l'écrit 

## **6.4 Composants réutilisables à prévoir** 

- Bouton primaire / secondaire 

- Carte d'information (utilisée pour le calendrier, les conseils) 

- Champ de texte avec état d'erreur intégré 

- Bulle de message (chatbot) 

- Badge de statut (à venir / fait / manqué) 

## **7. Checklist avant démo** 

À valider impérativement avant la présentation de mardi et mercredi. 

Page 8 / 9 

React Native / Expo 

MamaCi — Documentation Frontend 

- Compte(s) de démonstration pré-rempli(s) avec un calendrier déjà généré, pour ne pas dépendre d'une saisie en direct fragile 

- Application testée sur un device réel (pas seulement sur émulateur), idéalement celui utilisé le jour J 

- Test du parcours complet en conditions de connexion dégradée (mode avion partiel, Wi-Fi coupé) 

- Plan B validé : que montrer si le backend ou le chatbot externe est indisponible pendant le pitch 

- Notification de rappel testée et déclenchable de façon fiable en live 

- Écran de simulation USSD testé indépendamment de toute connexion réseau 

Page 9 / 9 

