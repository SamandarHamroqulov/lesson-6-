require("dotenv").config();
const nodemailer = require("nodemailer");
const emailService = async (email, link) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transport.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Verify email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Verify your email</h2>
        <p>Click this link to verify your account:</p>

        <p>
          <a href="${link}" target="_blank" rel="noopener noreferrer"
             style="display:inline-block;padding:10px 14px;background:#111;color:#fff;text-decoration:none;border-radius:8px">
            Verify Email
          </a>
        </p>

        <p>If the button doesn't work, copy and paste this link:</p>
        <p style="word-break: break-all;">
          <a href="${link}">${link}</a>
        </p>
      </div>
    `,
  });
};
module.exports = emailService;
