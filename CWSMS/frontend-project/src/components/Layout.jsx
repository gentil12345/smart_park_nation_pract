import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";

const NAV = [
  { to: "/cars",            label: "🚗 Cars" },
  { to: "/packages",        label: "📦 Packages" },
  { to: "/service-package", label: "🔧 Service Record" },
  { to: "/payment",         label: "💳 Payment" },
  { to: "/reports",         label: "📊 Reports" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sideOpen ? "w-56" : "w-14"} bg-[#1a3c5e] text-white flex flex-col transition-all duration-200 shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
          <span className="text-2xl">🅿️</span>
          {sideOpen && (
            <div>
              <p className="font-extrabold text-sm leading-tight">SmartPark</p>
              <p className="text-[10px] text-blue-300">CWSMS</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-white/20 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-base shrink-0">{label.split(" ")[0]}</span>
              {sideOpen && <span>{label.split(" ").slice(1).join(" ")}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/10 p-3">
          {sideOpen && (
            <p className="text-xs text-blue-300 mb-2 truncate">👤 {user?.username}</p>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-300 hover:text-red-100 w-full px-2 py-1.5 rounded hover:bg-white/10 transition"
          >
            <span>🚪</span>
            {sideOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(!sideOpen)} className="text-gray-500 hover:text-gray-700 text-xl">☰</button>
            <div>
              <h1 className="font-bold text-gray-800 text-sm">Car Washing Sales Management System</h1>
              <p className="text-xs text-gray-400">SmartPark · Rubavu District, Western Province, Rwanda</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">{new Date().toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
