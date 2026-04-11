# QuickScan

An AI-powered document archive. Upload PDFs or images and Claude instantly extracts text, classifies the document type, detects the year, writes a summary, and pulls out key facts. Documents persist across sessions and can be queried via a per-document chat.

## Features

- **AI analysis** — extracts text, detects document type and year, generates a summary and key facts
- **Chat** — ask questions about any document in plain English
- **Archive** — documents are grouped by year and saved to local storage so they survive page refreshes
- **Export** — download any document as a PDF
- **Multi-file upload** — drag or select multiple files, processed concurrently

## Tech stack

- React 19
- Claude claude-sonnet-4-20250514 (Anthropic API)
- jsPDF
- Vercel (serverless API route for key security)

## Local development

Clone the repo and install dependencies:

```bash
git clone https://github.com/jellyfishing2346/quick-scan.git
cd quick-scan/quick-scan
npm install
```

Create a `.env` file in `quick-scan/quick-scan/`:

```
ANTHROPIC_KEY=your-anthropic-api-key
```

Start the local proxy server and the React dev server in two separate terminals:

```bash
# Terminal 1
node --env-file=.env server.js

# Terminal 2
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com), set **Root Directory** to `quick-scan`
3. Add `ANTHROPIC_KEY` as an environment variable in the Vercel project settings
4. Deploy

The `api/claude.js` serverless function keeps the API key server-side — it is never exposed to the browser.

## License

MIT
