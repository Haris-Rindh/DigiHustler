import emailjs from '@emailjs/browser';

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_RESET_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_PASSWORD_RESET_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const emailService = {
  /**
   * Dispatches a branded 6-digit verification code to the member's registered email using EmailJS.
   */
  
  async sendAssignmentNotificationEmail(
    recipientEmail: string,
    recipientName: string,
    assignmentTitle: string
  ): Promise<EmailDispatchResult> {
    const cleanEmail = recipientEmail.trim().toLowerCase();
    if (import.meta.env.DEV) {
      console.log(`[DigiHust Mailer] Dispatching assignment notification for "${assignmentTitle}"`);
    }

    if (EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        const templateParams = {
          to_email: cleanEmail,
          to_name: recipientName,
          assignment_title: assignmentTitle,
          message: `A new assignment "${assignmentTitle}" has been published in the DigiHust Portal. Please log in to view the details.`
        };
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_ASSIGNMENT_TEMPLATE_ID || EMAILJS_RESET_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
        return { success: true, messageId: response.text };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    } else {
      console.warn('[DigiHust Mailer] EmailJS not configured. Simulating assignment email dispatch.');
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, messageId: 'sim_assignment_email' }), 600);
      });
    }
  },

  async sendPasswordResetEmail(
    recipientEmail: string,
    recipientName: string,
    otpCode: string
  ): Promise<EmailDispatchResult> {
    const cleanEmail = recipientEmail.trim().toLowerCase();
    if (import.meta.env.DEV) {
      console.log('[DigiHust Mailer] Dispatching security password reset OTP verification code');
    }

    // If EmailJS credentials are configured, send real email directly to inbox
    if (EMAILJS_SERVICE_ID && EMAILJS_RESET_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        const templateParams = {
          to_email: cleanEmail,
          to: cleanEmail,
          email: cleanEmail,
          recipient: cleanEmail,
          user_email: cleanEmail,
          recipient_email: cleanEmail,
          to_name: recipientName || 'Team Member',
          name: recipientName || 'Team Member',
          user_name: recipientName || 'Team Member',
          otp_code: otpCode,
          passcode: otpCode,
          code: otpCode,
          verification_code: otpCode,
          expires_in: '15 minutes',
          company_name: 'DigiHust Internal Operations',
          support_email: 'digihust@gmail.com',
          message: `Your DigiHust security verification code is: ${otpCode}. It will expire in 15 minutes.`
        };

        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_RESET_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        if (import.meta.env.DEV) {
          console.log('[DigiHust Mailer] EmailJS delivery completed with status:', response.status);
        }
        return {
          success: true,
          messageId: `emailjs-${Date.now()}`
        };
      } catch (err: any) {
        console.error('[DigiHust Mailer] EmailJS dispatch error:', err);
      }
    }

    return {
      success: true,
      messageId: `msg-${Date.now()}`
    };
  }
};
