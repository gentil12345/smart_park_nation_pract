import { useEffect, useState, useRef } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";

const EMPTY = { PaymentNumber: "", AmountPaid: "", PaymentDate: new Date().toISOString().split("T")[0], RecordNumber: "" };

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState(null);
  const billRef = useRef();

  const fetchAll = async () => {
    const [p, s] = await Promise.all([api.get("/payments"), api.get("/service-packages")]);
    setPayments(p.data);
    setServices(s.data);
  };

  useEffect(() => { fetchAll(); }, []);

  // Auto-fill amount from selected service
  const handleServiceChange = (recordNumber) => {
    const svc = services.find((s) => s.RecordNumber === recordNumber);
    setForm((f) => ({
      ...f,
      RecordNumber: recordNumber,
      AmountPaid: svc?.package?.PackagePrice || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/payments", { ...form, AmountPaid: Number(form.AmountPaid) });
      toast.success("Payment recorded!");
      setBillData(data);
      setForm(EMPTY);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record payment");
    } finally { setLoading(false); }
  };

  const handlePrint = () => {
    const content = billRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>SmartPark Bill</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: auto; }
        .header { text-align: center; border-bottom: 2px solid #1a3c5e; padding-bottom: 10px; margin-bottom: 15px; }
        .row { display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px; }
        .total { font-weight: bold; font-size: 16px; border-top: 2px solid #1a3c5e; padding-top: 8px; margin-top: 8px; }
        .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #666; }
      </style></head>
      <body>${content}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const selectedService = services.find((s) => s.RecordNumber === form.RecordNumber);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">💳 Payment</h2>
          <p className="text-sm text-gray-500">Record payments and generate bills</p>
        </div>
        <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">{payments.length} Payments</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Record Payment</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Number *</label>
              <input required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                placeholder="PAY001"
                value={form.PaymentNumber}
                onChange={(e) => setForm({ ...form, PaymentNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Service Record *</label>
              <select required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] bg-white"
                value={form.RecordNumber}
                onChange={(e) => handleServiceChange(e.target.value)}
              >
                <option value="">-- Select Service Record --</option>
                {services.map((s) => (
                  <option key={s._id} value={s.RecordNumber}>
                    {s.RecordNumber} — {s.PlateNumber} ({s.package?.PackageName})
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Car:</span><span className="font-semibold">{selectedService.PlateNumber}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Driver:</span><span>{selectedService.car?.DriverName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Package:</span><span>{selectedService.package?.PackageName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Package Price:</span><span className="font-bold text-green-700">{selectedService.package?.PackagePrice?.toLocaleString()} RWF</span></div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Amount Paid (RWF) *</label>
              <input required type="number" min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                value={form.AmountPaid}
                onChange={(e) => setForm({ ...form, AmountPaid: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Date *</label>
              <input required type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
                value={form.PaymentDate}
                onChange={(e) => setForm({ ...form, PaymentDate: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#1a3c5e] hover:bg-[#15304d] text-white font-bold py-2.5 rounded-lg transition disabled:opacity-60 text-sm"
            >
              {loading ? "Recording..." : "Record Payment"}
            </button>
          </form>
        </div>

        {/* Bill */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">🧾 Bill / Invoice</h3>
          {billData ? (
            <>
              <div ref={billRef} className="text-sm space-y-2">
                <div className="header text-center border-b-2 border-[#1a3c5e] pb-3 mb-3">
                  <p className="text-xl font-extrabold text-[#1a3c5e]">🅿️ SmartPark</p>
                  <p className="text-xs text-gray-500">Rubavu District, Western Province, Rwanda</p>
                  <p className="text-xs text-gray-500">Car Washing Sales Receipt</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Payment #:</span><span className="font-bold">{billData.PaymentNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date:</span><span>{new Date(billData.PaymentDate).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Plate Number:</span><span className="font-bold">{billData.car?.PlateNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Driver:</span><span>{billData.car?.DriverName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Phone:</span><span>{billData.car?.PhoneNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Car Type:</span><span>{billData.car?.CarType} ({billData.car?.CarSize})</span></div>
                  <hr className="my-2" />
                  <div className="flex justify-between"><span className="text-gray-500">Package:</span><span className="font-semibold">{billData.package?.PackageName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Description:</span><span className="text-right max-w-[150px]">{billData.package?.PackageDescription}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Package Price:</span><span>{billData.package?.PackagePrice?.toLocaleString()} RWF</span></div>
                  <hr className="my-2 border-[#1a3c5e] border-2" />
                  <div className="flex justify-between text-base font-extrabold text-[#1a3c5e]">
                    <span>AMOUNT PAID:</span>
                    <span>{billData.AmountPaid?.toLocaleString()} RWF</span>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-400 mt-4 pt-3 border-t border-gray-200">
                  <p>Thank you for choosing SmartPark!</p>
                  <p>Come back again 🚗✨</p>
                </div>
              </div>
              <button onClick={handlePrint}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-sm transition"
              >
                🖨️ Print Bill
              </button>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🧾</p>
              <p className="text-sm">Bill will appear here after recording a payment</p>
            </div>
          )}
        </div>

        {/* Payment history */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Payment History</h3>
          <div className="overflow-auto max-h-96 space-y-2">
            {payments.length === 0 ? (
              <p className="text-center py-6 text-gray-400 text-sm">No payments yet</p>
            ) : payments.map((p) => (
              <div key={p._id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-xs text-[#1a3c5e]">{p.PaymentNumber}</p>
                    <p className="text-xs text-gray-600">{p.car?.PlateNumber} — {p.car?.DriverName}</p>
                    <p className="text-xs text-gray-400">{p.package?.PackageName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-green-700 text-sm">{p.AmountPaid?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">RWF</p>
                    <p className="text-xs text-gray-400">{new Date(p.PaymentDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
