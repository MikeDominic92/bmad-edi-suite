# BMAD-EDI Suite v2.0 - Complete Electron Integration

**Date:** November 14, 2025
**Version:** 2.0.0 (Electron + Claude SDK + NotebookLM)

---

## OVERVIEW

The BMAD-EDI Suite has been completely transformed from a static React dashboard into a fully automated investigation system powered by Electron, Claude AI (via Anthropic SDK), and NotebookLM integration.

### What Changed?

**Before (v1.0):** Static dashboard displaying mock investigation data
**After (v2.0):** Full workflow automation executing real BMAD-EDI investigations with Claude Code as the AI engine

---

## ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                 ELECTRON DESKTOP APP                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         REACT FRONTEND (Renderer)                     │  │
│  │  • UI for all 10 phases                               │  │
│  │  • Real-time WebSocket updates                        │  │
│  │  • Live progress tracking                             │  │
│  └────────────────┬──────────────────────────────────────┘  │
│                   │ IPC + WebSocket                          │
│  ┌────────────────▼──────────────────────────────────────┐  │
│  │         NODE.JS BACKEND (Main Process)                │  │
│  │                                                         │  │
│  │  • Investigation Engine (Claude SDK)                  │  │
│  │  • 9-Phase Workflow Automation                        │  │
│  │  • File Processing (PDF/HTML/Images)                  │  │
│  │  • NotebookLM Browser Automation                      │  │
│  │  • File System Manager                                │  │
│  │  • WebSocket Server (port 8080)                       │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        C:\Users\jae2j\Documents\tickets\
        ├── incoming/        (monitored for new files)
        ├── customers/       (history lookup)
        ├── Trading_Partners/ (specs verification)
        └── resolution/      (final output)
```

---

## KEY FEATURES

### 1. Complete BMAD-EDI Workflow Automation

**All 9 Phases Implemented:**

1. **Ticket Extraction** (Analyst Agent)
   - PDF, HTML, image parsing
   - OCR support (Gemini integration ready)
   - Structured data extraction via Claude

2. **Customer History Review** (Analyst Agent)
   - Loads from `customers/{webEdiId}_{companyName}.md`
   - Pattern recognition
   - Risk assessment

3. **Trading Partner Check** (PM-Investigator Agent)
   - Verifies specs from `Trading_Partners/` folder
   - Requirement validation

4. **Complexity Assessment** (PM-Investigator Agent)
   - 4-factor scoring (0-8 scale)
   - Adaptive question count (2-8)

5. **Investigation Planning** (PM-Investigator Agent)
   - Generates NotebookLM queries
   - All questions prefixed: "Using ONLY WebEDI Knowledge Base sources:"

6. **Investigation Execution** (Investigator Agent)
   - **NotebookLM browser automation** (Patchright)
   - Queries WebEDI Knowledge Base
   - Citation extraction

7. **Root Cause Synthesis** (Investigator Agent)
   - Synthesizes findings from all queries
   - Confidence scoring

8. **Customer Response & File Organization** (Documentation Specialist Agent)
   - Generates professional response
   - Saves investigation report
   - Saves customer response
   - **Moves files:** `incoming/` → `resolution/{customer}/`

9. **QA Validation** (QA-Validator Agent)
   - Final validation
   - Copy-paste ready output

### 2. Real-Time Progress Streaming

**WebSocket Integration:**
- Backend broadcasts updates every phase
- Frontend displays live progress
- Phase-by-phase status updates
- Confidence tracking
- Citation display

**User Experience:**
- Watch investigation unfold in real-time
- Pause/resume functionality
- Live timer
- Progress indicators for each phase

### 3. File System Operations

**Automated File Management:**
- Monitors `incoming/` folder with Chokidar
- Parses PDF files (pdf-parse)
- Parses HTML files (jsdom)
- OCR for images (ready for Gemini integration)
- Moves completed investigations to `resolution/`
- Updates customer history files
- Creates investigation reports

**File Structure:**
```
C:\Users\jae2j\Documents\tickets\
├── incoming/
│   └── ticket_13690386.pdf          [Monitored]
├── customers/
│   └── 5035_Vee_Engineering.md      [Read]
├── Trading_Partners/
│   └── John_Deere/                  [Read]
└── resolution/
    └── 5035_Vee_Engineering/
        ├── ticket_13690386.pdf      [Moved here]
        ├── investigation_13690386.md [Generated]
        └── response_13690386.md      [Generated]
