import client from './client';

// Fluxo presigned: pede um URL assinado ao backend, envia o ficheiro
// diretamente ao R2 (PUT), e devolve o URL público final.
export async function uploadMedia(file) {
  const { uploadUrl, publicUrl } = await client
    .post('/uploads/presign', { filename: file.name, contentType: file.type })
    .then((r) => r.data);

  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  if (!res.ok) {
    throw new Error('Falha ao enviar o ficheiro para o storage');
  }

  return publicUrl;
}
