// src/components/AttentionMessage.tsx

import React, { useState } from "react";

interface AttentionMessageProps {
  message: string;
  onClose: () => void;
  onClick?: () => void;
  buttonContent?: string;
}

const AttentionMessage: React.FC<AttentionMessageProps> = ({
  message,
  onClose,
  onClick,
  buttonContent,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="error-message-overlay">
      <div className="error-message-container">
        <p className="error-message-text">{message}</p>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="acknowledge-checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="acknowledge-checkbox">
            Estou ciente de que este é um site para estudos.
          </label>
        </div>
        <div className="error-message-buttons">
          <button
            onClick={onClose}
            className="error-message-close-button"
            disabled={!isChecked}
          >
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

export default AttentionMessage;
