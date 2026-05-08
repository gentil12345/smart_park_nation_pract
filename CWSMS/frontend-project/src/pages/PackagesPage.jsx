import { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";

const EMPTY = { PackageNumber: "", PackageName: "", PackageDescription: "", PackagePrice: "" };

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const fetchPackages = async () => {
    const { data } = await api.get("/packages");
    setPackages(data);
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/packages", { ...form, PackagePrice: Number(form.PackagePrice) });
      toast.success("Package added!");
      setForm(EMPTY);
      fetchPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add package");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">📦 Service Packages</h2>
          <p className="text-sm text-gray-500">Manage car washing service packages and pricing</p>
        </div>
        <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">{packages.length} Packages</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Add New Package</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Package Number *</label>
                <input required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                  placeholder="PKG004"
                  value={form.PackageNumber}
                  onChange={(e) => setForm({ ...form, PackageNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Package Name *</label>
                <input required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                  placeholder="e.g. Deluxe wash"
                  value={form.PackageName}
                  onChange={(e) => setForm({ ...form, PackageName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
              <textarea required rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                placeholder="Describe what is included..."
                value={form.PackageDescription}
                onChange={(e) => setForm({ ...form, PackageDescription: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Price (RWF) *</label>
              <input required type="number" min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                placeholder="e.g. 15000"
                value={form.PackagePrice}
                onChange={(e) => setForm({ ...form, PackagePrice: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#1a3c5e] hover:bg-[#15304d] text-white font-bold py-2.5 rounded-lg transition disabled:opacity-60 text-sm"
            >
              {loading ? "Adding..." : "Add Package"}
            </button>
          </form>
        </div>

        {/* Packages list */}
        <div className="space-y-3">
          {packages.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">No packages yet</div>
          ) : packages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a3c5e] text-white flex items-center justify-center font-bold text-xs">
                  {pkg.PackageNumber}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{pkg.PackageName}</p>
                  <p className="text-xs text-gray-500">{pkg.PackageDescription}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-[#1a3c5e] text-lg">{pkg.PackagePrice.toLocaleString()}</p>
                <p className="text-xs text-gray-400">RWF</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
