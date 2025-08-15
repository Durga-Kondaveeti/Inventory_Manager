export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface StockItem {
  id?: string;
  
  // 1. Hierarchy
  category: string;      
  type: string;        
  itemName: string;      
  
  // 2. Inventory Data
  quantity: number;
  location: string;      
  
  purchasePrice: number; 
  sellingPrice: number;  
  
  lastUpdated: any;     
}

export const canViewFinancials = (role: UserRole) => role === 'admin';
export const canDeleteItems = (role: UserRole) => role === 'admin';