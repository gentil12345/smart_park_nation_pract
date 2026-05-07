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
    toast.success("Removed from Cart");
  };

  const shipping = cartTotal > 100 ? 0 : 10;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">Shopping Cart</h1>
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🛒</p>
            <h2 className="text-xl font-medium text-gray-700 mb-2">Your Amazon Cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Your shopping cart lives here. Start shopping!</p>
            <Link to="/products" className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold px-6 py-2 rounded-full border border-[#FCD200] text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Cart items */}
          <div className="flex-1 bg-white rounded border border-gray-200 p-4">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">Shopping Cart</h1>
            <p className="text-right text-sm text-gray-500 mb-4 border-b border-gray-200 pb-3">Price</p>

            <div className="divide-y divide-gray-200">
              {items.map(({ product, qty }) => (
                <div key={product._id} className="py-4 flex gap-4">
                  <Link to={`/products/${product._id}`} className="shrink-0">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/100"}
                      alt={product.name}
                      className="w-28 h-28 object-contain bg-white border border-gray-100 rounded"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${product._id}`} className="text-sm font-medium text-gray-900 hover:text-[#C7511F] line-clamp-2">
                      {product.name}
                    </Link>
                    <p className="text-[#007600] text-xs font-semibold mt-1">In Stock</p>
                    <p className="text-xs text-gray-500 mt-0.5">Eligible for FREE Shipping</p>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <select
                        value={qty}
                        onChange={(e) => handleQtyChange(product._id, Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-[#f0f2f2] focus:outline-none"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
                        ))}
                      </select>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleRemove(product._id)} className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline">
                        Delete
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline">
                        Save for later
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-bold text-gray-900">${(product.price * qty).toFixed(2)}</p>
                    {qty > 1 && <p className="text-xs text-gray-500">${product.price.toFixed(2)} each</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right pt-3 border-t border-gray-200">
              <p className="text-lg">
                Subtotal ({items.reduce((a, i) => a + i.qty, 0)} items):
                <span className="font-bold ml-2">${cartTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-72 shrink-0 bg-white rounded border border-gray-200 p-4">
            {cartTotal > 100 ? (
              <p className="text-[#007600] text-sm mb-3">
                ✓ Your order qualifies for <span className="font-bold">FREE Shipping</span>
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                Add <span className="font-bold">${(100 - cartTotal).toFixed(2)}</span> more for FREE Shipping
              </p>
            )}
            <p className="text-lg mb-3">
              Subtotal ({items.reduce((a, i) => a + i.qty, 0)} items):
              <span className="font-bold ml-1">${cartTotal.toFixed(2)}</span>
            </p>
            <div className="text-xs text-gray-500 space-y-1 mb-3">
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-[#007600]">FREE</span> : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Estimated tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-sm pt-1 border-t border-gray-200 mt-1">
                <span>Order total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold py-2 rounded-full border border-[#FCD200] text-sm transition"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
