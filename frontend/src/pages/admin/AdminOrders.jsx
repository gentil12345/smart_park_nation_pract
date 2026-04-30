import { useEffect, useState, Fragment } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = async () => {
    const { data } = await api.get("/orders");
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDeliver = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      toast.success("Marked as delivered");
      fetchOrders();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h1>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Paid</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <Fragment key={o._id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">{o.user?.name || "—"}</td>
                    <td className="px-4 py-3 font-semibold">${o.totalPrice.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          o.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {o.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                          STATUS_COLORS[o.status] || ""
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {!o.isDelivered && o.isPaid && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeliver(o._id);
                          }}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                  {expanded === o._id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 bg-gray-50">
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            <strong>Ship to:</strong> {o.shippingAddress.fullName},{" "}
                            {o.shippingAddress.address}, {o.shippingAddress.city},{" "}
                            {o.shippingAddress.country}
                          </p>
                          <p>
                            <strong>Items:</strong>{" "}
                            {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                          </p>
                          <p>
                            <strong>Payment:</strong> {o.paymentMethod}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
