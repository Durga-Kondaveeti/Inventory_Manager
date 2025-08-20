import { useState, useEffect } from "react"; // Added imports
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext"; // Added import
import AddItemModal from "../components/AddItemModal"; // Added import

export default function Dashboard() {
  const { isAdmin } = useAuth(); // Check role
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Placeholder refresh function
  const handleRefresh = () => {
    console.log("Item added! We will reload data in the next phase.");
    // In Phase 9, this will actually re-fetch the table data
  };

  return (
    <Layout>
      {/* 1. Page Title Section */}
      <div className="mb-8 mt-2 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-stone-900 sm:text-4xl">
            Overview
          </h1>
          <p className="mt-2 text-stone-500 font-medium">
            Manage your inventory and stock levels.
          </p>
        </div>
        
        {/* ACTION BUTTON - ONLY FOR ADMINS */}
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            + Add New Item
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="group rounded-3xl bg-white p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Stock</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-stone-900">1,240</span>
            <span className="text-sm font-bold text-green-500">Units</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group rounded-3xl bg-white p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Value</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-stone-900">$45.2k</span>
            <span className="text-sm font-bold text-stone-400">USD</span>
          </div>
        </div>

        <div className="group rounded-3xl bg-orange-50 p-6 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.1)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.2)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600">Low Stock Alert</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-orange-600">3</span>
            <span className="text-sm font-bold text-orange-400">Items</span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Live Inventory</h2>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search stock..." 
              className="w-64 rounded-xl bg-white py-2 pl-4 pr-10 text-sm font-bold text-stone-700 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>

        <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50/50">
          <p className="font-bold text-stone-400">No data available yet.</p>
          <p className="text-xs text-stone-400">Import from Tally or add manually.</p>
        </div>
      </div>
      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </Layout>
  );
}