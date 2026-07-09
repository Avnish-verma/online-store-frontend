import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../api";
import { Settings } from "../../types";

export default function SettingsPage() {
  const [formData, setFormData] = useState<Settings>({
    whatsappNumber: "",
    storeName: "",
    address: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getSettings()
      .then(data => setFormData(data))
      .catch(err => setError(err.message || "Failed to load settings"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      
      const updated = await updateSettings(formData);
      setFormData(updated);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Store Settings</h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">Settings saved successfully.</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Store Name</label>
          <input 
            required 
            type="text" 
            value={formData.storeName} 
            onChange={e => setFormData(p => ({...p, storeName: e.target.value}))} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">WhatsApp Number</label>
          <p className="text-xs text-gray-500 mb-2">Include country code without '+' (e.g., 1234567890)</p>
          <input 
            required 
            type="text" 
            value={formData.whatsappNumber} 
            onChange={e => setFormData(p => ({...p, whatsappNumber: e.target.value}))} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Physical Address</label>
          <textarea 
            rows={3}
            value={formData.address} 
            onChange={e => setFormData(p => ({...p, address: e.target.value}))} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900" 
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
