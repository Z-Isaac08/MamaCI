// src/navigation/index.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import { colors, typography } from '../theme';
import { useProfile } from '../context/ProfileContext';

import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import AdviceScreen from '../screens/AdviceScreen';
import UssdScreen from '../screens/UssdScreen';
import RemindersScreen from '../screens/RemindersScreen';
import HealthCentersScreen from '../screens/HealthCentersScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Tableau: 'home',
  Chatbot: 'message-circle',
  Conseils: 'book-open',
};

function TabIcon({ name, focused }) {
  return (
    <View style={[styles.tabIconWrap, focused && styles.tabIconWrapFocused]}>
      <Feather name={name} size={22} color={focused ? colors.teal : colors.greyLight} />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.greyLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused }) => <TabIcon name={TAB_ICONS[route.name]} focused={focused} />,
      })}
    >
      <Tab.Screen name="Tableau" component={DashboardScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'Assistant' }} />
      <Tab.Screen name="Conseils" component={AdviceScreen} options={{ title: 'Conseils' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigation() {
  const { bootstrapping, profile } = useProfile();

  if (bootstrapping) {
    return (
      <View style={styles.bootstrap}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={[typography.bodySoft, { marginTop: 12 }]}>Préparation de ton espace…</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={profile ? 'MainTabs' : 'Welcome'}
      >
        <RootStack.Screen name="Welcome" component={WelcomeScreen} />
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen
          name="USSD"
          component={UssdScreen}
          options={{ headerShown: true, title: 'Mode sans réseau', presentation: 'modal' }}
        />
        <RootStack.Screen name="Reminders" component={RemindersScreen} />
        <RootStack.Screen name="HealthCenters" component={HealthCentersScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bootstrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  tabBar: {
    height: 64,
    paddingBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
  },
  tabBarLabel: { fontSize: 11.5, fontWeight: '700' },
  tabIconWrap: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabIconWrapFocused: {
    backgroundColor: colors.cardTint,
  },
});
