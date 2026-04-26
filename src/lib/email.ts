const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const DEFAULT_APP_URL = 'https://ebenesaid.com';
const DEFAULT_LOGIN_URL = `${DEFAULT_APP_URL}/login`;

type BrevoRecipient = {
  email: string;
  name: string;
};

type BrevoEmailInput = {
  to: BrevoRecipient;
  subject: string;
  htmlContent: string;
  textContent: string;
};

type EmailTemplateAction = {
  label: string;
  href: string;
};

type EmailTemplateKeyValue = {
  label: string;
  value: string;
};

type EmailTemplateOptions = {
  subject: string;
  preheader?: string;
  title: string;
  greeting: string;
  intro: string;
  highlights?: EmailTemplateKeyValue[];
  body?: string[];
  action?: EmailTemplateAction;
  outro?: string;
  note?: string;
};

export type EmailSendResult = {
  ok: boolean;
  provider: 'brevo';
  messageId?: string;
  error?: string;
};

export type AccountCreatedEmailInput = {
  toEmail: string;
  firstName: string;
  lastName: string;
  loginEmail: string;
  temporaryPassword: string;
  userType: string;
  partnerType?: string;
  loginUrl?: string;
};

export type WelcomeEmailInput = {
  toEmail: string;
  firstName: string;
  university?: string;
  loginUrl?: string;
};

export type PasswordResetEmailInput = {
  toEmail: string;
  firstName: string;
  resetUrl: string;
  expiresAt: string;
};

export type PasswordChangedEmailInput = {
  toEmail: string;
  firstName: string;
  changedAt?: string;
  loginUrl?: string;
};

export type AccountStatusChangedEmailInput = {
  toEmail: string;
  firstName: string;
  accountType: string;
  isActive: boolean;
  loginUrl?: string;
};

export type AccountDeletedEmailInput = {
  toEmail: string;
  firstName: string;
  accountType: string;
};

export type PlatformPaymentReceiptEmailInput = {
  toEmail: string;
  firstName: string;
  amountEur: number;
  provider: string;
  reference: string;
  paidAt?: string;
  dashboardUrl?: string;
};

export type PlatformPaymentIssueEmailInput = {
  toEmail: string;
  firstName: string;
  provider: string;
  issue: string;
  billingUrl?: string;
};

export type DirectMessageNotificationEmailInput = {
  toEmail: string;
  recipientName: string;
  senderName: string;
  messagePreview: string;
  messagesUrl?: string;
};

export type SupportReceivedEmailInput = {
  toEmail: string;
  firstName: string;
  messagePreview: string;
  supportUrl?: string;
};

export type AdminAlertEmailInput = {
  toEmail: string;
  title: string;
  intro: string;
  highlights?: EmailTemplateKeyValue[];
  action?: EmailTemplateAction;
  body?: string[];
};

export type PlatformAnnouncementEmailInput = {
  toEmail: string;
  firstName: string;
  subject: string;
  title: string;
  intro: string;
  body: string[];
  action?: EmailTemplateAction;
};

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY?.trim() || process.env.BREVO_SMTP_API_KEY?.trim() || '';
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_FROM_EMAIL?.trim() ||
    '';
  const senderName =
    process.env.BREVO_SENDER_NAME?.trim() ||
    process.env.SMTP_FROM_NAME?.trim() ||
    'EBENESAID';

  return {
    apiKey,
    senderEmail,
    senderName,
  };
}

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_APP_URL).replace(/\/$/, '');
}

function getLoginUrl(override?: string) {
  return override?.trim() || `${getAppUrl()}/login`;
}

function getSupportEmail() {
  return (
    process.env.SUPPORT_EMAIL?.trim() ||
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    'info@ebenesaid.com'
  );
}

