import api from './api';

// O ficheiro vai para o nosso backend (multipart/form-data), que depois o
// envia ao R2 do lado do servidor — a app nunca fala com o R2 diretamente.
export async function uploadMedia(uri: string, filename: string, mimeType: string): Promise<string> {
  const formData = new FormData();
  // React Native aceita este formato especial para anexar ficheiros locais.
  formData.append('file', { uri, name: filename, type: mimeType } as any);

  // O cliente axios tem 'Content-Type: application/json' por omissão — é
  // preciso anulá-lo aqui para o React Native gerar o boundary do
  // multipart automaticamente.
  const { publicUrl } = await api
    .post('/uploads', formData, { headers: { 'Content-Type': undefined } })
    .then((r) => r.data);

  return publicUrl;
}
