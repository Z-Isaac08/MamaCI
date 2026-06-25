// src/data/chatbotRules.js
//
// Reproduit en local la logique décrite doc Backend §5.1 : le vrai backend
// relaiera vers un LLM contraint par prompt système. En attendant, ce mock
// applique la même politique (détection de signaux d'alerte en priorité,
// honnêteté si hors périmètre) pour que le comportement visible à l'écran
// soit déjà correct.

export const ALERT_KEYWORDS = [
  'saignement', 'saigne', 'douleur intense', 'forte douleur',
  'évanoui', 'evanoui', 'convulsion', 'ne bouge plus', 'respire pas',
  'fièvre très forte', 'fievre tres forte',
];

export const ALERT_REPLY =
  "Ce que tu décris peut être sérieux. Je ne peux pas évaluer cela à ta place : " +
  "rends-toi dès maintenant au centre de santé le plus proche, ou appelle une assistance médicale. " +
  "N'attends pas une réponse en ligne pour ce type de symptôme.";

export const FALLBACK_REPLY =
  "Je ne suis pas en mesure de répondre précisément à cette question. " +
  "Je suis surtout utile pour le suivi de grossesse, la vaccination et les petits soucis du quotidien. " +
  "Pour le reste, le mieux est d'en parler à un professionnel de santé.";

export const CHATBOT_RULES = [
  {
    keywords: ['nausée', 'nausee', 'vomi', 'mal au cœur', 'mal au coeur'],
    reply:
      "Les nausées sont fréquentes en début de grossesse. Essaie de manger en petites quantités, " +
      "plus souvent dans la journée, et évite les odeurs fortes le matin. Si elles t'empêchent de manger " +
      "ou de boire normalement, parles-en à ton centre de santé.",
  },
  {
    keywords: ['fatigue', 'fatiguée', 'fatiguee', 'épuisée', 'epuisee'],
    reply:
      "La fatigue est normale, surtout en début et fin de grossesse. Repose-toi dès que possible et " +
      "veille à bien t'hydrater. Si elle devient inhabituelle ou s'accompagne d'essoufflement, " +
      "signale-le à ton prochain rendez-vous.",
  },
  {
    keywords: ['fièvre', 'fievre', 'chaud', 'température'],
    reply:
      "Une fièvre légère mérite d'être surveillée. Repose-toi, hydrate-toi bien. Si elle dépasse 38,5°C " +
      "ou dure plus d'une journée, consulte rapidement un centre de santé.",
  },
  {
    keywords: ['allaitement', 'allaiter', 'lait maternel'],
    reply:
      "L'allaitement exclusif est recommandé jusqu'à 6 mois : pas d'eau ni d'aliment en plus, " +
      "le lait maternel suffit, même par forte chaleur. Tu trouveras plus de détails dans l'espace conseils.",
  },
  {
    keywords: ['vaccin', 'pev', 'piqûre', 'piqure'],
    reply:
      "Le calendrier vaccinal (PEV) protège ton enfant contre des maladies encore présentes en Côte d'Ivoire. " +
      "Tu peux voir les prochaines échéances directement sur ton tableau de bord.",
  },
  {
    keywords: ['rendez-vous', 'rdv', 'consultation', 'cpn'],
    reply:
      "Tes prochains rendez-vous sont visibles sur ton tableau de bord, avec un rappel automatique avant " +
      "chaque échéance. Tu peux aussi vérifier ton prochain rendez-vous via le menu USSD si tu n'as pas de réseau.",
  },
  {
    keywords: ['bonjour', 'salut', 'bonsoir'],
    reply: "Bonjour ! Je suis là pour répondre à tes questions sur ta grossesse ou ton bébé. Que veux-tu savoir ?",
  },
];
