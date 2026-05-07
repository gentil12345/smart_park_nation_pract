import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

const STATUS_COLORS = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  processing: { bg: "bg-blue-100", text: "text-blue-800" },
  shipped: { bg: "bg-purple-100", text: "text-purple-800" },
  delivered: { bg: "bg-green-100", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", text: "text-red-800" },
};

function MiniBar({ value, max, color = "bg-[#FF9900]" }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products", { params: { limit: 100 } }),
      api.get("/orders"),
      api.get("/users"),
    ]).then(([products, orders, users]) => {
      const allOrders = orders.data;
      const allProducts = products.data.products;
      const allUsers = users.data;

      const revenue = allOrders.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0);
      const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
      const deliveredOrders = allOrders.filter((o) => o.status === "delivered").length;

      // Revenue by month (last 6 months)
      const now = new Date();
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString("default", { month: "short" });
        const rev = allOrders
          .filter((o) => {
            const od = new Date(o.createdAt);
            return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear() && o.isPaid;
          })
          .reduce((acc, o) => acc + o.totalPrice, 0);
        monthlyRevenue.push({ label, rev });
      }

      // Top products by revenue
      const productRevMap = {};
      allOrders.forEach((o) => {
        if (!o.isPaid) return;
        o.items?.forEach((item) => {
          productRevMap[item.name] = (productRevMap[item.name] || 0) + item.price * item.qty;
        });
      });
      const topProducts = Object.entries(productRevMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, rev]) => ({ name, rev }));

      // Category breakdown
      const catMap = {};
      allProducts.forEach((p) => {
        catMap[p.category] = (catMap[p.category] || 0) + 1;
      });
      const categoryBreakdown = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, count]) => ({ cat, count }));

      // Order status breakdown
      const statusMap = {};
      allOrders.forEach((o) => {
        statusMap[o.status] = (statusMap[o.status] || 0) + 1;
      });

      setStats({
        totalProducts: products.data.total,
        totalOrders: allOrders.length,
        totalUsers: allUsers.length,
        revenue,
        pendingOrders,
        deliveredOrders,
        recentOrders: allOrders.slice(0, 8),
        monthlyRevenue,
        topProducts,
        categoryBreakdown,
        statusMap,
        lowStock: allProducts.filter((p) => p.stock <= 5 && p.stock > 0),
        outOfStock: allProducts.filter((p) => p.stock === 0).length,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const maxMonthRev = Math.max(...(stats?.monthlyRevenue.map((m) => m.rev) || [1]));
  const maxTopRev = stats?.topProducts[0]?.rev || 1;
  const maxCat = stats?.categoryBreakdown[0]?.count || 1;

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/products" className="bg-[#FF9900] hover:bg-[#e88b00] text-gray-900 font-semibold text-sm px-4 py-2 rounded border border-[#FF8F00]">
              + Add Product
            </Link>
            <Link to="/admin/orders" className="bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-4 py-2 rounded border border-gray-300">
              Manage Orders
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, sub: "From paid orders", icon: "💰", color: "border-l-4 border-[#FF9900]" },
            { label: "Total Orders", value: stats.totalOrders, sub: `${stats.pendingOrders} pending`, icon: "📦", color: "border-l-4 border-blue-500" },
            { label: "Total Users", value: stats.totalUsers, sub: "Registered accounts", icon: "👥", color: "border-l-4 border-purple-500" },
            { label: "Products", value: stats.totalProducts, sub: `${stats.outOfStock} out of stock`, icon: "🛍️", color: "border-l-4 border-green-500" },
          ].map((c) => (
            <div key={c.label} className={`bg-white rounded shadow-sm p-4 ${c.color}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{c.label}</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{c.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
                </div>
                <span className="text-2xl">{c.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Monthly Revenue Chart */}
          <div className="md:col-span-2 bg-white rounded shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Revenue — Last 6 Months</h2>
            <div className="flex items-end gap-2 h-40">
              {stats.monthlyRevenue.map((m) => {
                const h = maxMonthRev ? Math.max(4, Math.round((m.rev / maxMonthRev) * 100)) : 4;
                return (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500 font-medium">${m.rev > 0 ? m.rev.toFixed(0) : "0"}</span>
                    <div
                      className="w-full bg-[#FF9900] rounded-t hover:bg-[#e88b00] transition-all"
                      style={{ height: `${h}%` }}
                      title={`$${m.rev.toFixed(2)}`}
                    />
                    <span className="text-xs text-gray-500">{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Status Donut (simplified) */}
          <div className="bg-white rounded shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-3">
              {Object.entries(stats.statusMap).map(([status, count]) => {
                const colors = { pending: "bg-yellow-400", processing: "bg-blue-400", shipped: "bg-purple-400", delivered: "bg-green-500", cancelled: "bg-red-400" };
                const pct = stats.totalOrders ? Math.round((count / stats.totalOrders) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize font-medium text-gray-700">{status}</span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`${colors[status] || "bg-gray-400"} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Top Products by Revenue */}
          <div className="bg-white rounded shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Top Products by Revenue</h2>
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-gray-400">No sales data yet</p>
            ) : (
              <div className="space-y-3">
                {stats.topProducts.map((p, i) => (
                  <div key={p.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 truncate flex-1 mr-2">{i + 1}. {p.name}</span>
                      <span className="font-bold text-gray-900 shrink-0">${p.rev.toFixed(0)}</span>
                    </div>
                    <MiniBar value={p.rev} max={maxTopRev} color="bg-[#FF9900]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Products by Category</h2>
            <div className="space-y-3">
              {stats.categoryBreakdown.map((c) => (
                <div key={c.cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">{c.cat}</span>
                    <span className="font-bold text-gray-900">{c.count}</span>
                  </div>
                  <MiniBar value={c.count} max={maxCat} color="bg-blue-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-1">⚠️ Low Stock Alert</h2>
            <p className="text-xs text-gray-400 mb-3">Products with ≤5 units remaining</p>
            {stats.lowStock.length === 0 ? (
              <p className="text-sm text-green-600 font-medium">✓ All products well stocked</p>
            ) : (
              <div className="space-y-2">
                {stats.lowStock.map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate flex-1 mr-2">{p.name}</span>
                    <span className={`font-bold shrink-0 ${p.stock <= 2 ? "text-red-600" : "text-orange-500"}`}>
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
            {stats.outOfStock > 0 && (
              <p className="text-red-600 text-xs font-semibold mt-3 pt-3 border-t border-gray-100">
                {stats.outOfStock} product(s) out of stock
              </p>
            )}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-[#007185] hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200">
                  <th className="pb-2 pr-4">Order ID</th>
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Items</th>
                  <th className="pb-2 pr-4">Total</th>
                  <th className="pb-2 pr-4">Payment</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((o) => {
                  const sc = STATUS_COLORS[o.status] || { bg: "bg-gray-100", text: "text-gray-700" };
                  return (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="py-2 pr-4 font-mono text-xs text-gray-500">#{o._id.slice(-8).toUpperCase()}</td>
                      <td className="py-2 pr-4 font-medium text-gray-800">{o.user?.name || "—"}</td>
                      <td className="py-2 pr-4 text-gray-500">{o.items?.length || 0} item(s)</td>
                      <td className="py-2 pr-4 font-bold text-gray-900">${o.totalPrice.toFixed(2)}</td>
                      <td className="py-2 pr-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${o.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {o.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${sc.bg} ${sc.text}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-2 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
