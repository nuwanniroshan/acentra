import * as nodemailer from "nodemailer";

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "test",
      pass: process.env.SMTP_PASS || "test",
    },
  });

  static async sendEmail(to: string, subject: string, text: string) {
    if (
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.SMTP_USER !== "your-email@gmail.com"
      ) {
      try {
        await this.transporter.sendMail({
          from: '"Acentra Support" <noreply@acentra.com>',
          to,
          subject,
          text,
        });
        console.log(`Email sent to ${to} via SMTP`);
      } catch (error) {
        console.error("Failed to send email via SMTP", error);
        // Log locally for dev
        console.log(`\n--- EMAIL SIMULATION ---`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text}`);
      }
    } else {
      console.log(`\n--- EMAIL SIMULATION (No SMTP Config) ---`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text}`);
    }
  }

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:4200"}/reset-password?token=${token}`;
    await this.sendEmail(
      email,
      "Reset Your Password",
      `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`
    );
  }
}
