// src/pages/ItemDetails.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { type StockItem } from "../types";
import { getPriceIncGST, formatCurrency } from "../lib/inventoryUtils";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import EditItemModal from "../components/EditItemModal";

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [item, setItem] = useState<StockItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchItem = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const docRef = doc(db, "inventory", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() } as StockItem);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching item:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900"></div>
        </div>
      </Layout>
    );
  }

  if (!item) return null;

  const finalPrice = getPriceIncGST(item.sellingPrice, item.gst);

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate("/")} className="rounded-full bg-white p-2 text-stone-400 shadow-sm ring-1 ring-stone-100 hover:text-stone-900 hover:ring-stone-200">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-stone-900 sm:text-3xl">{item.itemName}</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-stone-400 mt-1">
            {item.category} / {item.type}
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-stone-100 p-6 sm:p-8 space-y-8">
        <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-6 ring-1 ring-stone-100">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Location</div>
            <div className="text-lg font-bold text-stone-700">{item.location}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Current Stock</div>
            <div className="text-4xl font-black text-stone-900">{item.quantity}</div>
            {item.quantity <= (item.minStock ?? 5) && (
              <span className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-600">
                Low Stock
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-stone-50 p-6 ring-1 ring-stone-100">
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-stone-400">Financial Overview</h3>
          <div className="space-y-4">
            {isAdmin && (
              <div className="flex justify-between border-b border-stone-200 pb-3">
                <span className="text-sm font-bold text-stone-500">Our Cost (Buy)</span>
                <span className="font-mono font-bold text-stone-400">{formatCurrency(item.purchasePrice)}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-stone-200 pb-3">
              <span className="text-sm font-bold text-stone-500">Sell (Excl. Tax)</span>
              <span className="font-mono font-bold text-stone-700">{formatCurrency(item.sellingPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-stone-900">Final Price (Inc. {item.gst || 0}% GST)</span>
              <span className="font-mono text-2xl font-black text-green-600">{formatCurrency(finalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-stone-100 px-6 py-3 text-sm font-bold text-stone-600 hover:bg-stone-200 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Item
          </button>
        </div>
      </div>

      <EditItemModal
        item={item}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchItem}
      />
    </Layout>
  );
}