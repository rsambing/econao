import multer from 'multer';

// Guarda o ficheiro em memória (buffer) — depois é enviado ao R2 do lado do
// servidor, sem o browser precisar de falar diretamente com o R2 (evita CORS).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

export default upload;
