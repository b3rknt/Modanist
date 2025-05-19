import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

const FAVORITES_KEY = 'FAVORITE_PRODUCTS';

export const getFavoriteProducts = async (): Promise<Product[]> => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const addFavoriteProduct = async (product: Product) => {
  const favorites = await getFavoriteProducts();
  if (!favorites.find((p: Product) => p.id === product.id)) {
    favorites.push(product);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavoriteProduct = async (productId: string) => {
  let favorites = await getFavoriteProducts();
  favorites = favorites.filter((p: Product) => p.id !== productId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const isProductFavorite = async (productId: string): Promise<boolean> => {
  const favorites = await getFavoriteProducts();
  return favorites.some((p: Product) => p.id === productId);
}; 