/**
 * Email Service Module
 * Handles sending assessment results via email using Nodemailer
 */

import nodemailer from "nodemailer";
import { generateAssessmentEmailHTML, generateAssessmentEmailText, AssessmentEmailData } from "./email-templates";

/**
 * Email service configuration
 */
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

/**
 * Email service class
 */
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;
  private isInitialized = false;

  /**
   * Initialize email service with configuration
   */
  async initialize(config: EmailConfig): Promise<void> {
    try {
      this.config = config;
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.auth.user,
          pass: config.auth.pass,
        },
      });

      // Verify connection
      await this.transporter.verify();
      this.isInitialized = true;
      console.log("✅ Email service initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize email service:", error);
      throw error;
    }
  }

  /**
   * Send assessment result email
   */
  async sendAssessmentEmail(
    recipientEmail: string,
    assessmentData: AssessmentEmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isInitialized || !this.transporter || !this.config) {
      return {
        success: false,
        error: "Email service not initialized",
      };
    }

    try {
      // Validate email
      if (!this.isValidEmail(recipientEmail)) {
        return {
          success: false,
          error: "Invalid email address",
        };
      }

      // Generate email content
      const htmlContent = generateAssessmentEmailHTML(assessmentData);
      const textContent = generateAssessmentEmailText(assessmentData);

      // Send email
      const info = await this.transporter.sendMail({
        from: this.config.from,
        to: recipientEmail,
        subject: `不動産査定結果 - ${assessmentData.prefecture}${assessmentData.city}${assessmentData.location}`,
        text: textContent,
        html: htmlContent,
        replyTo: "noreply@hy-consulting.jp",
      });

      console.log(`✅ Email sent successfully to ${recipientEmail} (ID: ${info.messageId})`);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to send email to ${recipientEmail}:`, errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send bulk assessment emails
   */
  async sendBulkAssessmentEmails(
    recipients: Array<{ email: string; data: AssessmentEmailData }>
  ): Promise<{
    successful: number;
    failed: number;
    results: Array<{ email: string; success: boolean; messageId?: string; error?: string }>;
  }> {
    const results = await Promise.all(
      recipients.map((recipient) =>
        this.sendAssessmentEmail(recipient.email, recipient.data).then((result) => ({
          email: recipient.email,
          ...result,
        }))
      )
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      successful,
      failed,
      results,
    };
  }

  /**
   * Validate email address
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if service is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;
export type { EmailConfig, AssessmentEmailData };
