import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import AddItemModal from "../components/AddItemModal";
import StockList from "../components/StockList"; 
import { getInventory } from "../lib/db"; 
import { type StockItem } from "../types";

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data State
  const [inventory, setInventory] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Function to load data from Firebase
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error("Failed to load inventory", error);
    }
    setLoading(false);
  };

  // Load data on first render
  useEffect(() => {
    fetchInventory();
  }, []);

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
      <div className="mb-8 mt-2 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-stone-900 sm:text-4xl">
            Overview
          </h1>
          <p className="mt-2 text-stone-500 font-medium">
            {inventory.length} items in stock.
          </p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            + Add New Item
          </button>
        )}
      </div>

      
      <div className="mt-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-stone-900">Live Inventory</h2>
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search category, type, or item..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-white py-3 pl-10 pr-4 text-sm font-bold text-stone-700 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
          />
          {/* Search Icon */}
          <svg className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 4. The Data List */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-orange-500"></div>
        </div>
      ) : (
        <StockList items={filteredItems} />
      )}

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchInventory} 
      />
    </Layout>
  );
}