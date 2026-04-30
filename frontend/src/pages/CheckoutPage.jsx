import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", address: "", city: "", postalCode: "", country: "",
    paymentMethod: "Card",
  });

  const items = cart.items || [];
  const shipping = cartTotal > 100 ? 0 : 10;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Cart is empty"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((i) => ({ product: i.product._id, qty: i.qty })),
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      });
      // Simulate payment
      await api.put(`/orders/${data._id}/pay`, { id: "sim_" + Date.now(), status: "COMPLETED", email: "user@shop.com" });
      await clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type} required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        {/* Shipping */}
        <div className="flex-1 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Shipping Address</h2>
            <div className="space-y-3">
              {field("Full Name", "fullName", "text", "John Doe")}
              {field("Address", "address", "text", "123 Main St")}
              <div className="grid grid-cols-2 gap-3">
                {field("City", "city", "text", "New York")}
                {field("Postal Code", "postalCode", "text", "10001")}
              </div>
              {field("Country", "country", "text", "United States")}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-2">
              {["Card", "PayPal", "Cash on Delivery"].map((method) => (
                <label key={method} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio" name="payment" value={method}
                    checked={form.paymentMethod === method}
                    onChange={() => setForm({ ...form, paymentMethod: method })}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map(({ product, qty }) => (
                <div key={product._id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate flex-1 mr-2">{product.name} ×{qty}</span>
                  <span className="shrink-0">${(product.price * qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="mb-3" />
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
