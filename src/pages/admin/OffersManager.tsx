import React, { useEffect, useState } from "react";
import { getOffers, createOffer, updateOffer, deleteOffer, uploadFile } from "../../api";
import { Offer } from "../../types";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";

export default function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentOfferId, setCurrentOfferId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    linkUrl: "",
    imageUrl: "",
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const data = await getOffers();
      setOffers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleEdit = (offer: Offer) => {
    setCurrentOfferId(offer.id);
    setFormData({
      title: offer.title,
      subtitle: offer.subtitle,
      linkUrl: offer.linkUrl || "",
      imageUrl: offer.imageUrl,
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentOfferId(null);
    setFormData({ title: "", subtitle: "", linkUrl: "", imageUrl: "" });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentOfferId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      await deleteOffer(id);
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setIsUploading(true);
      const res = await uploadFile(e.target.files[0]);
      setFormData(prev => ({ ...prev, imageUrl: res.url }));
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("An image is required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      if (currentOfferId) {
        const updated = await updateOffer(currentOfferId, formData);
        setOffers(prev => prev.map(o => o.id === currentOfferId ? updated : o));
      } else {
        const created = await createOffer(formData);
        setOffers(prev => [...prev, created]);
      }
      setIsEditing(false);
    } catch (err: any) {
      alert("Save failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
        {!isEditing && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Offer
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">{currentOfferId ? "Edit Offer" : "New Offer"}</h2>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5"/></button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Banner Image</label>
            {formData.imageUrl ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData(p => ({...p, imageUrl: ""}))} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-600 hover:bg-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors cursor-pointer bg-gray-50">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Upload Image</span>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Subtitle</label>
              <input required type="text" value={formData.subtitle} onChange={e => setFormData(p => ({...p, subtitle: e.target.value}))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">Link URL (Optional)</label>
              <input type="text" placeholder="/catalog" value={formData.linkUrl} onChange={e => setFormData(p => ({...p, linkUrl: e.target.value}))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting || isUploading} className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save Offer"}
            </button>
          </div>
        </form>
      ) : null}

      {!isEditing && (
        isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 text-gray-500">
            No offers active. Add one to show on the homepage.
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-48 h-32 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  <img src={offer.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{offer.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(offer)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(offer.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
