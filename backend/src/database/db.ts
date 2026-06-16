import Database from 'better-sqlite3';
import path from 'path';

// Caminho do banco de dados SQLite
const DB_PATH = path.join(__dirname, '..', '..', 'sticker_tracker.db');

// Cria e exporta a conexão com o banco de dados
const db = new Database(DB_PATH);

// Habilita WAL mode para melhor performance
db.pragma('journal_mode = WAL');

// Habilita foreign keys
db.pragma('foreign_keys = ON');

export default db;
