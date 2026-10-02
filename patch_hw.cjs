const fs = require('fs');
let content = fs.readFileSync('src/components/public/HowItWorks.tsx', 'utf8');

if (!content.includes('import { useApp }')) {
  content = content.replace(/import \{ SEOHead \} from '\.\.\/seo\/SEOHead';/g, "import { SEOHead } from '../seo/SEOHead';\nimport { useApp } from '../../context/AppContext';");
}

content = content.replace(/const \[openFaq, setOpenFaq\] = useState<number \| null>\(0\);/g, "const [openFaq, setOpenFaq] = useState<number | null>(0);\n  const { siteContent } = useApp();\n  const videoUrl = siteContent?.howItWorksVideoUrl;");

const videoSection = `
      {videoUrl && (
        <section className="bg-[var(--bg-subtle)] py-16 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-subtle)]"
            >
              <iframe
                src={videoUrl}
                title="How DigiHust Works"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </motion.div>
          </div>
        </section>
      )}
`;

content = content.replace(/\{(\/\* Process Steps \*\/)\}/, videoSection + '      {$1}');

fs.writeFileSync('src/components/public/HowItWorks.tsx', content);
