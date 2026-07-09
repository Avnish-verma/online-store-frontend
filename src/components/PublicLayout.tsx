import { Outlet, Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings } from "../api";
import { Settings } from "../types";

export default function PublicLayout() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900">
            <ShoppingBag className="w-6 h-6" />
            <span className="font-semibold text-lg tracking-tight">
              {settings?.storeName || "Fashion Point"}
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
            <Link to="/catalog" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Catalog</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {settings?.storeName || "Fashion Point"}. All rights reserved.
          </p>
          {settings?.address && (
            <p className="text-gray-400 text-xs mt-2">{settings.address}</p>
          )}
        </div>
      </footer>
    </div>
  );
}
