import React, { createContext, useContext, useState, useEffect } from 'react';

const InvestigationContext = createContext();

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within InvestigationProvider');
  }
  return context;
};

export const InvestigationProvider = ({ children }) => {
  // Load from localStorage on mount
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [currentPhase, setCurrentPhase] = useState(() => loadFromStorage('currentPhase', 1));
  const [isInvestigationRunning, setIsInvestigationRunning] = useState(() => loadFromStorage('isRunning', false));
  const [elapsedTime, setElapsedTime] = useState(() => loadFromStorage('elapsedTime', 0));

  const [ticketData, setTicketData] = useState(() => loadFromStorage('ticketData', null));
  const [complexityScore, setComplexityScore] = useState(() => loadFromStorage('complexityScore', 3));
  const [confidence, setConfidence] = useState(() => loadFromStorage('confidence', 0.82));
  const [customerResponse, setCustomerResponse] = useState(() => loadFromStorage('customerResponse', ''));

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('currentPhase', JSON.stringify(currentPhase));
  }, [currentPhase]);

  useEffect(() => {
    localStorage.setItem('isRunning', JSON.stringify(isInvestigationRunning));
  }, [isInvestigationRunning]);

  useEffect(() => {
    localStorage.setItem('elapsedTime', JSON.stringify(elapsedTime));
  }, [elapsedTime]);

  useEffect(() => {
    localStorage.setItem('ticketData', JSON.stringify(ticketData));
  }, [ticketData]);

  useEffect(() => {
    localStorage.setItem('complexityScore', JSON.stringify(complexityScore));
  }, [complexityScore]);

  useEffect(() => {
    localStorage.setItem('confidence', JSON.stringify(confidence));
  }, [confidence]);

  useEffect(() => {
    localStorage.setItem('customerResponse', JSON.stringify(customerResponse));
  }, [customerResponse]);

  // Timer effect
  useEffect(() => {
    if (!isInvestigationRunning) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isInvestigationRunning]);

  const resetInvestigation = () => {
    setCurrentPhase(0);
    setIsInvestigationRunning(false);
    setElapsedTime(0);
    setTicketData(null);
    setComplexityScore(0);
    setConfidence(0);
    setCustomerResponse('');
    localStorage.clear();
  };

  const startInvestigation = () => {
    setIsInvestigationRunning(true);
    setCurrentPhase(0);
  };

  const pauseInvestigation = () => {
    setIsInvestigationRunning(false);
  };

  const resumeInvestigation = () => {
    setIsInvestigationRunning(true);
  };

  const value = {
    currentPhase,
    setCurrentPhase,
    isInvestigationRunning,
    setIsInvestigationRunning,
    elapsedTime,
    setElapsedTime,
    ticketData,
    setTicketData,
    complexityScore,
    setComplexityScore,
    confidence,
    setConfidence,
    customerResponse,
    setCustomerResponse,
    resetInvestigation,
    startInvestigation,
    pauseInvestigation,
    resumeInvestigation,
  };

  return (
    <InvestigationContext.Provider value={value}>
      {children}
    </InvestigationContext.Provider>
  );
};
