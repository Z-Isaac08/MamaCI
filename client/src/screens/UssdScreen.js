// src/screens/UssdScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import { useProfile } from '../context/ProfileContext';
import { apiPost } from '../api/client';

export default function UssdScreen() {
  const { profile } = useProfile();
  
  const [dialed, setDialed] = useState('');
  const [inSession, setInSession] = useState(false);
  const [ussdText, setUssdText] = useState('');
  const [history, setHistory] = useState('');

  const handleKeypadPress = (key) => {
    if (inSession) {
      setDialed((prev) => prev + key);
    } else {
      setDialed((prev) => prev + key);
    }
  };

  const handleCall = async () => {
    if (!inSession) {
      if (dialed !== '*134#') {
        Alert.alert('Erreur', 'Code USSD non reconnu. Tapez *134# pour MamaCi.');
        setDialed('');
        return;
      }
      // Démarrer la session
      setInSession(true);
      setHistory('');
      await fetchUssd('');
      setDialed('');
    } else {
      // Envoyer la réponse
      if (dialed === '0' || dialed === '') {
        // Retour ou Quitter
        const newHistory = history ? history + '*' + dialed : dialed;
        await fetchUssd(newHistory);
        setHistory(newHistory);
      } else {
        const newHistory = history ? history + '*' + dialed : dialed;
        await fetchUssd(newHistory);
        setHistory(newHistory);
      }
      setDialed('');
    }
  };

  const handleEndCall = () => {
    setInSession(false);
    setDialed('');
    setUssdText('');
    setHistory('');
  };

  const fetchUssd = async (textInput) => {
    try {
      const responseText = await apiPost('/api/ussd', {
        text: textInput,
        cmu_id: profile?.cmu_id || 'CMU-123456',
      });
      
      // apiPost renvoie soit la string si tout va bien, soit un objet {success: false} si erreur réseau
      if (typeof responseText !== 'string') {
        setUssdText('Erreur de connexion au serveur USSD.');
        setTimeout(() => handleEndCall(), 3000);
        return;
      }

      if (responseText.startsWith('END')) {
        setUssdText(responseText.replace('END ', ''));
        setTimeout(() => handleEndCall(), 3000);
      } else {
        setUssdText(responseText.replace('CON ', ''));
      }
    } catch (e) {
      setUssdText('Erreur inattendue.');
      setTimeout(() => handleEndCall(), 3000);
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.intro}>
        <Text style={styles.introLabel}>MODE SANS RÉSEAU</Text>
        <Text style={styles.introTitle}>Simulation USSD Réelle</Text>
        <Text style={styles.introText}>
          Tape *134# pour lancer le service. Cette simulation se connecte au vrai backend pour tester le flux de production.
        </Text>
      </View>

      <View style={styles.phoneShell}>
        <View style={styles.phoneNotch} />
        
        {/* Écran du téléphone */}
        <View style={styles.screenArea}>
          {inSession ? (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <Text style={styles.uText}>{ussdText}</Text>
              <View style={styles.ussdInputRow}>
                <Text style={styles.uTextBlink}>&gt; {dialed}</Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.uText, { fontSize: 24, textAlign: 'center' }]}>
                {dialed || 'Écran d\'accueil'}
              </Text>
            </View>
          )}
        </View>

        {/* Clavier T9 */}
        <View style={styles.keypadGrid}>
          {keys.map((k) => (
            <Pressable key={k} onPress={() => handleKeypadPress(k)} style={styles.key}>
              <Text style={styles.keyText}>{k}</Text>
            </Pressable>
          ))}
          
          <View style={styles.actionRow}>
            <Pressable onPress={handleCall} style={[styles.actionKey, styles.callKey]}>
              <Feather name="phone" size={24} color={colors.white} />
            </Pressable>
            <Pressable onPress={handleEndCall} style={[styles.actionKey, styles.endKey]}>
              <Feather name="phone-off" size={24} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paperDeep, alignItems: 'center', paddingTop: spacing.lg },
  intro: { paddingHorizontal: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
  introLabel: { color: colors.coralDark, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  introTitle: { color: colors.ink, fontSize: 22, fontWeight: '800', marginTop: 4 },
  introText: { color: colors.inkSoft, fontSize: 13.5, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  phoneShell: {
    width: 280,
    backgroundColor: '#0D0D0D',
    borderRadius: 36,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#2A2A2A',
  },
  phoneNotch: {
    width: 60,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#3A3A3A',
    marginBottom: 20,
  },
  screenArea: {
    width: '100%',
    height: 180,
    backgroundColor: '#9CF7B0', // Rétro-éclairage vert old school
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#4F7D5C',
  },
  uText: {
    color: '#000',
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  ussdInputRow: {
    borderTopWidth: 1,
    borderTopColor: '#4F7D5C',
    paddingTop: 8,
    marginTop: 8,
  },
  uTextBlink: {
    color: '#000',
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '800',
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  key: {
    width: '28%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  keyText: { color: '#E5E5E5', fontWeight: '700', fontSize: 22 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: '10%',
  },
  actionKey: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callKey: { backgroundColor: colors.teal },
  endKey: { backgroundColor: colors.coral },
});
