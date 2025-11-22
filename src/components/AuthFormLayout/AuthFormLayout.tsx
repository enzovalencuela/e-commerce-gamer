// src/components/AuthFormLayout.tsx

import React, { useState } from "react";
import "./AuthFormLayout.css";
import { Link, useNavigate } from "react-router-dom";
import OkMessage from "../OkMessage/OkMessage";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

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
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [showContaTesteMessage, setShowContaTesteMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const contaTesteMessage =
    "Se for preferível você pode entrar com uma conta teste, assim não precisará se cadastrar";

  const handleLoginTeste = async () => {
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "usuarioteste@teste.com",
          password: "usuarioteste",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao entrar com a conta teste.");
      }
      login(data);
      navigate("/");
    } catch (error) {
      console.error("Erro no login de teste:", error);
      setShowErrorMessage(true);
    } finally {
      setShowContaTesteMessage(false);
    }
  };

  return (
    <div className="auth-page-container">
      {showErrorMessage && (
        <ErrorMessage onClose={() => setShowContaTesteMessage(false)} />
      )}
      {showContaTesteMessage && (
        <OkMessage
          message={contaTesteMessage}
          onClose={() => setShowContaTesteMessage(false)}
          onClick={handleLoginTeste}
          buttonContent="Entrar"
        />
      )}
      <div className="auth-card">
        <div className="auth-welcome-section">
          {showLogo && (
            <img src="/LOGO_MARCA.png" alt="Logo" className="auth-logo" />
          )}
          <h3>{welcomeTitle}</h3>
          <p>{welcomeMessage}</p>
        </div>
        <div className="auth-form-section">
          <h2>{title}</h2>
          {children}
          <button
            onClick={() => setShowContaTesteMessage(true)}
            className="conta-teste-button"
          >
            Entrar com conta teste
          </button>
          <Link to={welcomeButtonLink} className="welcome-button">
            {welcomeButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthFormLayout;
