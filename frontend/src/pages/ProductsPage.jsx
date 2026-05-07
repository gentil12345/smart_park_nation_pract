import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Toys"];
const SORTS = [
  { value: "newest", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);
  const [search, setSearch] = useState(keyword);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 16, sort };
      if (keyword) params.keyword = keyword;
      if (category !== "All") params.category = category;
      const { data } = await api.get("/products", { params });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const update = (key, value) => {
    const p = Object.fromEntries(searchParams);
    p[key] = value;
    if (key !== "page") p.page = 1;
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    update("keyword", search);
  };

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-3 md:px-6 py-4">
        {/* Search bar (mobile) */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4 md:hidden">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-[#FF9900] text-gray-900 px-4 py-2 rounded text-sm font-semibold">Go</button>
        </form>

        <div className="flex gap-4">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white border border-gray-200 rounded p-4 mb-3">
              <p className="font-bold text-gray-900 mb-3 text-sm border-b pb-2">Department</p>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => update("category", cat)}
                      className={`w-full text-left text-sm py-0.5 px-1 rounded transition ${
                        category === cat
                          ? "text-[#C7511F] font-bold"
                          : "text-[#007185] hover:text-[#C7511F]"
                      }`}
                    >
                      {category === cat && "› "}{cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded p-4">
              <p className="font-bold text-gray-900 mb-3 text-sm border-b pb-2">Sort By</p>
              <ul className="space-y-1">
                {SORTS.map((s) => (
                  <li key={s.value}>
                    <button
                      onClick={() => update("sort", s.value)}
                      className={`w-full text-left text-sm py-0.5 px-1 rounded transition ${
                        sort === s.value ? "text-[#C7511F] font-bold" : "text-[#007185] hover:text-[#C7511F]"
                      }`}
                    >
                      {sort === s.value && "› "}{s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="bg-white border border-gray-200 rounded px-4 py-2 mb-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                {keyword && <p className="text-sm text-gray-500">Results for <span className="font-semibold text-gray-900">"{keyword}"</span></p>}
                <p className="text-sm text-gray-500">{total.toLocaleString()} results {category !== "All" && `in ${category}`}</p>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <select
                  value={sort}
                  onChange={(e) => update("sort", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none"
                >
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(12)].map((_, i) => <div key={i} className="bg-white h-72 animate-pulse rounded border border-gray-200" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded p-12 text-center">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-gray-600 font-semibold">No results found</p>
                <p className="text-gray-400 text-sm mt-1">Try different keywords or browse categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-1 mt-6">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => update("page", i + 1)}
                    className={`px-3 py-1.5 text-sm rounded border transition ${
                      page === i + 1
                        ? "bg-[#FF9900] border-[#FF9900] text-gray-900 font-bold"
                        : "bg-white border-gray-300 text-[#007185] hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
