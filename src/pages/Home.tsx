import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOffers, getProducts } from "../api";
import { Offer, Product } from "../types";
import ProductCard from "../components/ProductCard";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const [offersData, productsData] = await Promise.all([
          getOffers(),
          getProducts({ limit: 4 })
        ]);
        
        setOffers(offersData);
        setProducts(productsData.products);
      } catch (err: any) {
        setError(err.message || "Failed to load homepage data");
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p className="font-medium">Error loading data</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero / Offers */}
      {offers.length > 0 ? (
        <div className="relative bg-gray-900 text-white h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <img 
            src={offers[0].imageUrl} 
            alt={offers[0].title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{offers[0].title}</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">{offers[0].subtitle}</p>
            {offers[0].linkUrl && (
              <a 
                href={offers[0].linkUrl}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 h-64 flex flex-col items-center justify-center text-gray-500">
          <p>No active offers</p>
        </div>
      )}

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Recent Arrivals</h2>
          <Link to="/catalog" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
