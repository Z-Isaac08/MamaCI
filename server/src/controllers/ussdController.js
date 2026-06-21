import { prisma } from "../../db/prisma.js";

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export const processUssd = async (req, res) => {
  try {
    const { text, cmu_id } = req.body;
    
    // Le texte reçu de l'opérateur USSD est souvent l'historique des saisies (ex: "1*2")
    const inputArray = text ? text.split('*') : [];
    const currentInput = inputArray[inputArray.length - 1] || "";
    
    // 1. Authentification USSD (normalement via numéro de téléphone, ici on simule avec cmu_id)
    if (!cmu_id) {
      return res.status(200).send("END Erreur: Veuillez fournir votre CMU-ID.");
    }

    const profile = await prisma.profile.findUnique({
      where: { cmu_id },
      include: {
        events: {
          where: { statut: "a_venir" },
          orderBy: { date_prevue: "asc" }
        }
      }
    });

    if (!profile) {
      return res.status(200).send("END Profil non trouvé. Veuillez vous inscrire d'abord.");
    }

    // 2. Gestion des menus
    const nextEvent = profile.events[0];

    // Menu Principal (texte vide)
    if (text === "") {
      let response = `CON MAMACI\n-----------------\n`;
      response += `1. Voir mon prochain RDV\n`;
      response += `2. Confirmer le RDV\n`;
      response += `3. Reporter\n`;
      response += `0. Quitter`;
      return res.status(200).send(response);
    }

    // Option 1 : Prochain RDV
    if (text === "1") {
      let response = `CON MAMACI\n-----------------\n`;
      if (nextEvent) {
        response += `${nextEvent.label}\n`;
        response += `Le ${formatDate(nextEvent.date_prevue)}\n\n`;
      } else {
        response += `Aucun RDV à venir\n\n`;
      }
      response += `1. Confirmer\n`;
      response += `2. Reporter\n`;
      response += `0. Retour`;
      return res.status(200).send(response);
    }

    // Option 2 (depuis le menu principal) ou Option 1 (depuis le menu 1) : Confirmer
    if (text === "2" || text === "1*1") {
      // Dans un vrai cas, on ferait un prisma.update ici.
      return res.status(200).send("END Rendez-vous confirme.\nMerci.\n");
    }

    // Option 3 (depuis le menu principal) ou Option 2 (depuis le menu 1) : Reporter
    if (text === "3" || text === "1*2") {
      return res.status(200).send("END Demande de report enregistree.\nUn agent te contactera.\n");
    }

    // Quitter
    if (currentInput === "0") {
      return res.status(200).send("END Merci d'avoir utilise MamaCi.");
    }

    // Par défaut, retourner le menu principal si saisie invalide
    return res.status(200).send("CON Choix invalide.\n1. Prochain RDV\n0. Quitter");

  } catch (error) {
    console.error("Erreur USSD :", error);
    return res.status(500).send("END Erreur système temporaire.");
  }
};
