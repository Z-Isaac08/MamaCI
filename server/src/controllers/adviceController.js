export const getAdvice = async (req, res) => {
  try {
    const { mode } = req.query; // grossesse ou nourrisson

    // Pour le MVP, on renvoie une liste statique
    const adviceList = [
      {
        id: 1,
        titre: "Importance du repos",
        mode: "grossesse",
        contenu: "Prenez le temps de vous reposer au moins 1 heure par jour..."
      },
      {
        id: 2,
        titre: "Alimentation équilibrée",
        mode: "grossesse",
        contenu: "Mangez beaucoup de légumes et de fruits pour le bien-être du bébé..."
      },
      {
        id: 3,
        titre: "L'allaitement maternel",
        mode: "nourrisson",
        contenu: "Le lait maternel est le meilleur aliment pour votre bébé..."
      },
      {
        id: 4,
        titre: "La vaccination, un bouclier",
        mode: "nourrisson",
        contenu: "Respectez le calendrier vaccinal pour protéger votre bébé des maladies graves."
      }
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
