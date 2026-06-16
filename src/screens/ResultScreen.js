import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ResultScreen({ route, navigation }) {
  const { score, total, deckId } = route.params;
  const percent = Math.round((score / total) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado</Text>

      <View style={styles.scoreBox}>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreTotal}>de {total}</Text>
      </View>

      <Text style={styles.percent}>{percent}% de acerto</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SoloMode', { deckId })}
      >
        <Text style={styles.buttonText}>Jogar de novo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Voltar para Decks</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  scoreBox: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#7c5cff',
  },
  scoreTotal: {
    fontSize: 18,
    color: '#9a9ab0',
  },
  percent: {
    fontSize: 16,
    color: '#cfcfdf',
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#7c5cff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#3a3a4a',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
