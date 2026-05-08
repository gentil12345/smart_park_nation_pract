import { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";

const EMPTY = { PlateNumber: "", CarType: "Sedan", CarSize: "Medium", DriverName: "", PhoneNumber: "" };

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCars = async () => {
    const { data } = await api.get("/cars");
    setCars(data);
  };

  useEffect(() => { fetchCars(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/cars", form);
      toast.success("Car registered successfully!");
      setForm(EMPTY);
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register car");
    } finally { setLoading(false); }
  };

  const filtered = cars.filter((c) =>
    c.PlateNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.DriverName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">🚗 Car Registration</h2>
          <p className="text-sm text-gray-500">Register new vehicles for car washing services</p>
        </div>
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">{cars.length} Cars</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Register New Car</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Plate Number *</label>
                <input required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] uppercase"
                  placeholder="RAB 123 A"
                  value={form.PlateNumber}
                  onChange={(e) => setForm({ ...form, PlateNumber: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Car Type *</label>
                <select required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] bg-white"
                  value={form.CarType}
                  onChange={(e) => setForm({ ...form, CarType: e.target.value })}
                >
                  {["Sedan", "SUV", "Truck", "Van", "Motorcycle", "Bus", "Other"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Car Size *</label>
              <div className="flex gap-3">
                {["Small", "Medium", "Large"].map((s) => (
                  <label key={s} className={`flex-1 text-center py-2 rounded-lg border cursor-pointer text-sm font-medium transition ${form.CarSize === s ? "bg-[#1a3c5e] text-white border-[#1a3c5e]" : "border-gray-300 text-gray-600 hover:border-[#1a3c5e]"}`}>
                    <input type="radio" name="size" value={s} checked={form.CarSize === s} onChange={() => setForm({ ...form, CarSize: s })} className="hidden" />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Driver Name *</label>
              <input required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                placeholder="Full name"
                value={form.DriverName}
                onChange={(e) => setForm({ ...form, DriverName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
              <input required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                placeholder="+250 7XX XXX XXX"
                value={form.PhoneNumber}
                onChange={(e) => setForm({ ...form, PhoneNumber: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a3c5e] hover:bg-[#15304d] text-white font-bold py-2.5 rounded-lg transition disabled:opacity-60 text-sm mt-2"
            >
              {loading ? "Registering..." : "Register Car"}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Registered Cars</h3>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] w-40"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto max-h-80">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="text-left text-gray-500 uppercase">
                  <th className="px-3 py-2">Plate</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Driver</th>
                  <th className="px-3 py-2">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-gray-400">No cars registered yet</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-bold text-[#1a3c5e]">{c.PlateNumber}</td>
                    <td className="px-3 py-2">{c.CarType}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.CarSize === "Small" ? "bg-green-100 text-green-700" : c.CarSize === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {c.CarSize}
                      </span>
                    </td>
                    <td className="px-3 py-2">{c.DriverName}</td>
                    <td className="px-3 py-2 text-gray-500">{c.PhoneNumber}</td>
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
