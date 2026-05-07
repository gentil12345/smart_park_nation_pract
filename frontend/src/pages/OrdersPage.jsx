import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📦</p>
            <h2 className="text-lg font-medium text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-400 text-sm mb-4">Looks like you haven't placed any orders.</p>
            <Link to="/products" className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold px-6 py-2 rounded-full border border-[#FCD200] text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded border border-gray-200 overflow-hidden">
                {/* Order header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap gap-4 items-center justify-between text-xs text-gray-600">
                  <div className="flex gap-6 flex-wrap">
                    <div>
                      <p className="uppercase font-bold text-gray-500 mb-0.5">Order Placed</p>
                      <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold text-gray-500 mb-0.5">Total</p>
                      <p className="text-gray-900 font-bold">${order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold text-gray-500 mb-0.5">Ship To</p>
                      <p className="text-gray-900">{order.shippingAddress?.fullName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="uppercase font-bold text-gray-500 mb-0.5">Order # {order._id.slice(-8).toUpperCase()}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.items.map((item) => (
                      <div key={item._id} className="shrink-0 flex gap-3 items-start">
                        <img
                          src={item.image || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-16 h-16 object-contain bg-gray-50 border border-gray-100 rounded"
                        />
                        <div>
                          <p className="text-sm text-gray-800 font-medium line-clamp-2 max-w-[180px]">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.qty}</p>
                          <p className="text-sm font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {order.isPaid ? "✓ Payment confirmed" : "⚠ Payment pending"}
                    </span>
                    {order.isDelivered && (
                      <span className="text-xs px-2 py-1 rounded font-semibold bg-green-100 text-green-700">
                        ✓ Delivered {new Date(order.deliveredAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
