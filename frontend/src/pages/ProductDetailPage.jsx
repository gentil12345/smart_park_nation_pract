import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please sign in first"); navigate("/login"); return; }
    setAddingToCart(true);
    const res = await addToCart(product._id, qty);
    setAddingToCart(false);
    if (res.success) { toast.success("Added to Cart"); navigate("/cart"); }
    else toast.error(res.message);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate("/login"); return; }
    setAddingToCart(true);
    const res = await addToCart(product._id, qty);
    setAddingToCart(false);
    if (res.success) navigate("/checkout");
    else toast.error(res.message);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to review"); return; }
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

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const ratingBars = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = product.reviews.length ? Math.round((count / product.reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#007185] mb-4 flex gap-1 flex-wrap">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <Link to="/products" className="hover:underline">Products</Link>
          <span className="text-gray-400">›</span>
          <Link to={`/products?category=${product.category}`} className="hover:underline">{product.category}</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-[1fr_1.2fr_280px] gap-6">
          {/* Image */}
          <div className="flex flex-col gap-2">
            <div className="border border-gray-200 rounded p-6 flex items-center justify-center h-80 bg-white">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/400"}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-xl font-medium text-gray-900 mb-1">{product.name}</h1>
            <p className="text-sm text-[#007185] mb-2">by <span className="hover:underline cursor-pointer">{product.brand}</span></p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
              <StarRating rating={product.rating} />
              <span className="text-[#007185] text-sm hover:text-[#C7511F] cursor-pointer">
                {product.numReviews.toLocaleString()} ratings
              </span>
              {product.featured && (
                <span className="bg-[#FF9900] text-[#131921] text-xs font-bold px-2 py-0.5 rounded">#1 Best Seller</span>
              )}
            </div>

            {/* Price */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-baseline gap-2 flex-wrap">
                {discount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">-{discount}%</span>
                )}
                <span className="text-sm text-gray-500 align-top mt-1">$</span>
                <span className="text-3xl font-medium text-gray-900">{Math.floor(product.price)}</span>
                <span className="text-lg text-gray-900">{(product.price % 1).toFixed(2).slice(1)}</span>
              </div>
              {discount > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  List Price: <span className="line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="text-red-600 ml-2">You save ${(product.originalPrice - product.price).toFixed(2)} ({discount}%)</span>
                </p>
              )}
              <p className="text-[#007185] text-sm mt-1">FREE Returns · FREE Delivery on orders over $100</p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-2">About this item</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <div className="border border-gray-300 rounded p-4 h-fit sticky top-20">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-sm text-gray-500 align-top mt-1">$</span>
              <span className="text-2xl font-medium text-gray-900">{Math.floor(product.price)}</span>
              <span className="text-base text-gray-900">{(product.price % 1).toFixed(2).slice(1)}</span>
            </div>

            <p className="text-[#007185] text-sm mb-1">FREE delivery <span className="font-bold text-gray-900">Tomorrow</span></p>
            <p className="text-sm text-gray-600 mb-3">Ships from and sold by <span className="text-[#007185]">ShopNow</span></p>

            {/* Stock */}
            <p className={`text-lg font-medium mb-3 ${product.stock > 0 ? "text-[#007600]" : "text-red-600"}`}>
              {product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} left in stock` : "In Stock") : "Out of Stock"}
            </p>

            {/* Qty */}
            {product.stock > 0 && (
              <div className="mb-3">
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-[#f0f2f2] focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] disabled:bg-gray-200 text-gray-900 font-semibold py-2 rounded-full border border-[#FCD200] text-sm mb-2 transition"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0 || addingToCart}
              className="w-full bg-[#FF9900] hover:bg-[#e88b00] disabled:bg-gray-200 text-gray-900 font-semibold py-2 rounded-full border border-[#FF8F00] text-sm transition"
            >
              Buy Now
            </button>

            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <p>🔒 Secure transaction</p>
              <p>↩ Free returns within 30 days</p>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <div className="grid md:grid-cols-[280px_1fr] gap-8">
            {/* Rating summary */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={product.rating} size="lg" />
                <span className="text-2xl font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">out of 5</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{product.numReviews} global ratings</p>
              <div className="space-y-1">
                {ratingBars.map(({ star, pct, count }) => (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="text-[#007185] w-10 shrink-0">{star} star</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-[#FF9900] h-3 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[#007185] w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews list + form */}
            <div>
              {product.reviews.length === 0 ? (
                <p className="text-gray-500 text-sm mb-6">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-5 mb-6">
                  {product.reviews.map((r) => (
                    <div key={r._id} className="border-b border-gray-100 pb-5">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
                          {r.name[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-gray-800">{r.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={r.rating} />
                        <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                      <p className="text-sm text-gray-700">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {user ? (
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Write a customer review</h3>
                  <form onSubmit={handleReview} className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Overall rating</label>
                      <StarRating rating={review.rating} onRate={(r) => setReview({ ...review, rating: r })} size="lg" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Add a written review</label>
                      <textarea
                        required rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] bg-white"
                        placeholder="What did you like or dislike? What did you use this product for?"
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit" disabled={submitting}
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 text-sm font-semibold px-6 py-2 rounded-full border border-[#FCD200] transition disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Sign in to write a review</p>
                  <Link to="/login" className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 text-sm font-semibold px-6 py-2 rounded-full border border-[#FCD200] inline-block">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
