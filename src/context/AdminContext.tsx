import React, { createContext, useContext, useState, useEffect } from "react";
import { getAdminMe } from "../api";

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setIsAdmin: (val: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      await getAdminMe();
      setIsAdmin(true);
    } catch (error) {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, checkAuth, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}
