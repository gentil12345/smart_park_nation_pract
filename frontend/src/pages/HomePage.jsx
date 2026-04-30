import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Toys"];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/featured")
      .then(({ data }) => setFeatured(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Shop Smarter,<br />Live Better
          </h1>
          <p className="text-indigo-200 text-lg mb-8">
            Discover thousands of products at unbeatable prices.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-indigo-700 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 transition text-sm"
          >
            Shop Now →
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Browse Categories</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="flex flex-col items-center gap-2 bg-white rounded-xl p-3 shadow-sm hover:shadow-md hover:border-indigo-300 border border-transparent transition text-center"
            >
              <span className="text-2xl">{catIcon(cat)}</span>
              <span className="text-xs font-medium text-gray-600">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Free Shipping on Orders Over $100</h3>
            <p className="text-gray-500">Plus 10% off your first order when you sign up.</p>
          </div>
          <Link to="/register" className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition whitespace-nowrap">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

function catIcon(cat) {
  const icons = { Electronics: "💻", Clothing: "👕", Books: "📚", Home: "🏠", Sports: "⚽", Beauty: "💄", Toys: "🧸" };
  return icons[cat] || "📦";
}
