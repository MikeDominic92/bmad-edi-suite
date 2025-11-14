import React from 'react';
import { useInvestigation } from '../../contexts/InvestigationContext';
import { CheckIcon } from '../Icons';

const ConfidenceMeter = () => {
  const { confidence } = useInvestigation();
  const confidenceLeft = `${confidence * 100}%`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 hover:shadow-lg transition-shadow duration-150">
      <h2 className="text-xl font-semibold text-gray-950 mb-6">Confidence Level</h2>
      <div className="w-full max-w-xl mx-auto">
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>0.0</span>
          <span>0.3</span>
          <span>0.5</span>
          <span>0.7</span>
          <span>1.0</span>
        </div>
        <div className="relative w-full h-8 bg-gradient-to-r from-error-red via-warning-amber to-success-green rounded-full mt-1">
          <div className="absolute top-0 left-[30%] w-px h-full bg-white opacity-40"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-white opacity-40"></div>
          <div className="absolute top-0 left-[70%] w-px h-full bg-white opacity-40"></div>

          <div className="absolute -bottom-10 text-center transition-all duration-500" style={{ left: confidenceLeft, transform: 'translateX(-50%)' }}>
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-primary-blue -mb-1"></div>
            <div className="text-xl font-bold text-gray-950 mt-1">{confidence.toFixed(2)}</div>
            <div className="text-sm font-semibold uppercase text-gray-600">HIGH</div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 font-medium px-1 mt-1">
          <span className="w-[30%] text-center text-error-red">LOW</span>
          <span className="w-[20%] text-center text-warning-amber">MEDIUM</span>
          <span className="w-[20%] text-center text-yellow-500">HIGH</span>
          <span className="w-[30%] text-center text-success-green">V.HIGH</span>
        </div>
      </div>
      <div className="mt-20 max-w-xl mx-auto space-y-2">
        <div className="flex items-center text-sm text-gray-700">
          <CheckIcon className="w-5 h-5 text-success-green mr-2" />
          Root cause identified with high confidence
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <CheckIcon className="w-5 h-5 text-success-green mr-2" />
          Resolution path verified from WebEDI KB
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <CheckIcon className="w-5 h-5 text-success-green mr-2" />
          All findings backed by source citations
        </div>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
