import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Product } from '../models/Product';
import { productService } from '../services/productService';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { favorites, toggleFavorite, addToCart } = useAppContext();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const productData = await productService.getProductById(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = favorites.includes(productId);

  const handleToggleFavorite = () => {
    toggleFavorite(productId);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert('Uyarı', 'Lütfen beden ve renk seçiniz.');
      return;
    }
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });
    Alert.alert('Başarılı', 'Ürün sepete eklendi!');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Ürün detayları yükleniyor...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Ürün bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.favoriteIcon} onPress={handleToggleFavorite}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={32}
          color={isFavorite ? '#e91e63' : '#aaa'}
        />
      </TouchableOpacity>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price} TL</Text>
        <Text style={styles.category}>Kategori: {product.category}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mevcut Bedenler</Text>
          <View style={styles.tagsContainer}>
            {product.sizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tag, selectedSize === size && styles.selectedTag]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.tagText, selectedSize === size && styles.selectedTagText]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mevcut Renkler</Text>
          <View style={styles.tagsContainer}>
            {product.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tag, selectedColor === color && styles.selectedTag]}
                onPress={() => setSelectedColor(color)}
              >
                <Text style={[styles.tagText, selectedColor === color && styles.selectedTagText]}>{color}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stok</Text>
          <Text style={styles.stock}>{product.stock} adet mevcut</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.cartButtonText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#2ecc71',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTag: {
    backgroundColor: '#e91e63',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTagText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    padding: 16,
  },
  cartButton: {
    backgroundColor: '#e91e63',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  cartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 