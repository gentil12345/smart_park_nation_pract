import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-6">Thank you for your purchase. Your order is being processed.</p>

      {order && (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-left mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Order ID: <span className="font-mono text-gray-700">{order._id.slice(-8).toUpperCase()}</span></span>
            <span className="capitalize bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{order.status}</span>
          </div>
          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} ×{item.qty}</span>
                <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr className="mb-3" />
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total Paid</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Link to="/orders" className="border border-indigo-600 text-indigo-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-50">
          View Orders
        </Link>
        <Link to="/products" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
