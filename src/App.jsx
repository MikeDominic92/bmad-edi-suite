import React, { useEffect } from 'react';
import { useInvestigation } from './contexts/InvestigationContext';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import AppHeader from './components/AppHeader';
import AppSidebar from './components/AppSidebar';
import MainContent from './components/MainContent';

function App() {
  const { currentPhase, setCurrentPhase } = useInvestigation();
  const { toasts, showToast, removeToast } = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K: Command palette (placeholder)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        showToast('Command palette coming soon!', 'info');
      }

      // Cmd/Ctrl + /: Toggle sidebar (placeholder)
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        showToast('Sidebar toggle coming soon!', 'info');
      }

      // 1-9: Jump to phase (0-8)
      if (e.key >= '1' && e.key <= '9') {
        const phase = parseInt(e.key) - 1;
        setCurrentPhase(phase);
        showToast(`Jumped to Phase ${phase}`, 'success', 2000);
      }

      // 0: Jump to phase 9
      if (e.key === '0') {
        setCurrentPhase(9);
        showToast('Jumped to Phase 9', 'success', 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentPhase, showToast]);

  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      <AppHeader />
      <AppSidebar />
      <MainContent />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Mobile bottom nav placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex lg:hidden items-center justify-around z-10">
        <button className="flex flex-col items-center text-primary-blue">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4h.01M12 12h.01M15 12h.01M12 15h.01M15 15h.01" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
          <span className="text-xs mt-1">Files</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1">History</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 font-medium text-xs">
            MH
          </div>
          <span className="text-xs mt-1">User</span>
        </button>
      </div>
    </div>
  );
}

export default App;
