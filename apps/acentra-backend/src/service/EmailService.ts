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

  // For this MVP, we'll just log to console to avoid needing real SMTP creds
  // But we'll structure it so it's easy to swap in a real transporter
  static async sendEmail(to: string, subject: string, text: string) {
    console.log(`\n--- EMAIL NOTIFICATION ---`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log(`--------------------------\n`);

    // Only attempt SMTP sending if we have valid credentials and SMTP is properly configured
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_USER !== "your-email@gmail.com" &&
      process.env.SMTP_PASS !== "your-app-password"
    ) {
      try {
        await this.transporter.sendMail({
          from: '"acentra." <noreply@acentra.com>',
          to,
          subject,
          text,
        });
        console.log("Email sent via SMTP");
      } catch (e) {
        console.error("Failed to send email via SMTP", e);
        // Don't re-throw the error to prevent breaking the main flow
      }
    } else {
      console.log(
        "SMTP not configured or using placeholder credentials, skipping actual email send"
      );
    }
  }

  static async notifyJobAssignment(
    email: string,
    jobTitle: string,
    jobDescription: string,
    startDate: Date,
    expectedClosingDate: Date
  ) {
    await this.sendEmail(
      email,
      `New Job Assignment: ${jobTitle}`,
      `You have been assigned to the job "${jobTitle}".\n\nDescription: ${jobDescription}\n\nStart Date: ${startDate.toLocaleDateString()}\nExpected Closing Date: ${expectedClosingDate.toLocaleDateString()}\n\nLog in to view details and start working on this job.`
    );
  }

  static async notifyCandidateUpload(
    email: string,
    candidateName: string,
    jobTitle: string
  ) {
    await this.sendEmail(
      email,
      `New Candidate for ${jobTitle}`,
      `A new candidate, ${candidateName}, has been uploaded for the job "${jobTitle}".`
    );
  }

  static async notifyStatusChange(
    email: string,
    candidateName: string,
    newStatus: string,
    jobTitle: string
  ) {
    await this.sendEmail(
      email,
      `Candidate Status Update: ${candidateName}`,
      `Candidate ${candidateName} for job "${jobTitle}" has been moved to ${newStatus}.`
    );
  }

  static async sendDemoRequestEmail(data: {
    name: string;
    email: string;
    phone: string;
    meetingTime?: string;
  }) {
    const supportEmail = process.env.SUPPORT_EMAIL || "support@acentra.com";
    const subject = "New Demo Request";
    const body = `
New Demo Request Received:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Preferred Meeting Time: ${data.meetingTime || "Not specified"}

Please follow up with this lead.
    `;
    await this.sendEmail(supportEmail, subject, body);
  }
}
