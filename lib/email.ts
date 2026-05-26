import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendTransactionalEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.warn('[EMAIL] RESEND_API_KEY not set — email not sent to:', to)
      return { ok: false, error: 'Email service not configured' }
    }

    const resend = new Resend(apiKey)

    const from = process.env.EMAIL_FROM || 'OASIS <noreply@mesapos.in>'

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text: text || '',
    })

    if (error) {
      console.error('[EMAIL ERROR]', error)
      return { ok: false, error }
    }

    console.log('[EMAIL SENT]', { to, subject, id: data?.id })
    return { ok: true, data }

  } catch (err) {
    console.error('[EMAIL EXCEPTION]', err)
    return { ok: false, error: err }
  }
}