function escapeHtml(value: string) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatRoleLabel(userType: string, partnerType?: string) {
  const type = String(userType ?? '').trim().toLowerCase();
  const partner = String(partnerType ?? '').trim().toLowerCase();

  if (type === 'admin') return 'Admin Account';
  if (type === 'staff') return 'Staff Account';
  if (type === 'investor') return 'Investor Account';
  if (type === 'student') return 'Student Account';
  if (type === 'university' || partner === 'school') return 'School Partner Account';
  if (type === 'agent' || partner === 'house agent' || partner === 'housing provider') return 'House Agent Partner Account';
  if (type === 'job_partner' || partner === 'job supplier' || partner === 'employer') return 'Job Supplier Partner Account';
  if (type === 'supplier' || partner === 'cook' || partner === 'food supplier' || partner === 'catering provider') {
    return 'Cook / Food Supplier Partner Account';
  }
  if (type === 'transport' || partner === 'transport agent' || partner === 'transport provider') {
    return 'Transport Agent Partner Account';
  }

  return 'Platform Account';
}

function formatDateLabel(value?: string) {
  if (!value) {
    return 'Just now';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(parsed);
}

function buildEmailTemplate(options: EmailTemplateOptions) {
  const supportEmail = getSupportEmail();
  const highlightMarkup = options.highlights?.length
    ? `
      <div style="margin:24px 0;border:1px solid #dcfce7;background:#f0fdf4;border-radius:18px;padding:20px 22px;">
        ${options.highlights
          .map(
            item => `
              <p style="margin:8px 0;font-size:14px;line-height:1.6;color:#0f172a;">
                <strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}
              </p>
            `
          )
          .join('')}
      </div>
    `
    : '';

  const bodyMarkup = (options.body ?? [])
    .map(
      paragraph => `
        <p style="margin:0 0 16px;font-size:14px;line-height:1.75;color:#475569;">
          ${escapeHtml(paragraph)}
        </p>
      `
    )
    .join('');

  const actionMarkup = options.action
    ? `
      <div style="margin-top:28px;">
        <a href="${escapeHtml(options.action.href)}" style="display:inline-block;background:#166534;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:14px;font-size:14px;font-weight:700;">
          ${escapeHtml(options.action.label)}
        </a>
      </div>
    `
    : '';

  const noteMarkup = options.note
    ? `
      <p style="margin:24px 0 0;font-size:12px;line-height:1.7;color:#64748b;">
        ${escapeHtml(options.note)}
      </p>
    `
    : '';

  const outroMarkup = options.outro
    ? `
      <p style="margin:24px 0 0;font-size:14px;line-height:1.75;color:#475569;">
        ${escapeHtml(options.outro)}
      </p>
    `
    : '';

  const htmlContent = `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(options.preheader || options.intro)}
    </div>
    <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#166534;padding:28px 32px;">
          <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;font-weight:700;color:#bbf7d0;">EBENESAID</div>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.15;color:#ffffff;">${escapeHtml(options.title)}</h1>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(options.greeting)}</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#334155;">
            ${escapeHtml(options.intro)}
          </p>
          ${highlightMarkup}
          ${bodyMarkup}
          ${actionMarkup}
          ${outroMarkup}
          ${noteMarkup}
        </div>
        <div style="border-top:1px solid #e2e8f0;background:#f8fafc;padding:20px 32px;">
          <p style="margin:0;font-size:12px;line-height:1.7;color:#64748b;">
            EBENESAID is the relocation and partner operations platform for international students, partners, staff, and investors.
            For help, contact <a href="mailto:${escapeHtml(supportEmail)}" style="color:#166534;text-decoration:none;">${escapeHtml(supportEmail)}</a>.
          </p>
        </div>
      </div>
    </div>
  `;

  const textLines = [
    options.greeting,
    '',
    options.intro,
    '',
    ...(options.highlights?.flatMap(item => [`${item.label}: ${item.value}`]) ?? []),
    ...(options.highlights?.length ? [''] : []),
    ...((options.body ?? []).flatMap(paragraph => [paragraph, ''])),
    ...(options.action ? [`${options.action.label}: ${options.action.href}`, ''] : []),
    ...(options.outro ? [options.outro, ''] : []),
    ...(options.note ? [options.note, ''] : []),
    `Support: ${supportEmail}`,
  ];

  return {
    subject: options.subject,
    htmlContent,
    textContent: textLines.join('\n').trim(),
  };
}

