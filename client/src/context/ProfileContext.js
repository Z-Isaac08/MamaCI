// src/context/ProfileContext.js
//
// State global pour Profil + Calendrier (doc Frontend §5.2 : partagé entre
// Tableau de bord et Simulation USSD — même source de vérité, doc Backend §3.6).

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPost, apiPatch } from '../api/client';

const STORAGE_KEY = '@mamaci/profile_id';
const CACHE_KEY = '@mamaci/last_calendar';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [calendarFromCache, setCalendarFromCache] = useState(false);

  // Vérification locale au lancement — purement locale, sans appel réseau
  // bloquant (doc Frontend §2.3).
  useEffect(() => {
    (async () => {
      try {
        const storedId = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedId) {
          const res = await apiGet(`/api/profiles/${storedId}`);
          if (res.success) {
            setProfile(res.data);
            await loadCalendar(storedId);
            await loadReminders(storedId);
          } else {
            await AsyncStorage.removeItem(STORAGE_KEY);
          }
        }
      } finally {
        setBootstrapping(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCalendar = useCallback(async (profileId) => {
    const res = await apiGet(`/api/profiles/${profileId}/calendar`);
    if (res.success) {
      setCalendar(res.data);
      setCalendarFromCache(false);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data: res.data, at: Date.now() }));
      return res.data;
    }
    // Stratégie offline minimale — doc Frontend §4.3
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      setCalendar(parsed.data);
      setCalendarFromCache(true);
    }
    return null;
  }, []);

  const loadReminders = useCallback(async (profileId) => {
    const res = await apiGet(`/api/profiles/${profileId}/reminders`);
    if (res.success) {
      setReminders(res.data);
      return res.data;
    }
    return [];
  }, []);

  const createProfile = useCallback(async ({ cmu_id, nom, statut, date_reference }) => {
    const res = await apiPost('/api/profiles', { cmu_id, nom, mode: statut, date_reference });
    if (!res.success) return res;

    setProfile(res.data);
    await AsyncStorage.setItem(STORAGE_KEY, res.data.id);

    const genRes = await apiPost(`/api/profiles/${res.data.id}/calendar/generate`, {});
    if (genRes.success) {
      setCalendar(genRes.data);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data: genRes.data, at: Date.now() }));
    }
    return res;
  }, []);

  const loginProfile = useCallback(async (cmu_id) => {
    const res = await apiPost('/api/profiles/login', { cmu_id });
    if (!res.success) return res;

    setProfile(res.data);
    await AsyncStorage.setItem(STORAGE_KEY, res.data.id);
    await loadCalendar(res.data.id);
    await loadReminders(res.data.id);
    return res;
  }, [loadCalendar, loadReminders]);

  const switchToNourrisson = useCallback(
    async (dateNaissance) => {
      if (!profile) return { success: false, error: { code: 'NO_PROFILE', message: 'Aucun profil actif.' } };
      const profileId = profile.id;

      // 1. PATCH le mode → nourrisson
      const res = await apiPatch(`/api/profiles/${profileId}/mode`, {
        date_naissance: dateNaissance,
      });
      if (!res.success) return res;

      // Mettre à jour le profil local avec la réponse du backend
      const updatedProfile = res.data;
      setProfile(updatedProfile);

      // 2. Regénérer le calendrier PEV (même pattern que createProfile)
      const genRes = await apiPost(`/api/profiles/${updatedProfile.id}/calendar/generate`, {});
      if (genRes.success) {
        setCalendar(genRes.data);
        setCalendarFromCache(false);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data: genRes.data, at: Date.now() }));
      } else {
        // Fallback: essayer de charger le calendrier déjà regénéré côté serveur
        await loadCalendar(updatedProfile.id);
      }

      return res;
    },
    [profile, loadCalendar]
  );

  const triggerReminder = useCallback(async (eventId) => {
    const res = await apiPost(`/api/events/${eventId}/trigger-reminder`, {});
    if (res.success) {
      setReminders((prev) => [res.data, ...prev]);
    }
    return res;
  }, []);

  const updateEventStatus = useCallback(async (eventId, statut) => {
    const res = await apiPatch(`/api/events/${eventId}/status`, { statut });
    if (res.success) {
      setCalendar((prev) => prev.map((e) => (e.id === eventId ? res.data : e)));
    }
    return res;
  }, []);

  const resetProfile = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(CACHE_KEY);
    setProfile(null);
    setCalendar([]);
    setReminders([]);
  }, []);

  const value = {
    profile,
    calendar,
    reminders,
    bootstrapping,
    calendarFromCache,
    createProfile,
    loginProfile,
    switchToNourrisson,
    triggerReminder,
    updateEventStatus,
    refreshCalendar: () => profile && loadCalendar(profile.id),
    refreshReminders: () => profile && loadReminders(profile.id),
    resetProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile doit être utilisé dans un ProfileProvider');
  return ctx;
}
