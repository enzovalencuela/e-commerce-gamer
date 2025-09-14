// src/components/AuthFormLayout.tsx

import React from "react";
import "./AuthFormLayout.css";
import { Link } from "react-router-dom";

interface AuthFormLayoutProps {
  title: string;
  children: React.ReactNode;
  welcomeTitle: string;
  welcomeMessage: string;
  welcomeButtonText: string;
  welcomeButtonLink: string;
  showLogo?: boolean;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  children,
  welcomeTitle,
  welcomeMessage,
  welcomeButtonText,
  welcomeButtonLink,
  showLogo = false,
}) => {
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-form-section">
          <h2>{title}</h2>
          {children}
        </div>
        <div className="auth-welcome-section">
          {showLogo && (
            <img src="/LOGO_MARCA.png" alt="Logo" className="auth-logo" />
          )}
          <h3>{welcomeTitle}</h3>
          <p>{welcomeMessage}</p>
          <Link to={welcomeButtonLink} className="welcome-button">
            {welcomeButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthFormLayout;
