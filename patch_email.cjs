const fs = require('fs');
let content = fs.readFileSync('src/lib/emailService.ts', 'utf8');

const newMethod = `
  async sendAssignmentNotificationEmail(
    recipientEmail: string,
    recipientName: string,
    assignmentTitle: string
  ): Promise<EmailDispatchResult> {
    const cleanEmail = recipientEmail.trim().toLowerCase();
    console.log(\`[DigiHust Mailer] Sending assignment notification for "\${assignmentTitle}" to \${cleanEmail}\`);

    if (EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        const templateParams = {
          to_email: cleanEmail,
          to_name: recipientName,
          assignment_title: assignmentTitle,
          message: \`A new assignment "\${assignmentTitle}" has been published in the DigiHust Portal. Please log in to view the details.\`
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
`;

content = content.replace(/async sendPasswordResetEmail\(/, newMethod + "\n  async sendPasswordResetEmail(");

fs.writeFileSync('src/lib/emailService.ts', content);
