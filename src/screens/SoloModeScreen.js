import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';
import useDeckStore from '../store/useDeckStore';
import { isAnswerCorrect } from '../utils/answerMatcher';
import { transcribeAudio } from '../services/speechService';

export default function SoloModeScreen({ route, navigation }) {
  const { deckId } = route.params;
  const deck = useDeckStore((state) => state.getDeckById(deckId));

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [spokenText, setSpokenText] = useState('');
  const [score, setScore] = useState(0);
  const [manualInput, setManualInput] = useState(''); // fallback para teste sem STT
  const [loading, setLoading] = useState(false);

  if (!deck || deck.cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Este deck não possui cartas.</Text>
      </View>
    );
  }

  const currentCard = deck.cards[currentIndex];
  const isLastCard = currentIndex === deck.cards.length - 1;

  const startRecording = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permissão necessária', 'Precisamos do acesso ao microfone.');
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
      setFeedback(null);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setLoading(true);

    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      // Envia o áudio para o serviço de transcrição (ver src/services/speechService.js)
      const transcript = await transcribeAudio(uri);
      setSpokenText(transcript);
      checkAnswer(transcript);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível processar o áudio.');
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (text) => {
    const correct = isAnswerCorrect(text, currentCard.answer);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore((s) => s + 1);
  };

  const handleManualCheck = () => {
    setSpokenText(manualInput);
    checkAnswer(manualInput);
  };

  const nextCard = () => {
    setFeedback(null);
    setSpokenText('');
    setManualInput('');
    if (isLastCard) {
      navigation.replace('Result', {
        score,
        total: deck.cards.length,
        deckId,
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {currentIndex + 1} / {deck.cards.length}
      </Text>

      <View style={styles.card}>
        <Text style={styles.question}>{currentCard.question}</Text>
      </View>

      {feedback && (
        <View
          style={[
            styles.feedbackBox,
            feedback === 'correct' ? styles.correctBox : styles.wrongBox,
          ]}
        >
          <Text style={styles.feedbackText}>
            {feedback === 'correct' ? 'Acertou!' : 'Não foi essa...'}
          </Text>
          <Text style={styles.feedbackSub}>Você disse: "{spokenText}"</Text>
          {feedback === 'wrong' && (
            <Text style={styles.feedbackSub}>
              Resposta certa: "{currentCard.answer}"
            </Text>
          )}
        </View>
      )}

      {!feedback && (
        <>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={loading}
          >
            <Text style={styles.micButtonText}>
              {loading
                ? 'Processando...'
                : isRecording
                ? 'Parar e Responder'
                : 'Falar Resposta'}
            </Text>
          </TouchableOpacity>

          {/* Fallback manual - útil enquanto o STT não está configurado */}
          <View style={styles.manualBox}>
            <Text style={styles.manualLabel}>
              Ou digite (modo teste, sem microfone):
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Resposta..."
              placeholderTextColor="#6a6a80"
              value={manualInput}
              onChangeText={setManualInput}
              onSubmitEditing={handleManualCheck}
            />
            <TouchableOpacity style={styles.manualButton} onPress={handleManualCheck}>
              <Text style={styles.manualButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {feedback && (
        <TouchableOpacity style={styles.nextButton} onPress={nextCard}>
          <Text style={styles.nextButtonText}>
            {isLastCard ? 'Finalizar' : 'Próxima'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 20,
    paddingTop: 60,
  },
  progress: {
    color: '#9a9ab0',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1c1c2e',
    borderRadius: 16,
    padding: 30,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  question: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  micButton: {
    backgroundColor: '#7c5cff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  micButtonActive: {
    backgroundColor: '#ff6b6b',
  },
  micButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualBox: {
    backgroundColor: '#1c1c2e',
    borderRadius: 14,
    padding: 14,
  },
  manualLabel: {
    color: '#9a9ab0',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#28283c',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    marginBottom: 10,
  },
  manualButton: {
    backgroundColor: '#3a3a4a',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  feedbackBox: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  correctBox: {
    backgroundColor: '#1f3d2b',
  },
  wrongBox: {
    backgroundColor: '#3d1f1f',
  },
  feedbackText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  feedbackSub: {
    color: '#cfcfdf',
    fontSize: 13,
  },
  nextButton: {
    backgroundColor: '#7c5cff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    color: '#9a9ab0',
    textAlign: 'center',
    marginTop: 60,
  },
});
