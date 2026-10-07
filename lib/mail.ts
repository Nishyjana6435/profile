import nodemailer from "nodemailer";

const env = (...names: string[]) => names.map((n) => process.env[n]).find(Boolean);

/** The Gmail account can be stored under any mail-ish name; find it the way the assistant finds its own keys. */
export function mailCreds() {
  const keys = Object.keys(process.env).filter((k) => /MAIL|SMTP/i.test(k) && !/^NEXT_PUBLIC_/.test(k));
  const user = env("GMAIL_USER", "GMAIL_USERNAME", "EMAIL_USER", "SMTP_USER") ?? keys.map((k) => process.env[k]?.trim()).find((v) => v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const pass = env("GMAIL_PASS", "GMAIL_PASSWORD", "GMAIL_APP_PASSWORD", "EMAIL_PASS", "SMTP_PASS") ?? keys.filter((k) => /PASS|SECRET|TOKEN|KEY/i.test(k)).map((k) => process.env[k]?.trim()).find(Boolean);
  return { user, pass, to: env("LEAD_TO", "CONTACT_EMAIL") || user };
}

export async function sendMail(msg: { to: string; subject: string; text: string; replyTo?: string }) {
  const { user, pass } = mailCreds();
  if (!user || !pass) throw new Error("mail unconfigured");
  const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  await transport.sendMail({ from: `"nishyai.com" <${user}>`, ...msg });
}
