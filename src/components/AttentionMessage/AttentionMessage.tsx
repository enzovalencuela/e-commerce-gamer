// src/components/ErrorMessage.tsx

import React, { useState } from "react";

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
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
        <button
          onClick={onClose}
          className="error-message-close-button"
          disabled={!isChecked}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
