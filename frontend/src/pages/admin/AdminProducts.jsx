import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

const EMPTY = {
  name: "", description: "", price: "", originalPrice: "", category: "Electronics",
  brand: "", stock: "", featured: false, images: [""],
};
const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Toys", "Other"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    const { data } = await api.get("/products", { params: { limit: 100 } });
    setProducts(data.products);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (p) => {
    setForm({ ...p, price: p.price, originalPrice: p.originalPrice, stock: p.stock, images: p.images.length ? p.images : [""] });
    setModal("edit");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), stock: Number(form.stock), images: form.images.filter(Boolean) };
      if (modal === "add") await api.post("/products", payload);
      else await api.put(`/products/${form._id}`, payload);
      toast.success(modal === "add" ? "Product created!" : "Product updated!");
      setModal(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img src={p.images?.[0] || "https://via.placeholder.com/40"} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-yellow-500">{"★".repeat(Math.round(p.rating))}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-indigo-600 hover:underline text-xs font-semibold">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{modal === "add" ? "Add Product" : "Edit Product"}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Brand", key: "brand", type: "text" },
                { label: "Price ($)", key: "price", type: "number" },
                { label: "Original Price ($)", key: "originalPrice", type: "number" },
                { label: "Stock", key: "stock", type: "number" },
                { label: "Image URL", key: "images[0]", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type} required={["name", "price", "stock"].includes(key)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={key === "images[0]" ? form.images[0] : form[key]}
                    onChange={(e) => {
                      if (key === "images[0]") setForm({ ...form, images: [e.target.value] });
                      else setForm({ ...form, [key]: e.target.value });
                    }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-indigo-600" />
                Featured product
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
