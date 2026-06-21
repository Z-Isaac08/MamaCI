const API_URL = "http://localhost:3000/api";

async function runE2ETest() {
  try {
    console.log(
      "🚀 Démarrage du test End-to-End (Parcours Utilisateur MamaCI)...\n",
    );

    // 1. Création du profil (Onboarding)
    console.log("Étape 1: Création du profil (Mode: grossesse)...");
    const profileRes = await fetch(`${API_URL}/profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cmu_id: `CMU-${Date.now()}`, // ID unique pour chaque test
        mode: "grossesse",
        date_reference: new Date("2026-08-01").toISOString(),
      }),
    });
    const profileData = await profileRes.json();
    if (!profileData.success)
      throw new Error("Échec création profil : " + JSON.stringify(profileData));
    const profileId = profileData.data.id;
    console.log("✅ Profil créé avec succès! ID:", profileId, "\n");

    // 2. Génération du calendrier
    console.log("Étape 2: Génération du calendrier CPN...");
    const calendarGenRes = await fetch(
      `${API_URL}/profiles/${profileId}/calendar/generate`,
      {
        method: "POST",
      },
    );
    const calendarGenData = await calendarGenRes.json();
    if (!calendarGenData.success)
      throw new Error(
        "Échec génération calendrier : " + JSON.stringify(calendarGenData),
      );
    console.log(
      `✅ Calendrier généré avec ${calendarGenData.data.length} événements!\n`,
    );

    // 3. Récupération du calendrier pour affichage
    console.log(
      "Étape 3: Récupération du calendrier pour le tableau de bord...",
    );
    const calendarRes = await fetch(
      `${API_URL}/profiles/${profileId}/calendar`,
    );
    const calendarData = await calendarRes.json();
    if (!calendarData.success)
      throw new Error(
        "Échec récupération calendrier : " + JSON.stringify(calendarData),
      );
    const firstEvent = calendarData.data[0];
    console.log(
      "✅ Calendrier récupéré. Premier événement:",
      firstEvent.type,
      "prévu le",
      new Date(firstEvent.date_prevue).toLocaleDateString(),
      "\n",
    );

    // 4. Mise à jour du statut de l'événement (L'utilisatrice valide son RDV)
    console.log(
      "Étape 4: Mise à jour du statut du premier événement (marqué comme 'fait')...",
    );
    const statusRes = await fetch(`${API_URL}/events/${firstEvent.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "fait" }),
    });
    const statusData = await statusRes.json();
    if (!statusData.success)
      throw new Error(
        "Échec mise à jour statut : " + JSON.stringify(statusData),
      );
    console.log(
      "✅ Statut mis à jour! Nouveau statut de",
      firstEvent.type,
      ":",
      statusData.data.statut,
      "\n",
    );

    // 5. Déclenchement d'un rappel
    console.log(
      "Étape 5: Déclenchement manuel du rappel pour le deuxième événement (simulation pour la démo)...",
    );
    const secondEvent = calendarData.data[1];
    const reminderRes = await fetch(
      `${API_URL}/events/${secondEvent.id}/trigger-reminder`,
      {
        method: "POST",
      },
    );
    const reminderData = await reminderRes.json();
    if (!reminderData.success)
      throw new Error(
        "Échec déclenchement rappel : " + JSON.stringify(reminderData),
      );
    console.log(
      "✅ Rappel déclenché avec succès pour",
      secondEvent.type,
      "!\n",
    );

    // 6. Récupération des conseils
    console.log("Étape 6: Récupération de l'espace conseils santé (Mode: grossesse)...");
    const adviceRes = await fetch(`${API_URL}/advice?mode=grossesse`);
    const adviceData = await adviceRes.json();
    if (!adviceData.success)
      throw new Error(
        "Échec récupération conseils : " + JSON.stringify(adviceData),
      );
    console.log(
      `✅ ${adviceData.data.length} conseils récupérés. Exemple de fiche : "${adviceData.data[0].titre}"\n`,
    );

    // 7. Test du Chatbot (Question normale)
    console.log("Étape 7: Envoi d'une question classique au Chatbot...");
    const chatNormalRes = await fetch(`${API_URL}/chatbot/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Je suis un peu fatiguée aujourd'hui" }),
    });
    const chatNormalData = await chatNormalRes.json();
    console.log("✅ Réponse du Chatbot (Normal) :", chatNormalData.data.reply, "\n");

    // 8. Test du Chatbot (Urgence / Alerte)
    console.log("Étape 8: Envoi d'une question critique au Chatbot (Alerte Médicale)...");
    const chatAlertRes = await fetch(`${API_URL}/chatbot/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "J'ai un saignement depuis ce matin" }),
    });
    const chatAlertData = await chatAlertRes.json();
    console.log("✅ Réponse du Chatbot (Alerte détectée:", chatAlertData.data.isAlert, ") :", chatAlertData.data.reply, "\n");

    console.log(
      "🎉 Test End-to-End terminé avec succès ! Tout le parcours de l'application fonctionne parfaitement.",
    );
  } catch (error) {
    console.error("❌ ERREUR LORS DU TEST:", error.message);
  }
}

runE2ETest();
