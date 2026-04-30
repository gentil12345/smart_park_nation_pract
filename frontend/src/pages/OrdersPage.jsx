import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>No orders yet.</p>
          <Link to="/products" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-mono text-sm text-gray-500">#{order._id.slice(-8).toUpperCase()}</span>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {order.items.map((item) => (
                  <div key={item._id} className="shrink-0 text-center">
                    <img src={item.image || "https://via.placeholder.com/60"} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-gray-100" />
                    <p className="text-xs text-gray-500 mt-1 w-14 truncate">{item.name}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.items.length} item(s)</span>
                <span className="font-bold text-gray-900">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
