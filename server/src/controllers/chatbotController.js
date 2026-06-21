export const processMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.error("INVALID_FORMAT", "Le message est manquant", 400);
    }

    const lowerMessage = message.toLowerCase();

    // Détection des signaux d'alerte selon la spécification (Section 5.1)
    const alertKeywords = ["saignement", "douleur", "fièvre", "urgence", "sang", "malaise"];
    const isAlert = alertKeywords.some(kw => lowerMessage.includes(kw));

    if (isAlert) {
      return res.success({
        reply: "⚠️ Alerte Santé : Vos symptômes nécessitent une attention médicale. Veuillez vous rendre immédiatement au centre de santé le plus proche ou consulter un professionnel de santé.",
        isAlert: true
      });
    }

    // MOCK: Réponse simulée pour fonctionner 100% hors-ligne (Hackathon MVP)
    const mockResponses = [
      "C'est une excellente question. N'oubliez pas de bien vous hydrater tout au long de la journée.",
      "Il est tout à fait normal de ressentir cela. Prenez le temps de vous reposer.",
      "Pour toute question médicale spécifique, n'hésitez pas à en parler lors de votre prochaine consultation (CPN).",
      "Votre santé et celle de votre bébé sont prioritaires. Continuez à suivre le calendrier de l'application.",
      "Mangez équilibré et essayez de faire de courtes marches si vous vous en sentez capable."
    ];
    
    // On prend une réponse au hasard
    const randomReply = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    res.success({
      reply: randomReply,
      isAlert: false
    });

  } catch (error) {
    console.error("Erreur chatbot :", error);
    res.error("SERVER_ERROR", "Erreur lors du traitement du message", 500);
  }
};
