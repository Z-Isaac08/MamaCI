// src/api/client.js
//
// Point d'entrée unique pour tous les appels réseau (doc Frontend §4.1).
//
// Pour brancher le vrai backend Express une fois prêt :
//   1. Mettre USE_MOCK à false
//   2. Renseigner BASE_URL avec l'IP/URL du serveur (doc Backend §1)
// Aucun autre fichier de l'app n'a besoin d'être modifié : tous les écrans
// passent par apiGet/apiPost/apiPatch ci-dessous.

import axios from "axios";
import * as mock from "./mockServer";

// --- Bascule mock / backend réel -------------------------------------
export const USE_MOCK = false;
const BASE_URL = "https://resume-collapse-body.ngrok-free.dev"; // à remplacer par l'IP locale du backend
// -----------------------------------------------------------------------

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 6000, // timeout court — doc Frontend §4.2, ne jamais bloquer l'UI
});

function normalizeError(error) {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.code === "ECONNABORTED") {
    return {
      code: "TIMEOUT",
      message: "La connexion met trop de temps à répondre.",
    };
  }
  return {
    code: "NETWORK_ERROR",
    message: "Impossible de joindre le serveur pour le moment.",
  };
}

export async function apiGet(path) {
  if (USE_MOCK) return mock.handleGet(path);
  try {
    const res = await http.get(path);
    return res.data;
  } catch (e) {
    return { success: false, error: normalizeError(e) };
  }
}

export async function apiPost(path, body) {
  if (USE_MOCK) return mock.handlePost(path, body);
  try {
    const res = await http.post(path, body);
    return res.data;
  } catch (e) {
    return { success: false, error: normalizeError(e) };
  }
}

export async function apiPatch(path, body) {
  if (USE_MOCK) return mock.handlePatch(path, body);
  try {
    const res = await http.patch(path, body);
    return res.data;
  } catch (e) {
    return { success: false, error: normalizeError(e) };
  }
}
