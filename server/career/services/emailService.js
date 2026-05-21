const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.isConfigured = true;
    } else {
      console.warn('⚠️ SMTP not configured. Emails will be logged to console instead.');
    }
  }

  async sendMail(options) {
    if (!this.isConfigured) {
      console.log('📧 [Email Mock] To:', options.to, '| Subject:', options.subject);
      return;
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      ...options,
    });
  }

  /**
   * Send confirmation email to the candidate after applying.
   */
  async sendApplicationConfirmation(candidate, job) {
    await this.sendMail({
      to: candidate.email,
      subject: `Application Received — ${job.title} at SK Constructions`,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 32px;">
          <div style="background: #0C0C0C; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #FFB800; font-size: 20px; margin: 0;">SK Constructions</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
            <h2 style="color: #0C0C0C; font-size: 18px;">Thank you for your application, ${candidate.fullName}!</h2>
            <p style="color: #555; line-height: 1.6;">
              We have received your application for the position of <strong>${job.title}</strong> 
              in our <strong>${job.department}</strong> department at <strong>${job.location}</strong>.
            </p>
            <p style="color: #555; line-height: 1.6;">
              Our hiring team will carefully review your profile and get back to you soon. 
              In the meantime, feel free to explore more about us.
            </p>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                This is an automated email from SK Constructions Career Portal. 
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    });
  }

  /**
   * Send notification to admin when a new application is received.
   */
  async sendAdminNotification(candidate, job) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;

    await this.sendMail({
      to: adminEmail,
      subject: `New Application — ${job.title} from ${candidate.fullName}`,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0C0C0C;">New Job Application Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #333;">Position:</td><td style="padding: 8px; color: #555;">${job.title}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #333;">Candidate:</td><td style="padding: 8px; color: #555;">${candidate.fullName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #333;">Email:</td><td style="padding: 8px; color: #555;">${candidate.email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #333;">Phone:</td><td style="padding: 8px; color: #555;">${candidate.phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #333;">Experience:</td><td style="padding: 8px; color: #555;">${candidate.experience} years</td></tr>
            ${candidate.resumeUrl ? `<tr><td style="padding: 8px; font-weight: bold; color: #333;">Resume:</td><td style="padding: 8px;"><a href="${candidate.resumeUrl}" style="color: #FFB800;">Download</a></td></tr>` : ''}
          </table>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">Log in to the admin panel to review this application.</p>
        </div>
      `,
    });
  }
}

module.exports = new EmailService();
