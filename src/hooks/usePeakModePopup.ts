import { useState, useEffect } from 'react';

const INITIAL_DELAY = 10 * 1000; // 10 seconds

export const usePeakModePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasSeenPopup = sessionStorage.getItem('peakModePopupSeen');
    
    if (!hasSeenPopup) {
      // Show popup after initial delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark as seen in this session
        sessionStorage.setItem('peakModePopupSeen', 'true');
      }, INITIAL_DELAY);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    onClose: handleClose
  };
}; 