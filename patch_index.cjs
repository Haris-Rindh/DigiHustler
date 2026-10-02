const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const enhancedMeta = `
    <title>DigiHust | Digital Services Handled by Specialized Talent</title>
    <meta name="description" content="DigiHust delivers web development, design, AI & automation, digital marketing, and cybersecurity through verified specialized teams under one professional brand." />
    <meta property="og:title" content="DigiHust | Digital Services Handled by Specialized Talent" />
    <meta property="og:description" content="DigiHust delivers web development, design, AI & automation, digital marketing, and cybersecurity through verified specialized teams under one professional brand." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.digihust.tech" />
    <meta property="og:image" content="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="DigiHust | Digital Services Handled by Specialized Talent" />
    <meta name="twitter:description" content="DigiHust delivers web development, design, AI & automation, digital marketing, and cybersecurity through verified specialized teams under one professional brand." />
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://www.digihust.tech" />
`;

content = content.replace(/<title>.*?<\/title>\s*<meta name="description".*?\/>/s, enhancedMeta.trim());

fs.writeFileSync('index.html', content);
