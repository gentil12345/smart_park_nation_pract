import { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";

const EMPTY = { RecordNumber: "", ServiceDate: new Date().toISOString().split("T")[0], PlateNumber: "", PackageNumber: "" };

export default function ServicePackagePage() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    const [r, c, p] = await Promise.all([
      api.get("/service-packages"),
      api.get("/cars"),
      api.get("/packages"),
    ]);
    setRecords(r.data);
    setCars(c.data);
    setPackages(p.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/service-packages/${editId}`, form);
        toast.success("Record updated!");
        setEditId(null);
      } else {
        await api.post("/service-packages", form);
        toast.success("Service record created!");
      }
      setForm(EMPTY);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally { setLoading(false); }
  };

  const handleEdit = (rec) => {
    setEditId(rec._id);
    setForm({
      RecordNumber: rec.RecordNumber,
      ServiceDate: rec.ServiceDate?.split("T")[0] || new Date().toISOString().split("T")[0],
      PlateNumber: rec.PlateNumber,
      PackageNumber: rec.PackageNumber,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service record?")) return;
    try {
      await api.delete(`/service-packages/${id}`);
      toast.success("Deleted");
      fetchAll();
    } catch { toast.error("Delete failed"); }
  };

  const handleCancel = () => { setEditId(null); setForm(EMPTY); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">🔧 Service Records</h2>
          <p className="text-sm text-gray-500">Record car washing service assignments</p>
        </div>
        <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">{records.length} Records</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">
            {editId ? "✏️ Edit Service Record" : "➕ New Service Record"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Record Number *</label>
                <input required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                  placeholder="SRV001"
                  value={form.RecordNumber}
                  onChange={(e) => setForm({ ...form, RecordNumber: e.target.value })}
                  disabled={!!editId}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Service Date *</label>
                <input required type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                  value={form.ServiceDate}
                  onChange={(e) => setForm({ ...form, ServiceDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Car (Plate Number) *</label>
              <select required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] bg-white"
                value={form.PlateNumber}
                onChange={(e) => setForm({ ...form, PlateNumber: e.target.value })}
              >
                <option value="">-- Select Car --</option>
                {cars.map((c) => (
                  <option key={c._id} value={c.PlateNumber}>{c.PlateNumber} — {c.DriverName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Service Package *</label>
              <select required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] bg-white"
                value={form.PackageNumber}
                onChange={(e) => setForm({ ...form, PackageNumber: e.target.value })}
              >
                <option value="">-- Select Package --</option>
                {packages.map((p) => (
                  <option key={p._id} value={p.PackageNumber}>{p.PackageName} — {p.PackagePrice.toLocaleString()} RWF</option>
                ))}
              </select>
            </div>

            {/* Preview selected package */}
            {form.PackageNumber && (() => {
              const pkg = packages.find((p) => p.PackageNumber === form.PackageNumber);
              return pkg ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                  <p className="font-bold text-blue-800">{pkg.PackageName}</p>
                  <p className="text-blue-600">{pkg.PackageDescription}</p>
                  <p className="font-extrabold text-blue-900 mt-1">{pkg.PackagePrice.toLocaleString()} RWF</p>
                </div>
              ) : null;
            })()}

            <div className="flex gap-2">
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#1a3c5e] hover:bg-[#15304d] text-white font-bold py-2.5 rounded-lg transition disabled:opacity-60 text-sm"
              >
                {loading ? "Saving..." : editId ? "Update Record" : "Create Record"}
              </button>
              {editId && (
                <button type="button" onClick={handleCancel}
                  className="px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">All Service Records</h3>
          <div className="overflow-auto max-h-96">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="text-left text-gray-500 uppercase">
                  <th className="px-3 py-2">Record#</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Plate</th>
                  <th className="px-3 py-2">Package</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-6 text-gray-400">No records yet</td></tr>
                ) : records.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-bold text-[#1a3c5e]">{r.RecordNumber}</td>
                    <td className="px-3 py-2 text-gray-500">{new Date(r.ServiceDate).toLocaleDateString()}</td>
                    <td className="px-3 py-2 font-semibold">{r.PlateNumber}</td>
                    <td className="px-3 py-2">{r.package?.PackageName || r.PackageNumber}</td>
                    <td className="px-3 py-2 font-bold text-green-700">{r.package?.PackagePrice?.toLocaleString() || "—"}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline text-xs font-semibold">Edit</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:underline text-xs font-semibold">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
