// src/components/AuthFormLayout.tsx

import React, { useState } from "react";
import "./AuthFormLayout.css";
import { Link, useNavigate } from "react-router-dom";
import OkMessage from "../OkMessage/OkMessage";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
  const [showContaTesteMessage, setShowContaTesteMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const contaTesteMessage =
    "Se for preferível você pode entrar com uma conta teste, assim não precisará se cadastrar";

  const handleLoginTeste = async () => {
    setIsLoading(true);
    const auth = getAuth();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL2;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        "usuarioteste@teste.com",
        "usuarioteste"
      );

      const firebaseIdToken = await userCredential.user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/user-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseIdToken}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao sincronizar conta teste.");

      const data = await response.json();
      login(data);
      navigate("/");
    } catch (error) {
      console.error("Erro no login de teste:", error);
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Entrar com conta teste"}
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
