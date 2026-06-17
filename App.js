import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import BattleScreen from './src/screens/BattleScreen';
import DecksScreen from './src/screens/DecksScreen';
import CreateDeckScreen from './src/screens/CreateDeckScreen';
import DeckDetailScreen from './src/screens/DeckDetailScreen';
import SoloModeScreen from './src/screens/SoloModeScreen';
import ResultScreen from './src/screens/ResultScreen';
import RankingScreen from './src/screens/RankingScreen';
import MultiplayerLobbyScreen from './src/screens/MultiplayerLobbyScreen';
import MultiplayerGameScreen from './src/screens/MultiplayerGameScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#0f0f1a' },
  headerTintColor: '#ffffff',
  headerShadowVisible: false,
  contentStyle: { backgroundColor: '#0f0f1a' },
};

// Stack principal que envolve as tabs
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1c1c2e',
          borderTopColor: '#2a2a3e',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#7c5cff',
        tabBarInactiveTintColor: '#9a9ab0',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Início', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Battle"
        component={BattleScreen}
        options={{ tabBarLabel: 'Batalha', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⚔️</Text> }}
      />
      <Tab.Screen
        name="Decks"
        component={DecksScreen}
        options={{ tabBarLabel: 'Decks', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📚</Text> }}
      />
      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{ tabBarLabel: 'Ranking', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏆</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="CreateDeck" component={CreateDeckScreen} options={{ title: 'Novo Deck' }} />
        <Stack.Screen name="DeckDetail" component={DeckDetailScreen} options={{ title: 'Deck' }} />
        <Stack.Screen name="SoloMode" component={SoloModeScreen} options={{ title: 'Modo Solo' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Resultado', headerBackVisible: false }} />
        <Stack.Screen name="MultiplayerLobby" component={MultiplayerLobbyScreen} options={{ title: 'Multiplayer' }} />
        <Stack.Screen name="MultiplayerGame" component={MultiplayerGameScreen} options={{ title: 'Partida', headerBackVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
