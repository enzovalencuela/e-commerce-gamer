/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types/Product";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import type { User as FirebaseAuthUser } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  setLogLevel,
} from "firebase/firestore";

setLogLevel("debug");

declare const __initial_auth_token: string | undefined;

interface UserData {
  id_usuario?: number;
  name?: string | null;
  role?: "admin" | "user";
}

type User = FirebaseAuthUser & UserData;

interface AuthContextType {
  user: User | null | undefined;
  cart: Product[];
  login: (userData: UserData) => void;
  logout: () => Promise<void>;
  addToCart: (item: Product) => Promise<"ok" | "error">;
  removeFromCart: (itemId: number) => Promise<void>;
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  paymentStatus: PaymentStatus | null;
  purchasedProducts: Product[];
  loading: boolean;
  isAuthReady: boolean;
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

let app: any;
let auth: any;
let db: any;
let appId: string;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  appId = import.meta.env.VITE_FIREBASE_APP_ID || "default-app-id";
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 10) {
    throw new Error(
      "VITE_FIREBASE_API_KEY não está configurada ou é inválida."
    );
  }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Erro ao inicializar Firebase:", e);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [paymentId, setPaymentId] = useState<URLSearchParams | null>(null);
  const [atualizarQuery, setAtualizarQuery] = useState(false);
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    if (!auth || !db) return;

    const signInAndListen = async () => {
      try {
        if (typeof __initial_auth_token !== "undefined") {
          await signInWithCustomToken(auth, __initial_auth_token);
          console.debug("Autenticação inicial: Custom Token usado.");
        } else {
          await signInAnonymously(auth);
          console.debug("Autenticação inicial: Anônima usada.");
        }
      } catch (error) {
        console.error("Erro na autenticação inicial:", error);
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userId = firebaseUser.uid;
          console.debug("Usuário Firebase Autenticado:", userId);

          const userDocRef = doc(
            db,
            "artifacts",
            appId,
            "users",
            userId,
            "user_data",
            "profile"
          );

          const docSnap = await getDoc(userDocRef);
          let userDataFromFirestore: UserData = {};

          if (docSnap.exists()) {
            userDataFromFirestore = docSnap.data() as UserData;
            console.debug(
              "Perfil do Firestore carregado:",
              userDataFromFirestore
            );
          } else {
            console.debug(
              "Perfil do Firestore não encontrado. Usando dados básicos do Auth."
            );
          }

          const combinedUser: User = {
            ...firebaseUser,
            ...userDataFromFirestore,
          };
          setUser(combinedUser);
        } else {
          setUser(null);
          console.debug("Usuário Firebase Deslogado/Não Autenticado.");
        }

        if (!isAuthReady) {
          setIsAuthReady(true);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    signInAndListen();
  }, []);

  const syncUserToFirestore = async (
    firebaseUser: FirebaseAuthUser,
    backendData: UserData
  ) => {
    const userId = firebaseUser.uid;
    const userDocRef = doc(
      db,
      "artifacts",
      appId,
      "users",
      userId,
      "user_data",
      "profile"
    );

    const dataToSave: UserData = {
      name: backendData.name || firebaseUser.displayName,
      id_usuario: backendData.id_usuario,
      role: backendData.role || "user",
    };

    try {
      await setDoc(userDocRef, dataToSave, { merge: true });
      console.debug("Dados do usuário sincronizados com o Firestore.");
      return dataToSave;
    } catch (e) {
      console.error("Erro ao salvar dados no Firestore:", e);
      return {};
    }
  };

  const login = async (backendData: UserData) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      console.error(
        "Tentativa de login sem usuário autenticado no Firebase Auth."
      );
      return;
    }

    const syncedData = await syncUserToFirestore(firebaseUser, backendData);

    const combinedUser: User = { ...firebaseUser, ...syncedData };
    setUser(combinedUser);
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        localStorage.removeItem("user_data");
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("loggedInUserEmail");
      } catch (error) {
        console.error("Erro ao fazer signOut:", error);
      }
    }
    setUser(null);
    setCart([]);
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthReady || !user?.uid || !user.id_usuario) {
        setCart([]);
        setLoading(false);
        return;
      }
      setLoading(true);

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
      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, isAuthReady]);

  const addToCart = async (item: Product) => {
    if (!user || !user.id_usuario) {
      console.error(
        "Usuário não logado ou sem ID. Não é possível adicionar ao carrinho."
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
    if (!user || !user.id_usuario) return;
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

  useEffect(() => {
    setPaymentId(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (atualizarQuery) {
      setPaymentId(new URLSearchParams(window.location.search));
    }
    setAtualizarQuery(false);
  }, [atualizarQuery]);

  useEffect(() => {
    if (!isAuthReady || !user || !paymentId) return;

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
  }, [user, paymentId, isAuthReady]);

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
    loading: loading || !isAuthReady,
    isAuthReady,
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
