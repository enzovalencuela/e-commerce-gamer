// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: number; // Mudei para number, pois é o tipo do banco de dados
  name: string;
  email: string;
}

interface CartItem {
  id: number;
  titulo: string;
  preco: string;
  img: string;
}

interface AuthContextType {
  user: User | null;
  cart: CartItem[];
  login: (userData: User) => void;
  logout: () => void;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
}
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erro ao carregar usuário do LocalStorage:", error);
      return null;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  // Carrega o carrinho quando o usuário está logado
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${VITE_BACKEND_URL}/api/cart/${user.id}`
          );
          if (!response.ok) {
            throw new Error("Erro ao buscar o carrinho");
          }
          const productIds: number[] = await response.json();

          const fetchedItems: CartItem[] = [];
          for (const productId of productIds) {
            const productResponse = await fetch(
              `${VITE_BACKEND_URL}/api/products/${productId}`
            );
            const productData = await productResponse.json();
            fetchedItems.push(productData);
          }
          setCart(fetchedItems);
        } catch (error) {
          console.error("Erro ao buscar carrinho:", error);
        }
      }
    };
    fetchCart();
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCart([]); // Limpa o carrinho ao deslogar
  };

  const addToCart = async (item: CartItem) => {
    if (!user) {
      console.error(
        "Usuário não logado. Não é possível adicionar ao carrinho."
      );
      return;
    }
    try {
      await fetch(`${VITE_BACKEND_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: item.id }),
      });
      setCart((prevCart) => [...prevCart, item]);
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user) return;
    try {
      await fetch(`${VITE_BACKEND_URL}/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: itemId }),
      });
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Erro ao remover produto do carrinho:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, cart, login, logout, addToCart, removeFromCart }}
    >
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
