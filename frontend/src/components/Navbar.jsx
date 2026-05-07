import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Toys"];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      {/* Top bar */}
      <nav className="bg-[#131921] text-white sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-3 py-2 flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 border-2 border-transparent hover:border-white rounded px-1 py-0.5 mr-1">
            <span className="text-white font-extrabold text-xl tracking-tight">shop<span className="text-[#FF9900]">Now</span></span>
          </Link>

          {/* Deliver to */}
          <div className="hidden md:flex flex-col text-xs shrink-0 border-2 border-transparent hover:border-white rounded px-1 py-0.5 cursor-pointer">
            <span className="text-gray-400">Deliver to</span>
            <span className="font-bold text-sm">United States</span>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-3xl">
            <select className="bg-[#f3f3f3] text-gray-700 text-xs px-2 rounded-l-md border-r border-gray-300 hidden md:block shrink-0 h-10">
              <option>All</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ShopNow"
              className="flex-1 h-10 px-3 text-gray-900 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-[#FF9900] hover:bg-[#e88b00] h-10 w-12 flex items-center justify-center rounded-r-md shrink-0">
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </form>

          {/* Right links */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            {/* Account */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex flex-col text-xs border-2 border-transparent hover:border-white rounded px-2 py-1"
              >
                <span className="text-gray-300">{user ? `Hello, ${user.name.split(" ")[0]}` : "Hello, sign in"}</span>
                <span className="font-bold text-sm flex items-center gap-1">Account & Lists <span className="text-[10px]">▾</span></span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {!user ? (
                    <div className="px-4 pb-3 border-b">
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center bg-[#FF9900] hover:bg-[#e88b00] text-gray-900 font-bold py-1.5 rounded text-sm mb-2">Sign In</Link>
                      <p className="text-xs text-center text-gray-500">New customer? <Link to="/register" onClick={() => setMenuOpen(false)} className="text-[#007185] hover:underline">Start here</Link></p>
                    </div>
                  ) : null}
                  <div className="pt-2">
                    {user && <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-1.5 text-sm hover:bg-gray-50">Your Account</Link>}
                    <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-1.5 text-sm hover:bg-gray-50">Your Orders</Link>
                    {user?.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-1.5 text-sm hover:bg-gray-50 text-orange-600 font-semibold">Admin Panel</Link>}
                    {user && <><hr className="my-1" /><button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-1.5 text-sm text-red-500 hover:bg-gray-50">Sign Out</button></>}
                  </div>
                </div>
              )}
            </div>

            {/* Orders */}
            <Link to="/orders" className="hidden md:flex flex-col text-xs border-2 border-transparent hover:border-white rounded px-2 py-1">
              <span className="text-gray-300">Returns</span>
              <span className="font-bold text-sm">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-end gap-1 border-2 border-transparent hover:border-white rounded px-2 py-1 relative">
              <div className="relative">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -top-1 left-4 bg-[#FF9900] text-[#131921] text-xs font-extrabold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="font-bold text-sm hidden md:block">Cart</span>
            </Link>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="bg-[#232f3e] text-white text-sm">
          <div className="max-w-[1500px] mx-auto px-3 flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            <button className="flex items-center gap-1 px-2 py-1 hover:border hover:border-white rounded whitespace-nowrap font-bold shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
              All
            </button>
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/products?category=${cat}`} className="px-2 py-1 hover:border hover:border-white rounded whitespace-nowrap shrink-0 text-xs">
                {cat}
              </Link>
            ))}
            <Link to="/products" className="px-2 py-1 hover:border hover:border-white rounded whitespace-nowrap shrink-0 text-xs">Today's Deals</Link>
            <Link to="/products?sort=rating" className="px-2 py-1 hover:border hover:border-white rounded whitespace-nowrap shrink-0 text-xs">Best Sellers</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
