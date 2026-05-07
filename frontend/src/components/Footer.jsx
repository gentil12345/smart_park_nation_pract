import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-sm py-3 text-center transition"
      >
        Back to top
      </button>

      {/* Main footer */}
      <div className="bg-[#232f3e] text-gray-300 py-10 px-4">
        <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Get to Know Us</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white hover:underline">About ShopNow</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Careers</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Press Releases</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Investor Relations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Make Money with Us</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white hover:underline">Sell products on ShopNow</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Become an Affiliate</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Advertise Your Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">ShopNow Payment Products</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white hover:underline">ShopNow Business Card</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Shop with Points</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Reload Your Balance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Let Us Help You</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/profile" className="hover:text-white hover:underline">Your Account</Link></li>
              <li><Link to="/orders" className="hover:text-white hover:underline">Your Orders</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Shipping Rates & Policies</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Returns & Replacements</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Help</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#131921] text-gray-500 text-xs py-4 text-center">
        <p className="text-white font-extrabold text-lg mb-1">shop<span className="text-[#FF9900]">Now</span></p>
        <p>© {new Date().getFullYear()} ShopNow, Inc. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link to="/" className="hover:text-white hover:underline">Conditions of Use</Link>
          <Link to="/" className="hover:text-white hover:underline">Privacy Notice</Link>
          <Link to="/" className="hover:text-white hover:underline">Interest-Based Ads</Link>
        </div>
      </div>
    </footer>
  );
}
