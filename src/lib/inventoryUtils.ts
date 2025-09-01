import { type StockItem } from "../types";

export const calculateGSTAmount = (price: number, gstPercentage: number = 0): number => {
  return price * (gstPercentage / 100);
};

export const getPriceIncGST = (price: number, gstPercentage: number = 0): number => {
  return price + calculateGSTAmount(price, gstPercentage);
};

// CHANGE: Use 'en-IN' for Indian formatting (e.g., 1,50,000 instead of 150,000)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

export type GroupedInventory = Record<string, Record<string, StockItem[]>>;

export const groupInventory = (items: StockItem[]): GroupedInventory => {
  return items.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    const type = item.type || "General";
    
    if (!acc[category]) acc[category] = {};
    if (!acc[category][type]) acc[category][type] = [];
    
    acc[category][type].push(item);
    return acc;
  }, {} as GroupedInventory);
};