import { prisma } from "../../db/prisma.js";

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body; // "a_venir", "fait", "manque"

    if (!["a_venir", "fait", "manque"].includes(statut)) {
      return res.error("INVALID_STATUS", "Statut invalide", 400);
    }

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: { statut }
    });

    res.success(event);
  } catch (error) {
    console.error("Erreur mise à jour statut événement :", error);
    if (error.code === 'P2025') {
        return res.error("NOT_FOUND", "Événement introuvable", 404);
    }
    res.error("SERVER_ERROR", "Erreur lors de la mise à jour de l'événement", 500);
  }
};

export const triggerReminder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Pour le MVP: on cherche le reminder associé à cet event et on le passe à declenche: true
    const reminders = await prisma.reminder.findMany({
      where: { event_id: id }
    });

    if (reminders.length === 0) {
      return res.error("NOT_FOUND", "Aucun rappel trouvé pour cet événement", 404);
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id: reminders[0].id },
      data: { declenche: true }
    });

    // En conditions réelles (MVP mobile), c'est ici qu'on déclencherait une notification Expo (expo-server-sdk)
    // Pour la démo, on simule juste le succès.

    res.success({ message: "Rappel déclenché avec succès", reminder: updatedReminder });
  } catch (error) {
    console.error("Erreur déclenchement rappel :", error);
    res.error("SERVER_ERROR", "Erreur lors du déclenchement du rappel", 500);
  }
};
