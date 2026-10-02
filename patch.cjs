const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');

content = content.replace(/import \{.*?\} from 'lucide-react';/, "import { ShieldCheck, Linkedin, Github, Facebook, Instagram, Twitter, Mail, AtSign } from 'lucide-react';");

content = content.replace(/\{\s*label:\s*'GitHub',\s*icon:\s*<Github.*?href:\s*'https:\/\/github\.com\/digihust'\s*\}/, "{ label: 'GitHub', icon: <Github className=\"w-4 h-4 text-[var(--text-heading)] group-hover:scale-110 transition-transform duration-150\" />, href: 'https://github.com/DigiHust-Official' }");
content = content.replace(/\{\s*label:\s*'Facebook',\s*icon:\s*<Facebook.*?href:\s*'https:\/\/www\.facebook\.com\/share\/p\/1EubKwa3Ce\/'\s*\}/, "{ label: 'Facebook', icon: <Facebook className=\"w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform duration-150\" />, href: 'https://www.facebook.com/digihust.tech' },\n                { label: 'Instagram', icon: <Instagram className=\"w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform duration-150\" />, href: 'https://www.instagram.com/digi_hust/' },\n                { label: 'Twitter/X', icon: <Twitter className=\"w-4 h-4 text-[#1DA1F2] group-hover:scale-110 transition-transform duration-150\" />, href: 'https://x.com/DigiHust' },\n                { label: 'Threads', icon: <AtSign className=\"w-4 h-4 text-[var(--text-heading)] group-hover:scale-110 transition-transform duration-150\" />, href: 'https://www.threads.com/@digi_hust' }");
content = content.replace(/\{\s*label:\s*'Email Inquiries',\s*icon:\s*<Mail.*?href:\s*'mailto:contact@digihust\.com'\s*\}/, "{ label: 'Email Inquiries', icon: <Mail className=\"w-4 h-4 text-[var(--brand-teal)] group-hover:scale-110 transition-transform duration-150\" />, href: 'mailto:digihust@gmail.com' }");

content = content.replace(/className="flex items-center space-x-2.5 pt-2"/, "className=\"flex flex-wrap gap-2.5 pt-2\"");

fs.writeFileSync('src/components/layout/Footer.tsx', content);
