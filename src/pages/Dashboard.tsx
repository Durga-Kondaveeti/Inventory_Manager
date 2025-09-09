// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import LowStockModal from "../components/LowStockModal";
import StockList from "../components/StockList";
import SkeletonLoader from "../components/SkeletonLoader";
import { subscribeToInventory } from "../lib/db";
import { type StockItem } from "../types";

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);

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
        console.error("Critical Sync Error - Connection to Firebase severed:", error);
        setLoading(false);
      }
    );
    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);
const lowStockItems = inventory.filter(item => item.quantity <= (item.minStock ?? 5));
  
  // Real-time multifaceted search engine
  const filteredItems = inventory.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.type.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower) // Added location to searchable fields for better utility
    );
  });

  // Determine if the user is actively hunting for an item
  const isCurrentlySearching = searchTerm.trim().length > 0;

  return (
    <Layout>
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-black tracking-tighter text-stone-900 sm:text-4xl">System Overview</h1>
      </div>

      {/* Stats Grid - Stripped down to operational essentials */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Low Stock Operational Alert Card */}
        <div 
          onClick={() => setIsLowStockModalOpen(true)}
          className="cursor-pointer group rounded-3xl bg-orange-50 p-6 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.1)] transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.2)] hover:scale-[1.02] border border-orange-100/50"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600">Low Stock Alert</h3>
            <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
          </div>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-5xl font-black text-orange-600 tracking-tighter">
              {loading ? "..." : lowStockItems.length}
            </span>
          </div>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-orange-500/80 group-hover:text-orange-600 transition-colors">
            Tap to view&rarr;
          </p>
        </div>

      </div>

      <div className="mt-12 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-stone-200/60 pb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black text-stone-900 tracking-tight">Stock</h2>
          {isAdmin && (
            <button 
              onClick={() => navigate("/add-item")}
              className="flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-200 hover:bg-black hover:shadow-xl active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4 float-left" />
              </svg>
              Add Item
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-80 transition-all duration-300 focus-within:w-full focus-within:sm:w-96">
          <input 
            type="text" 
            placeholder="Search by name, category, or aisle..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-white py-3.5 pl-11 pr-4 text-sm font-bold text-stone-700 shadow-sm outline-none ring-1 ring-stone-200 transition-all focus:ring-2 focus:ring-orange-500/30 focus:shadow-md placeholder:font-medium placeholder:text-stone-400"
          />
          <svg className={`absolute left-4 top-4 h-4 w-4 transition-colors duration-200 ${isCurrentlySearching ? 'text-orange-500' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Quick Clear Button */}
          {isCurrentlySearching && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3.5 rounded-full bg-stone-100 p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="mt-8 space-y-10">
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      ) : (
        <StockList 
          items={filteredItems} 
          onViewDetails={(item) => navigate(`/item/${item.id}`)} 
          searchTerm={searchTerm} // <--- ADD THIS LINE
        />
      )}

      {/* Floating Action Button for Mobile */}
      {isAdmin && (
        <button 
          onClick={() => navigate("/add-item")} 
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105 active:scale-95 sm:hidden"
        >
           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
        </button>
      )}

      <LowStockModal
        isOpen={isLowStockModalOpen}
        onClose={() => setIsLowStockModalOpen(false)}
        items={lowStockItems}
      />
    </Layout>
  );
}