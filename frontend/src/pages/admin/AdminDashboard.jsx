import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/products", { params: { limit: 1 } }),
      api.get("/orders"),
      api.get("/users"),
    ]).then(([products, orders, users]) => {
      const revenue = orders.data.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0);
      setStats({
        products: products.data.total,
        orders: orders.data.length,
        users: users.data.length,
        revenue,
        recentOrders: orders.data.slice(0, 5),
      });
    });
  }, []);

  const cards = stats
    ? [
        { label: "Total Products", value: stats.products, icon: "📦", color: "bg-blue-50 text-blue-700" },
        { label: "Total Orders", value: stats.orders, icon: "🛒", color: "bg-green-50 text-green-700" },
        { label: "Total Users", value: stats.users, icon: "👥", color: "bg-purple-50 text-purple-700" },
        { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: "💰", color: "bg-yellow-50 text-yellow-700" },
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/admin/products" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Manage Products</Link>
          <Link to="/admin/orders" className="text-sm border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50">Manage Orders</Link>
        </div>
      </div>

      {!stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className={`rounded-2xl p-5 ${c.color} bg-opacity-50`}>
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className="text-2xl font-extrabold">{c.value}</p>
              <p className="text-sm opacity-70">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {stats && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs text-gray-500">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="py-2">{o.user?.name || "—"}</td>
                    <td className="py-2 font-semibold">${o.totalPrice.toFixed(2)}</td>
                    <td className="py-2 capitalize">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{o.status}</span>
                    </td>
                    <td className="py-2 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
