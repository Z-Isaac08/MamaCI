import { prisma } from "./db/prisma.js";

async function main() {
  // 1. Créer un nouveau profil avec un événement de calendrier et un rappel associés
  const newProfile = await prisma.profile.create({
    data: {
      cmu_id: "CMU-78923410",
      mode: "grossesse",
      date_reference: new Date("2026-06-01"),
      events: {
        create: {
          type: "CPN_1",
          date_prevue: new Date("2026-07-15"),
          statut: "a_venir",
          reminders: {
            create: {
              canal: "app",
              declenche: false,
            },
          },
        },
      },
    },
    // On inclut les relations pour vérifier le résultat complet dans le console.log
    include: {
      events: {
        include: {
          reminders: true,
        },
      },
    },
  });

  console.log("=== Profil créé avec succès ===");
  console.log(JSON.stringify(newProfile, null, 2));

  // 2. Récupérer tous les profils avec leurs événements et rappels respectifs
  const allProfiles = await prisma.profile.findMany({
    include: {
      events: {
        include: {
          reminders: true,
        },
      },
    },
  });

  console.log("\n=== Liste de tous les profils en base ===");
  console.log(JSON.stringify(allProfiles, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
