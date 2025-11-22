/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Button from "../../components/Button/Button";
import GoogleLoginButton from "../../components/ButtonGoogle/ButtonGoogle";
import AuthFormLayout from "../../components/AuthFormLayout/AuthFormLayout";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL2;

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user) {
        throw new Error("Usuário não encontrado após login com e-mail/senha.");
      }

      const firebaseIdToken = await user.getIdToken();
      const response = await fetch(`${BACKEND_URL}/user-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseIdToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwt_token", firebaseIdToken);
        localStorage.setItem("loggedInUserEmail", data.email || user.email);
        login(data.user);
        navigate("/");
      } else {
        const errorText = await response.text();
        console.error(
          "Erro do backend após login Firebase:",
          response.status,
          errorText
        );
        setError(
          "Erro ao sincronizar dados do usuário no backend. Tente novamente."
        );
      }
    } catch (err) {
      console.error("Erro ao fazer login com e-mail/senha (Firebase)", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (user: any) => {
    if (isLoading || !user) return;
    setIsLoading(true);

    try {
      const firebaseIdToken = await user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseIdToken}`,
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwt_token", firebaseIdToken);
        localStorage.setItem("loggedInUserEmail", user.email || "");
        login(data.user);
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
    } finally {
      setIsLoading(false);
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
        <Button
          child={isLoading ? "Carregando..." : "Entrar"}
          disabled={isLoading}
        />
      </form>
      <GoogleLoginButton onSuccess={handleGoogleLogin} />
    </AuthFormLayout>
  );
};

export default Login;
