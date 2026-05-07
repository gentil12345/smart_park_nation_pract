import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    const res = await register(form.name, form.email, form.password);
    if (res.success) { toast.success("Account created!"); navigate("/"); }
    else toast.error(res.message);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center pt-8 px-4">
      <Link to="/" className="text-3xl font-extrabold text-gray-900 mb-6">
        shop<span className="text-[#FF9900]">Now</span>
      </Link>

      <div className="w-full max-w-sm border border-gray-300 rounded p-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-4">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: "Your name", key: "name", type: "text", placeholder: "First and last name" },
            { label: "Email", key: "email", type: "email", placeholder: "" },
            { label: "Password", key: "password", type: "password", placeholder: "At least 6 characters" },
            { label: "Re-enter password", key: "confirm", type: "password", placeholder: "" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-bold text-gray-900 mb-1">{label}</label>
              <input
                type={type} required
                placeholder={placeholder}
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold py-2 rounded border border-[#FCD200] text-sm transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create your ShopNow account"}
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          By creating an account, you agree to ShopNow's{" "}
          <span className="text-[#007185] hover:underline cursor-pointer">Conditions of Use</span> and{" "}
          <span className="text-[#007185] hover:underline cursor-pointer">Privacy Notice</span>.
        </p>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-[#007185] hover:text-[#C7511F] hover:underline">Sign in →</Link>
      </p>
    </div>
  );
}
