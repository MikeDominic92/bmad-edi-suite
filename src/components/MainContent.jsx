import React from 'react';
import { useInvestigation } from '../contexts/InvestigationContext';
import TicketExtractionCard from './phases/TicketExtractionCard';
import ComplexityAssessmentWidget from './phases/ComplexityAssessmentWidget';
import ConfidenceMeter from './phases/ConfidenceMeter';
import CustomerResponseCard from './phases/CustomerResponseCard';
import QAValidationChecklist from './phases/QAValidationChecklist';
import HiddenDetailsExpander from './phases/HiddenDetailsExpander';

// Start Investigation Button Component
const StartInvestigationButton = () => {
  const { startInvestigation, isInvestigationRunning, wsConnected } = useInvestigation();

  const handleStart = async () => {
    console.log('[UI] Start Investigation clicked');
    // Start with default ticket ID (will use files from incoming folder)
    await startInvestigation('13690386');
  };

  return (
    <button
      onClick={handleStart}
      disabled={isInvestigationRunning}
      className="w-full px-6 py-4 bg-primary-blue text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
    >
      {isInvestigationRunning ? 'Investigation Running...' : 'Start Investigation'}
    </button>
  );
};

// Trigger Info Component
const TriggerInfo = () => {
  const { wsConnected, folderStats } = useInvestigation();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 mb-2">BMAD-EDI v2.1 - Trigger Mode</h3>
      <div className="text-sm text-blue-800 space-y-1">
        <p>• Backend: {wsConnected ? '✅ Connected' : '⚠️ Disconnected'}</p>
        <p>• Files in incoming/: {folderStats.incoming || 0}</p>
        <p>• Mode: Trigger-based (uses Claude Code)</p>
      </div>
      <p className="mt-3 text-xs text-blue-600">
        Click "Start Investigation" to create a trigger that Claude Code will detect and auto-execute /bmadedi
      </p>
    </div>
  );
};

const MainContent = () => {
  const { currentPhase } = useInvestigation();

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 0:
        return (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold">Phase 0: Pre-Investigation</h2>
            <p className="mt-4 text-gray-700">File upload and initial analysis placeholder.</p>
            <p className="mt-2 text-sm text-gray-500">Upload a ticket file to begin automated investigation.</p>

            {/* Start Investigation Button */}
            <div className="mt-8 flex flex-col gap-4">
              <StartInvestigationButton />
              <TriggerInfo />
            </div>
          </div>
        );
      case 1:
      case 2:
        return <TicketExtractionCard />;
      case 3:
      case 4:
      case 5:
        return <ComplexityAssessmentWidget />;
      case 6:
      case 7:
        return <ConfidenceMeter />;
      case 8:
        return <CustomerResponseCard />;
      case 9:
        return (
          <>
            <QAValidationChecklist />
            <HiddenDetailsExpander />
          </>
        );
      default:
        return <TicketExtractionCard />;
    }
  };

  return (
    <main className="pt-20 pb-12 px-4 sm:px-8 bg-gray-50 min-h-screen lg:ml-72">
      <div className="max-w-4xl mx-auto">
        {renderPhaseContent()}
      </div>
    </main>
  );
};

export default MainContent;
