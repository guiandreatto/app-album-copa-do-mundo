import db from './db';

/**
 * Cria todas as tabelas do banco de dados.
 * Executado automaticamente ao iniciar o servidor.
 */
export function createTables(): void {
  // Tabela de usuários
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Tabela de figurinhas (álbum completo)
  db.exec(`
    CREATE TABLE IF NOT EXISTS stickers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sticker_number INTEGER NOT NULL UNIQUE,
      player_name TEXT NOT NULL,
      country TEXT NOT NULL,
      position TEXT NOT NULL
    )
  `);

  // Tabela de figurinhas do usuário (controle de quantidade)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_stickers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      sticker_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (sticker_id) REFERENCES stickers(id) ON DELETE CASCADE,
      UNIQUE(user_id, sticker_id)
    )
  `);

  // Índices para melhor performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_stickers_user_id ON user_stickers(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_stickers_sticker_id ON user_stickers(sticker_id);
    CREATE INDEX IF NOT EXISTS idx_stickers_country ON stickers(country);
  `);

  console.log('✅ Tabelas criadas com sucesso!');
}
