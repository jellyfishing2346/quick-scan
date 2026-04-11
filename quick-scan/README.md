# QuickScan

![License](https://img.shields.io/badge/license-MIT-gold) ![React](https://img.shields.io/badge/React-19-blue?logo=react) ![Claude](https://img.shields.io/badge/Claude-Sonnet_4-blueviolet?logo=anthropic) ![Vercel](https://img.shields.io/badge/deployed-Vercel-black?logo=vercel)

> Turn a pile of PDFs and photos into a searchable, AI-summarized document archive — in seconds.

Most people have a folder of scanned documents they'll never find again. QuickScan fixes that: drop in a file, and Claude reads it, figures out what it is, pulls out the key facts, and files it by year — automatically. You can then chat with any document in plain English.

---

## Demo

> *(Add a screen recording GIF here — [Kap](https://getkap.co) is great for this on Mac)*

---

## Features

| Feature | Detail |
|---|---|
| **AI document analysis** | Extracts text, detects document type and year, writes a 2–3 sentence summary and key facts |
| **Per-document chat** | Ask plain-English questions about any file — context-aware conversation powered by Claude |
| **Persistent archive** | Documents survive page refreshes via localStorage — grouped and browsable by year |
| **Full-text search** | Searches inside extracted text and summaries, not just filenames |
| **Drag-and-drop** | Drop files anywhere on the canvas, not just the upload button |
| **Skeleton loading** | Cards appear immediately as placeholders — the app stays interactive during AI processing |
| **Responsive** | Collapses to a mobile-friendly layout with a slide-in sidebar drawer |
| **Secure by default** | API key lives server-side in a Vercel serverless function — never shipped to the browser |

---

## How it works

```
User drops a file
       │
       ▼
 Skeleton card appears immediately (optimistic UI)
       │
       ▼
 File → base64 → sent to Claude with a structured prompt
       │
       ├── Extracts raw text verbatim
       ├── Classifies document type (Invoice, Contract, ID, etc.)
       ├── Detects the year
       ├── Writes a plain-English summary
       └── Pulls out key facts as a list
       │
       ▼
 Response parsed from JSON → card fills in with real data
       │
       ▼
 Saved to localStorage → persists across sessions
```

The API key never touches the client. All Claude calls are proxied through a [Vercel serverless function](api/claude.js) that reads `ANTHROPIC_KEY` from the server environment.

---

## Tech stack

- **React 19** — UI and state management
- **Claude Sonnet 4** (Anthropic API) — document analysis and chat
- **jsPDF** — converts uploaded images to archival PDF format
- **Vercel** — hosting + serverless API proxy

---

## Local development

**Prerequisites:** Node 18+, an [Anthropic API key](https://console.anthropic.com)

```bash
git clone https://github.com/jellyfishing2346/quick-scan.git
cd quick-scan/quick-scan
npm install
```

Create `.env` in `quick-scan/quick-scan/`:

```
ANTHROPIC_KEY=your-key-here
```

Run the proxy server and React dev server in two terminals:

```bash
# Terminal 1 — API proxy (no extra dependencies, uses Node 20 built-ins)
node --env-file=.env server.js

# Terminal 2 — React app
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com) → set **Root Directory** to `quick-scan`
3. Add `ANTHROPIC_KEY` as an environment variable
4. Deploy

---

## License

[MIT](LICENSE)
