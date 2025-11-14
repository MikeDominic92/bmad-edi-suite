# Quick Start Guide - BMAD-EDI Suite

## 🚀 Get Running in 60 Seconds

### 1. Install Dependencies

```bash
cd bmad-edi-app
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

### 3. Try These Features

**Keyboard Shortcuts:**
- Press `1` to jump to Phase 0 (Pre-Investigation)
- Press `2` to jump to Phase 1 (Ticket Extraction)
- Press `0` to jump to Phase 9 (QA Validation)

**Copy Functionality:**
- Click any "Copy" button on the Ticket Extraction phase
- You'll see a toast notification confirming the copy

**Timer Controls:**
- Go to the sidebar → Agent Status Card
- Click "Pause" to pause the investigation timer
- Click "Resume" to resume

**State Persistence:**
- Navigate to different phases
- Refresh the page
- Notice your phase position and timer are preserved!

## 📂 Project Structure

```
bmad-edi-app/
├── src/
│   ├── components/          # All UI components
│   │   └── phases/         # Phase-specific screens
│   ├── contexts/           # State management
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Helper functions
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind configuration
```

## 🎯 What's Working

✅ All 10 investigation phases with UI
✅ Phase navigation (click sidebar or keyboard 0-9)
✅ Timer with pause/resume
✅ Copy-to-clipboard with toast notifications
✅ State persistence (survives page refresh)
✅ Responsive design (desktop, tablet, mobile)
✅ Keyboard shortcuts (1-9, 0)
✅ Hover animations on cards/buttons

## 🔜 What's Coming

🔜 Backend API integration
🔜 Real file upload processing
🔜 NotebookLM WebEDI KB connection
🔜 Automated investigation workflow
🔜 Export reports (PDF/Markdown)

## 🐛 Known Issues

- File upload button shows alert (functionality not yet implemented)
- Mock data only (no real investigation backend)
- Command palette (Cmd+K) shows "coming soon" toast

## 📚 Learn More

- [Full README](README.md) - Complete documentation
- [GitHub Repository](https://github.com/MikeDominic92/bmad-edi-suite)
- Design system based on Linear, Notion, Vercel aesthetics

## 💡 Tips

1. **Explore All Phases**: Click through phases 0-9 to see different UI components
2. **Test Keyboard Shortcuts**: Try pressing numbers 1-9 and 0 to jump between phases
3. **Copy Text**: Click "Copy" buttons to test clipboard functionality with toast feedback
4. **Watch the Timer**: The timer at the bottom of the phase progress tracks investigation time
5. **Refresh Test**: Change phases, refresh page, notice state persists!

## 🛠️ Development Commands

```bash
# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚢 Deploy

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

## 📞 Need Help?

- Check [README.md](README.md) for full documentation
- Open an issue on [GitHub](https://github.com/MikeDominic92/bmad-edi-suite/issues)
- Review component code in `src/components/`

---

**Happy investigating! 🎉**
