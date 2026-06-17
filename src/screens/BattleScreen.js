import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useDeckStore from '../store/useDeckStore';

export default function BattleScreen({ navigation }) {
  const decks = useDeckStore((state) => state.decks);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ Batalha</Text>

      {/* Multiplayer */}
      <TouchableOpacity
        style={styles.modeCard}
        onPress={() => navigation.navigate('MultiplayerLobby')}
      >
        <Text style={styles.modeIcon}>🎮</Text>
        <View style={styles.modeInfo}>
          <Text style={styles.modeTitle}>Multiplayer</Text>
          <Text style={styles.modeSub}>Desafie um amigo em tempo real</Text>
        </View>
        <Text style={styles.modeArrow}>›</Text>
      </TouchableOpacity>

      {/* Solo */}
      <Text style={styles.sectionLabel}>ESCOLHA UM DECK PARA JOGAR SOLO</Text>
      {decks.length === 0 ? (
        <Text style={styles.empty}>Crie um deck na aba Decks primeiro.</Text>
      ) : (
        decks.map((deck) => (
          <TouchableOpacity
            key={deck.id}
            style={[styles.deckRow, deck.cards.length === 0 && styles.deckRowDisabled]}
            disabled={deck.cards.length === 0}
            onPress={() => navigation.navigate('SoloMode', { deckId: deck.id })}
          >
            <Text style={styles.deckRowTitle}>{deck.title}</Text>
            <Text style={styles.deckRowCount}>{deck.cards.length} cartas</Text>
            <Text style={styles.modeArrow}>›</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  modeCard: {
    backgroundColor: '#1a1040', borderRadius: 14, padding: 18, flexDirection: 'row',
    alignItems: 'center', borderWidth: 1.5, borderColor: '#7c5cff', marginBottom: 24,
    shadowColor: '#7c5cff', shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  modeIcon: { fontSize: 28, marginRight: 14 },
  modeInfo: { flex: 1 },
  modeTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  modeSub: { color: '#9a9ab0', fontSize: 12, marginTop: 2 },
  modeArrow: { color: '#7c5cff', fontSize: 24, fontWeight: 'bold' },
  sectionLabel: { color: '#9a9ab0', fontSize: 10, letterSpacing: 2, marginBottom: 12 },
  empty: { color: '#9a9ab0', fontSize: 14, textAlign: 'center', marginTop: 20 },
  deckRow: {
    backgroundColor: '#1c1c2e', borderRadius: 12, padding: 16, flexDirection: 'row',
    alignItems: 'center', marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#7c5cff',
  },
  deckRowDisabled: { opacity: 0.4 },
  deckRowTitle: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  deckRowCount: { color: '#9a9ab0', fontSize: 12, marginRight: 10 },
});
