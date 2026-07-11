import type { Db } from "./supabase.ts";

export interface EmailMessage {
  to: string[];
  subject: string;
  html: string;
  /** template name for the email_log record */
  template: string;
  payload?: Record<string, unknown>;
}

export interface EmailResult {
  status: "sent" | "logged" | "failed";
  detail?: string;
}

const FROM = "BrandEvolved <notifications@brandevolved.com>";

/**
 * Sends via Resend when RESEND_API_KEY is configured; otherwise "log-only"
 * mode writes the message to the email_log table so nothing is lost and the
 * flow can be verified end-to-end before an account exists.
 * Every attempt (sent, logged or failed) is recorded in email_log.
 */
export async function sendEmail(
  db: Db,
  organizationId: string,
  message: EmailMessage,
  resendApiKey = typeof process !== "undefined" ? process.env.RESEND_API_KEY : undefined,
): Promise<EmailResult> {
  let result: EmailResult;

  if (!resendApiKey) {
    result = { status: "logged", detail: "RESEND_API_KEY not set — log-only mode" };
  } else {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: message.to,
          subject: message.subject,
          html: message.html,
        }),
      });
      result = res.ok
        ? { status: "sent" }
        : { status: "failed", detail: `Resend ${res.status}: ${await res.text()}` };
    } catch (err) {
      result = { status: "failed", detail: String(err) };
    }
  }

  await db.from("email_log").insert({
    organization_id: organizationId,
    recipients: message.to,
    subject: message.subject,
    template: message.template,
    payload: (message.payload ?? {}) as never,
    status: result.status,
    detail: result.detail ?? null,
  });

  return result;
}
