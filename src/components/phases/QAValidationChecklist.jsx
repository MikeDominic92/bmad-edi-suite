import React from 'react';
import { CheckIcon } from '../Icons';
import Button from '../Button';

const QAValidationChecklist = () => {
  const items = [
    "All NotebookLM citations from WebEDI KB only",
    "No hallucinations or unsourced claims",
    "Complexity assessment accurate",
    "Question count appropriate (2-8 based on complexity)",
    "Zero generic questions",
    "Trading Partner spec consulted (if available)",
    "Customer history reviewed",
    "Root cause confidence > 0.7 (or escalated if < 0.5)",
    "Customer response non-technical",
    "Files organized to resolution folder",
    "Customer history updated",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 hover:shadow-lg transition-shadow duration-150">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-950">QA Validation</h2>
        <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-success-green rounded-full text-sm font-medium">
          <CheckIcon className="w-5 h-5" />
          11/11
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center">
            <CheckIcon className="w-5 h-5 text-success-green mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
      <Button variant="success" className="w-full h-12 mt-8">
        <CheckIcon className="w-5 h-5" />
        <span className="ml-2">Investigation Approved - Ready to Send</span>
      </Button>
    </div>
  );
};

export default QAValidationChecklist;
