import React from 'react';
import { useInvestigation } from '../contexts/InvestigationContext';
import { CheckIcon, ArrowRightIcon, DashIcon, FolderIcon, BotIcon, PlusIcon, PlayIcon, PauseIcon } from './Icons';
import Button from './Button';

const PhaseProgress = () => {
  const { currentPhase, setCurrentPhase, elapsedTime } = useInvestigation();

  const phases = [
    "Pre-Investigation",
    "Ticket Extraction",
    "Customer History",
    "Trading Partner Spec",
    "Complexity Assessment",
    "Investigation Planning",
    "Investigation Execution",
    "Root Cause Synthesis",
    "Response & Files",
    "QA Validation",
  ];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <h3 className="text-xs font-medium uppercase text-gray-500 p-4 border-b border-gray-200">
        Investigation Progress
      </h3>
      <nav className="p-2 space-y-1">
        {phases.map((phase, index) => {
          const isCompleted = index < currentPhase;
          const isActive = index === currentPhase;

          let Icon = DashIcon;
          if (isCompleted) Icon = CheckIcon;
          if (isActive) Icon = ArrowRightIcon;

          let textClass = "text-gray-500";
          if (isCompleted) textClass = "text-gray-700 line-through";
          if (isActive) textClass = "text-blue-600 font-semibold";

          let bgClass = "hover:bg-gray-50";
          if (isCompleted) bgClass = "bg-gray-100 hover:bg-gray-200";
          if (isActive) bgClass = "bg-blue-100 border-l-4 border-blue-600";

          return (
            <button
              key={index}
              onClick={() => setCurrentPhase(index)}
              className={`flex items-center w-full h-10 px-4 py-2 text-left rounded-md transition-colors duration-150 ${bgClass}`}
            >
              <Icon
                className={`w-4 h-4 mr-3 ${
                  isCompleted ? "text-green-500" : isActive ? "text-blue-600" : "text-gray-400"
                }`}
              />
              <span className={`text-sm ${textClass}`}>
                [{index}] {phase}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Elapsed: {formatTime(elapsedTime)}</p>
      </div>
    </div>
  );
};

const AgentStatus = () => {
  const { currentPhase, isInvestigationRunning, pauseInvestigation, resumeInvestigation } = useInvestigation();

  const agentPhases = [
    { name: "Media Analysis", phases: [0], color: "pink", status: "Analyzing uploaded files..." },
    { name: "Analyst", phases: [1, 2], color: "blue", status: "Extracting ticket data..." },
    { name: "PM-Investigator", phases: [3, 4, 5], color: "purple", status: "Assessing complexity..." },
    { name: "Investigator", phases: [6, 7], color: "yellow", status: "Executing investigation..." },
    { name: "Documentation Specialist", phases: [8], color: "green", status: "Drafting response..." },
    { name: "QA-Validator", phases: [9], color: "cyan", status: "Validating findings..." },
  ];

  const currentAgent = agentPhases.find(a => a.phases.includes(currentPhase)) || agentPhases[0];

  const agentColors = {
    pink: { bg: "bg-pink-500", gradient: "from-pink-400 to-pink-600" },
    blue: { bg: "bg-blue-500", gradient: "from-blue-400 to-blue-600" },
    purple: { bg: "bg-purple-500", gradient: "from-purple-400 to-purple-600" },
    yellow: { bg: "bg-yellow-500", gradient: "from-yellow-400 to-yellow-600" },
    green: { bg: "bg-green-500", gradient: "from-green-400 to-green-600" },
    cyan: { bg: "bg-cyan-500", gradient: "from-cyan-400 to-cyan-600" },
  };

  const color = agentColors[currentAgent.color];
  const progress = ((currentPhase + 1) / 10) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm mt-6">
      <h3 className="text-xs font-medium uppercase text-gray-500 p-4 border-b border-gray-200">
        Current Agent
      </h3>
      <div className="p-4 flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full ${color.bg} flex items-center justify-center text-white mb-3`}>
          <BotIcon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-950">{currentAgent.name}</h3>
        <p className="text-xs text-gray-500">Phase {currentAgent.phases.join('-')}</p>
        <p className="text-sm text-gray-700 mt-4 px-2">
          Currently: {currentAgent.status}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${color.gradient} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</span>

        <div className="flex gap-2 mt-4">
          {isInvestigationRunning ? (
            <Button variant="secondary" onClick={pauseInvestigation} className="text-xs px-3 py-1.5">
              <PauseIcon className="w-3 h-3 mr-1" />
              Pause
            </Button>
          ) : (
            <Button variant="primary" onClick={resumeInvestigation} className="text-xs px-3 py-1.5">
              <PlayIcon className="w-3 h-3 mr-1" />
              Resume
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const FileOperations = () => {
  const folders = [
    { name: "incoming/", count: 3 },
    { name: "processing/", count: 1 },
    { name: "customers/", count: 87 },
    { name: "Trading_Partners/", count: 24 },
    { name: "resolution/", count: 456 },
  ];

  const handleUpload = () => {
    // Placeholder for file upload functionality
    alert('File upload functionality coming soon!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mt-6">
      <h3 className="text-xs font-medium uppercase text-gray-500 p-4 border-b border-gray-200">
        Files
      </h3>
      <div className="p-4 space-y-2">
        {folders.map(folder => (
          <button key={folder.name} className="flex items-center justify-between w-full h-10 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            <div className="flex items-center min-w-0">
              <FolderIcon className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{folder.name}</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5 ml-2">
              {folder.count}
            </span>
          </button>
        ))}
        <Button variant="secondary" className="w-full mt-4" onClick={handleUpload}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>
    </div>
  );
};

const AppSidebar = () => {
  return (
    <aside className="fixed top-16 bottom-0 left-0 w-72 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto hidden lg:block">
      <PhaseProgress />
      <AgentStatus />
      <FileOperations />
    </aside>
  );
};

export default AppSidebar;
