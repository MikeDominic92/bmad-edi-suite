# BMAD-EDI Investigation Suite

Enterprise EDI ticket investigation workflow automation powered by AI.

## Overview

BMAD-EDI v5.1 combines the BMAD Method v6 agent-based framework with precision investigation capabilities, designed specifically for EDI support engineers to streamline ticket resolution workflows.

### Key Features

- **10-Phase Investigation Workflow**: Automated progression from pre-investigation to QA validation
- **6 Specialized AI Agents**: Media Analysis, Analyst, PM-Investigator, Investigator, Documentation Specialist, QA-Validator
- **Complexity-Adaptive Questions**: 2-8 questions optimized based on ticket complexity (0-8 scoring)
- **Zero Hallucinations**: NotebookLM WebEDI KB integration with source verification
- **State Persistence**: localStorage-based investigation state management
- **Copy-Paste Optimized**: One-click copying for all customer responses
- **Keyboard Shortcuts**: Power-user accessibility (1-9 for phases, Cmd+K for commands)

## Tech Stack

- **Framework**: React 18.3 + Vite 5.3
- **Styling**: Tailwind CSS 3.4
- **Typography**: Inter + JetBrains Mono
- **State Management**: React Context API
- **Build Tool**: Vite (Fast HMR, optimized builds)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bmad-edi-suite.git
cd bmad-edi-suite

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
bmad-edi-app/
├── src/
│   ├── components/          # UI components
│   │   ├── phases/         # Phase-specific components
│   │   ├── AppHeader.jsx
│   │   ├── AppSidebar.jsx
│   │   ├── MainContent.jsx
│   │   ├── Button.jsx
│   │   ├── Icons.jsx
│   │   └── Toast.jsx
│   ├── contexts/           # React contexts
│   │   └── InvestigationContext.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useToast.jsx
│   ├── utils/              # Utility functions
│   │   └── clipboard.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## Usage

### Keyboard Shortcuts

- `1-9`: Jump to Phase 0-8
- `0`: Jump to Phase 9 (QA Validation)
- `Cmd/Ctrl + K`: Open command palette (coming soon)
- `Cmd/Ctrl + /`: Toggle sidebar (coming soon)
- `Cmd/Ctrl + C`: Copy active section

### Investigation Workflow

1. **Phase 0**: Pre-Investigation - Upload ticket file
2. **Phase 1-2**: Ticket Extraction - Automated data extraction
3. **Phase 3-5**: Complexity Assessment - Intelligent question optimization
4. **Phase 6-7**: Investigation Execution - NotebookLM KB queries
5. **Phase 8**: Customer Response - Formatted responses ready to send
6. **Phase 9**: QA Validation - 11-point quality checklist

### State Persistence

All investigation state is automatically saved to localStorage:
- Current phase
- Timer state (elapsed time)
- Ticket data
- Complexity scores
- Confidence levels
- Customer responses

State persists across page refreshes and browser sessions.

## Design System

### Colors

- **Primary Blue**: #2563EB
- **Success Green**: #10B981
- **Warning Amber**: #F59E0B
- **Error Red**: #EF4444
- **Info Purple**: #8B5CF6

### Typography

- **Font Family**: Inter (body), JetBrains Mono (code)
- **Scale**: 12px → 36px (defined in Tailwind config)

### Component Library

All components follow the design system specifications from the BMAD-EDI UI/UX design brief with:
- Consistent spacing (8px base unit)
- Hover animations (shadow lift, color darken)
- Focus states (keyboard navigation)
- Responsive breakpoints (1440px, 1024px, 768px, 375px)

## Features Implemented

✅ **Critical Bug Fixes**
- Fixed border width bug (`border-l-4` instead of `border-l-3`)
- Removed `dangerouslySetInnerHTML` security vulnerability
- Proper Tailwind build-time compilation (not runtime CDN)
- Error handling for clipboard operations with fallback

✅ **Core Features**
- Toast notifications with success/error/info variants
- Keyboard shortcuts for phase navigation
- Hover animations on cards and buttons
- Timer pause/resume functionality
- localStorage state persistence
- InvestigationContext for global state management

✅ **UI Components (9 Total)**
- Phase Progress Indicator
- Agent Status Card
- File Operations Panel
- Ticket Extraction Card
- Complexity Assessment Widget
- Confidence Meter
- Customer Response Card
- QA Validation Checklist
- Hidden Details Expander

## Upcoming Features

🔜 **Backend Integration**
- Node.js/Express API server
- NotebookLM WebEDI KB connection
- File upload processing
- Real investigation workflow automation

🔜 **Enhanced UI**
- Command palette (Cmd+K)
- Collapsible sidebar
- Mobile bottom navigation (functional)
- Dark mode toggle

🔜 **Production Features**
- Real-time investigation status updates
- WebSocket connection for live updates
- Export investigation reports (PDF/Markdown)
- Multi-user support

## Contributing

This project uses the BMAD Method v6 for development. To contribute:

1. Fork the repository
2. Create a feature branch
3. Use BMAD methodology for planning (PRD → Architecture → Stories)
4. Submit a pull request with clear description

## License

MIT License - See LICENSE file for details

## Author

**Michael Hoang** - EDI Support Engineer

## Acknowledgments

- Built with BMAD Method v6 (Breakthrough Method for Agile AI-Driven Development)
- Design system based on Linear, Notion, and Vercel Dashboard aesthetics
- NotebookLM integration for zero-hallucination knowledge base queries

---

**Version**: 1.0.0
**Last Updated**: 2025-01-14
**Status**: Production-Ready Frontend (Backend integration pending)
