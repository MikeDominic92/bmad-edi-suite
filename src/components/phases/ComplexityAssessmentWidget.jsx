import React from 'react';
import { useInvestigation } from '../../contexts/InvestigationContext';

const ComplexityAssessmentWidget = () => {
  const { complexityScore } = useInvestigation();

  const factors = [
    { name: "Error Clarity", score: 0, max: 2, desc: "Clear error code identified" },
    { name: "System Scope", score: 1, max: 2, desc: "Dual systems involved (GlobalShop + John Deere)" },
    { name: "Pattern Recognition", score: 1, max: 2, desc: "Similar pattern exists in knowledge base" },
    { name: "Customer History", score: 1, max: 2, desc: "New issue, known customer" },
  ];

  const totalScore = factors.reduce((acc, f) => acc + f.score, 0);
  const maxScore = factors.reduce((acc, f) => acc + f.max, 0);

  const getScoreColor = (score, max) => {
    const ratio = score / max;
    if (ratio <= 0.3) return "from-green-400 to-green-600";
    if (ratio <= 0.7) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 relative hover:shadow-lg transition-shadow duration-150">
      <div className="absolute top-6 right-6 w-12 h-12 bg-warning-amber rounded-full flex items-center justify-center text-white text-xl font-bold">
        {totalScore}/{maxScore}
      </div>
      <h2 className="text-xl font-semibold text-gray-950 mb-6">Complexity Assessment</h2>
      <h3 className="text-sm font-semibold text-gray-800 mb-4">📊 Scoring Breakdown</h3>
      <div className="space-y-4">
        {factors.map(factor => (
          <div key={factor.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-gray-950">{factor.name}</span>
              <span className="text-xs font-medium text-gray-500">{factor.score}/{factor.max}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-grow bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(factor.score, factor.max)} transition-all duration-300`}
                  style={{ width: `${(factor.score / factor.max) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1">{factor.desc}</p>
          </div>
        ))}
      </div>
      <hr className="my-6 border-gray-200" />
      <div className="flex items-center gap-4 mb-4">
        <span className="inline-block px-5 py-2 text-sm font-semibold text-white bg-warning-amber rounded-full">
          📍 Complexity Level: L1 - MODERATE
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Investigation Strategy:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Questions: 4-5</li>
          <li>NotebookLM Queries: 1-2</li>
          <li>Estimated Time: 45 seconds</li>
          <li>Strategy: Primary + diagnostic queries</li>
        </ul>
      </div>
    </div>
  );
};

export default ComplexityAssessmentWidget;
