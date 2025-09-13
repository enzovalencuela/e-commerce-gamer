// src/components/MobileMenu.tsx

import React from "react";

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  return (
    <div className="mobile-menu-container open">
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <div className="div-ul-mobile">
        <ul>
          <li>Link 1</li>
          <li>Link 2</li>
          <li>Link 2</li>
          <li>Link 2</li>
          <li>Link 2</li>
          <li>Link 2</li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
