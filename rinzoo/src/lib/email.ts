/**
 * Email sending utility — uses Resend when RESEND_API_KEY is set,
 * otherwise logs the email to the console (development fallback).
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const FROM =
  process.env.RESEND_FROM_EMAIL ?? "Rinzoo <noreply@rinzoo.in>";

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const isDev = process.env.NODE_ENV !== "production";

  // Always print to terminal in development so you can test without a verified domain
  if (isDev) {
    // Extract the verification link from the HTML (for easy copy-paste)
    const linkMatch = html.match(/href="(https?:\/\/[^"]+verify[^"]+)"/);
    console.log("\n─── 📧 Email ────────────────────────────────────────────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    if (linkMatch?.[1]) {
      console.log(`\n🔗 Verification link (click to verify):\n   ${linkMatch[1]}`);
    }
    console.log("─────────────────────────────────────────────────────────\n");
  }

  if (!apiKey) return; // No API key — console only

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[sendEmail] Resend error:", err);
    throw new Error(`Failed to send email: ${res.status}`);
  }
}

const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

/** Branded verification email */
export function buildVerificationEmail(name: string, token: string): string {
  const link = `${BASE_URL}/auth/verify-email?token=${token}`;
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0d1f4a;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:900;color:#e91e63;font-family:Georgia,serif;">Rinzoo</p>
            <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;letter-spacing:3px;text-transform:uppercase;">Kapde Mange Jo!</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">Verify your email address</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              Hi <strong>${name}</strong>, welcome to Rinzoo! Click the button below to verify your email and activate your account.
            </p>

            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:50px;background:#e91e63;">
                  <a href="${link}"
                     style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;border-radius:50px;">
                    Verify Email Address
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:24px 0 8px;font-size:13px;color:#9ca3af;">
              Or copy and paste this link into your browser:
            </p>
            <p style="margin:0;font-size:12px;color:#3b82f6;word-break:break-all;">${link}</p>

            <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
              This link expires in <strong>24 hours</strong>. If you didn't create a Rinzoo account, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} Ropox Industries · Rinzoo Detergent Powder<br>
              KH NO 3/18, PL NO 79, Nangloi, Kotla Vihar Phase 1, New Delhi
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
