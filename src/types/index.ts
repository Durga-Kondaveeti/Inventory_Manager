// src/types/index.ts
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface StockItem {
  id?: string;
  category: string;
  type: string;
  location: string;
  itemName: string;
  
  quantity: number;
  unit: string; // NEW: ton, feet, count
  minStock: number; // NEW: For low stock alert
  
  purchasePrice: number;
  sellingPrice: number;
  gst: number;
  
  lastUpdated: any;
}