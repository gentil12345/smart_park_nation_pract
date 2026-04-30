import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    const res = await addToCart(product._id, qty);
    if (res.success) toast.success("Added to cart!");
    else toast.error(res.message);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to review"); return; }
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success("Review submitted!");
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-sm p-6 md:p-10">
        {/* Image */}
        <div className="rounded-xl overflow-hidden bg-gray-100 h-80 md:h-auto">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/600x400"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-xs text-indigo-500 font-semibold uppercase mb-1">{product.category} · {product.brand}</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <>
                <span className="text-gray-400 line-through text-lg">${product.originalPrice.toFixed(2)}</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-3 mb-6">
            <span className={`text-sm font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <label className="text-sm font-medium text-gray-700">Qty:</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition text-sm"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm p-6 md:p-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Reviews</h2>

        {product.reviews.length === 0 ? (
          <p className="text-gray-400 text-sm mb-6">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4 mb-8">
            {product.reviews.map((r) => (
              <div key={r._id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-800">{r.name}</span>
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <form onSubmit={handleReview} className="space-y-3">
            <h3 className="font-semibold text-gray-700">Write a Review</h3>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Rating</label>
              <StarRating rating={review.rating} onRate={(r) => setReview({ ...review, rating: r })} size="lg" />
            </div>
            <textarea
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Share your experience..."
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
            />
            <button
              type="submit" disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
