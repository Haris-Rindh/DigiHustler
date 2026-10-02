const fs = require('fs');
let content = fs.readFileSync('src/components/portal/AssignmentWorkspace.tsx', 'utf8');

if (!content.includes('import { emailService }')) {
  content = content.replace(/import \{ useApp \} from '\.\.\/\.\.\/context\/AppContext';/g, "import { useApp } from '../../context/AppContext';\nimport { emailService } from '../../lib/emailService';");
}

const sendEmails = `
      // Send Email Notifications
      const assignmentTitle = newTitle;
      
      // Notify leader if assigned
      if (leader && leader.email) {
        emailService.sendAssignmentNotificationEmail(leader.email, leader.name, assignmentTitle);
      }
      
      // Notify members
      selectedMembers.forEach(memberId => {
        const member = users.find(u => u.id === memberId);
        if (member && member.email && member.id !== leader?.id) {
          emailService.sendAssignmentNotificationEmail(member.email, member.name, assignmentTitle);
        }
      });
`;

content = content.replace(/createdBy: currentUser\.name\n      \}\);/g, `createdBy: currentUser.name\n      });\n\n${sendEmails}`);

fs.writeFileSync('src/components/portal/AssignmentWorkspace.tsx', content);
