import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, orderBy, serverTimestamp,onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { type StockItem } from "../types";
import { type FirestoreError } from "firebase/firestore";
const COLLECTION = "inventory";


export function subscribeToInventory(
  onUpdate: (items: StockItem[]) => void, 
  onError: (error: FirestoreError) => void
) {
  const q = query(collection(db, COLLECTION), orderBy("category"));

  // onSnapshot sets up a permanent connection
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as StockItem));
    
    onUpdate(items);
  }, onError);

  return unsubscribe;
}

export async function addStockItem(item: Omit<StockItem, "id" | "lastUpdated">) {
  return await addDoc(collection(db, COLLECTION), {
    ...item,
    lastUpdated: serverTimestamp()
  });
}

export async function updateStockItem(id: string, updates: Partial<StockItem>) {
  const ref = doc(db, COLLECTION, id);
  return await updateDoc(ref, {
    ...updates,
    lastUpdated: serverTimestamp()
  });
}

export async function deleteStockItem(id: string) {
  const ref = doc(db, COLLECTION, id);
  return await deleteDoc(ref);
}