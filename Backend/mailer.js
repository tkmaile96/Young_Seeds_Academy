const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // If secrets are missing, skip sending emails (registration still succeeds).
  if (!smtpUser || !smtpPass) return null;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Gmail uses STARTTLS on 587.
    auth: { user: smtpUser, pass: smtpPass },
  });

  return transporter;
}

async function sendTextMail({ to, subject, text }) {
  const t = getTransporter();
  if (!t) {
    console.warn('Email sending disabled: missing SMTP_USER/SMTP_PASS');
    return;
  }

  const from = process.env.MAIL_FROM || process.env.TEACHER_EMAIL || process.env.SMTP_USER;
  await t.sendMail({ from, to, subject, text });
}

function formatPhone(phone) {
  if (!phone) return '-';
  return String(phone).trim();
}

async function sendRegistrationNotifications(reg) {
  const teacherEmail = process.env.TEACHER_EMAIL;
  if (!teacherEmail) {
    console.warn('Email sending disabled: missing TEACHER_EMAIL');
    return;
  }

  const studentEmail = reg.email;
  if (!studentEmail) return;

  const fullName = `${reg.first_name || ''} ${reg.last_name || ''}`.trim() || 'Student';
  const grade = reg.grade || '-';
  const preferredTime = reg.preferred_time || '-';
  const phone = formatPhone(reg.phone);

  // 1) Notify the teacher/admin
  const teacherSubject = `New registration received: ${fullName} (${grade})`;
  const teacherText = [
    `Hi TK,`,
    ``,
    `You have a new class registration:`,
    ``,
    `Name: ${fullName}`,
    `Email: ${studentEmail}`,
    `Phone: ${phone}`,
    `Grade: ${grade}`,
    `Preferred time: ${preferredTime}`,
    `Registration ID: ${reg.id || '-'}`,
    ``,
    `Thanks,`,
    `Website`,
  ].join('\n');

  // 2) Confirm to the student/parent
  const studentSubject = `Registration received - Young Seeds Academy`;
  const studentText = [
    `Hi ${fullName},`,
    ``,
    `Thanks for registering with Young Seeds Academy (Mathematics Tutoring).`,
    ``,
    `We received your details:`,
    `Grade: ${grade}`,
    `Preferred time: ${preferredTime}`,
    ``,
    `If we need anything else, we will contact you shortly.`,
    ``,
    `Kind regards,`,
    `TK Maile`,
  ].join('\n');

  await Promise.all([
    sendTextMail({ to: teacherEmail, subject: teacherSubject, text: teacherText }),
    sendTextMail({ to: studentEmail, subject: studentSubject, text: studentText }),
  ]);
}

module.exports = { sendRegistrationNotifications };

