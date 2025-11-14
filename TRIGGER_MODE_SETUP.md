# BMAD-EDI v2.1 - Trigger Mode Setup Guide

**No API Key Needed! Use Claude Code Directly**

---

## What's New in v2.1?

Instead of using the Anthropic API (which requires a paid API key), v2.1 uses a **trigger-based system** where the Electron app communicates with Claude Code running in your VS Code session.

### Architecture

```
Electron App                Claude Code (VS Code)
    │                              │
    ├─ Detects ticket              │
    ├─ Creates .trigger file ───────>
    │                              │
    │                         Detects trigger
    │                              │
    │                         Runs /bmadedi
    │                              │
    │                         Saves results
    │                              │
    <─── Reads results ────────────┤
    │                              │
    └─ Displays in UI              │
```

**Benefits:**
- ✅ **FREE** - No API key or usage costs
- ✅ Uses your existing Claude Code subscription
- ✅ Full visibility - see investigation in VS Code
- ✅ Same powerful /bmadedi workflow
- ✅ No code changes to your workflow

---

## Setup (5 minutes)

### Step 1: Install Python Watchdog (Optional but Recommended)

For automatic trigger detection:

```bash
pip install watchdog
```

*Without this, you'll need to manually run /bmadedi when triggers are created*

### Step 2: Verify Hooks Are Installed

Check that these files exist:

```
C:\Users\jae2j\.claude\hooks\
├── bmad-edi-auto-trigger.py       # Python watcher
├── bmad-edi-trigger-watcher.sh    # Bash watcher (alternative)
├── bmad-edi-session-start.sh      # Auto-start on session
└── user-prompt-submit.sh          # Auto-detect triggers
```

All hooks were created automatically during setup!

### Step 3: Start Claude Code Session

1. Open VS Code
2. Open terminal in your tickets directory
3. Start Claude Code (Cmd+Shift+P → "Claude Code")
4. You'll see in the logs:

```
[BMAD-EDI] v2.1 - Trigger-Based Mode Active
[BMAD-EDI] Watching for investigation triggers...
[BMAD-EDI] Ready to receive triggers from BMAD-EDI App
```

### Step 4: Start the Electron App

```bash
cd C:\Users\jae2j\OneDrive\Desktop\bmad-edi-app
npm run dev
```

You'll see:

```
[BMAD-EDI] Investigation engine initialized (Trigger-based mode)
[BMAD-EDI] Trigger directory: C:\Users\jae2j\Documents\tickets\.triggers
[BMAD-EDI] Waiting for Claude Code to execute investigations...
```

### Step 5: Run Your First Investigation

1. Drop a ticket file into `C:\Users\jae2j\Documents\tickets\incoming\`
2. Click **"Start Investigation"** in the app
3. Watch the magic:
   - App creates `.trigger` file
   - Claude Code detects it
   - Automatically runs `/bmadedi`
   - Results appear in app in real-time!

---

## How It Works

### Trigger File Format

When you click "Start Investigation", the app creates a JSON trigger file:

**File:** `C:\Users\jae2j\Documents\tickets\.triggers\13690386.trigger`

```json
{
  "ticketId": "13690386",
  "webEdiId": "5035",
  "companyName": "Vee Engineering",
  "files": [
    {
      "name": "ticket_13690386.pdf",
      "type": "pdf"
    }
  ],
  "timestamp": "2025-11-14T20:30:00.000Z",
  "status": "pending"
}
```

### Claude Code Detection

The Python watcher (`bmad-edi-auto-trigger.py`) monitors the `.triggers/` folder:

1. Detects new `.trigger` file
2. Reads ticket metadata
3. Automatically executes `/bmadedi` in your Claude Code session
4. Creates `.complete` file when done

### App Monitors Results

The Electron app watches for:
- `.complete` file in `.triggers/` folder, OR
- `investigation_*.md` and `response_*.md` files in `resolution/` folder

When found, displays results in the UI!

---

## Workflow Example

### Manual Workflow (Traditional)

```bash
# You manually:
1. Open Claude Code
2. Type: /bmadedi
3. Answer prompts
4. Copy results
5. Organize files
Total time: 30-60 minutes
```

### Automated Workflow (v2.1 Trigger Mode)

```bash
# App automatically:
1. Detects ticket
2. Triggers Claude Code
3. Claude Code runs /bmadedi
4. Results appear in app
Total time: 5-10 minutes (hands-off!)
```

---

## Troubleshooting

### "No triggers detected"

**Check:**
1. Is Claude Code running in VS Code?
2. Is Python watcher installed? `pip install watchdog`
3. Check logs: `C:\Users\jae2j\.claude\hooks\bmad-edi-auto.log`

**Manual trigger:**
If watcher isn't working, you can manually run `/bmadedi` when you see:
```
[BMAD-EDI] Trigger created: C:\Users\jae2j\Documents\tickets\.triggers\13690386.trigger
```

### "Investigation timeout"

**Possible causes:**
- Claude Code not running
- /bmadedi command failed
- File permissions issue

**Fix:**
1. Check Claude Code session is active
2. Manually run `/bmadedi` to test
3. Check `bmad-edi-auto.log` for errors

### "Results not appearing in app"

**Check:**
1. Investigation completed successfully?
2. Files exist in `resolution/{customer}/`?
3. File names match pattern: `investigation_*.md`, `response_*.md`

**Manual check:**
```bash
ls "C:\Users\jae2j\Documents\tickets\resolution\5035_Vee_Engineering\"
# Should show: investigation_13690386.md, response_13690386.md
```

---

## Advanced Configuration

### Change Trigger Directory

Edit `.env`:
```bash
TRIGGER_DIR=C:/custom/path/.triggers
```

### Adjust Timeout

Edit `electron/backend/investigation-engine-trigger.js`:
```javascript
const result = await this.watchForCompletion(triggerData, 900000); // 15 min
```

### Disable Automatic Triggers

Comment out in `bmad-edi-auto-trigger.py`:
```python
# observer.start()  # Disable automatic watching
```

Then manually run `/bmadedi` when you see triggers.

---

## Comparison: v2.0 vs v2.1

| Feature | v2.0 (Claude SDK) | v2.1 (Trigger Mode) |
|---------|-------------------|---------------------|
| **Cost** | $0.30-0.50/ticket | FREE |
| **Setup** | API key required | No API key |
| **Visibility** | Backend only | See in VS Code |
| **Speed** | 5-10 min | 5-10 min (same) |
| **Control** | Automated | Automated |
| **Flexibility** | Fixed workflow | Can pause/edit |

---

## FAQ

**Q: Do I still need an Anthropic API key?**
A: No! v2.1 uses your existing Claude Code subscription.

**Q: Can I use both modes?**
A: Yes! Keep v2.0 for production, use v2.1 for development.

**Q: What if Claude Code crashes?**
A: App will timeout after 10 minutes. Just restart Claude Code and click "Start Investigation" again.

**Q: Can I edit the investigation while it's running?**
A: Yes! Since it's running in your Claude Code session, you can interact with it directly in VS Code.

**Q: Does this work offline?**
A: Claude Code requires internet, but no separate API calls are made.

---

## Next Steps

1. ✅ **Start Claude Code** in VS Code
2. ✅ **Start Electron App** with `npm run dev`
3. ✅ **Drop ticket** into `incoming/` folder
4. ✅ **Click "Start Investigation"**
5. ✅ **Watch Claude Code execute /bmadedi automatically!**

---

**Congratulations!** You're now using BMAD-EDI v2.1 Trigger Mode with zero API costs!

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
