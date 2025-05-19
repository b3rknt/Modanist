import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { productService } from "../services/productService";
import { Product } from "../models/Product";

const FavoritesScreen = ({ navigation }: any) => {
  const { favorites, toggleFavorite } = useAppContext();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      const products: Product[] = [];
      for (const id of favorites) {
        const product = await productService.getProductById(id);
        if (product) products.push(product);
      }
      setFavoriteProducts(products);
      setLoading(false);
    };
    fetchFavorites();
  }, [favorites]);

  const renderItem = ({ item }: { item: Product }) => {
    const { id, ...productData } = item;
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate("ProductDetailScreen", { productId: id })
        }
      >
        <Image source={{ uri: productData.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{productData.name}</Text>
          <Text style={styles.category}>{productData.category}</Text>
          <Text style={styles.price}>{productData.price} TL</Text>
          <TouchableOpacity onPress={() => toggleFavorite(id)}>
            <Text style={styles.remove}>Favorilerden Kaldır</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Henüz favori ürününüz bulunmuyor.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    color: "#2ecc71",
    marginBottom: 2,
  },
  remove: {
    color: "#e91e63",
    fontWeight: "bold",
    marginTop: 2,
    fontSize: 13,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 32,
  },
});

export default FavoritesScreen;
