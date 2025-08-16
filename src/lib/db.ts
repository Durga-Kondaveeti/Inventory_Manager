import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { type StockItem } from "../types";

const COLLECTION = "inventory";

export async function getInventory() {
  const q = query(collection(db, COLLECTION), orderBy("category"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockItem));
}

export async function addStockItem(item: Omit<StockItem, "id" | "lastUpdated">) {
  return await addDoc(collection(db, COLLECTION), {
    ...item,
    lastUpdated: serverTimestamp()
  });
}

export async function deleteStockItem(id: string) {
  const ref = doc(db, COLLECTION, id);
  return await deleteDoc(ref);
}