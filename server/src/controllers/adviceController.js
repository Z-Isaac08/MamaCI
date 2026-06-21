export const getAdvice = async (req, res) => {
  try {
    const { mode } = req.query; // grossesse ou nourrisson

    // Pour le MVP, on renvoie une liste statique alignée sur le format attendu par l'app mobile
    const adviceList = [
      {
        id: "g1",
        title: "Des aliments locaux riches en fer",
        summary: "Feuilles de patate douce, foie, haricots, baobab : où trouver du fer dans ton assiette ivoirienne.",
        body: "Pendant la grossesse, les besoins en fer augmentent fortement. Pas besoin de produits importés : les feuilles de patate douce, le foie de bœuf, les haricots (niébé) et la poudre de baobab (pain de singe) sont d'excellentes sources locales et accessibles. Associe-les à un fruit riche en vitamine C (orange, mangue) pour une meilleure absorption.",
        tag: "Nutrition",
        mode: "grossesse",
      },
      {
        id: "g2",
        title: "Avant de prendre un médicament ou une tisane",
        summary: "Un symptôme la nuit ? Le réflexe à avoir avant l'automédication.",
        body: "Beaucoup de médicaments courants et certaines tisanes traditionnelles peuvent présenter un risque pendant la grossesse. Avant de prendre quoi que ce soit sans avis médical, pose la question au chatbot MamaCi ou contacte ton centre de santé. Ce réflexe simple peut éviter une complication évitable.",
        tag: "Prévention",
        mode: "grossesse",
      },
      {
        id: "g3",
        title: "Pourquoi ne sauter aucune CPN",
        summary: "Chaque consultation prénatale détecte des risques invisibles à l'œil nu.",
        body: "Une consultation prénatale ne sert pas qu'à vérifier que tout va bien : elle permet de détecter tôt des risques comme l'hypertension ou l'anémie, souvent sans aucun symptôme ressenti. MamaCi te rappelle chaque rendez-vous pour que tu n'aies plus à t'en souvenir seule.",
        tag: "Suivi",
        mode: "grossesse",
      },
      {
        id: "n1",
        title: "L'allaitement exclusif, jusqu'à 6 mois",
        summary: "Pas d'eau, pas de bouillie : pourquoi le lait maternel suffit les 6 premiers mois.",
        body: "L'allaitement exclusif (uniquement le lait maternel, sans eau ni aliment) pendant les 6 premiers mois protège ton bébé contre de nombreuses infections, y compris en saison chaude. Même par forte chaleur, le lait maternel couvre ses besoins en eau.",
        tag: "Allaitement",
        mode: "nourrisson",
      },
      {
        id: "n2",
        title: "Pourquoi respecter le calendrier vaccinal",
        summary: "Chaque vaccin du PEV protège contre une maladie encore présente en Côte d'Ivoire.",
        body: "Le BCG, la Polio, le Penta et les autres vaccins du PEV protègent ton enfant contre des maladies graves encore actives dans le pays. Un vaccin manqué peut généralement être rattrapé — mais plus tôt il est fait, mieux ton enfant est protégé.",
        tag: "Vaccination",
        mode: "nourrisson",
      },
      {
        id: "n3",
        title: "Reconnaître un signe qui doit alerter",
        summary: "Fièvre, refus de téter, somnolence inhabituelle : quand consulter sans attendre.",
        body: "Chez un nourrisson, certains signes nécessitent une consultation rapide : fièvre élevée, refus de téter, somnolence inhabituelle ou difficulté à respirer. En cas de doute, utilise le chatbot MamaCi : il t'oriente vers un centre de santé si besoin.",
        tag: "Alerte",
        mode: "nourrisson",
      },
    ];

    const filteredAdvice = mode 
      ? adviceList.filter(a => a.mode === mode) 
      : adviceList;

    res.success(filteredAdvice);
  } catch (error) {
    console.error("Erreur récupération conseils :", error);
    res.error("SERVER_ERROR", "Erreur lors de la récupération des conseils", 500);
  }
};

