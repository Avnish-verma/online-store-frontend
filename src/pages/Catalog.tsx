import { useEffect, useState } from "react";
import { getCategories, getProducts } from "../api";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";

export default function Catalog() {
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);
        
        const params: any = { page, limit };
        if (activeCategory) params.category = activeCategory;
        
        const data = await getProducts(params);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [activeCategory, page, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Catalog</h1>
      
      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        <button
          onClick={() => { setActiveCategory(""); setPage(1); }}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === "" 
              ? "bg-gray-900 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? "bg-gray-900 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading / Error States */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 bg-red-50 rounded-xl">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 border border-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 border border-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
