// src/components/Header.tsx

import React, { useState } from "react";
import TopBar from "../components/TopBar";
import MainNavbar from "../components/MainNavBar";
import CategoryNavbar from "../components/CategoryNavBar";

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
        <CategoryNavbar />
      </div>
      {/* O MobileMenu é renderizado condicionalmente */}
      {isMobileMenuOpen && <></>}
    </header>
  );
};

export default Header;
