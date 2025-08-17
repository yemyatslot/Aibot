# AI Math Bot (Next.js)

Features:
- Ask advanced third-year math questions in English or Myanmar
- Upload a photo/screenshot of the problem; OCR runs in the browser and the recognized text is sent to the model
- LaTeX rendering with KaTeX

## Setup
1. Create a GitHub repo and copy these files into the repo paths shown.
2. In Vercel, import the repo and set an environment variable:
   - `OPENAI_API_KEY` = your OpenAI key
3. `npm install` (locally)
4. `npm run dev` to test locally

Notes:
- Do NOT commit your API key to the repo. Use Vercel env vars.
- Tesseract runs in the browser, so OCR is done client-side to avoid heavy server work.
