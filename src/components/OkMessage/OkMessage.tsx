import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

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
  return createPortal(
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
          <p className="error-message-text">{message}</p>
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
    </AnimatePresence>,
    document.body
  );
};

export default OkMessage;
