import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, getSettings, logOrder } from "../api";
import { Product, Settings } from "../types";
import { MessageCircle, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColour, setSelectedColour] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        if (!id) throw new Error("Product ID is required");
        
        const [prodData, settsData] = await Promise.all([
          getProduct(id),
          getSettings()
        ]);
        
        setProduct(prodData);
        setSettings(settsData);
        
        if (prodData.sizes?.length > 0) setSelectedSize(prodData.sizes[0]);
        if (prodData.colours?.length > 0) setSelectedColour(prodData.colours[0]);
        
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleOrder = () => {
    if (!product || !settings?.whatsappNumber) return;
    
    const message = `Hello ${settings.storeName}! I would like to order:
*${product.name}*
Price: $${product.price.toFixed(2)}
Quantity: ${quantity}
${selectedSize ? `Size: ${selectedSize}\n` : ""}${selectedColour ? `Colour: ${selectedColour}\n` : ""}
Is this available?`;

    // Log the order anonymously (fire and forget)
    logOrder({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      colour: selectedColour,
      quantity
    }).catch(console.error);

    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-xl max-w-lg mx-auto">
          <p className="font-medium text-lg">Error loading product</p>
          <p className="text-sm mt-2">{error || "Product not found"}</p>
          <button 
            onClick={() => navigate("/catalog")}
            className="mt-6 text-sm font-medium hover:underline"
          >
            Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
            {!product.inStock && (
              <div className="absolute top-4 right-4 bg-black/80 text-white text-sm font-medium px-3 py-1 rounded">
                Out of Stock
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-medium text-gray-900 mb-6">${product.price.toFixed(2)}</p>
          
          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>

          <div className="space-y-6 flex-1">
            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] h-12 px-4 rounded-md border text-sm font-medium transition-colors
                        ${selectedSize === size 
                          ? "border-gray-900 bg-gray-900 text-white" 
                          : "border-gray-200 text-gray-900 hover:border-gray-900"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colours */}
            {product.colours && product.colours.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Colour</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colours.map(colour => (
                    <button
                      key={colour}
                      onClick={() => setSelectedColour(colour)}
                      className={`px-4 h-12 rounded-md border text-sm font-medium transition-colors
                        ${selectedColour === colour 
                          ? "border-gray-900 bg-gray-900 text-white" 
                          : "border-gray-200 text-gray-900 hover:border-gray-900"}`}
                    >
                      {colour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center w-32 border border-gray-200 rounded-md">
                <button 
                  className="w-10 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >-</button>
                <div className="flex-1 text-center font-medium">{quantity}</div>
                <button 
                  className="w-10 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900"
                  onClick={() => setQuantity(q => q + 1)}
                >+</button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <button
              disabled={!product.inStock || !settings?.whatsappNumber}
              onClick={handleOrder}
              className={`w-full h-14 flex items-center justify-center gap-2 rounded-full font-medium text-lg transition-all
                ${product.inStock && settings?.whatsappNumber
                  ? "bg-[#25D366] hover:bg-[#20bd5a] text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <MessageCircle className="w-5 h-5" />
              {settings?.whatsappNumber ? "Order on WhatsApp" : "WhatsApp Not Configured"}
            </button>
            {!product.inStock && (
              <p className="text-center text-sm text-gray-500 mt-3">This product is currently out of stock.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
