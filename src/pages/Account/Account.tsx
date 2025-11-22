// src/pages/Account.tsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Account.css";
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading/Loading";
import FormDados from "../../components/FormDados/FormDados";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import SpanMessage from "../../components/SpanMessage/SpanMessage";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);

  const spanMessage = "Operação, realizada com sucesso.";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Todos os campos são obrigatórios.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("As novas senhas não coincidem.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/user/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id_usuario,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao alterar a senha.");
      }

      setPasswordSuccess("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError((err as Error).message);
    }
  };

  return loading || !user ? (
    <Loading />
  ) : (
    <div className="account-container">
      {showOkMessage && <SpanMessage message={spanMessage} status="ok" />}
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => (setShowErrorMessage(false), navigate("/carrinho"))}
        />
      )}
      {formSubmit ? (
        <FormDados
          setShowErrorMessage={setShowErrorMessage}
          setFormSubmit={setFormSubmit}
          setShowOkMessage={setShowOkMessage}
        />
      ) : (
        <>
          <h2>Minha Conta</h2>
          <div className="user-info">
            <p>
              <strong>Nome:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <div className="change-password-section">
            <button
              className="submit-button"
              onClick={() => setFormSubmit(true)}
            >
              Atualizar dados pessoais
            </button>
          </div>
          <div className="change-password-section">
            <h3>Alterar Senha</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="current-password">Senha Atual</label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">Nova Senha</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-new-password">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  id="confirm-new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="success-message">{passwordSuccess}</p>
              )}
              <Button child="Alterar Senha" />
            </form>
          </div>

          <div className="change-password-section">
            <BackButton />
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
