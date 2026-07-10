import { describe, it, expect } from 'vitest';
import { applyExclusiveGate } from './content.service.js';

const conteudoExclusivo = {
  id: 1,
  title: 'Reformas económicas dos anos 90',
  theme: 'Reformas Económicas',
  region: 'Nacional',
  imageUrl: 'https://exemplo.ao/capa.jpg',
  isExclusive: true,
  body: 'Corpo completo do conteúdo, só deve aparecer com sessão iniciada.',
  mediaUrl: 'https://exemplo.ao/video.mp4',
  media: [{ id: 1, url: 'https://exemplo.ao/extra.jpg', type: 'IMAGE' }],
  comments: [{ id: 1, body: 'Um comentário' }]
};

const conteudoNormal = { ...conteudoExclusivo, isExclusive: false };

describe('applyExclusiveGate (conteúdo Jindungo)', () => {
  it('esconde body, mediaUrl, media e comments de um visitante não autenticado', () => {
    const resultado = applyExclusiveGate(conteudoExclusivo, false);

    expect(resultado.locked).toBe(true);
    expect(resultado.body).toBeNull();
    expect(resultado.mediaUrl).toBeNull();
    expect(resultado.media).toEqual([]);
    expect(resultado.comments).toEqual([]);
  });

  it('mantém sempre visível o teaser (título, tema, região, capa)', () => {
    const resultado = applyExclusiveGate(conteudoExclusivo, false);

    expect(resultado.title).toBe(conteudoExclusivo.title);
    expect(resultado.theme).toBe(conteudoExclusivo.theme);
    expect(resultado.region).toBe(conteudoExclusivo.region);
    expect(resultado.imageUrl).toBe(conteudoExclusivo.imageUrl);
  });

  it('devolve o conteúdo completo quando o utilizador está autenticado', () => {
    const resultado = applyExclusiveGate(conteudoExclusivo, true);

    expect(resultado.locked).toBe(false);
    expect(resultado.body).toBe(conteudoExclusivo.body);
    expect(resultado.mediaUrl).toBe(conteudoExclusivo.mediaUrl);
    expect(resultado.media).toEqual(conteudoExclusivo.media);
    expect(resultado.comments).toEqual(conteudoExclusivo.comments);
  });

  it('não aplica nenhuma restrição a conteúdo que não é exclusivo, mesmo sem sessão', () => {
    const resultado = applyExclusiveGate(conteudoNormal, false);

    expect(resultado.locked).toBe(false);
    expect(resultado.body).toBe(conteudoNormal.body);
    expect(resultado.comments).toEqual(conteudoNormal.comments);
  });
});
