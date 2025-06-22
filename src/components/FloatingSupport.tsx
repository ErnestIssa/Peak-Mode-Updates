import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SupportModal from './SupportModal';

interface FloatingSupportProps {
  onSupportOpen: () => void;
  onSupportClose: () => void;
}

const FloatingSupport: React.FC<FloatingSupportProps> = ({ onSupportOpen, onSupportClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    const newState = !isModalOpen;
    setIsModalOpen(newState);
    if (newState) {
      onSupportOpen();
    } else {
      onSupportClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      onSupportClose();
    }
  };

  return (
    <>
      {/* Backdrop overlay when modal is open */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={handleBackdropClick}
        />
      )}

      <button
        onClick={toggleModal}
        className={`fixed bottom-4 right-4 z-50 bg-black text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 ${isModalOpen ? 'bg-gray-700' : 'hover:bg-black/90'}`}
        aria-label={isModalOpen ? "Close Support" : "Open Support"}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <SupportModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onSupportClose();
        }}
      />
    </>
  );
};

export default FloatingSupport; 