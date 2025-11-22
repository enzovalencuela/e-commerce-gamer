/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import GoogleLoginButton from "../../components/ButtonGoogle/ButtonGoogle";
import AuthFormLayout from "../../components/AuthFormLayout/AuthFormLayout";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (event: any) => {
    event.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const firebaseIdToken = await user.getIdToken();
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/user/emaillogin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseIdToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("jwt_token", firebaseIdToken);
          localStorage.setItem("loggedInUserEmail", data.email);

          navigate("/");
        } else {
          const errorText = await response.text();
          console.error(
            "Erro do backend após login Firebase:",
            response.status,
            errorText
          );
          setError(
            "Erro ao obter dados do usuário no backend. Tente novamente."
          );
        }
      }
    } catch (error: any) {
      console.error("Erro ao fazer login com e-mail/senha (Firebase):", error);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("E-mail ou senha inválidos.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Muitas tentativas de login. Tente novamente mais tarde.");
      } else {
        setError("Erro ao fazer login. Verifique seu e-mail e senha.");
      }
    }
  };

  const handleGoogleLogin = async (user: any) => {
    if (user) {
      const firebaseIdToken = await user.getIdToken();
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/user/googlelogin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseIdToken}`,
            },
            body: JSON.stringify({
              name: user.displayName,
              email: user.email,
            }),
          }
        );

        if (response.ok) {
          localStorage.setItem("jwt_token", firebaseIdToken);
          localStorage.setItem("loggedInUserEmail", user.email);
          navigate("/");
        } else {
          console.error(
            "Erro na resposta do backend ao sincronizar dados do Google:",
            response.status,
            await response.text()
          );
          setError("Erro ao sincronizar dados do Google com o servidor.");
        }
      } catch (error) {
        console.error(
          "Erro ao fazer requisição para sincronização do Google (CATCH):",
          error
        );
        setError("Erro de conexão ao sincronizar com o servidor.");
      }
    }
  };

  return (
    <AuthFormLayout
      title="Entrar"
      welcomeTitle="Bem-vindo de volta!"
      welcomeMessage="Para se conectar, faça login com seus dados."
      welcomeButtonText="Cadastre-se"
      welcomeButtonLink="/register"
      showLogo={true}
    >
      <form className="auth-form" onSubmit={handleEmailLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="sua senha"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <Button child="Entrar" />
      </form>
      <GoogleLoginButton onSuccess={handleGoogleLogin} />
    </AuthFormLayout>
  );
};

export default Login;
