import { useEffect, useState, useRef } from "react";
import api from "../lib/api";

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/payments/report/daily?date=${date}`);
      setReport(data);
    } catch { setReport({ records: [], totalAmount: 0, count: 0 }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(); }, []);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>SmartPark Daily Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #1a3c5e; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #1a3c5e; color: white; padding: 8px 12px; text-align: left; font-size: 12px; }
        td { padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 12px; }
        tr:nth-child(even) { background: #f9f9f9; }
        .summary { margin-top: 15px; padding: 10px; background: #f0f4f8; border-radius: 6px; }
        .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #888; }
      </style></head>
      <body>${content}</body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">📊 Daily Reports</h2>
          <p className="text-sm text-gray-500">View and print daily car washing sales reports</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c5e]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={fetchReport} disabled={loading}
            className="bg-[#1a3c5e] hover:bg-[#15304d] text-white font-bold px-4 py-2 rounded-lg text-sm transition disabled:opacity-60"
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
          {report && report.records.length > 0 && (
            <button onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition"
            >
              🖨️ Print
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      {report && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-[#1a3c5e]">{report.count}</p>
            <p className="text-sm text-gray-500 mt-1">Cars Washed</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-green-600">{report.totalAmount?.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total Revenue (RWF)</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-blue-600">
              {report.count > 0 ? Math.round(report.totalAmount / report.count).toLocaleString() : 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Avg. per Car (RWF)</p>
          </div>
        </div>
      )}

      {/* Printable report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div ref={printRef}>
          {/* Report header */}
          <div className="text-center mb-6 border-b-2 border-[#1a3c5e] pb-4">
            <h1 className="text-2xl font-extrabold text-[#1a3c5e]">🅿️ SmartPark</h1>
            <p className="text-sm text-gray-500">Rubavu District, Western Province, Rwanda</p>
            <p className="text-sm font-bold text-gray-700 mt-2">DAILY CAR WASHING SALES REPORT</p>
            <p className="text-sm text-gray-500">
              Date: <span className="font-semibold">{new Date(date + "T12:00:00").toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading report...</div>
          ) : !report || report.records.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p>No transactions found for this date</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1a3c5e] text-white">
                      <th className="px-4 py-3 text-left text-xs uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Payment #</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Plate Number</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Driver Name</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Package Name</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Description</th>
                      <th className="px-4 py-3 text-right text-xs uppercase">Amount Paid (RWF)</th>
                      <th className="px-4 py-3 text-left text-xs uppercase">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {report.records.map((r, i) => (
                      <tr key={r._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                        <td className="px-4 py-3 font-bold text-[#1a3c5e]">{r.PaymentNumber}</td>
                        <td className="px-4 py-3 font-bold">{r.car?.PlateNumber || "—"}</td>
                        <td className="px-4 py-3">{r.car?.DriverName || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {r.package?.PackageName || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{r.package?.PackageDescription || "—"}</td>
                        <td className="px-4 py-3 text-right font-extrabold text-green-700">{r.AmountPaid?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(r.PaymentDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#1a3c5e] text-white font-bold">
                      <td colSpan={6} className="px-4 py-3 text-right text-sm">TOTAL REVENUE:</td>
                      <td className="px-4 py-3 text-right text-lg">{report.totalAmount?.toLocaleString()} RWF</td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-[#1a3c5e]">{report.count}</p>
                  <p className="text-xs text-gray-500">Total Cars Washed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-green-600">{report.totalAmount?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Revenue (RWF)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-blue-600">
                    {report.count > 0 ? Math.round(report.totalAmount / report.count).toLocaleString() : 0}
                  </p>
                  <p className="text-xs text-gray-500">Average per Car (RWF)</p>
                </div>
              </div>

              <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200">
                <p>Report generated on {new Date().toLocaleString()} by SmartPark CWSMS</p>
                <p>Rubavu District, Western Province, Rwanda</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
