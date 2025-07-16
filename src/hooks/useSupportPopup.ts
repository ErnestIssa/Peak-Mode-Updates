import { useState, useEffect } from 'react';

export const useSupportPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onClose = () => {
    setIsVisible(false);
  };

  const onOpen = () => {
    setIsVisible(true);
  };

  return {
    isVisible,
    onClose,
    onOpen
  };
}; 