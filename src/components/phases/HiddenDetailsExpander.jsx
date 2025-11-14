import React, { useState } from 'react';
import { ChevronDownIcon } from '../Icons';

const HiddenDetailsExpander = () => {
  const [open, setOpen] = useState(null);

  const toggle = (id) => setOpen(open === id ? null : id);

  const sections = [
    { id: 'actions', title: "Show Actions", content: "Detailed action steps would be populated here from the investigation system." },
    { id: 'root', title: "Show Root Cause", content: "Root cause analysis with evidence and citations would be displayed here." },
    { id: 'citations', title: "Show Citations", content: "Source citations from NotebookLM WebEDI KB would be listed here." },
    { id: 'validation', title: "Show Validation", content: "Detailed validation results and test outcomes would appear here." },
    { id: 'escalation', title: "Show Dev Escalation", content: "Developer escalation template would be shown if needed." },
  ];

  return (
    <div className="bg-gray-100 rounded-lg p-6 mt-8">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Additional Details (Hidden by Default)
      </h3>
      <div className="flex flex-wrap gap-2">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            className="flex items-center gap-1 text-sm text-gray-700 bg-transparent hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
          >
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${open === s.id ? 'rotate-180' : ''}`} />
            {s.title}
          </button>
        ))}
      </div>

      {open && (
        <div className="mt-4 p-4 bg-white rounded-md shadow-sm border border-gray-200 animate-slide-down">
          <h4 className="text-base font-semibold text-gray-900 mb-2">
            {sections.find(s => s.id === open)?.title}
          </h4>
          <p className="text-sm text-gray-700">
            {sections.find(s => s.id === open)?.content}
          </p>
        </div>
      )}
    </div>
  );
};

export default HiddenDetailsExpander;
