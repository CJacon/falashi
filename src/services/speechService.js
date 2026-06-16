// Serviço de transcrição de áudio (Speech-to-Text).
//
// Este arquivo centraliza a integração com a API de reconhecimento de voz.
// Hoje ele está em modo "stub" (simulação) para permitir testar o fluxo
// completo do app sem precisar de uma chave de API configurada.
//
// Para integrar com uma API real (ex: OpenAI Whisper), substitua o corpo
// da função transcribeAudio() pelo código comentado abaixo.

const USE_REAL_API = false; // mude para true quando configurar a API
const API_URL = 'https://api.openai.com/v1/audio/transcriptions';
const API_KEY = ''; // NUNCA deixe chaves hardcoded em produção - usar variáveis de ambiente

export async function transcribeAudio(audioUri) {
  if (!USE_REAL_API) {
    // Modo simulação: retorna um texto vazio para forçar o uso do campo manual,
    // ou pode ser usado para testes manuais simulando uma transcrição.
    console.log('[speechService] Modo simulação ativo. URI do áudio:', audioUri);
    return '';
  }

  try {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro na API de transcrição: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('[speechService] Erro ao transcrever áudio:', error);
    return '';
  }
}
