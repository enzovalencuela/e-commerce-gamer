/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  onSubmit: ({ formData }: any) => Promise<void>;
  onError: (error: any) => Promise<void>;
  onReady: () => Promise<void>;
  totalAmount: number;
  loading: boolean;
  showErrorMessage: boolean;
  setShowErrorMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PaymentProviderProps {
  children: ReactNode;
}

const PaymentContext = createContext<AuthContextType | undefined>(undefined);

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  children,
}) => {
  const { user, cart, selectedItems, setAtualizarQuery } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!user) return;

  const calculateTotal = () => {
    if (!cart || !selectedItems) {
      return 0;
    }
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + Number(item.preco), 0);
  };

  const totalAmount = calculateTotal();

  const onSubmit = async ({ formData }: { formData: Record<string, any> }) => {
    if (!user || totalAmount <= 0) {
      setShowErrorMessage(true);
      return;
    }

    return new Promise<void>((resolve, reject) => {
      fetch(`${VITE_BACKEND_URL}/api/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          product_ids: selectedItems,
          user_id: user.id,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erro no pagamento");
          return response.json();
        })
        .then((data) => {
          console.log("Pagamento processado:", data);
          setLoading(false);
          const id = data.payment.id;
          navigate(`/status?payment_id=${id}`);
          setAtualizarQuery(true);
          resolve();
        })
        .catch((error) => {
          setLoading(false);
          setShowErrorMessage(true);
          console.error("Erro ao processar pagamento", error);
          reject();
        });
    });
  };

  const onError = async (error: any) => {
    setLoading(false);
    console.log("Erro:", error);
  };

  const onReady = async () => {
    setLoading(false);
  };

  const contextValue = {
    onSubmit,
    totalAmount,
    loading,
    showErrorMessage,
    setShowErrorMessage,
    onError,
    onReady,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