async function sendBrevoEmail(input: BrevoEmailInput): Promise<EmailSendResult> {
  const { apiKey, senderEmail, senderName } = getBrevoConfig();

  if (!apiKey || !senderEmail) {
    return {
      ok: false,
      provider: 'brevo',
      error: 'Brevo email configuration is missing.',
    };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: senderName,
        },
        to: [input.to],
        subject: input.subject,
        htmlContent: input.htmlContent,
        textContent: input.textContent,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { messageId?: string; message?: string };
    if (!response.ok) {
      return {
        ok: false,
        provider: 'brevo',
        error: payload.message || `Brevo request failed with status ${response.status}.`,
      };
    }

    return {
      ok: true,
      provider: 'brevo',
      messageId: payload.messageId,
    };
  } catch (error) {
    return {
      ok: false,
      provider: 'brevo',
      error: error instanceof Error ? error.message : 'Unknown Brevo email error.',
    };
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<EmailSendResult> {
  return sendBrevoEmail({
    to: {
      email: to,
      name: to,
    },
    subject,
    htmlContent,
    textContent: textContent?.trim() || stripHtml(htmlContent),
  });
}

async function sendStructuredEmail(
  toEmail: string,
  toName: string,
  template: ReturnType<typeof buildEmailTemplate>
): Promise<EmailSendResult> {
  return sendBrevoEmail({
    to: {
      email: toEmail,
      name: toName || toEmail,
    },
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent,
  });
}

function buildAccountCreatedEmail(input: AccountCreatedEmailInput) {
  const accountType = formatRoleLabel(input.userType, input.partnerType);
  const loginUrl = getLoginUrl(input.loginUrl);
  const firstName = input.firstName.trim() || 'there';

  return buildEmailTemplate({
    subject: `Your EBENESAID ${accountType} is ready`,
    preheader: 'Your platform account has been created and is ready for first login.',
    title: 'Your account is ready',
    greeting: `Hello ${firstName},`,
    intro: `An administrator has created your ${accountType} on EBENESAID. You can now sign in using the credentials below.`,
    highlights: [
      { label: 'Account type', value: accountType },
      { label: 'Login email', value: input.loginEmail },
      { label: 'Temporary password', value: input.temporaryPassword },
      { label: 'Login link', value: loginUrl },
    ],
    body: [
      'This password is temporary and should be changed immediately after your first successful login.',
    ],
    action: {
      label: 'Go to EBENESAID Login',
      href: loginUrl,
    },
    note: 'If you were not expecting this account, please contact the EBENESAID administrator before signing in.',
  });
}

export async function sendAccountCreatedEmail(input: AccountCreatedEmailInput): Promise<EmailSendResult> {
  const template = buildAccountCreatedEmail(input);
  return sendStructuredEmail(input.toEmail, `${input.firstName} ${input.lastName}`.trim() || input.toEmail, template);
}

export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const loginUrl = getLoginUrl(input.loginUrl);

  const template = buildEmailTemplate({
    subject: 'Welcome to EBENESAID',
    preheader: 'Your student platform account is ready.',
    title: 'Welcome to EBENESAID',
    greeting: `Hello ${firstName},`,
    intro: 'Your student account is now active and ready to support your relocation, housing, jobs, transport, food, and student operations in one place.',
    highlights: input.university?.trim()
      ? [
          { label: 'University', value: input.university.trim() },
          { label: 'Login link', value: loginUrl },
        ]
      : [{ label: 'Login link', value: loginUrl }],
    body: [
      'Inside your account you can organize documents, review relocation steps, speak with EBENESAID AI specialists, and use the service modules that match your profile.',
      'Please complete your profile carefully so the platform can guide you accurately across student support, operations, and partner services.',
    ],
    action: {
      label: 'Open My Account',
      href: loginUrl,
    },
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}

export async function sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const template = buildEmailTemplate({
    subject: 'Reset your EBENESAID password',
    preheader: 'Use this secure link to reset your password.',
    title: 'Password reset requested',
    greeting: `Hello ${firstName},`,
    intro: 'We received a request to reset the password for your EBENESAID account.',
    highlights: [
      { label: 'Reset link', value: input.resetUrl },
      { label: 'Expires', value: formatDateLabel(input.expiresAt) },
    ],
    body: [
      'For your security, this reset link can only be used once.',
      'If you did not request a password reset, you can ignore this message and your password will remain unchanged.',
    ],
    action: {
      label: 'Reset Password',
      href: input.resetUrl,
    },
    note: 'Do not forward this email to anyone. EBENESAID support will never ask you to share your password.',
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}

export async function sendPasswordChangedEmail(input: PasswordChangedEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const loginUrl = getLoginUrl(input.loginUrl);
  const template = buildEmailTemplate({
    subject: 'Your EBENESAID password was changed',
    preheader: 'Your account security settings were updated.',
    title: 'Password changed successfully',
    greeting: `Hello ${firstName},`,
    intro: 'The password for your EBENESAID account has been updated successfully.',
    highlights: [{ label: 'Changed at', value: formatDateLabel(input.changedAt) }],
    body: [
      'If you made this change, no further action is needed.',
      'If you did not make this change, reset your password immediately and contact support as soon as possible.',
    ],
    action: {
      label: 'Sign in to EBENESAID',
      href: loginUrl,
    },
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}

export async function sendAccountStatusChangedEmail(input: AccountStatusChangedEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const loginUrl = getLoginUrl(input.loginUrl);
  const template = buildEmailTemplate({
    subject: input.isActive ? 'Your EBENESAID account has been activated' : 'Your EBENESAID account has been deactivated',
    preheader: input.isActive ? 'Your platform access is active again.' : 'Your platform access is currently disabled.',
    title: input.isActive ? 'Account activated' : 'Account deactivated',
    greeting: `Hello ${firstName},`,
    intro: input.isActive
      ? `Your ${input.accountType} on EBENESAID has been activated by an administrator.`
      : `Your ${input.accountType} on EBENESAID has been deactivated by an administrator.`,
    body: input.isActive
      ? [
          'You can now sign in again and continue using the modules assigned to your account.',
        ]
      : [
          'You will not be able to sign in while this status remains inactive. Please contact EBENESAID support or an administrator if you believe this was done in error.',
        ],
    action: input.isActive
      ? {
          label: 'Open Login',
          href: loginUrl,
        }
      : undefined,
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}

export async function sendAccountDeletedEmail(input: AccountDeletedEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const template = buildEmailTemplate({
    subject: 'Your EBENESAID account has been removed',
    preheader: 'Your platform account has been removed by an administrator.',
    title: 'Account removed',
    greeting: `Hello ${firstName},`,
    intro: `Your ${input.accountType} on EBENESAID has been removed by an administrator.`,
    body: [
      'If you believe this happened in error or you still need access to the platform, please contact EBENESAID support for clarification.',
    ],
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}

export async function sendPlatformPaymentReceiptEmail(input: PlatformPaymentReceiptEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const dashboardUrl = input.dashboardUrl?.trim() || `${getAppUrl()}/billing`;
  const providerLabel = input.provider === 'flutterwave' ? 'Flutterwave' : input.provider === 'stripe' ? 'Stripe' : input.provider;

  const template = buildEmailTemplate({
    subject: 'Your EBENESAID payment receipt',
    preheader: 'Your student platform fee has been recorded successfully.',
    title: 'Payment received',
    greeting: `Hello ${firstName},`,
    intro: 'Your EBENESAID student platform fee has been received successfully.',
    highlights: [
      { label: 'Amount', value: `EUR ${input.amountEur.toFixed(2)}` },
      { label: 'Provider', value: providerLabel },
      { label: 'Reference', value: input.reference },
      { label: 'Paid at', value: formatDateLabel(input.paidAt) },
    ],
    body: [
      'Your account payment record has been updated and the transaction is now visible in your billing area.',
      'Please keep this email for your records in case you need to verify your payment later.',
    ],
    action: {
      label: 'Open Billing',
      href: dashboardUrl,
    },
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}

export async function sendPlatformPaymentIssueEmail(input: PlatformPaymentIssueEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const billingUrl = input.billingUrl?.trim() || `${getAppUrl()}/billing`;
  const providerLabel = input.provider === 'flutterwave' ? 'Flutterwave' : input.provider === 'stripe' ? 'Stripe' : input.provider;

  const template = buildEmailTemplate({
    subject: 'There was a problem with your EBENESAID payment',
    preheader: 'Your payment attempt needs attention.',
    title: 'Payment action needed',
    greeting: `Hello ${firstName},`,
    intro: `We could not complete your payment flow through ${providerLabel}.`,
    body: [
      input.issue,
      'Please review your billing details and try again. If the problem continues, contact support and include your account email address.',
    ],
    action: {
      label: 'Review Billing',
      href: billingUrl,
    },
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}

export async function sendDirectMessageNotificationEmail(input: DirectMessageNotificationEmailInput): Promise<EmailSendResult> {
  const messagesUrl = input.messagesUrl?.trim() || `${getAppUrl()}/messages`;
  const preview = input.messagePreview.length > 180 ? `${input.messagePreview.slice(0, 177)}...` : input.messagePreview;

  const template = buildEmailTemplate({
    subject: `New message from ${input.senderName}`,
    preheader: 'A new direct message is waiting for you on EBENESAID.',
    title: 'You have a new message',
    greeting: `Hello ${input.recipientName || 'there'},`,
    intro: `${input.senderName} sent you a new direct message on EBENESAID.`,
    highlights: [{ label: 'Message preview', value: preview }],
    body: [
      'Open your message center to continue the conversation and respond from your account.',
    ],
    action: {
      label: 'Open Messages',
      href: messagesUrl,
    },
  });

  return sendStructuredEmail(input.toEmail, input.recipientName || input.toEmail, template);
}

export async function sendSupportReceivedEmail(input: SupportReceivedEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const supportUrl = input.supportUrl?.trim() || `${getAppUrl()}/support`;
  const preview = input.messagePreview.length > 180 ? `${input.messagePreview.slice(0, 177)}...` : input.messagePreview;

  const template = buildEmailTemplate({
    subject: 'EBENESAID support received your message',
    preheader: 'Your support request is now in our queue.',
    title: 'Support request received',
    greeting: `Hello ${firstName},`,
    intro: 'Your message has been received by the EBENESAID support team.',
    highlights: [{ label: 'Message preview', value: preview }],
    body: [
      'A team member will review the request and respond through the platform support area as soon as possible.',
    ],
    action: {
      label: 'Open Support',
      href: supportUrl,
    },
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}

export async function sendAdminAlertEmail(input: AdminAlertEmailInput): Promise<EmailSendResult> {
  const template = buildEmailTemplate({
    subject: input.title,
    preheader: input.intro,
    title: input.title,
    greeting: 'Hello Team,',
    intro: input.intro,
    highlights: input.highlights,
    body: input.body,
    action: input.action,
  });

  return sendStructuredEmail(input.toEmail, 'EBENESAID Admin', template);
}

export async function sendPlatformAnnouncementEmail(input: PlatformAnnouncementEmailInput): Promise<EmailSendResult> {
  const firstName = input.firstName.trim() || 'there';
  const template = buildEmailTemplate({
    subject: input.subject,
    preheader: input.intro,
    title: input.title,
    greeting: `Hello ${firstName},`,
    intro: input.intro,
    body: input.body,
    action: input.action,
  });

  return sendStructuredEmail(input.toEmail, firstName, template);
}
