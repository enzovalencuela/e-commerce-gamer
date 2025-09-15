// src/components/OkMessage.tsx

import React from "react";

interface OkMessageProps {
  message: string;
  onClose: () => void;
  onClick?: () => void;
  buttonContent?: string;
}

const OkMessage: React.FC<OkMessageProps> = ({
  message,
  onClose,
  onClick,
  buttonContent,
}) => {
  return (
    <div className="error-message-overlay">
      <div className="error-message-container">
        <p className="error-message-text">{message}</p>
        <div className="error-message-buttons">
          <button onClick={onClose} className="error-message-close-button">
            Fechar
          </button>
          {onClick && buttonContent && (
            <button onClick={onClick} className="error-message-close-button">
              {buttonContent}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OkMessage;
