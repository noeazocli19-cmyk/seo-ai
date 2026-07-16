/**
 * Email Service — Resend Integration
 * Sends transactional emails: welcome, password reset, newsletter, contact.
 *
 * Env vars (in .env):
 *   RESEND_API_KEY="re_xxx"
 *   RESEND_FROM_EMAIL="SEO AI Writer <noreply@seoaiwriter.bj>"
 *   APP_URL="http://localhost:3000"  (or your production domain)
 *
 * If RESEND_API_KEY is missing, emails are logged to console (dev mode).
 */
import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || 'SEO AI Writer <noreply@seoaiwriter.bj>'
const appUrl = process.env.APP_URL || 'http://localhost:3000'

const resend = apiKey ? new Resend(apiKey) : null

interface EmailParams {
  to: string
  subject: string
  html: string
}

/**
 * Internal send helper. Falls back to console.log when no API key is configured.
 */
async function sendEmail({ to, subject, html }: EmailParams): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    // Dev mode: log email to console
    console.log('\n📧 ─── EMAIL (dev mode, no RESEND_API_KEY) ───')
    console.log(`To: ${to}`)
    console.log(`From: ${fromEmail}`)
    console.log(`Subject: ${subject}`)
    console.log('─'.repeat(50))
    console.log(html.replace(/<[^>]*>/g, ''))
    console.log('─'.repeat(50) + '\n')
    return { success: true }
  }

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('[RESEND ERROR]', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('[RESEND EXCEPTION]', err)
    const message = err instanceof Error ? err.message : 'Erreur d\'envoi email'
    return { success: false, error: message }
  }
}

/**
 * Welcome email sent after registration.
 */
export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:40px 40px 32px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">SEO AI Writer</h1>
              <p style="color:#dbeafe;font-size:14px;margin:8px 0 0;">Le meilleur assistant IA pour le contenu SEO</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#0f172a;font-size:22px;margin:0 0 16px;">Bienvenue ${name} ! 🎉</h2>
              <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 20px;">
                Votre compte SEO AI Writer a été créé avec succès. Vous pouvez dès maintenant générer du contenu optimisé pour Google grâce à l'IA Gemini 2.5 Flash.
              </p>
              <div style="background:#eff6ff;border-radius:12px;padding:20px;margin:24px 0;">
                <p style="color:#1d4ed8;font-size:14px;margin:0;font-weight:600;">✨ Ce que vous pouvez faire :</p>
                <ul style="color:#1e3a5f;font-size:14px;line-height:1.8;margin:12px 0 0;padding-left:20px;">
                  <li>Discuter avec un assistant IA expert SEO</li>
                  <li>Générer articles, méta-données, FAQ et plus</li>
                  <li>Analyser votre contenu en temps réel</li>
                  <li>Rechercher des mots-clés stratégiques</li>
                  <li>Exporter en PDF, DOCX, Markdown</li>
                </ul>
              </div>
              <a href="${appUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;margin-top:8px;">Commencer maintenant →</a>
              <p style="color:#94a3b8;font-size:13px;margin:32px 0 0;line-height:1.5;">
                Si le bouton ne fonctionne pas, copiez ce lien :<br>
                <a href="${appUrl}" style="color:#2563eb;">${appUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                © 2025 SEO AI Writer · Cotonou, Bénin · <a href="${appUrl}" style="color:#64748b;">seoaiwriter.bj</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  await sendEmail({
    to: email,
    subject: 'Bienvenue sur SEO AI Writer 🎉',
    html,
  })
}

/**
 * Password reset email with a secure link.
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${appUrl}/?reset-token=${token}`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">Réinitialisation de mot de passe</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Bonjour,<br><br>
                Vous avez demandé la réinitialisation de votre mot de passe SEO AI Writer. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
              </p>
              <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">Réinitialiser mon mot de passe</a>
              <p style="color:#94a3b8;font-size:13px;margin:24px 0 0;line-height:1.6;">
                Ce lien expirera dans 1 heure pour des raisons de sécurité.<br>
                Si vous n'avez pas demandé cette réinitialisation, ignorez cet email — votre mot de passe restera inchangé.
              </p>
              <p style="color:#94a3b8;font-size:12px;margin:20px 0 0;word-break:break-all;">
                Lien direct : <a href="${resetUrl}" style="color:#2563eb;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">© 2025 SEO AI Writer · Cotonou, Bénin</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  await sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe — SEO AI Writer',
    html,
  })
}

/**
 * Newsletter confirmation email.
 */
export async function sendNewsletterWelcome(email: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:32px;text-align:center;">
          <h1 style="color:#fff;font-size:22px;margin:0;">Inscription confirmée ✅</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#475569;font-size:16px;line-height:1.6;">
            Merci de vous être inscrit à la newsletter SEO AI Writer ! Vous recevrez désormais nos meilleurs conseils SEO, nouveautés produit et prompts exclusifs.
          </p>
          <a href="${appUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:16px;">Découvrir SEO AI Writer</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim()

  await sendEmail({
    to: email,
    subject: 'Bienvenue dans la newsletter SEO AI Writer 📩',
    html,
  })
}
