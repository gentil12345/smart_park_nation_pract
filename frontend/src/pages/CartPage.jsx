import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();
  const items = cart.items || [];

  const handleQtyChange = async (productId, qty) => {
    if (qty < 1) return;
    await addToCart(productId, qty);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    toast.success("Item removed");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started.</p>
        <Link to="/products" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700">
          Browse Products
        </Link>
      </div>
    );
  }

  const shipping = cartTotal > 100 ? 0 : 10;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map(({ product, qty }) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/80"}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-xl bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product._id}`} className="font-semibold text-gray-800 text-sm hover:text-indigo-600 line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-indigo-600 font-bold mt-1">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleQtyChange(product._id, qty - 1)} className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100 text-sm font-bold">-</button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => handleQtyChange(product._id, qty + 1)} className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
              </div>
              <p className="font-bold text-gray-800 w-16 text-right">${(product.price * qty).toFixed(2)}</p>
              <button onClick={() => handleRemove(product._id)} className="text-red-400 hover:text-red-600 ml-2">✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
              <hr />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400 mb-3">Add ${(100 - cartTotal).toFixed(2)} more for free shipping</p>
            )}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition"
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center text-sm text-indigo-600 mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