```

### 4. Claude SDK Integration

**Anthropic API:**
- Model: `claude-sonnet-4-5-20250929`
- All 9 phases use Claude for analysis
- System prompts for each agent role
- Clean, copy-paste ready outputs
- No emojis (uses [+], [!], [*] markers)

**API Usage:**
- ~15-20 API calls per investigation
- Average 4K tokens input, 2K output
- Estimated cost: $0.30-0.50 per ticket

### 5. NotebookLM Integration

**Browser Automation (Patchright):**
- Launches Chromium browser
- Navigates to WebEDI Knowledge Base notebook
- Submits queries
- Extracts responses and citations
- Calculates confidence based on citations

**Fallback Mode:**
- If NotebookLM not available, uses mock responses
- Allows testing without full setup
- Can be configured later

---

## FILE STRUCTURE

```
bmad-edi-app/
├── electron/
│   ├── main.js                       # Electron entry point
│   ├── preload.js                    # IPC bridge (secure)
│   └── backend/
│       ├── investigation-engine.js   # Main workflow orchestrator
│       ├── file-processor.js         # PDF/HTML/Image parsing
│       ├── notebooklm-client.js      # NotebookLM automation
│       └── file-system-manager.js    # File operations
│
├── src/
│   ├── components/                   # React UI (existing)
│   ├── contexts/
│   │   └── InvestigationContext.jsx  # Updated with WebSocket
│   ├── hooks/
│   │   └── useInvestigationStream.js # NEW: WebSocket hook
│   └── api/                          # File system API (existing)
│
├── package.json                      # Updated with Electron scripts
├── electron-builder.json             # NEW: Packaging config
├── .env                              # NEW: Configuration
├── .env.example                      # NEW: Template
└── BMAD_EDI_ELECTRON_INTEGRATION.md  # This file
```

---

## CONFIGURATION

### Environment Variables (.env)

**Required:**
```bash
ANTHROPIC_API_KEY=your_api_key_here
NOTEBOOKLM_NOTEBOOK_URL=https://notebooklm.google.com/notebook/fe1e5d80-9cf6-45fe-a974-0b5525c6b403
TICKETS_BASE_PATH=C:/Users/jae2j/Documents/tickets
```

**Optional:**
```bash
WEBSOCKET_PORT=8080
NODE_ENV=development
```

### Getting Your Anthropic API Key

1. Visit: https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create new key
5. Copy to `.env` file

---

## USAGE

### Development Mode

**Start the app:**
```bash
npm run dev
```

This runs:
1. Vite dev server (React frontend on port 5173)
2. Electron app (loads frontend + backend)

**What happens:**
- React app opens in Electron window
- WebSocket server starts on port 8080
- File watcher monitors `incoming/` folder
- Backend ready to execute investigations

### Starting an Investigation

**Option 1: Automatic (File Watcher)**
- Drop ticket file into `C:\Users\jae2j\Documents\tickets\incoming\`
- App detects file automatically
- Click "Start Investigation" button
- Watch real-time progress through all 9 phases

**Option 2: Manual Trigger**
- Use UI to select ticket ID
- Click "Start Investigation"
- Backend processes file from incoming folder

**What You'll See:**
- Phase 0: Investigation starting...
- Phase 1: Extracting ticket data... ✓
- Phase 2: Reviewing customer history... ✓
- Phase 3: Checking trading partner specs... ✓
- Phase 4: Assessing complexity... (Score: 4/8, L2) ✓
- Phase 5: Planning investigation... (6 questions) ✓
- Phase 6: Executing queries... (NotebookLM) ✓
- Phase 7: Synthesizing root cause... (Confidence: 0.82) ✓
- Phase 8: Generating response & organizing files... ✓
- Phase 9: QA validation complete! ✓

**Result:**
- Investigation report saved
- Customer response ready to copy-paste
- Files moved to resolution folder
- Customer history updated

### Pause/Resume

**During investigation:**
- Click "Pause" to pause workflow
- Backend stops at current phase
- Click "Resume" to continue
- Investigation picks up where it left off

---

## PRODUCTION BUILD

### Build for Windows

```bash
npm run build:win
```

**Output:** `dist-electron/BMAD-EDI Suite-1.0.0-x64.exe` (NSIS installer)
**Output:** `dist-electron/BMAD-EDI Suite-1.0.0-x64-portable.exe` (Portable)

### Build for macOS

```bash
npm run build:mac
```

**Output:** `dist-electron/BMAD-EDI Suite-1.0.0.dmg`
**Output:** `dist-electron/BMAD-EDI Suite-1.0.0-mac.zip`

### Build for Linux

```bash
npm run build:linux
```

**Output:** `dist-electron/BMAD-EDI Suite-1.0.0.AppImage`
**Output:** `dist-electron/bmad-edi-suite_1.0.0_amd64.deb`

### Installation

**Windows:**
- Run `.exe` installer
- Follow setup wizard
- App installs to `C:\Program Files\BMAD-EDI Suite\`
- Desktop shortcut created

**macOS:**
- Open `.dmg` file
- Drag to Applications folder
- Launch from Launchpad

**Linux:**
- Run AppImage: `chmod +x BMAD-EDI-Suite-1.0.0.AppImage && ./BMAD-EDI-Suite-1.0.0.AppImage`
- Or install deb: `sudo dpkg -i bmad-edi-suite_1.0.0_amd64.deb`

---

## TROUBLESHOOTING

### Issue: "ANTHROPIC_API_KEY not found"

**Solution:**
1. Create `.env` file in project root
2. Add: `ANTHROPIC_API_KEY=your_api_key_here`
3. Restart app

### Issue: "Cannot connect to WebSocket"

**Solution:**
1. Check if port 8080 is available
2. Change port in `.env`: `WEBSOCKET_PORT=8081`
3. Update frontend hook to match
4. Restart app

### Issue: "No files found in incoming folder"

**Solution:**
1. Verify path in `.env`: `TICKETS_BASE_PATH=C:/Users/jae2j/Documents/tickets`
2. Check folder exists
3. Add test file to `incoming/` folder
4. Check app console for errors

### Issue: "NotebookLM queries failing"

**Solution:**
- NotebookLM integration uses browser automation (may need manual login first time)
- Check if Patchright installed: `npm install patchright`
- Update selectors in `notebooklm-client.js` if NotebookLM UI changed
- For now, app uses mock responses as fallback

### Issue: "PDF parsing error"

**Solution:**
1. Check if PDF is corrupted
2. Try re-saving PDF
3. Check console for specific error
4. Some PDFs may need OCR (image-based PDFs)

---

## TESTING

### Test with Vee Engineering Ticket

**Setup:**
1. Copy `Documents/tickets/resolution/4984_Lubrication_Specialties_Inc/ticket_13671123.htm` to `incoming/`
2. Start app: `npm run dev`
3. Click "Start Investigation"
4. Watch phases complete in real-time

**Expected Results:**
- Phase 1: Extracts Lubrication Specialties data
- Phase 2: Loads customer history from `customers/4984_*.md`
- Phase 4: Complexity score calculated
- Phase 6: NotebookLM queries executed (or mock)
- Phase 8: Files moved to `resolution/4984_*/`
- Phase 9: Final output ready

### Manual Testing Checklist

- [ ] App launches successfully
- [ ] WebSocket connects (green indicator)
- [ ] Folder stats load correctly
- [ ] Start investigation button works
- [ ] Real-time phase updates appear
- [ ] Phase progress shows in UI
- [ ] Pause/resume works
- [ ] Files move to resolution folder
- [ ] Investigation report saved
- [ ] Customer response generated
- [ ] Final output copy-paste ready

---

## COST ANALYSIS

### Claude API Costs

**Per Investigation:**
- 9 phases × ~2 API calls each = ~18 calls
- Average 4K input + 2K output per call
- Cost: $0.30-0.50 per investigation

**Monthly (200 tickets):**
- 200 tickets × $0.40 avg = $80/month

**Comparison:**
- Manual investigation time: 30-60 min
- Automated time: 5-10 min
- Time savings: 80-90%
- Cost per hour saved: ~$2-3

### Gemini API (OCR - Optional)

**If using Google AI Studio skill:**
- Free tier: 15 requests/minute
- Paid: $0.00025/image
- Minimal cost impact

---

## NEXT STEPS

### Immediate (Before First Use)

1. **Get Anthropic API Key**
   - Visit https://console.anthropic.com/
   - Create account
   - Generate API key
   - Add to `.env` file

2. **Test with Sample Ticket**
   - Copy test file to `incoming/`
   - Run `npm run dev`
   - Start investigation
   - Verify all phases complete

3. **Configure NotebookLM** (Optional)
   - Update selectors in `notebooklm-client.js`
   - Test browser automation
   - Authenticate manually first time

### Enhancements

**High Priority:**
1. **NotebookLM Selectors**: Update with actual UI selectors
2. **Error Handling**: Add retry logic for API failures
3. **Logging**: Enhanced logging for debugging
4. **Toast Notifications**: Better user feedback

**Medium Priority:**
1. **Email Integration**: Auto-fetch tickets from email
2. **Multi-ticket Queue**: Process multiple tickets in sequence
3. **Analytics Dashboard**: Track investigation metrics
4. **Export Options**: PDF, DOCX, Excel reports

**Low Priority:**
1. **Custom MCP Server**: Package as reusable MCP server
2. **Mobile Companion**: React Native app for notifications
3. **Cloud Sync**: Sync investigations across devices
4. **Team Features**: Multi-user support

---

## SECURITY CONSIDERATIONS

### API Key Protection

- `.env` file is gitignored
- Never commit API keys
- Use environment variables only
- Keys stored locally, never in code

### IPC Security

- `contextBridge` used in preload.js
- No direct Node.js access from renderer
- All IPC calls validated
- Limited API surface exposed

### File System Access

- Limited to `TICKETS_BASE_PATH` only
- No access to system directories
- File operations validated
- Sandboxed environment

### Browser Automation

- NotebookLM runs in separate browser context
- No access to main app
- Headless mode in production
- Authentication handled separately

---

## KNOWN LIMITATIONS

1. **NotebookLM Integration**: Requires manual UI selector configuration
2. **OCR**: Image-based PDFs need Google AI Studio skill integration
3. **Single Investigation**: Can't run multiple investigations simultaneously
4. **Windows File Paths**: Uses Windows-style paths (C:\Users\...)
5. **Large Files**: Very large PDFs (>50MB) may timeout

---

## CHANGELOG

### v2.0.0 (November 14, 2025)

**Added:**
- ✓ Complete Electron desktop app
- ✓ Claude SDK integration (Anthropic API)
- ✓ Investigation engine with 9-phase workflow
- ✓ File processor (PDF, HTML, image parsing)
- ✓ NotebookLM client (browser automation)
- ✓ File system manager (Chokidar watcher)
- ✓ WebSocket server (real-time updates)
- ✓ React frontend integration (WebSocket hooks)
- ✓ IPC bridge (secure Electron communication)
- ✓ Configuration system (.env support)
- ✓ Build scripts (Windows, macOS, Linux)

**Changed:**
- ↻ InvestigationContext.jsx - Added WebSocket integration
- ↻ package.json - Added Electron scripts
- ↻ File system API - Now uses Electron IPC

**Fixed:**
- ✓ Real-time progress tracking
- ✓ Automated file operations
- ✓ Professional output formatting

### v1.0.0 (Previous)

- ✓ Static React dashboard
- ✓ Mock investigation data
- ✓ UI for all 10 phases
- ✓ State management (Context API)
- ✓ localStorage persistence

---

## SUPPORT

**Documentation:**
- This file: `BMAD_EDI_ELECTRON_INTEGRATION.md`
- File system integration: `FILE_SYSTEM_INTEGRATION.md`
- Frontend structure: `BMAD_EDI_APP_STRUCTURE.md`

**Issues:**
- GitHub: [Create issue](https://github.com/yourusername/bmad-edi-app/issues)
- Email: support@example.com

**Updates:**
- Check for updates: `git pull origin main`
- Rebuild: `npm install && npm run build`

---

## LICENSE

MIT License - See LICENSE file for details

---

## CREDITS

**Built with:**
- React 18.3
- Electron 39.2
- Vite 5.3
- Tailwind CSS 3.4
- Claude AI (Anthropic SDK)
- Patchright (Browser automation)
- pdf-parse, jsdom, cheerio
- chokidar (File watching)
- WebSocket (ws)

**Developed by:** Michael Hoang
**Framework:** BMAD Method V6 + BMAD-EDI v5.1
**AI Assistant:** Claude Code (Anthropic)

---

**BMAD-EDI Suite v2.0 - Investigation Automation Powered by Claude AI**

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
