## **MAMACI** 

## **Récapitulatif technique** 

Suite aux retours du jury — Présentation intermédiaire _Ce qui s'implémente vs ce qui se documente comme perspective_ 

Hackathon 2026 — Équipe MamaCi Document de travail — Juin 2026 

MamaCi — Récapitulatif technique 

Suite retours jury 

## **Lecture de ce document** 

Le jury a formulé 7 retours lors de la présentation intermédiaire. Ce document les analyse un par un et tranche pour chacun : implémentation réelle, maquette assumée, ou perspective documentée. Pour chaque décision, le raisonnement est explicite. 

✅ **Implémenté** 

Fonctionnel et démontrable en live lors du pitch final. 

**==> picture [469 x 35] intentionally omitted <==**

🎨 **Maquetté** 

Visible dans la démo (wireframe ou écran statique), accompagné d'une explication de l'architecture prévue. Le jury voit la direction, pas juste une promesse orale. 

**==> picture [469 x 35] intentionally omitted <==**

🔭 **Perspective documentée** 

Hors délai, mais le travail de réflexion technique est fait et présentable. Le jury voit que vous avez creusé le sujet, pas juste esquivé. 

## **1. Personnalisation selon le stade de grossesse** 

✅ **Décision : Implémenter** 

Retour jury : « Plus personnaliser au cas où les mamans connaissent la solution à 3 ou 6 mois de grossesse/accouchement » 

C'est un ajustement direct de l'algorithme de génération du calendrier déjà existant — pas un nouveau chantier. L'impact démo est fort : montrer qu'une femme qui découvre l'app à 5 mois de grossesse voit un calendrier adapté à son stade réel, pas un calendrier reparti de zéro. 

## **Ce que ça change côté Frontend** 

- Ajouter un champ ou un sélecteur dans l'écran d'onboarding pour saisir le stade actuel de grossesse (en semaines ou en mois), en plus ou à la place de la date de terme 

- Afficher uniquement les échéances CPN restantes (pas celles déjà passées), avec une mention visuelle claire du stade actuel dans le tableau de bord 

Page 2 / 7 

MamaCi — Récapitulatif technique 

Suite retours jury 

- Adapter le contenu de l'espace conseils selon le trimestre en cours (conseils du 1er trimestre vs 3ème trimestre) 

## **Ce que ça change côté Backend** 

- Modifier l'algorithme de génération du calendrier CPN pour accepter en entrée soit une date de terme, soit un stade actuel (ex. 20 semaines d'aménorrhée) et calculer les échéances restantes à partir de ce point 

- Ajouter une logique de filtrage : ne retourner que les événements dont la date_prevue est supérieure ou égale à aujourd'hui 

- Permettre la mise à jour du stade si la femme corrige l'information plus tard 

## **2. Centres de santé les plus proches** 

✅ **Décision : Implémenter** 

Retour jury : « Faire apparaître les centres de santé les plus proches » 

Fonctionnalité visuellement forte en démo et rapide à mettre en place. Elle renforce directement le critère « impact sectoriel » : MamaCi ne se contente pas de rappeler un rendez-vous, elle aide aussi à trouver où aller. Une carte avec 10 à 15 centres de santé ivoiriens codés en dur suffit largement pour le pitch — pas besoin d'une base de données exhaustive. 

## **Ce que ça change côté Frontend** 

- Intégrer une carte interactive dans le tableau de bord ou dans un écran dédié (librairie react-nativemaps ou équivalent Expo) 

- Afficher les centres de santé comme marqueurs sur la carte, avec nom et distance estimée depuis la position de l'utilisatrice 

- Déclencher la géolocalisation à l'ouverture de l'écran (permission à demander proprement, avec message explicatif vulgarisé) 

- Prévoir un affichage en mode liste en fallback si la carte ne charge pas (connexion faible) 

## **Ce que ça change côté Backend** 

- Créer une collection Firestore 'health_centers' avec les données des centres (nom, coordonnées GPS, type de structure, adresse) 

Page 3 / 7 

MamaCi — Récapitulatif technique 

Suite retours jury 

