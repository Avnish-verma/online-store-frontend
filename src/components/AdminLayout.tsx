import { Outlet, Link, useNavigate } from "react-router-dom";
import { Package, Tag, Settings, LogOut } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { adminLogout } from "../api";

export default function AdminLayout() {
  const { setIsAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminLogout();
      setIsAdmin(false);
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link to="/admin/offers" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
            <Tag className="w-5 h-5" />
            Offers
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
