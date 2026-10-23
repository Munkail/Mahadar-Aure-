import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function geminiSecretaryPlugin(): Plugin {
  return {
    name: 'gemini-secretary-api',
    configureServer(server) {
      server.middlewares.use('/api/gemini/secretary', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = body ? JSON.parse(body) : {};
            const { message, history = [], language = 'ha', settings = {} } = parsed;

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  text: language === 'ha'
                    ? "Barka da zuwa Mahadar Aure AI Secretary! Shirin mu yana aiki don taimaka muku samun abokin rayuwa bisa tsarin addinin Musulunci da al'ada mai kyau. Don Allah a tuntubi ofishinmu ta WhatsApp: 09165006713 ko Telegram: https://t.me/Mahadaraure."
                    : "Welcome to Mahadar Aure AI Secretary! We assist you in finding a righteous marriage partner with dignity and Islamic values. Please contact our official staff on WhatsApp: 09165006713 or Telegram: https://t.me/Mahadaraure."
                })
              );
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const stdPrice = settings.standardPriceNaira || 3000;
            const vipPrice = settings.vipPriceNaira || 5000;
            const waPhone = settings.contactWhatsApp || '09165006713';
            const tgLink = settings.contactTelegram || 'https://t.me/Mahadaraure';
            const fbLink = settings.contactFacebook || 'https://www.facebook.com/mahadaraure';
            const chLink = settings.contactWhatsAppChannel || 'https://whatsapp.com/channel/0029VbCDhJrHrDZb9cyYdu08';

            const systemInstruction = `You are the AI Secretary for "Mahadar Aure", a prestigious Islamic and Hausa-oriented marriage matchmaking service in Nigeria.
Tagline: "Haɗa Zuciya, Gina Gida, Gina Al’umma".

Key Rules & Knowledge:
1. Languages: Respond naturally and fluently in ${language === 'ha' ? 'Hausa (Hausa language is default)' : 'English'}, or code-switch respectfully if requested.
2. Tone: Warm, respectful, modest, dignified, adhering to Islamic etiquette (Bismillahi, Salamu alaikum, In sha Allah, etc.).
3. Service Overview: Mahadar Aure connects consenting adults (aged 18+) seeking lawful marriage (Nikah) under dignified conditions with guardian (Waliyyi) involvement.
4. Membership Plans & Prices:
   - Standard Plan: ₦${stdPrice.toLocaleString()} (Standard matching, basic verified profile).
   - VIP Plan: ₦${vipPrice.toLocaleString()} (Priority confidential matching, direct counseling support).
   Prices are strictly in Nigerian Naira (₦). Never invent promotional discounts or claim payment is verified without authorized staff confirmation.
5. Registration Requirements:
   - Must be an adult (18 years and above).
   - Provide accurate bio-data: Age, state/city, education, occupation, marital status (Never Married, Divorced, Widowed).
   - Optional genotype disclosure (AA, AS, SS, etc.) which is kept strictly confidential and accessible only to authorized staff for sickle-cell counseling.
   - Free consent to data processing for marriage introduction purposes only.
6. Matchmaking Mechanism:
   - Matchmaking is carefully reviewed and authorized by human staff based on mutual compatibility criteria.
   - We do not make automatic marriage predictions or guarantees. Final introductions require consent of both parties and their guardians.
7. Official Contact Channels:
   - WhatsApp Support: ${waPhone}
   - Telegram: ${tgLink}
   - Facebook Page: ${fbLink}
   - WhatsApp Channel: ${chLink}
8. Critical Guardrail: Clearly state you are an AI assistant. Never impersonate human staff. If a user raises complex issues, disputes, payment queries, or personal family matters, politely direct them to contact staff via WhatsApp (${waPhone}) or Telegram.`;

            // Format contents from history
            const contents: any[] = [];
            for (const h of history.slice(-6)) {
              contents.push({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
              });
            }
            contents.push({
              role: 'user',
              parts: [{ text: message }]
            });

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents,
              config: {
                systemInstruction,
                temperature: 0.6,
              },
            });

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ text: response.text || '' }));
          } catch (error: any) {
            console.error('Gemini Secretary API Error:', error);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                text: "Gafara dai, an samu ɗan matsala wajen sadarwa. Don Allah sake gwadawa ko kuma a tuntuɓi jami'in Mahadar Aure a WhatsApp: 09165006713."
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiSecretaryPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
