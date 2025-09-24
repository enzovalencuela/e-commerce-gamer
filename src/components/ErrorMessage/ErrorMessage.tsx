// src/components/ErrorMessage.tsx

import React from "react";

interface ErrorMessageProps {
  onClose: () => void;
  onClick?: () => void | Promise<void>;
  buttonContent?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  onClose,
  onClick,
  buttonContent,
}) => {
  return (
    <div className="error-message-overlay">
      <div className="error-message-container">
        <p className="error-message-text">Erro ao realizar operação, verifique se está logado e tente novamente mais tarde</p>
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

export default ErrorMessage;
