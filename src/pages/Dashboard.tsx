import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import AddItemModal from "../components/AddItemModal";
import LowStockModal from "../components/LowStockModal";
import EditItemModal from "../components/EditItemModal"; // IMPORTED
import StockList from "../components/StockList";
import { getInventory } from "../lib/db";
import { type StockItem } from "../types";

export default function Dashboard() {
  const { isAdmin } = useAuth();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const [inventory, setInventory] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => { fetchInventory(); }, []);

  const totalStock = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = inventory.reduce((acc, item) => {
    const price = isAdmin ? item.purchasePrice : item.sellingPrice;
    return acc + (item.quantity * price);
  }, 0);
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
      
      {/* 1. Header Section */}
      <div className="mb-8 mt-2 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-stone-900 sm:text-4xl">Overview</h1>
          <p className="mt-2 text-stone-500 font-medium">{inventory.length} items in stock.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsAddModalOpen(true)} className="hidden sm:block rounded-2xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95">
            + Add New Item
          </button>
        )}
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Total Stock */}
        <div className="group rounded-3xl bg-white p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Stock</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-stone-900">{loading ? "..." : totalStock.toLocaleString()}</span>
            <span className="text-sm font-bold text-green-500">Units</span>
          </div>
        </div>
        {/* Total Value */}
        {isAdmin && (
        <div className="group rounded-3xl bg-white p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">{isAdmin ? "Inventory Value (Cost)" : "Inventory Value (Retail)"}</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-stone-900">{loading ? "..." : `$${(totalValue / 1000).toFixed(1)}k`}</span>
            <span className="text-sm font-bold text-stone-400">INR</span>
          </div>
        </div>
        )}


        {/* Low Stock */}
        <div onClick={() => setIsLowStockModalOpen(true)} className="cursor-pointer group rounded-3xl bg-orange-50 p-6 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.1)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.2)] hover:scale-[1.02]">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600">Low Stock Alert</h3>
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-orange-600">{loading ? "..." : lowStockItems.length}</span>
            <span className="text-sm font-bold text-orange-400">Items</span>
          </div>
          <p className="mt-2 text-[10px] font-bold text-orange-400/70">Click to view details</p>
        </div>
      </div>

      {/* 3. Search Bar */}
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
          <svg className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 4. DATA LIST - PASS THE EDIT HANDLER */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-orange-500"></div>
        </div>
      ) : (
        <StockList 
          items={filteredItems} 
          onEdit={(item) => setEditingItem(item)} 
        />
      )}

      {/* 5. Modals */}
      {isAdmin && (
        <button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-white shadow-2xl sm:hidden">
           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      )}

     <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchInventory}
        existingItems={inventory} 
      />

      <LowStockModal
        isOpen={isLowStockModalOpen}
        onClose={() => setIsLowStockModalOpen(false)}
        items={lowStockItems}
      />

      {/* ADDED EDIT MODAL */}
      <EditItemModal
        item={editingItem}
        isOpen={!!editingItem} 
        onClose={() => setEditingItem(null)}
        onSuccess={fetchInventory}
      />
    </Layout>
  );
}