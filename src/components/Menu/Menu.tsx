import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Package,
  User,
  X,
} from "lucide-react";

interface MenuProps {
  onClose: () => void;
}

export default function Menu({ onClose }: MenuProps) {
  const [userAdmin, setUserAdmin] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      setUserAdmin(true);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-slate-950/15 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Sua área</p>
            <p className="text-sm text-slate-500">
              Acesse conta, pedidos e gestão.
            </p>
          </div>
          <button
            className="rounded-full border border-slate-200 p-2 text-slate-500"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          {userAdmin && (
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
          <Link
            to="/account"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <User className="h-4 w-4" />
            Minha Conta
          </Link>
          <Link
            to="/minhas-compras"
            onClick={onClose}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <Package className="h-4 w-4" />
            Minhas Compras
          </Link>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
