import { create } from 'zustand';
import {
  initDatabase,
  fetchAllDecks,
  insertDeck,
  deleteDeck,
  insertCard,
  deleteCard,
} from '../services/database';

// Estrutura de um deck:
// { id, title, cards: [{ id, question, answer }] }

const useDeckStore = create((set, get) => ({
  decks: [],
  isLoading: true,

  // Inicializa o banco e carrega os decks salvos. Chamar uma vez ao abrir o app.
  loadDecks: async () => {
    try {
      await initDatabase();
      const decks = await fetchAllDecks();
      set({ decks, isLoading: false });
    } catch (err) {
      console.error('[useDeckStore] Erro ao carregar decks:', err);
      set({ isLoading: false });
    }
  },

  addDeck: async (title) => {
    const newDeck = {
      id: Date.now().toString(),
      title,
      cards: [],
    };
    await insertDeck(newDeck.id, newDeck.title);
    set((state) => ({ decks: [...state.decks, newDeck] }));
    return newDeck.id;
  },

  removeDeck: async (deckId) => {
    await deleteDeck(deckId);
    set((state) => ({
      decks: state.decks.filter((d) => d.id !== deckId),
    }));
  },

  addCard: async (deckId, question, answer) => {
    const newCard = { id: Date.now().toString(), question, answer };
    await insertCard(newCard.id, deckId, question, answer);
    set((state) => ({
      decks: state.decks.map((d) =>
        d.id === deckId ? { ...d, cards: [...d.cards, newCard] } : d
      ),
    }));
  },

  removeCard: async (deckId, cardId) => {
    await deleteCard(cardId);
    set((state) => ({
      decks: state.decks.map((d) =>
        d.id === deckId
          ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
          : d
      ),
    }));
  },

  getDeckById: (deckId) => get().decks.find((d) => d.id === deckId),
}));

export default useDeckStore;
