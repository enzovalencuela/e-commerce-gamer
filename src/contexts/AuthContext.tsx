/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types/Product";

interface User {
  id_usuario?: number;
  name?: string;
  email: string | null;
  role?: "admin" | "user";
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: any;
  providerData: any;
  refreshToken: any;
  tenantId: string | null;
  delete: any;
  getIdToken: any;
  getIdTokenResult: any;
  reload: any;
  toJSON: any;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: any;
  uid: any;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  cart: Product[];
  login: (userData: User) => void;
  logout: () => void;
  addToCart: (item: Product) => Promise<"ok" | "error">;
  removeFromCart: (itemId: number) => Promise<void>;
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  paymentStatus: PaymentStatus | null;
  purchasedProducts: Product[];
  loading: boolean;
  setAtualizarQuery: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface Items {
  id: string;
  description: string;
  quantity: string;
  title: string;
  unit_price: string;
}

interface AdditionalInfo {
  items: Items[];
}

interface PixInfo {
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
}

interface PaymentStatus {
  id: number;
  status: string;
  status_detail?: string;
  total_amount?: number;
  payment_type?: string;
  payment_method?: string;
  date_approved?: string;
  additional_info?: AdditionalInfo;
  installments?: number;
  pix?: PixInfo;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [paymentId, setPaymentId] = useState<URLSearchParams>();
  const [atualizarQuery, setAtualizarQuery] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erro ao carregar usuário do LocalStorage:", error);
      return null;
    }
  });

  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      if (user) {
        try {
          const response = await fetch(
            `${VITE_BACKEND_URL}/api/cart/${user.id_usuario}`
          );
          if (!response.ok) {
            throw new Error("Erro ao buscar o carrinho");
          }
          const productIds: number[] = await response.json();

          const fetchedItems: Product[] = [];
          for (const productId of productIds) {
            const productResponse = await fetch(
              `${VITE_BACKEND_URL}/api/products/${productId}`
            );
            const productData = await productResponse.json();
            fetchedItems.push(productData);
          }
          setCart(fetchedItems);
          setLoading(false);
        } catch (error) {
          console.error("Erro ao buscar carrinho:", error);
          setLoading(false);
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
    setCart([]);
  };

  const addToCart = async (item: Product) => {
    if (!user) {
      console.error(
        "Usuário não logado. Não é possível adicionar ao carrinho."
      );
      return "error";
    }

    const itemExists = cart.some((cartItem) => cartItem.id === item.id);
    if (itemExists) {
      return "error";
    }
    try {
      await fetch(`${VITE_BACKEND_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id_usuario, productId: item.id }),
      });
      setCart((prevCart) => [...prevCart, item]);
      return "ok";
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      return "error";
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user) return;
    try {
      await fetch(`${VITE_BACKEND_URL}/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id_usuario, productId: itemId }),
      });
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== itemId)
      );
    } catch (error) {
      console.error("Erro ao remover produto do carrinho:", error);
    }
  };

  if (!paymentId) {
    setPaymentId(new URLSearchParams(window.location.search));
  }

  useEffect(() => {
    if (atualizarQuery) {
      setPaymentId(new URLSearchParams(window.location.search));
    }
    setAtualizarQuery(false);
  }, [atualizarQuery]);

  useEffect(() => {
    setLoading(true);

    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/payments/status?${paymentId}`
        );

        const data = await response.json();
        if (response.ok && data.payment) {
          setPaymentStatus(data.payment);
        } else {
          console.error("Erro ao obter status do pagamento:", data.error);
          setPaymentStatus(null);
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erro de rede ao buscar status:", error);
        setPaymentStatus(null);
        setLoading(false);
      }
    };
    fetchPaymentStatus();
  }, [user, paymentId]);

  useEffect(() => {
    setLoading(true);
    const fetchPurchasedProducts = async () => {
      if (!paymentStatus?.additional_info?.items) return;

      try {
        const products: Product[] = [];
        for (const item of paymentStatus.additional_info.items) {
          const response = await fetch(
            `${VITE_BACKEND_URL}/api/products/${item.id}`
          );
          if (response.ok) {
            const data = await response.json();
            products.push(data);
          }
        }
        setPurchasedProducts(products);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erro ao buscar produtos comprados:", error);
        setLoading(false);
      }
    };

    fetchPurchasedProducts();
  }, [paymentStatus]);

  const contextValue = {
    user,
    cart,
    login,
    logout,
    addToCart,
    removeFromCart,
    selectedItems,
    setSelectedItems,
    paymentStatus,
    purchasedProducts,
    loading,
    setAtualizarQuery,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
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
