import { createCategory } from './categoryService';
import { createProduct } from './productService';
import { Product } from '../types/product';
import { ProductFormData } from '../models/Product';

export const addSampleData = async () => {
  // Kategoriler
  const categories = [
    { name: 'Tişört', key: 'tshirt' },
    { name: 'Pantolon', key: 'pants' },
    { name: 'Elbise', key: 'dress' },
    { name: 'Ayakkabı', key: 'shoes' },
    { name: 'Aksesuar', key: 'accessories' }
  ];

  const categoryIds: { [key: string]: string } = {};

  // Kategoriler
  for (const cat of categories) {
    const id = await createCategory(cat.name);
    categoryIds[cat.key] = id;
  }

  const now = new Date();

  const tshirts = Array.from({ length: 10 }, (_, i) => ({
    name: `Basic Tişört ${i + 1}`,
    description: 'Pamuklu, rahat kesim tişört.',
    price: 99.99 + i * 10,
    category: 'tshirt',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beyaz', 'Siyah', 'Mavi', 'Kırmızı'],
    imageUrl: '',
    stock: 50 - i,
    createdAt: now,
    updatedAt: now
  }));
  const pants = Array.from({ length: 10 }, (_, i) => ({
    name: `Kot Pantolon ${i + 1}`,
    description: 'Modern kesim kot pantolon.',
    price: 199.99 + i * 15,
    category: 'pants',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Mavi', 'Siyah', 'Gri'],
    imageUrl: '',
    stock: 30 - i,
    createdAt: now,
    updatedAt: now
  }));
  const dresses = Array.from({ length: 10 }, (_, i) => ({
    name: `Yazlık Elbise ${i + 1}`,
    description: 'Renkli, hafif kumaşlı yazlık elbise.',
    price: 299.99 + i * 20,
    category: 'dress',
    sizes: ['S', 'M', 'L'],
    colors: ['Çiçekli', 'Kırmızı', 'Mavi'],
    imageUrl: '',
    stock: 20 - i,
    createdAt: now,
    updatedAt: now
  }));
  const shoes = Array.from({ length: 10 }, (_, i) => ({
    name: `Spor Ayakkabı ${i + 1}`,
    description: 'Günlük kullanıma uygun spor ayakkabı.',
    price: 399.99 + i * 25,
    category: 'shoes',
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Siyah', 'Beyaz', 'Gri'],
    imageUrl: '',
    stock: 40 - i,
    createdAt: now,
    updatedAt: now
  }));
  const accessories = Array.from({ length: 10 }, (_, i) => ({
    name: `Aksesuar ${i + 1}`,
    description: 'Şık ve kullanışlı aksesuar.',
    price: 49.99 + i * 5,
    category: 'accessories',
    sizes: ['Standart'],
    colors: ['Siyah', 'Kahverengi', 'Gri'],
    imageUrl: '',
    stock: 100 - i * 2,
    createdAt: now,
    updatedAt: now
  }));

  const products: ProductFormData[] = [
    ...tshirts,
    ...pants,
    ...dresses,
    ...shoes,
    ...accessories
  ];

  // Ürünleri eklemek için
  for (const product of products) {
    await createProduct(product);
  }
}; 