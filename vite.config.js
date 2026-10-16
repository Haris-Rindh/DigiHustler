import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { verifyMailboxSmtp } from './server/emailVerifier.js';
import { sendWhatsAppNotification } from './server/whatsappNotifier.js';

function serverApiPlugin() {
  return {
    name: 'server-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/verify-email')) {
          try {
            const url = new URL(req.url, 'http://localhost:3000');
            const email = url.searchParams.get('email');
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            if (!email) {
              res.statusCode = 400;
              res.end(JSON.stringify({ exists: false, reason: 'missing_email', message: 'Email query parameter missing.' }));
              return;
            }

            const result = await verifyMailboxSmtp(email);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 200;
            res.end(JSON.stringify({ exists: true, reason: 'middleware_error_fail_open', details: err?.message }));
          }
        } else if (req.url && req.url.startsWith('/api/send-whatsapp')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }

          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              let leadData = body ? JSON.parse(body) : {};
              if (!leadData || (!leadData.name && !leadData.email)) {
                const url = new URL(req.url, 'http://localhost:3000');
                leadData = {
                  name: url.searchParams.get('name'),
                  email: url.searchParams.get('email'),
                  company: url.searchParams.get('company'),
                  description: url.searchParams.get('description'),
                };
              }
              const result = await sendWhatsAppNotification(leadData);
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err) {
              console.error('[Vite Dev Server] WhatsApp API error:', err);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, reason: 'middleware_fail_open', details: err?.message }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), serverApiPlugin()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    sourcemap: false, // S12: No .map files in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
