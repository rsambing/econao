import { sendMail } from '../lib/mail.js';

const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3001').replace(/\/$/, '');

export class EmailService {
  async sendPasswordResetEmail(email, name, token) {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

    await sendMail({
      to: email,
      subject: 'Recuperação de senha — EconAO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #7A1F2B;">EconAO</h2>
          <p>Olá, ${name || ''}</p>
          <p>Recebemos um pedido para redefinir a tua senha. Clica no botão abaixo para escolheres uma nova senha:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: #7A1F2B; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Redefinir senha
            </a>
          </p>
          <p style="color: #767070; font-size: 13px;">
            Se não pediste isto, ignora este email. O link expira em 1 hora.
          </p>
          <p style="color: #767070; font-size: 13px;">
            Se o botão não funcionar, copia este link: <br />${resetUrl}
          </p>
        </div>
      `,
    });
  }
}
