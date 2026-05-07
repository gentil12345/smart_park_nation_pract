import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) { toast.success("Welcome back!"); navigate(from, { replace: true }); }
    else toast.error(res.message);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center pt-8 px-4">
      <Link to="/" className="text-3xl font-extrabold text-gray-900 mb-6">
        shop<span className="text-[#FF9900]">Now</span>
      </Link>

      <div className="w-full max-w-sm border border-gray-300 rounded p-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
            <input
              type="email" required
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Password</label>
            <input
              type="password" required
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold py-2 rounded border border-[#FCD200] text-sm transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          By continuing, you agree to ShopNow's{" "}
          <span className="text-[#007185] hover:underline cursor-pointer">Conditions of Use</span> and{" "}
          <span className="text-[#007185] hover:underline cursor-pointer">Privacy Notice</span>.
        </p>

        <p className="text-xs text-center text-gray-400 mt-4 border-t border-gray-200 pt-3">
          Demo: admin@shop.com / admin123
        </p>
      </div>

      <div className="w-full max-w-sm mt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-500">New to ShopNow?</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <Link
          to="/register"
          className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded border border-gray-300 text-sm transition"
        >
          Create your ShopNow account
        </Link>
      </div>
    </div>
  );
}
