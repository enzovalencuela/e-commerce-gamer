// src/components/Header.tsx

import React from "react";
import TopBar from "../TopBar/TopBar";
import MainNavbar from "../MainNavBar/MainNavBar";
import "./Header.css";

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
  return (
    <header>
      <TopBar />
      <div className="div-nav">
        <MainNavbar onSearch={onSearch} />
        <ul className="div-ul">
          {navDepartments.map((dept) => (
            <li key={dept.id} className="li-departamento">
              {dept.name}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
