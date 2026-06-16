import db from '../database/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/interfaces';
import { JWT_SECRET } from '../middleware/auth.middleware';

/**
 * Service de autenticação.
 * Gerencia registro, login e recuperação de senha.
 */
export class AuthService {
  /**
   * Registra um novo usuário.
   */
  register(name: string, email: string, password: string): { token: string; user: Omit<User, 'password'> } {
    // Verifica se o email já existe
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      throw new Error('Email já cadastrado.');
    }

    // Hash da senha
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insere o usuário
    const result = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    ).run(name, email, hashedPassword);

    const userId = result.lastInsertRowid as number;

    // Gera o token JWT
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    // Busca o usuário criado (sem a senha)
    const user = db.prepare(
      'SELECT id, name, email, created_at FROM users WHERE id = ?'
    ).get(userId) as Omit<User, 'password'>;

    // Inicializa as figurinhas do usuário (todas com quantidade 0)
    const stickers = db.prepare('SELECT id FROM stickers').all() as { id: number }[];
    const insertUserSticker = db.prepare(
      'INSERT INTO user_stickers (user_id, sticker_id, quantity) VALUES (?, ?, 0)'
    );

    const insertAll = db.transaction(() => {
      for (const sticker of stickers) {
        insertUserSticker.run(userId, sticker.id);
      }
    });
    insertAll();

    return { token, user };
  }

  /**
   * Realiza login do usuário.
   */
  login(email: string, password: string): { token: string; user: Omit<User, 'password'> } {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;

    if (!user) {
      throw new Error('Email ou senha incorretos.');
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      throw new Error('Email ou senha incorretos.');
    }

    // Gera o token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Retorna sem a senha
    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  /**
   * Recuperação de senha (simulada).
   * Atualiza a senha diretamente no banco.
   */
  resetPassword(email: string, newPassword: string): void {
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as User | undefined;

    if (!user) {
      throw new Error('Email não encontrado.');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashedPassword, email);
  }
}
