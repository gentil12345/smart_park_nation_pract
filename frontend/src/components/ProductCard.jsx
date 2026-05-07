import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to add to cart"); return; }
    const res = await addToCart(product._id, 1);
    if (res.success) toast.success("Added to Cart");
    else toast.error(res.message);
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const stars = Math.round(product.rating);

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden border border-gray-200 hover:border-gray-300"
    >
      {/* Image */}
      <div className="relative bg-white flex items-center justify-center h-48 p-4 overflow-hidden">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5">
            -{discount}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 right-2 bg-[#FF9900] text-[#131921] text-xs font-bold px-1.5 py-0.5">
            #1 Best Seller
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-gray-500 font-semibold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[#FF9900] text-sm leading-none">
            {"★".repeat(stars)}{"☆".repeat(5 - stars)}
          </span>
          <span className="text-[#007185] text-xs hover:text-orange-500">({product.numReviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-xs text-gray-500 align-top mt-0.5">$</span>
            <span className="text-xl font-medium text-gray-900">{Math.floor(product.price)}</span>
            <span className="text-sm text-gray-900">{(product.price % 1).toFixed(2).slice(1)}</span>
          </div>
          {discount > 0 && (
            <p className="text-xs text-gray-500">
              List: <span className="line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="text-red-600 ml-1">Save {discount}%</span>
            </p>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-red-600 text-xs font-semibold mt-0.5">Only {product.stock} left!</p>
          )}
        </div>

        <p className="text-[#007185] text-xs mt-1">FREE delivery</p>

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="mt-2 w-full bg-[#FFD814] hover:bg-[#F7CA00] disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 text-xs font-semibold py-1.5 rounded-full border border-[#FCD200] disabled:border-gray-200 transition"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
