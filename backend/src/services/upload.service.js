import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
  // Gera um URL presigned para o cliente enviar o ficheiro diretamente ao R2 (PUT),
  // e devolve o URL público final onde o ficheiro ficará acessível.
  async createPresignedUpload(filename, contentType) {
    if (!R2_PUBLIC_URL) {
      throw new Error('R2_PUBLIC_URL não está configurado no servidor');
    }

    const key = `${folderFor(contentType)}/${randomUUID()}${safeExtension(filename)}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return { uploadUrl, publicUrl, key };
  }
}
