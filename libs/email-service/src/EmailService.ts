import * as nodemailer from "nodemailer";

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    // auth: {
    //   user: process.env.SMTP_USER || "test",
    //   pass: process.env.SMTP_PASS || "test",
    // },
    auth: "none",
  } as any);

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

  static async notifyJobPendingApproval(
    email: string,
    jobTitle: string,
    creatorName: string
  ) {
    await this.sendEmail(
      email,
      `New Job Pending Approval: ${jobTitle}`,
      `A new job "${jobTitle}" has been created by ${creatorName} and is waiting for your approval.`
    );
  }

  static async notifyJobApproved(
    email: string,
    jobTitle: string,
    budget?: number
  ) {
    let message = `Your job "${jobTitle}" has been approved and is now open for recruitment.`;
    if (budget) {
      message += `\n\nApproved Budget: ${budget}`;
    }
    await this.sendEmail(
      email,
      `Job Approved: ${jobTitle}`,
      message
    );
  }

  static async notifyJobRejected(
    email: string,
    jobTitle: string,
    reason: string
  ) {
    await this.sendEmail(
      email,
      `Job Rejected: ${jobTitle}`,
      `Your job "${jobTitle}" has been rejected.\n\nReason: ${reason}`
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
