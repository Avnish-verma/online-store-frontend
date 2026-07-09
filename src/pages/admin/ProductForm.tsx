import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, createProduct, updateProduct, uploadFile } from "../../api";
import { Upload, X, ArrowLeft } from "lucide-react";

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: true,
    sizes: "",
    colours: "",
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getProduct(id)
        .then(data => {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            price: data.price ? String(data.price) : "",
            category: data.category || "",
            inStock: data.inStock ?? true,
            sizes: data.sizes?.join(", ") || "",
            colours: data.colours?.join(", ") || "",
          });
          setImages(data.images || []);
        })
        .catch(err => setError(err.message || "Failed to load product"))
        .finally(() => setIsLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setIsUploading(true);
      setError(null);
      const file = e.target.files[0];
      const res = await uploadFile(file);
      setImages(prev => [...prev, res.url]);
    } catch (err: any) {
      setError("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inStock: formData.inStock,
        sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
        colours: formData.colours.split(",").map(c => c.trim()).filter(Boolean),
        images: images,
      };

      if (isEdit && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to save product");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/admin")} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Product" : "Add Product"}</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <form  onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200" encType="multipart/form-data">
        
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Product Images</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 hover:bg-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors cursor-pointer bg-gray-50">
              {isUploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              ) : (
                <>
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Upload</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
            <textarea rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Price ($)</label>
            <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
            <input required type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Sizes (comma separated)</label>
            <input type="text" name="sizes" placeholder="S, M, L, XL" value={formData.sizes} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Colours (comma separated)</label>
            <input type="text" name="colours" placeholder="Red, Blue, Black" value={formData.colours} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" />
          </div>
          <div className="md:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="inStock" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900" />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-900">In Stock</label>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/admin")} className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Cancel</button>
          <button type="submit" disabled={isSubmitting || isUploading} className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
