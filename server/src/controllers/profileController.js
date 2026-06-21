import { prisma } from "../../db/prisma.js";
import { generateEventsForProfile } from "../services/calendarService.js";

export const createProfile = async (req, res) => {
  try {
    const { cmu_id, nom, mode, date_reference } = req.body;
    
    if (!cmu_id || !mode || !date_reference) {
      return res.error("INVALID_FORMAT", "Champs obligatoires manquants", 400);
    }

    const profile = await prisma.profile.create({
      data: {
        cmu_id,
        nom: nom || null,
        mode,
        date_reference: new Date(date_reference),
      },
    });

    res.success(profile, 201);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.error("ALREADY_EXISTS", "Un profil avec cet identifiant CMU existe d\u00e9j\u00e0", 400);
    }
    console.error("Erreur cr\u00e9ation de profil :", error);
    res.error("SERVER_ERROR", "Erreur lors de la cr\u00e9ation du profil", 500);
  }
};

export const loginProfile = async (req, res) => {
  try {
    const { cmu_id } = req.body;

    if (!cmu_id) {
      return res.error("INVALID_FORMAT", "L'identifiant CMU est requis", 400);
    }

    const profile = await prisma.profile.findUnique({
      where: { cmu_id },
    });

    if (!profile) {
      return res.error("NOT_FOUND", "Aucun profil trouv\u00e9 avec cet identifiant CMU", 404);
    }

    res.success(profile);
  } catch (error) {
    console.error("Erreur connexion profil :", error);
    res.error("SERVER_ERROR", "Erreur lors de la connexion", 500);
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.params.id },
      include: { events: true }
    });

    if (!profile) {
      return res.error("NOT_FOUND", "Profil introuvable", 404);
    }

    res.success(profile);
  } catch (error) {
    console.error("Erreur récupération profil :", error);
    res.error("SERVER_ERROR", "Erreur lors de la récupération du profil", 500);
  }
};

export const updateMode = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_naissance } = req.body;

    const updateData = { mode: "nourrisson" };
    if (date_naissance) {
      updateData.date_reference = new Date(date_naissance);
    }

    const profile = await prisma.profile.update({
      where: { id },
      data: updateData,
    });

    // Régénère le calendrier PEV à partir de la date de naissance
    const events = await generateEventsForProfile(profile.id, profile.mode, profile.date_reference);

    res.success(profile);
  } catch (error) {
    console.error("Erreur mise à jour mode :", error);
    if (error.code === 'P2025') {
        return res.error("NOT_FOUND", "Profil introuvable", 404);
    }
    res.error("SERVER_ERROR", "Erreur lors de la mise à jour du mode", 500);
  }
};

export const generateCalendar = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { id }
    });

    if (!profile) {
      return res.error("NOT_FOUND", "Profil introuvable", 404);
    }

    const events = await generateEventsForProfile(profile.id, profile.mode, profile.date_reference);
    
    res.success(events, 201);
  } catch (error) {
    console.error("Erreur génération calendrier :", error);
    res.error("SERVER_ERROR", "Erreur lors de la génération du calendrier", 500);
  }
};

export const getCalendar = async (req, res) => {
    try {
        const events = await prisma.calendarEvent.findMany({
            where: { profile_id: req.params.id },
            orderBy: { date_prevue: 'asc' }
        });
        res.success(events);
    } catch (error) {
        console.error("Erreur récupération calendrier :", error);
        res.error("SERVER_ERROR", "Erreur lors de la récupération du calendrier", 500);
    }
};

export const getReminders = async (req, res) => {
    try {
        const reminders = await prisma.reminder.findMany({
            where: {
                declenche: true,
                event: { profile_id: req.params.id },
            },
            include: { event: true },
            orderBy: { triggered_at: 'desc' },
        });

        // Retourner des objets plats compatibles avec le frontend
        const flat = reminders.map(r => ({
            id: r.id,
            event_id: r.event_id,
            profile_id: r.event.profile_id,
            canal: r.canal,
            declenche: r.declenche,
            triggered_at: r.triggered_at,
            label: r.event.label || r.event.type,
        }));

        res.success(flat);
    } catch (error) {
        console.error("Erreur récupération rappels :", error);
        res.error("SERVER_ERROR", "Erreur lors de la récupération des rappels", 500);
    }
};
