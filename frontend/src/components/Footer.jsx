export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="text-white font-bold text-lg mb-1">🛍️ ShopNow</p>
          <p>Your one-stop online store.</p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-white font-semibold mb-2">Shop</p>
            <ul className="space-y-1">
              <li><a href="/products" className="hover:text-white">All Products</a></li>
              <li><a href="/products?category=Electronics" className="hover:text-white">Electronics</a></li>
              <li><a href="/products?category=Clothing" className="hover:text-white">Clothing</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Account</p>
            <ul className="space-y-1">
              <li><a href="/profile" className="hover:text-white">Profile</a></li>
              <li><a href="/orders" className="hover:text-white">Orders</a></li>
              <li><a href="/cart" className="hover:text-white">Cart</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center mt-6 text-xs text-gray-600">
        © {new Date().getFullYear()} ShopNow. All rights reserved.
      </div>
    </footer>
  );
}
