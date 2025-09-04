// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // NEW IMPORT
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import LowStockModal from "../components/LowStockModal";
import EditItemModal from "../components/EditItemModal";
import ItemDetailsModal from "../components/ItemDetailsModal";
import StockList from "../components/StockList";
import SkeletonLoader from "../components/SkeletonLoader";
import { subscribeToInventory } from "../lib/db";
import { type StockItem } from "../types";

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate(); // ADD NAVIGATE
  
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [viewingItem, setViewingItem] = useState<StockItem | null>(null);

  const [inventory, setInventory] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToInventory(
      (data) => {
        setInventory(data);
        setLoading(false);
      },
      (error) => {
        console.error("Sync Error:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const lowStockItems = inventory.filter(item => item.quantity < 10);
  
  const filteredItems = inventory.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.type.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-black tracking-tighter text-stone-900 sm:text-4xl">Overview</h1>
        <p className="mt-2 text-stone-500 font-medium">{inventory.length} items across all categories.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="group rounded-3xl bg-white p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Inventory Breakdown</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(
              inventory.reduce((acc, item) => {
                const cat = item.category || "Uncategorized";
                acc[cat] = (acc[cat] || 0) + item.quantity;
                return acc;
              }, {} as Record<string, number>)
            ).map(([cat, count]) => (
              <div key={cat} className="flex justify-between items-center border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                <span className="font-bold text-stone-700">{cat}</span>
                <span className="font-black text-stone-900">{count} <span className="text-[10px] text-stone-400 font-normal">units</span></span>
              </div>
            ))}
            {inventory.length === 0 && <p className="text-sm text-stone-400 italic">No items yet.</p>}
          </div>
        </div>

        <div 
          onClick={() => setIsLowStockModalOpen(true)}
          className="cursor-pointer group rounded-3xl bg-orange-50 p-6 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.1)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.2)] hover:scale-[1.02]"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600">Low Stock Alert</h3>
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-orange-600">
              {loading ? "..." : lowStockItems.length}
            </span>
            <span className="text-sm font-bold text-orange-400">Items</span>
          </div>
          <p className="mt-2 text-[10px] font-bold text-orange-400/70">Click to view details</p>
        </div>
      </div>

      <div className="mt-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-stone-900">Live Inventory</h2>
          {isAdmin && (
            <button 
              onClick={() => navigate("/add-item")} // REDIRECTS TO PAGE
              className="flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search catalog..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-white py-3 pl-10 pr-4 text-sm font-bold text-stone-700 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
          />
          <svg className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 space-y-10">
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      ) : (
        <StockList 
          items={filteredItems} 
          onViewDetails={(item) => setViewingItem(item)} 
        />
      )}

      {/* Mobile Add Button */}
      {isAdmin && (
        <button onClick={() => navigate("/add-item")} className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-white shadow-2xl sm:hidden">
           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      )}

      {/* REMOVED AddItemModal component entirely */}

      <LowStockModal
        isOpen={isLowStockModalOpen}
        onClose={() => setIsLowStockModalOpen(false)}
        items={lowStockItems}
      />

      <ItemDetailsModal
        item={viewingItem}
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        onEdit={(item) => setEditingItem(item)} 
      />

      <EditItemModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSuccess={() => {}}
      />
    </Layout>
  );
}