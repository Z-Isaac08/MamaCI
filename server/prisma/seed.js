import { prisma } from "../db/prisma.js";
import { generateEventsForProfile } from "../src/services/calendarService.js";

async function main() {
  console.log("🌱 Début du seed de la base de données...");

  // Nettoyage de la base de données
  console.log("🧹 Nettoyage des anciennes données...");
  await prisma.reminder.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.profile.deleteMany();

  // Création du profil 1 : Femme enceinte (Mode Grossesse)
  console.log("👩🏾 Création du profil Grossesse (Awa Konaté)...");
  const profile1 = await prisma.profile.create({
    data: {
      cmu_id: "CMU-123456",
      nom: "Awa Konaté",
      mode: "grossesse",
      // Date de terme prévue dans 4 mois
      date_reference: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    },
  });

  // Générer le calendrier pour le profil 1
  const events1 = await generateEventsForProfile(
    profile1.id,
    profile1.mode,
    profile1.date_reference,
  );

  // Simuler que le premier CPN est fait, et déclencher un rappel pour le deuxième
  if (events1.length >= 2) {
    await prisma.calendarEvent.update({
      where: { id: events1[0].id },
      data: { statut: "fait" },
    });

    const reminder1 = await prisma.reminder.findFirst({
      where: { event_id: events1[1].id },
    });

    if (reminder1) {
      await prisma.reminder.update({
        where: { id: reminder1.id },
        data: {
          declenche: true,
          triggered_at: new Date(new Date().setDate(new Date().getDate() - 2)), // Déclenché il y a 2 jours
        },
      });
    }
  }

  // Création du profil 2 : Jeune maman (Mode Nourrisson)
  console.log("👩🏾‍🍼 Création du profil Nourrisson (Fatou Diop)...");
  const profile2 = await prisma.profile.create({
    data: {
      cmu_id: "CMU-654321",
      nom: "Fatou Diop",
      mode: "nourrisson",
      // Bébé né il y a 7 semaines
      date_reference: new Date(
        new Date().setDate(new Date().getDate() - 7 * 7),
      ),
    },
  });

  // Générer le calendrier pour le profil 2
  const events2 = await generateEventsForProfile(
    profile2.id,
    profile2.mode,
    profile2.date_reference,
  );

  // Marquer le vaccin à la naissance et à 6 semaines comme faits
  if (events2.length >= 2) {
    await prisma.calendarEvent.update({
      where: { id: events2[0].id },
      data: { statut: "fait" },
    });
    await prisma.calendarEvent.update({
      where: { id: events2[1].id },
      data: { statut: "fait" },
    });

    // Déclencher le rappel pour Penta 2 (prévu à 10 semaines)
    if (events2.length >= 3) {
      const reminder2 = await prisma.reminder.findFirst({
        where: { event_id: events2[2].id },
      });

      if (reminder2) {
        await prisma.reminder.update({
          where: { id: reminder2.id },
          data: {
            declenche: true,
            triggered_at: new Date(
              new Date().setHours(new Date().getHours() - 5),
            ), // Déclenché il y a 5 heures
          },
        });
      }
    }
  }

  console.log("✅ Seed terminé avec succès !");
  console.log("Identifiants de test :");
  console.log("- CMU-123456 (Grossesse - Awa Konaté)");
  console.log("- CMU-654321 (Nourrisson - Fatou Diop)");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
