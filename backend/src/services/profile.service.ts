import db from '../database/db';
import bcrypt from 'bcryptjs';
import { User } from '../models/interfaces';

/**
 * Service de Perfil do Usuário.
 */
export class ProfileService {
  /**
   * Retorna os dados do perfil do usuário.
   */
  getProfile(userId: number): Omit<User, 'password'> {
    const user = db.prepare(
      'SELECT id, name, email, created_at FROM users WHERE id = ?'
    ).get(userId) as Omit<User, 'password'> | undefined;

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return user;
  }

  /**
   * Atualiza o nome do usuário.
   */
  updateName(userId: number, name: string): Omit<User, 'password'> {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome é obrigatório.');
    }

    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), userId);

    return this.getProfile(userId);
  }

  /**
   * Altera a senha do usuário.
   */
  changePassword(userId: number, currentPassword: string, newPassword: string): void {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User | undefined;

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // Verifica a senha atual
    const isValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isValid) {
      throw new Error('Senha atual incorreta.');
    }

    if (newPassword.length < 6) {
      throw new Error('A nova senha deve ter no mínimo 6 caracteres.');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, userId);
  }
}
