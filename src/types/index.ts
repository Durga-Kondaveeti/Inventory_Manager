
export interface UserProfile {
  uid: string;         
  email: string;
  role: 'admin' | 'user'; 
  name?: string;
}

export interface StockItem {
  id?: string;             
  itemName: string;        
  sku?: string;            
  purchasePrice: number;   
  sellingPrice: number;    
  quantity: number;        
  location: string;        
  lastUpdated: Date;       
}