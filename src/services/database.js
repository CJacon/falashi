import * as SQLite from 'expo-sqlite';

let db = null;

// Abre (ou cria) o banco e garante que as tabelas existam
export async function initDatabase() {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('falashi.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY NOT NULL,
      deck_id TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
  `);

  return db;
}

function getDb() {
  if (!db) {
    throw new Error(
      'Banco de dados não inicializado. Chame initDatabase() antes de usar.'
    );
  }
  return db;
}

// ---------- DECKS ----------

export async function fetchAllDecks() {
  const database = getDb();
  const decks = await database.getAllAsync(
    'SELECT * FROM decks ORDER BY created_at ASC'
  );
  const cards = await database.getAllAsync(
    'SELECT * FROM cards ORDER BY created_at ASC'
  );

  return decks.map((deck) => ({
    id: deck.id,
    title: deck.title,
    cards: cards
      .filter((c) => c.deck_id === deck.id)
      .map((c) => ({ id: c.id, question: c.question, answer: c.answer })),
  }));
}

export async function insertDeck(id, title) {
  const database = getDb();
  await database.runAsync(
    'INSERT INTO decks (id, title, created_at) VALUES (?, ?, ?)',
    id,
    title,
    Date.now()
  );
}

export async function deleteDeck(id) {
  const database = getDb();
  await database.runAsync('DELETE FROM cards WHERE deck_id = ?', id);
  await database.runAsync('DELETE FROM decks WHERE id = ?', id);
}

// ---------- CARDS ----------

export async function insertCard(id, deckId, question, answer) {
  const database = getDb();
  await database.runAsync(
    'INSERT INTO cards (id, deck_id, question, answer, created_at) VALUES (?, ?, ?, ?, ?)',
    id,
    deckId,
    question,
    answer,
    Date.now()
  );
}

export async function deleteCard(id) {
  const database = getDb();
  await database.runAsync('DELETE FROM cards WHERE id = ?', id);
}
