import api from './api';

// Fluxo presigned: pede um URL assinado ao backend, envia o ficheiro
// directamente ao R2 (PUT), e devolve o URL público final.
export async function uploadMedia(uri: string, filename: string, mimeType: string): Promise<string> {
  const { uploadUrl, publicUrl } = await api
    .post('/uploads/presign', { filename, contentType: mimeType })
    .then((r) => r.data);

  const file = await fetch(uri);
  const blob = await file.blob();

  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: { 'Content-Type': mimeType },
  });

  if (!res.ok) {
    throw new Error('Falha ao enviar o ficheiro para o storage');
  }

  return publicUrl;
}
