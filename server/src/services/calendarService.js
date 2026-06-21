import { prisma } from "../../db/prisma.js";

// Helpers pour manipuler les dates
const subtractMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
};

const addWeeks = (date, weeks) => {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
};

// Labels lisibles pour l'affichage dans l'app mobile
const EVENT_LABELS = {
  CPN_1: "1ère consultation prénatale",
  CPN_2: "2ème consultation prénatale",
  CPN_3: "3ème consultation prénatale",
  CPN_4: "4ème consultation prénatale",
  BCG_Polio_0: "BCG + Polio 0 (naissance)",
  Penta_1_Polio_1: "Penta 1 + Polio 1 (6 sem.)",
  Penta_2_Polio_2: "Penta 2 + Polio 2 (10 sem.)",
  Penta_3_Polio_3: "Penta 3 + Polio 3 (14 sem.)",
};

export const generateEventsForProfile = async (profileId, mode, dateReference) => {
  const eventsToCreate = [];

  if (mode === "grossesse") {
    // CPN: Soustraction de mois à partir de la date de terme
    eventsToCreate.push({ type: "CPN_1", date_prevue: subtractMonths(dateReference, 7) });
    eventsToCreate.push({ type: "CPN_2", date_prevue: subtractMonths(dateReference, 5) });
    eventsToCreate.push({ type: "CPN_3", date_prevue: subtractMonths(dateReference, 3) });
    eventsToCreate.push({ type: "CPN_4", date_prevue: subtractMonths(dateReference, 1) });
  } else if (mode === "nourrisson") {
    // PEV: Ajout de semaines à partir de la date de naissance
    eventsToCreate.push({ type: "BCG_Polio_0", date_prevue: addWeeks(dateReference, 0) });
    eventsToCreate.push({ type: "Penta_1_Polio_1", date_prevue: addWeeks(dateReference, 6) });
    eventsToCreate.push({ type: "Penta_2_Polio_2", date_prevue: addWeeks(dateReference, 10) });
    eventsToCreate.push({ type: "Penta_3_Polio_3", date_prevue: addWeeks(dateReference, 14) });
  }

  // Nettoyage éventuel des anciens événements si on régénère le calendrier
  await prisma.calendarEvent.deleteMany({
    where: { profile_id: profileId }
  });

  // Création des événements et des rappels associés en une transaction
  const createdEvents = [];
  for (const event of eventsToCreate) {
    const created = await prisma.calendarEvent.create({
      data: {
        profile_id: profileId,
        type: event.type,
        label: EVENT_LABELS[event.type] || event.type,
        date_prevue: event.date_prevue,
        statut: "a_venir",
        reminders: {
          create: {
            canal: "app",
            declenche: false
          }
        }
      },
      include: { reminders: true }
    });
    createdEvents.push(created);
  }

  return createdEvents;
};

