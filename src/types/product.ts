export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'tshirt' | 'pants' | 'dress' | 'shoes' | 'accessories';
  size: string[];
  color: string[];
  images: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
} 