import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../src/types/product';
import { addFavoriteProduct, removeFavoriteProduct, isProductFavorite } from '../src/services/favoriteService';

interface ProductCardProps {
  product: Product;
}

const DEFAULT_IMAGE = 'https://cdn-icons-png.flaticon.com/512/892/892458.png';

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : DEFAULT_IMAGE;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const fav = await isProductFavorite(product.id);
      setFavorite(fav);
    };
    checkFavorite();
  }, [product.id]);

  const handleFavorite = async () => {
    if (favorite) {
      await removeFavoriteProduct(product.id);
      setFavorite(false);
    } else {
      await addFavoriteProduct(product);
      setFavorite(true);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toFixed(2)} TL</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="cart-outline" size={24} color="#e91e63" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleFavorite}>
          <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={24} color="#e91e63" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 12,
  },
  button: {
    padding: 8,
  },
}); 