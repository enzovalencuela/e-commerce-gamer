import React, { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

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
            <motion.button
              onClick={onClose}
              className="error-message-close-button"
              disabled={!isChecked}
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

export default AttentionMessage;
