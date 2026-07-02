import client from './client';

// O ficheiro vai para o nosso backend (multipart/form-data), que depois o
// envia ao R2 do lado do servidor — o browser nunca fala com o R2
// diretamente, por isso não é preciso CORS no bucket.
export async function uploadMedia(file) {
  const formData = new FormData();
  formData.append('file', file);

  // O cliente axios tem 'Content-Type: application/json' por omissão — é
  // preciso anulá-lo aqui para o browser gerar o boundary do multipart
  // automaticamente (caso contrário o backend não consegue ler o ficheiro).
  const { publicUrl } = await client
    .post('/uploads', formData, { headers: { 'Content-Type': undefined } })
    .then((r) => r.data);

  return publicUrl;
}
