import { describe, it, expect, vi } from 'vitest';
import { authorize } from './authorize.middleware.js';

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('authorize middleware', () => {
  it('devolve 401 quando não há utilizador autenticado', () => {
    const req = { user: null };
    const res = mockRes();
    const next = vi.fn();

    authorize('ADMIN')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('devolve 403 quando o papel do utilizador não está na lista permitida', () => {
    const req = { user: { id: 1, role: 'USER' } };
    const res = mockRes();
    const next = vi.fn();

    authorize('ADMIN')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('chama next() quando o papel do utilizador está na lista permitida', () => {
    const req = { user: { id: 1, role: 'ADMIN' } };
    const res = mockRes();
    const next = vi.fn();

    authorize('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('aceita qualquer um dos vários papéis permitidos', () => {
    const req = { user: { id: 1, role: 'USER' } };
    const res = mockRes();
    const next = vi.fn();

    authorize('ADMIN', 'USER')(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
