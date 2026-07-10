import { describe, it, expect } from 'vitest';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

describe('AuthService.generateToken / verifyToken', () => {
  it('gera um token que pode ser verificado e devolve o mesmo payload', () => {
    const payload = { id: 1, email: 'admin@econao.ao', role: 'ADMIN' };
    const token = authService.generateToken(payload);

    expect(typeof token).toBe('string');

    const decoded = authService.verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('rejeita um token inválido/adulterado', () => {
    const token = authService.generateToken({ id: 1, email: 'a@a.ao', role: 'USER' });
    const tokenAdulterado = token.slice(0, -2) + 'xx';

    expect(() => authService.verifyToken(tokenAdulterado)).toThrow();
  });
});

describe('AuthService.getSafeUser', () => {
  it('remove a password do objeto devolvido ao cliente', () => {
    const user = { id: 1, name: 'Maria', email: 'maria@econao.ao', password: 'hash-secreto', role: 'USER' };

    const safeUser = authService.getSafeUser(user);

    expect(safeUser.password).toBeUndefined();
    expect(safeUser.name).toBe('Maria');
    expect(safeUser.email).toBe('maria@econao.ao');
  });
});
