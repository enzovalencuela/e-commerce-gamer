// src/components/Header.tsx

import React, { useState } from "react";
import TopBar from "../components/TopBar";
import MainNavbar from "../components/MainNavBar";

const navDepartments = [
  { id: "1", name: "PC Gamer" },
  { id: "2", name: "Notebooks" },
  { id: "3", name: "Periféricos" },
  { id: "4", name: "Consoles" },
  { id: "5", name: "Componentes" },
  { id: "6", name: "Monitores" },
  { id: "7", name: "Realidade VR" },
  { id: "8", name: "Hardware" },
];

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header>
      <TopBar />
      <div className="div-nav">
        <MainNavbar
          onSearch={onSearch}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <ul className="div-ul">
          {navDepartments.map((dept) => (
            <li key={dept.id} className="li-departamento">
              {dept.name}
            </li>
          ))}
        </ul>
      </div>
      {isMobileMenuOpen && (
        <div className="mobile-menu-container open">
          <button
            className="close-button"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            X
          </button>
          <div className="div-ul-mobile">
            <ul>
              {navDepartments.map((dept) => (
                <li key={dept.id}>{dept.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
