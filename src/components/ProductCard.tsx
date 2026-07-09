import { Link } from "react-router-dom";
import { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 relative mb-4">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <p className="font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
      </div>
    </Link>
  );
}
