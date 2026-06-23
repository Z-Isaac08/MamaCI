// src/api/mockServer.js
//
// Simule en mémoire les endpoints décrits dans la doc Backend (§3),
// avec les mêmes routes, le même format de réponse {success, data} /
// {success, error}, et les mêmes codes d'erreur (INVALID_FORMAT, etc.).
// Permet à toute l'équipe frontend de travailler sans dépendre de la
// disponibilité du backend Firebase.

import { CPN_SCHEDULE, PEV_SCHEDULE } from '../data/calendarRules';
import { ADVICE_GROSSESSE, ADVICE_NOURRISSON } from '../data/advice';
import { CHATBOT_RULES, ALERT_KEYWORDS, FALLBACK_REPLY, ALERT_REPLY } from '../data/chatbotRules';

const DELAY = 550; // simule une latence réseau réaliste pour tester les états de chargement

let profiles = {};
let events = {};
let reminders = {};
let nextEventId = 1;
let nextReminderId = 1;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ok(data) {
  return { success: true, data };
}
function err(code, message) {
  return { success: false, error: { code, message } };
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function generateEventsForProfile(profile) {
  const schedule = profile.mode === 'grossesse' ? CPN_SCHEDULE : PEV_SCHEDULE;
  const created = schedule.map((item) => {
    const id = String(nextEventId++);
    const ev = {
      id,
      profile_id: profile.id,
      type: item.type,
      label: item.label,
      date_prevue: addDays(profile.date_reference, item.offsetDays),
      statut: 'a_venir',
    };
    events[id] = ev;
    return ev;
  });
  return created;
}

// --- GET -----------------------------------------------------------------
export async function handleGet(path) {
  await wait(DELAY);

  let m;

  if ((m = path.match(/^\/api\/profiles\/([^/]+)$/))) {
    const profile = profiles[m[1]];
    if (!profile) return err('NOT_FOUND', 'Profil introuvable.');
    return ok(profile);
  }

  if ((m = path.match(/^\/api\/profiles\/([^/]+)\/calendar$/))) {
    const list = Object.values(events).filter((e) => e.profile_id === m[1]);
    return ok(list.sort((a, b) => (a.date_prevue > b.date_prevue ? 1 : -1)));
  }

  if ((m = path.match(/^\/api\/profiles\/([^/]+)\/reminders$/))) {
    const list = Object.values(reminders).filter((r) => r.profile_id === m[1]);
    return ok(list);
  }

  if (path.startsWith('/api/advice')) {
    const mode = path.includes('nourrisson') ? 'nourrisson' : 'grossesse';
    return ok(mode === 'grossesse' ? ADVICE_GROSSESSE : ADVICE_NOURRISSON);
  }

  return err('NOT_FOUND', 'Route inconnue.');
}

// --- POST ------------------------------------------------------------------
export async function handlePost(path, body) {
  await wait(DELAY);
  let m;

  if (path === '/api/profiles') {
    const { cmu_id, statut, date_reference } = body;
    if (!cmu_id || !/^[A-Za-z0-9-]{6,}$/.test(cmu_id)) {
      return err('INVALID_FORMAT', "L'identifiant CMU saisi n'est pas reconnu. Vérifie le format.");
    }
    if (!statut || !date_reference) {
      return err('INVALID_FORMAT', 'Merci de renseigner le statut et la date associée.');
    }
    const id = 'profile_' + Date.now();
    const profile = {
      id,
      cmu_id,
      mode: statut, // 'grossesse' | 'nourrisson'
      date_reference,
      created_at: new Date().toISOString(),
    };
    profiles[id] = profile;
    return ok(profile);
  }

  if ((m = path.match(/^\/api\/profiles\/([^/]+)\/calendar\/generate$/))) {
    const profile = profiles[m[1]];
    if (!profile) return err('NOT_FOUND', 'Profil introuvable.');
    // Supprimer les anciens events pour éviter les doublons
    Object.keys(events).forEach((id) => {
      if (events[id].profile_id === profile.id) delete events[id];
    });
    const created = generateEventsForProfile(profile);
    return ok(created);
  }

  if ((m = path.match(/^\/api\/events\/([^/]+)\/trigger-reminder$/))) {
    const event = events[m[1]];
    if (!event) return err('NOT_FOUND', 'Échéance introuvable.');
    const id = String(nextReminderId++);
    const reminder = {
      id,
      event_id: event.id,
      profile_id: event.profile_id,
      canal: 'app',
      declenche: true,
      triggered_at: new Date().toISOString(),
      label: event.label,
    };
    reminders[id] = reminder;
    return ok(reminder);
  }

  if (path === '/api/chatbot/message') {
    return ok(getChatbotReply(body.message || ''));
  }

  return err('NOT_FOUND', 'Route inconnue.');
}

// --- PATCH -------------------------------------------------------------
export async function handlePatch(path, body) {
  await wait(DELAY);
  let m;

  if ((m = path.match(/^\/api\/profiles\/([^/]+)\/mode$/))) {
    const profile = profiles[m[1]];
    if (!profile) return err('NOT_FOUND', 'Profil introuvable.');
    profile.mode = 'nourrisson';
    if (body?.date_naissance) profile.date_reference = body.date_naissance;
    // Régénère le calendrier pour le nouveau mode
    Object.keys(events).forEach((id) => {
      if (events[id].profile_id === profile.id) delete events[id];
    });
    generateEventsForProfile(profile);
    return ok(profile);
  }

  if ((m = path.match(/^\/api\/events\/([^/]+)\/status$/))) {
    const event = events[m[1]];
    if (!event) return err('NOT_FOUND', 'Échéance introuvable.');
    event.statut = body.statut;
    return ok(event);
  }

  return err('NOT_FOUND', 'Route inconnue.');
}

// --- Logique chatbot locale (mock du relais LLM, doc Backend §5.1) -------
function getChatbotReply(message) {
  const lower = message.toLowerCase();

  const hasAlert = ALERT_KEYWORDS.some((kw) => lower.includes(kw));
  if (hasAlert) {
    return { reply: ALERT_REPLY, type: 'alert' };
  }

  const matched = CHATBOT_RULES.find((rule) =>
    rule.keywords.some((kw) => lower.includes(kw))
  );
  if (matched) {
    return { reply: matched.reply, type: 'info' };
  }

  return { reply: FALLBACK_REPLY, type: 'fallback' };
}

// --- Helpers exposés pour les écrans (lecture directe hors REST) -------
export function _debugAllProfiles() {
  return profiles;
}
