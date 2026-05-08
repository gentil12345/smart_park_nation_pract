import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.username, form.password);
    setLoading(false);
    if (res.success) { toast.success("Welcome!"); navigate("/"); }
    else toast.error(res.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3c5e] to-[#2d6a9f] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🅿️</div>
          <h1 className="text-2xl font-extrabold text-[#1a3c5e]">SmartPark</h1>
          <p className="text-sm text-gray-500">Car Washing Sales Management System</p>
          <p className="text-xs text-gray-400 mt-1">Rubavu District, Western Province, Rwanda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              type="text" required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
              placeholder="receptionist"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password" required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#1a3c5e] hover:bg-[#15304d] text-white font-bold py-2.5 rounded-lg transition disabled:opacity-60 text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-4">
          Default: <span className="font-mono">receptionist</span> / <span className="font-mono">admin123</span>
        </p>
      </div>
    </div>
  );
}
