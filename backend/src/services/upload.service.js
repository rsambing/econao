import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '../lib/r2.js';

// Vídeo/áudio vão para videos/, o resto (imagens) para images/.
function folderFor(contentType) {
  return /^(video|audio)\//.test(contentType) ? 'videos' : 'images';
}

function safeExtension(filename) {
  const match = /\.([a-zA-Z0-9]{1,8})$/.exec(filename || '');
  return match ? `.${match[1].toLowerCase()}` : '';
}

export class UploadService {
  // Recebe o ficheiro no servidor (via multer) e envia-o ao R2 do lado do
  // servidor. O browser nunca fala diretamente com o R2, por isso não é
  // preciso configurar CORS no bucket.
  async uploadFile(buffer, filename, contentType) {
    if (!R2_PUBLIC_URL) {
      throw new Error('R2_PUBLIC_URL não está configurado no servidor');
    }

    const key = `${folderFor(contentType)}/${randomUUID()}${safeExtension(filename)}`;

    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }));

    return { publicUrl: `${R2_PUBLIC_URL}/${key}`, key };
  }
}
