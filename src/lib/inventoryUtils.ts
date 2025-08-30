import { type StockItem } from "../types";
// GST calucation
export const calculateGSTAmount = (price: number, gstPercentage: number = 0): number => {
  return price * (gstPercentage / 100);
};

export const getPriceIncGST = (price: number, gstPercentage: number = 0): number => {
  return price + calculateGSTAmount(price, gstPercentage);
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// data Transformation logic
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