- Endpoint GET /api/health-centers?lat=X&lng=Y retournant les centres triés par distance depuis la position de l'utilisatrice 

- Pour le MVP : dataset statique de 10 à 15 centres ivoiriens représentatifs (Abidjan + quelques villes secondaires), suffisant pour la démo 

_Note : une intégration à un registre officiel des établissements de santé ivoiriens est envisageable comme perspective, si ce registre est accessible._ 

## **3. Interface praticien (sage-femme / médecin)** 

## 🎨 **Décision : Maquetter** 

Retour jury : « Mettre un côté pour praticien » + « La sage-femme facilite l'installation » 

C'est le retour le plus structurant architecturalement — il introduit un deuxième type d'utilisateur avec des droits différents, un tableau de bord différent, et potentiellement une logique de liaison praticienpatiente. Impossible à implémenter solidement en une journée. En revanche, montrer un écran maquetté du tableau de bord praticien pendant le pitch, accompagné d'une explication claire de l'architecture prévue (gestion des rôles, liaison compte), est faisable et convaincant. 

## **Ce que la maquette doit montrer** 

- Écran de connexion praticien (rôle distinct de la mère) 

- Tableau de bord praticien : liste de ses patientes, statut de suivi de chacune (CPN à jour / en retard), alertes 

- Vue détaillée d'une patiente : calendrier, historique des consultations, prochaine échéance 

- Fonctionnalité d'enrôlement : la sage-femme scanne ou saisit l'identifiant CMU de la patiente pour l'inscrire directement depuis son propre appareil 

## **Architecture technique à expliquer au jury** 

- Gestion des rôles : deux types de comptes dans Firestore (role: 'mere' / role: 'praticien'), avec des règles de sécurité Firestore différenciées selon le rôle 

- Liaison praticien-patiente : une collection 'relationships' { praticien_id, profile_id } permettant au praticien de voir uniquement ses propres patientes 

- L'enrôlement par la sage-femme crée le profil de la mère directement, pré-rempli avec les informations médicales déjà connues — réduisant la friction pour les utilisatrices peu à l'aise avec le numérique 

Page 4 / 7 

MamaCi — Récapitulatif technique 

Suite retours jury 

## **4. Carnet de santé électronique** 

## 🎨 **Décision : Maquetter** 

Retour jury : « Greffer un carnet de santé électronique » 

Le carnet de santé électronique est le cœur de la vision long terme de MamaCi — il remplace le carnet papier fragile identifié comme cause principale des problèmes dans le brief initial. Mais implémenter un vrai dossier médical numérique sécurisé dépasse largement le délai restant. Un écran maquetté du 

carnet, avec une explication du modèle de données prévu et des enjeux de conformité, est la bonne réponse ici. 

## **Ce que la maquette doit montrer** 

- Écran récapitulatif du profil de santé de la mère : informations de base, groupe sanguin, antécédents importants, allergies 

- Historique des consultations prénatales : date, praticien, observations, résultats clés 

- Historique vaccinal de l'enfant (PEV) : vaccins reçus, dates, lots 

- Pièces jointes : ordonnances, résultats d'examens (photos ou PDF) 

## **Architecture technique à expliquer au jury** 

- Modèle de données : collections Firestore 'consultations' { profile_id, date, praticien_id, notes, résultats } et 'vaccinations' { profile_id, vaccin, date, lot } 

- Stockage des pièces jointes : Firebase Storage (équivalent cloud de Google Drive, inclus dans Firebase) pour les fichiers binaires 

