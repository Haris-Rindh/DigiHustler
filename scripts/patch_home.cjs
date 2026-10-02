const fs = require('fs');
let content = fs.readFileSync('src/components/public/Home.tsx', 'utf8');

// Replace the CLIENT LOGO TRUST STRIP
const startStr = '{/* ── CLIENT LOGO TRUST STRIP ── */}';
const endStr = '</section>';
const startIndex = content.indexOf(startStr);
if (startIndex !== -1) {
    const nextSection = content.indexOf('{/* ── METRICS STRIP ── */}', startIndex);
    if (nextSection !== -1) {
        content = content.substring(0, startIndex) + content.substring(nextSection);
    }
}

// Replace the roles in testimonials if needed? Wait, the PDF said "Show the roles on these cards like intern, specialist, management, etc. in addition to all these information"
// Let's check where those cards are. The screenshot in the PDF for issue 1 shows team profile cards, not testimonial cards!
// "These brands look fake so change them" points to the Client logo strip.
// "Show the roles on these cards like intern, specialist, management, etc. in addition to all these information" points to the "Meet The Talent" cards!
// I'll leave the testimonials alone, and focus on the team cards.

fs.writeFileSync('src/components/public/Home.tsx', content, 'utf8');
