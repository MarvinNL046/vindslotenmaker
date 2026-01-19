import { Resend } from 'resend';

// Initialize Resend only when API key is available (prevents build errors)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = 'VindSlotenmaker <noreply@vindslotenmaker.nl>';

// Brand colors (Orange / Dark Gray theme)
const colors = {
  primary: '#F97316',
  primaryLight: '#FB923C',
  accent: '#F97316',
  accentLight: '#FDBA74',
  background: '#F8FAFC',
  foreground: '#1F2937',
  muted: '#64748B',
  border: '#E2E8F0',
  white: '#FFFFFF',
};

export async function sendVerificationEmail(
  to: string,
  code: string,
  type: 'register' | 'login' | 'claim'
): Promise<{ success: boolean; error?: string }> {
  const subjects = {
    register: 'Verifieer uw e-mailadres - VindSlotenmaker',
    login: 'Uw inlogcode - VindSlotenmaker',
    claim: 'Verificatiecode voor uw claim - VindSlotenmaker',
  };

  const titles = {
    register: 'Welkom bij VindSlotenmaker',
    login: 'Uw inlogcode',
    claim: 'Verifieer uw claim',
  };

  const descriptions = {
    register: 'Bedankt voor uw registratie. Gebruik onderstaande code om uw e-mailadres te verifieren.',
    login: 'Gebruik onderstaande code om in te loggen op uw account.',
    claim: 'Gebruik onderstaande code om uw claim te verifieren.',
  };

  try {
    if (!resend) {
      console.warn('Resend API key not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: subjects[type],
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${colors.foreground}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
  <div style="background-color: ${colors.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.08);">
    <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <span style="color: ${colors.white};">Vind</span><span style="color: ${colors.foreground};">Slotenmaker</span>
      </h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: ${colors.foreground}; margin-top: 0;">${titles[type]}</h2>
      <p style="color: ${colors.muted};">${descriptions[type]}</p>

      <div style="background: ${colors.background}; border: 2px dashed ${colors.accent}; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
        <p style="margin: 0 0 10px 0; color: ${colors.muted}; font-size: 14px;">Uw verificatiecode:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: ${colors.primary};">
          ${code}
        </div>
      </div>

      <p style="color: ${colors.muted}; font-size: 14px;">
        Deze code is 15 minuten geldig. Deel deze code met niemand.
      </p>

      <hr style="border: none; border-top: 1px solid ${colors.border}; margin: 24px 0;">

      <p style="color: ${colors.muted}; font-size: 12px; text-align: center;">
        Als u deze e-mail niet heeft aangevraagd, kunt u deze veilig negeren.
      </p>
    </div>

    <div style="text-align: center; padding: 24px; color: ${colors.muted}; font-size: 12px; background-color: ${colors.background}; border-top: 1px solid ${colors.border};">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} VindSlotenmaker</p>
      <p style="margin: 5px 0 0 0;">
        <a href="https://www.vindslotenmaker.nl" style="color: ${colors.accent};">vindslotenmaker.nl</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend) {
      console.warn('Resend API key not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Welkom bij VindSlotenmaker!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${colors.foreground}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
  <div style="background-color: ${colors.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.08);">
    <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <span style="color: ${colors.white};">Vind</span><span style="color: ${colors.foreground};">Slotenmaker</span>
      </h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: ${colors.foreground}; margin-top: 0;">Welkom, ${name}!</h2>

      <p style="color: ${colors.muted}; font-size: 16px;">
        Bedankt voor het aanmaken van een account bij VindSlotenmaker.
        We zijn blij dat u deel uitmaakt van onze community!
      </p>

      <div style="background: ${colors.background}; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid ${colors.border};">
        <h3 style="color: ${colors.primary}; margin-top: 0; font-size: 16px;">Wat kunt u doen met uw account?</h3>
        <ul style="color: ${colors.muted}; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;">Vermeldingen claimen en beheren</li>
          <li style="margin-bottom: 8px;">Uw contactgegevens en diensten bijwerken</li>
          <li style="margin-bottom: 8px;">Fotos toevoegen aan uw vermelding</li>
          <li style="margin-bottom: 8px;">Aanvragen ontvangen van potentiele klanten</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://www.vindslotenmaker.nl/dashboard"
           style="background: ${colors.accent}; color: ${colors.white}; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
          Ga naar uw Dashboard
        </a>
      </div>

      <p style="color: ${colors.muted}; font-size: 14px;">
        Bent u slotenmaker? Zoek naar uw bedrijf en klik op "Claim deze vermelding"
        om de informatie te beheren.
      </p>

      <hr style="border: none; border-top: 1px solid ${colors.border}; margin: 24px 0;">

      <p style="color: ${colors.muted}; font-size: 14px;">
        Vragen? Neem gerust contact met ons op via
        <a href="https://www.vindslotenmaker.nl/contact" style="color: ${colors.accent};">ons contactformulier</a>.
      </p>
    </div>

    <div style="text-align: center; padding: 24px; color: ${colors.muted}; font-size: 12px; background-color: ${colors.background}; border-top: 1px solid ${colors.border};">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} VindSlotenmaker</p>
      <p style="margin: 5px 0 0 0;">
        <a href="https://www.vindslotenmaker.nl" style="color: ${colors.accent};">vindslotenmaker.nl</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendClaimApprovedEmail(
  to: string,
  facilityName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend) {
      console.warn('Resend API key not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Uw claim is goedgekeurd - ${facilityName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: ${colors.foreground}; max-width: 600px; margin: 0 auto; padding: 20px; background-color: ${colors.background};">
  <div style="background-color: ${colors.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.08);">
    <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <span style="color: ${colors.white};">Vind</span><span style="color: ${colors.foreground};">Slotenmaker</span>
      </h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: ${colors.foreground}; margin-top: 0;">Uw claim is goedgekeurd!</h2>
      <p style="color: ${colors.muted};">
        Goed nieuws! Uw claim voor <strong style="color: ${colors.foreground};">${facilityName}</strong> is goedgekeurd.
      </p>

      <p style="color: ${colors.muted};">
        U kunt nu inloggen op uw dashboard om de informatie van uw bedrijf te beheren.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://www.vindslotenmaker.nl/dashboard"
           style="background: ${colors.accent}; color: ${colors.white}; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
          Ga naar Dashboard
        </a>
      </div>
    </div>

    <div style="text-align: center; padding: 24px; color: ${colors.muted}; font-size: 12px; background-color: ${colors.background}; border-top: 1px solid ${colors.border};">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} VindSlotenmaker</p>
      <p style="margin: 5px 0 0 0;">
        <a href="https://www.vindslotenmaker.nl" style="color: ${colors.accent};">vindslotenmaker.nl</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
