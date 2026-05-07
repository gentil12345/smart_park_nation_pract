import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  { name: "Electronics", icon: "💻", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200" },
  { name: "Clothing", icon: "👕", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200" },
  { name: "Books", icon: "📚", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200" },
  { name: "Home", icon: "🏠", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200" },
  { name: "Sports", icon: "⚽", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" },
  { name: "Beauty", icon: "💄", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200" },
  { name: "Toys", icon: "🧸", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200" },
];

const DEALS = [
  { label: "Up to 40% off", sub: "Electronics", color: "from-blue-600 to-blue-800", cat: "Electronics" },
  { label: "New Arrivals", sub: "Clothing & Fashion", color: "from-pink-500 to-rose-700", cat: "Clothing" },
  { label: "Best Sellers", sub: "Books & More", color: "from-amber-500 to-orange-700", cat: "Books" },
  { label: "Home Deals", sub: "Furniture & Decor", color: "from-green-600 to-teal-700", cat: "Home" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products/featured"),
      api.get("/products", { params: { sort: "rating", limit: 8 } }),
    ]).then(([feat, top]) => {
      setFeatured(feat.data);
      setTopRated(top.data.products);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      {/* Hero Carousel (static) */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-b from-[#232f3e] to-[#37475A] text-white py-16 px-6 text-center">
          <p className="text-[#FF9900] text-sm font-semibold uppercase tracking-widest mb-2">Limited Time Offer</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Deals of the Day
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Discover millions of products at unbeatable prices. Free delivery on orders over $100.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/products" className="bg-[#FF9900] hover:bg-[#e88b00] text-[#131921] font-bold px-8 py-3 rounded-full text-sm transition">
              Shop Now
            </Link>
            <Link to="/products?sort=rating" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full text-sm border border-white/30 transition">
              Best Sellers
            </Link>
          </div>
        </div>
        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#EAEDED] to-transparent" />
      </div>

      <div className="max-w-[1500px] mx-auto px-3 md:px-6 -mt-4 pb-12 space-y-6">

        {/* Deal banners */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DEALS.map((d) => (
            <Link
              key={d.cat}
              to={`/products?category=${d.cat}`}
              className={`bg-gradient-to-br ${d.color} text-white rounded-lg p-5 hover:opacity-90 transition`}
            >
              <p className="text-lg font-extrabold leading-tight">{d.label}</p>
              <p className="text-xs text-white/70 mt-1">{d.sub}</p>
              <p className="text-xs mt-3 font-semibold underline">Shop now</p>
            </Link>
          ))}
        </div>

        {/* Category grid */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-[#FF9900] transition">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center group-hover:text-[#C7511F]">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
              See all deals →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 h-64 animate-pulse rounded" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>

        {/* Top Rated */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">⭐ Top Rated</h2>
            <Link to="/products?sort=rating" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
              See all →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 h-64 animate-pulse rounded" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {topRated.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>

        {/* Prime-style banner */}
        <div className="bg-gradient-to-r from-[#232f3e] to-[#37475A] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div>
            <p className="text-[#FF9900] font-bold text-sm mb-1">ShopNow Prime</p>
            <h3 className="text-2xl font-extrabold mb-1">Free Delivery. Every Day.</h3>
            <p className="text-gray-300 text-sm">Orders over $100 ship free. No membership needed.</p>
          </div>
          <Link to="/register" className="shrink-0 bg-[#FF9900] hover:bg-[#e88b00] text-[#131921] font-bold px-8 py-3 rounded-full text-sm transition">
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  );
}
