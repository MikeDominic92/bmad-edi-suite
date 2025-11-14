import { useEffect, useState, useCallback, useRef } from 'react';

export const useInvestigationStream = () => {
  const [ws, setWs] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseData, setPhaseData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [isInvestigationRunning, setIsInvestigationRunning] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    try {
      console.log('[WebSocket] Connecting to investigation stream...');
      const websocket = new WebSocket('ws://localhost:8080');

      websocket.onopen = () => {
        console.log('[WebSocket] Connected to investigation stream');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[WebSocket] Message received:', message.type);

          if (message.type === 'PHASE_UPDATE') {
            setCurrentPhase(message.phase);
            setPhaseData(prev => ({
              ...prev,
              [message.phase]: message.data
            }));

            // If phase 9 complete, stop investigation
            if (message.phase === 9 && message.data.status === 'complete') {
              setIsInvestigationRunning(false);
            }
          } else if (message.type === 'CONNECTED') {
            console.log('[WebSocket]', message.message);
          }
        } catch (error) {
          console.error('[WebSocket] Message parse error:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };

      websocket.onclose = () => {
        console.log('[WebSocket] Disconnected from investigation stream');
        setIsConnected(false);
        setWs(null);

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          console.log(`[WebSocket] Reconnecting in ${delay}ms...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, delay);
        }
      };

      setWs(websocket);
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const startInvestigation = useCallback(async (ticketId) => {
    if (window.electronAPI) {
      console.log('[Investigation] Starting investigation for ticket:', ticketId);
      setIsInvestigationRunning(true);
      setCurrentPhase(0);
      setPhaseData({});

      const result = await window.electronAPI.startInvestigation(ticketId);

      if (!result.success) {
        console.error('[Investigation] Error:', result.error);
        setIsInvestigationRunning(false);
      }

      return result;
    } else {
      console.error('[Investigation] Electron API not available');
      return { success: false, error: 'Electron API not available' };
    }
  }, []);

  const pauseInvestigation = useCallback(async () => {
    if (window.electronAPI) {
      console.log('[Investigation] Pausing investigation');
      const result = await window.electronAPI.pauseInvestigation();
      return result;
    }
  }, []);

  const resumeInvestigation = useCallback(async () => {
    if (window.electronAPI) {
      console.log('[Investigation] Resuming investigation');
      const result = await window.electronAPI.resumeInvestigation();
      return result;
    }
  }, []);

  return {
    currentPhase,
    phaseData,
    isConnected,
    isInvestigationRunning,
    startInvestigation,
    pauseInvestigation,
    resumeInvestigation
  };
};
