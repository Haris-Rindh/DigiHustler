const fs = require('fs');

// BlogPost.tsx
let bp = fs.readFileSync('src/components/public/BlogPost.tsx', 'utf8');
bp = bp.replace(/<SEOHead([\s\S]*?)description=\{post\.excerpt\}/, '<SEOHead$1description={post.excerpt}\n        ogImage={post.imageUrl || undefined}');
fs.writeFileSync('src/components/public/BlogPost.tsx', bp);

// CaseStudyDetail.tsx
let cs = fs.readFileSync('src/components/public/CaseStudyDetail.tsx', 'utf8');
cs = cs.replace(/<SEOHead([\s\S]*?)description=\{study\.summary\}/, '<SEOHead$1description={study.summary}\n        ogImage={study.imageUrl || undefined}');
fs.writeFileSync('src/components/public/CaseStudyDetail.tsx', cs);
