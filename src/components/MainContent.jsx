import React from 'react';
import { useInvestigation } from '../contexts/InvestigationContext';
import TicketExtractionCard from './phases/TicketExtractionCard';
import ComplexityAssessmentWidget from './phases/ComplexityAssessmentWidget';
import ConfidenceMeter from './phases/ConfidenceMeter';
import CustomerResponseCard from './phases/CustomerResponseCard';
import QAValidationChecklist from './phases/QAValidationChecklist';
import HiddenDetailsExpander from './phases/HiddenDetailsExpander';

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
