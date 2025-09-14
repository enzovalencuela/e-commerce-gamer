// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Função para fazer o login e armazenar o usuário
  const login = (userData: User) => {
    setUser(userData);
    // Em um projeto real, você armazenaria o token de autenticação aqui (e.g., localStorage)
  };

  // Função para fazer o logout
  const logout = () => {
    setUser(null);
    // Remover o token de autenticação do armazenamento aqui
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
