import { useState, useEffect } from 'react';

const INITIAL_DELAY = 4 * 1000; // 4 seconds

export const usePeakModePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after initial delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, INITIAL_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    onClose: handleClose
  };
}; 