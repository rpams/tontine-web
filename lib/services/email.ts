/**
 * Service d'envoi d'emails
 * En développement, log dans la console
 * En production, utiliser un vrai service (Resend, SendGrid, etc.)
 */

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // En développement, logger dans la console
    if (process.env.NODE_ENV === 'development') {
      console.log('\n📧 ========== EMAIL (DEV MODE) ==========');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Text: ${options.text || 'N/A'}`);
      if (options.html) {
        console.log(`HTML: ${options.html}`);
      }
      console.log('=========================================\n');

      return { success: true };
    }

    // En production, utiliser un vrai service d'email
    // Exemple avec Resend:
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Tontine <noreply@votredomaine.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    */

    // Pour l'instant, logger aussi en production
    console.log(`📧 Email envoyé à ${options.to}: ${options.subject}`);

    return { success: true };

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Envoie un email avec un code OTP
 */
export async function sendOTPEmail(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const subject = 'Votre code de vérification Tontine';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-code { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-digits { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Code de Vérification</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Vous avez demandé à vous connecter à votre compte Tontine. Voici votre code de vérification :</p>

          <div class="otp-code">
            <div class="otp-digits">${otp}</div>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Valide pendant 3 minutes</p>
          </div>

          <div class="warning">
            <strong>⚠️ Important :</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Ne partagez jamais ce code avec personne</li>
              <li>Ce code expire dans 3 minutes</li>
              <li>Si vous n'avez pas demandé ce code, ignorez cet email</li>
            </ul>
          </div>

          <p>Si vous rencontrez des difficultés, contactez notre support.</p>

          <p>Cordialement,<br><strong>L'équipe Tontine</strong></p>
        </div>
        <div class="footer">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p>&copy; ${new Date().getFullYear()} Tontine. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Votre code de vérification Tontine

    Code: ${otp}

    Ce code est valide pendant 3 minutes.
    Ne le partagez avec personne.

    Si vous n'avez pas demandé ce code, ignorez cet email.

    L'équipe Tontine
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}