- Conformité : souligner que les données de santé nécessitent un cadre réglementaire spécifique (chiffrement renforcé, droits d'accès stricts) — identifié comme premier chantier de production 

## **5. E-vaccin** 

🔭 **Décision : Perspective documentée** 

Retour jury : « E-vaccin, voir comment l'intégrer » 

L'intégration d'un système de vaccination électronique officiel dépend de l'existence d'une API ou d'un registre national ivoirien accessible — ce qui n'est pas établi à ce stade. Le calendrier PEV statique déjà implémenté dans le MVP couvre l'essentiel pour la démo. Ce retour du jury est une invitation à montrer que vous avez pensé à la connexion institutionnelle, pas à l'implémenter en 24h. 

Page 5 / 7 

MamaCi — Récapitulatif technique 

Suite retours jury 

## **Ce qu'on présente au jury** 

- Le calendrier PEV standard est déjà intégré dans le MVP (statique, basé sur les recommandations OMS/nationales) 

- La perspective e-vaccin consiste à remplacer ce calendrier statique par une synchronisation avec un registre vaccinal officiel, si et quand une API nationale ivoirienne devient disponible 

- L'architecture backend est déjà prévue pour cette extension : la collection CalendarEvent peut recevoir des données d'une source externe sans refonte 

- MamaCi pourrait également servir de canal de reporting vaccinal vers les autorités sanitaires (remontée anonymisée des taux de couverture PEV) 

## **6. Personnalisation avancée du parcours** 

🔭 **Décision : Perspective documentée** 

Retour jury : « Personnaliser le parcours des femmes enceintes » 

Ce retour va au-delà de la personnalisation par stade (déjà implémentée au point 1) — il demande une adaptation fine selon le profil individuel : parité (premier enfant ou non), facteurs de risque, zone géographique, niveau de maîtrise du français. C'est de la logique de profiling qui nécessite plus de données collectées, une logique de règles métier avancée, et potentiellement du machine learning à terme. Hors portée du délai, mais documentable clairement. 

## **Ce qu'on présente au jury** 

- La personnalisation basique (stade de grossesse) est déjà dans le MVP — c'est le socle 

- La personnalisation avancée s'appuie sur des variables additionnelles à collecter lors de l'onboarding étendu : parité, facteurs de risque déclarés, préférence de langue, zone géographique 

- Ces variables alimentent une logique de règles métier côté backend : si première grossesse ET zone rurale → renforcer les rappels et simplifier le niveau de langue des conseils 

- À terme : un moteur de recommandation apprenant des comportements (consultations effectuées, questions posées au chatbot) pour affiner le parcours de chaque utilisatrice 

## **Tableau de synthèse** 

Vue d'ensemble des 7 retours jury et de leur traitement. 

Page 6 / 7 

MamaCi — Récapitulatif technique 

Suite retours jury 

||||
|---|---|---|
|**Fonctionnalité**|**Frontend**|**Backend**|
||||
||||
|1. Personnalisation par stade✅|Onboarding étendu (stade actuel),<br>tableau de bord filtré|Algorithme calendrier adaptatif,<br>filtre sur date_prevue|
||||
||||
|2. Centres de santé✅|Carte interactive + liste fallback,<br>géolocalisation|Collection health_centers, endpoint<br>trié par distance|
||||
||||
|3. Interface praticien🎨|Maquette tableau de bord praticien<br>+ enrôlement|Architecture rôles + collection<br>relationships (expliquée)|
||||
||||
|4. Carnet santé électronique🎨|Maquette écran carnet<br>(consultations, vaccins, pièces<br>jointes)|Modèle données<br>consultations/vaccinations<br>(expliqué)|
||||
||||
|5. E-vaccin🔭|Calendrier PEV statique déjà en<br>place|Architecture prête pour extension<br>API externe (expliquée)|
||||
||||
|6. Personnalisation avancée🔭|—|Logique de profiling et règles métier<br>documentées|
||||



## **Message à faire passer au jury** 

**Comment présenter ces choix** 

Ne pas présenter les maquettes et perspectives comme des manques — les présenter comme une architecture de produit réfléchie. 

"Vous nous avez donné 7 directions en fin de présentation intermédiaire. En une journée, voici ce que 

nous avons implémenté et démontrons en live. Voici ce que nous avons architecturé et maquetté — vous pouvez voir la direction exacte que prend le produit. Et voici les perspectives pour lesquelles nous avons déjà fait le travail de réflexion technique, prêtes à être développées dès la phase suivante." 

C'est exactement ça, la maturité produit que le jury évalue — pas un produit qui tente tout et qui plante pendant la démo. 

Page 7 / 7 

