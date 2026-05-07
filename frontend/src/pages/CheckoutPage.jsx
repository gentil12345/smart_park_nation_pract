import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=review
  const [form, setForm] = useState({
    fullName: "", address: "", city: "", postalCode: "", country: "United States",
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
        shippingAddress: { fullName: form.fullName, address: form.address, city: form.city, postalCode: form.postalCode, country: form.country },
        paymentMethod: form.paymentMethod,
      });
      await api.put(`/orders/${data._id}/pay`, { id: "sim_" + Date.now(), status: "COMPLETED", email: "user@shop.com" });
      await clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const inp = (label, key, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="block text-sm font-bold text-gray-900 mb-1">{label}</label>
      <input
        type={type} required
        placeholder={placeholder}
        className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      {/* Checkout header */}
      <div className="bg-[#131921] text-white py-3 px-4 mb-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold">shop<span className="text-[#FF9900]">Now</span></Link>
          <h1 className="text-lg font-medium">Checkout</h1>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className={step >= 1 ? "text-[#FF9900] font-bold" : ""}>Shipping</span>
            <span>›</span>
            <span className={step >= 2 ? "text-[#FF9900] font-bold" : ""}>Payment</span>
            <span>›</span>
            <span className={step >= 3 ? "text-[#FF9900] font-bold" : ""}>Review</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* Left */}
            <div className="flex-1 space-y-4">
              {/* Shipping */}
              <div className="bg-white rounded border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF9900] text-white text-xs flex items-center justify-center font-bold">1</span>
                  Shipping Address
                </h2>
                <div className="space-y-3">
                  {inp("Full name", "fullName", "text", "John Doe")}
                  {inp("Address", "address", "text", "123 Main St, Apt 4B")}
                  <div className="grid grid-cols-2 gap-3">
                    {inp("City", "city", "text", "New York")}
                    {inp("ZIP Code", "postalCode", "text", "10001")}
                  </div>
                  {inp("Country", "country", "text", "United States")}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF9900] text-white text-xs flex items-center justify-center font-bold">2</span>
                  Payment Method
                </h2>
                <div className="space-y-2">
                  {[
                    { value: "Card", label: "💳 Credit or debit card" },
                    { value: "PayPal", label: "🅿️ PayPal" },
                    { value: "Cash on Delivery", label: "💵 Cash on Delivery" },
                  ].map((m) => (
                    <label key={m.value} className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition ${form.paymentMethod === m.value ? "border-[#FF9900] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <input
                        type="radio" name="payment" value={m.value}
                        checked={form.paymentMethod === m.value}
                        onChange={() => setForm({ ...form, paymentMethod: m.value })}
                        className="accent-[#FF9900]"
                      />
                      <span className="text-sm font-medium text-gray-800">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Items review */}
              <div className="bg-white rounded border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF9900] text-white text-xs flex items-center justify-center font-bold">3</span>
                  Review Items
                </h2>
                <div className="space-y-3">
                  {items.map(({ product, qty }) => (
                    <div key={product._id} className="flex gap-3 items-center">
                      <img src={product.images?.[0] || "https://via.placeholder.com/60"} alt={product.name} className="w-14 h-14 object-contain bg-gray-50 border border-gray-100 rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {qty}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">${(product.price * qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="w-full lg:w-72 shrink-0 bg-white rounded border border-gray-200 p-4 sticky top-4">
              <button
                type="submit" disabled={loading}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold py-2.5 rounded-full border border-[#FCD200] text-sm mb-4 transition disabled:opacity-60"
              >
                {loading ? "Placing Order..." : "Place your order"}
              </button>
              <p className="text-xs text-gray-500 mb-4 text-center">
                By placing your order, you agree to ShopNow's privacy notice and conditions of use.
              </p>
              <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>Items ({items.reduce((a, i) => a + i.qty, 0)}):</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span><span>{shipping === 0 ? <span className="text-[#007600]">FREE</span> : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-red-700 text-base border-t border-gray-200 pt-2 mt-2">
                  <span>Order total:</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
