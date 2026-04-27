import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

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
  const modal = (
    <AnimatePresence>
      <motion.div
        className="error-message-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="error-message-container"
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <p className="error-message-text">
            Erro ao realizar operação, verifique se está logado e tente
            novamente mais tarde.
          </p>
          <div className="error-message-buttons">
            <motion.button
              onClick={onClose}
              className="error-message-close-button"
              whileTap={{ scale: 0.97 }}
            >
              Fechar
            </motion.button>
            {onClick && buttonContent && (
              <motion.button
                onClick={onClick}
                className="error-message-close-button"
                whileTap={{ scale: 0.97 }}
              >
                {buttonContent}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
};

export default ErrorMessage;
