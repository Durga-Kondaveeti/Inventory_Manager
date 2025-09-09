// src/pages/AddItem.tsx
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { addStockItem, deleteItemsByField } from "../lib/db";
import { type StockItem } from "../types";
import Layout from "../components/Layout";

// Custom Dropdown Component
function CustomDropdown({ label, fieldName, options, value, onChange, disabled, onNew, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div 
        className={`w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 flex justify-between items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:ring-2 hover:ring-orange-500/20'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {value || <span className="text-stone-400">Select {label}...</span>}
        <svg className={`h-4 w-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-stone-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
          {options.map((opt: string) => (
            <div 
              key={opt} 
              className="group flex justify-between items-center px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-50 last:border-0" 
              onClick={() => { onChange(fieldName, opt); setIsOpen(false); }}
            >
              <span className="font-bold text-stone-700">{opt}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(fieldName, opt); setIsOpen(false); }} 
                className="text-stone-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title={`Delete ${opt}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          <div 
            className="px-4 py-3 text-orange-600 font-bold cursor-pointer hover:bg-orange-50 transition-colors" 
            onClick={() => { onNew(fieldName); setIsOpen(false); }}
          >
            + Create New {label}...
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingItems, setExistingItems] = useState<StockItem[]>([]);
  const [newFields, setNewFields] = useState({ category: false, type: false, location: false });

  const [formData, setFormData] = useState({
    category: "", type: "", itemName: "", 
    quantity: 0, unit: "count", minStock: 5, // <-- NEW FIELDS
    location: "", purchasePrice: 0, sellingPrice: 0, gst: 0,
  });

  // Fetch unique data for dropdowns
  useEffect(() => {
    const fetchInventory = async () => {
      const q = query(collection(db, "inventory"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => doc.data() as StockItem);
      setExistingItems(items);
    };
    fetchInventory();
  }, []);

  const uniqueCategories = useMemo(() => Array.from(new Set(existingItems.map(i => i.category).filter(Boolean))).sort(), [existingItems]);
  const uniqueLocations = useMemo(() => Array.from(new Set(existingItems.map(i => i.location).filter(Boolean))).sort(), [existingItems]);
  const availableTypes = useMemo(() => {
    if (!formData.category || newFields.category) return [];
    return Array.from(new Set(existingItems.filter(i => i.category === formData.category).map(i => i.type).filter(Boolean))).sort();
  }, [existingItems, formData.category, newFields.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addStockItem({
        ...formData,
        quantity: Number(formData.quantity),
        minStock: Number(formData.minStock), 
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        gst: Number(formData.gst),
      } as StockItem);
      navigate("/"); // Redirect back to dashboard
    } catch (error) {
      console.error("Error adding item:", error);
      alert("System failed to commit item to the database.");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    // FIX: Intercept mobile keyboard double-space-to-period
    if (typeof value === 'string' && value.endsWith('. ')) {
      value = value.replace(/\.\s$/g, '  ');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [fieldName]: value,
      ...(fieldName === "category" ? { type: "" } : {}) 
    }));
  };

  const handleDeleteOption = async (fieldName: string, value: string) => {
    if (!window.confirm(`Are you sure? This will permanently delete ALL items assigned to ${fieldName}: "${value}".`)) return;
    try {
      await deleteItemsByField(fieldName, value);
      setExistingItems(prev => prev.filter(item => item[fieldName as keyof StockItem] !== value));
      if (formData[fieldName as keyof typeof formData] === value) {
        setFormData(prev => ({ ...prev, [fieldName]: "" }));
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete records.");
    }
  };

  const renderField = (label: string, fieldName: keyof typeof newFields, options: string[], disabled = false) => (
    <div className="group">
      <div className="mb-2 flex justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">{label}</label>
        {newFields[fieldName] && (
          <button type="button" onClick={() => setNewFields(p => ({ ...p, [fieldName]: false }))} className="text-xs font-bold text-orange-600 hover:underline">
            Cancel
          </button>
        )}
      </div>
      {newFields[fieldName] ? (
        <input
          name={fieldName}
          placeholder={`Enter new ${label.toLowerCase()}...`}
          autoFocus
          required
          className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
          onChange={handleChange}
        />
      ) : (
        <CustomDropdown
          label={label}
          fieldName={fieldName}
          options={options}
          value={formData[fieldName]}
          onChange={handleDropdownChange}
          onDelete={handleDeleteOption}
          onNew={(f: any) => setNewFields(p => ({ ...p, [f]: true }))}
          disabled={disabled}
        />
      )}
    </div>
  );

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate("/")} className="rounded-full bg-white p-2 text-stone-400 shadow-sm ring-1 ring-stone-100 hover:text-stone-900 hover:ring-stone-200">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-stone-900 sm:text-3xl">Add New Stock</h1>
          <p className="text-sm font-medium text-stone-500">Enter item details below.</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-stone-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {renderField("Category", "category", uniqueCategories)}
              {renderField("Type", "type", availableTypes, !formData.category && !newFields.category)}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Item Name</label>
              <input name="itemName" placeholder="e.g. 12mm Clear Sheet" required className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Quantity</label>
                <input name="quantity" type="number" min="0" required className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20" onChange={handleChange} />
              </div> */}
              {/* LOGISTICS ROW */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Quantity + Unit */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Current Stock</label>
                <div className="flex gap-2">
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    required
                    className="flex-1 rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                    onChange={handleChange}
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-28 rounded-xl bg-stone-50 px-4 py-3 font-bold text-stone-600 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="count">Count</option>
                    <option value="feet">Feet</option>
                    <option value="ton">Ton</option>
                  </select>
                </div>
              </div>

              {/* Minimum Stock Alert Target */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-orange-400">Low Stock Alert At</label>
                <input
                  name="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  required
                  className="w-full rounded-xl bg-orange-50 px-4 py-3 font-bold text-orange-900 shadow-sm outline-none ring-1 ring-orange-200 focus:ring-2 focus:ring-orange-500/20"
                  onChange={handleChange}
                />
              </div>
              
              {/* Location (Keep your existing renderField call here) */}
              <div className="sm:col-span-3">
                 {renderField("Location", "location", uniqueLocations)}
              </div>
            </div>
              {renderField("Location", "location", uniqueLocations)}
            </div>

            <div className="rounded-2xl bg-orange-50/50 p-6 ring-1 ring-orange-100/50">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-orange-800">Financial Data</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Purchase Price", name: "purchasePrice", prefix: "Inr" },
                  { label: "Selling Price", name: "sellingPrice", prefix: "Inr" },
                  { label: "GST Tax", name: "gst", prefix: "%" }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-stone-400">{field.label}</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-bold text-stone-400">{field.prefix === '$' ? '$' : ''}</span>
                      <input name={field.name} type="number" step="0.01" min="0" required className={`w-full rounded-xl bg-white py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20 ${field.prefix === '$' ? 'pl-7 pr-3' : 'px-4'}`} onChange={handleChange} />
                      <span className="absolute right-3 font-bold text-stone-400">{field.prefix === '%' ? '%' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => navigate("/")} className="rounded-xl px-6 py-3 text-sm font-bold text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="rounded-xl bg-stone-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50">
                {loading ? "Committing..." : "Save Record"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}