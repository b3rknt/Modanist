import React from "react";
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
import { useEffect, useState } from "react";

const CartScreen = ({ navigation }: any) => {
  const { cart, removeFromCart, increaseCartItem, decreaseCartItem } =
    useAppContext();
  const [stockMap, setStockMap] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Her sepetteki ürün için stoğu çek
    const fetchStocks = async () => {
      const map: { [key: string]: number } = {};
      for (const item of cart) {
        // Aynı ürün, beden, renk kombinasyonu için anahtar
        const key = `${item.productId}_${item.size}_${item.color}`;
        // Ürünü çek
        const product = await productService.getProductById(item.productId);
        map[key] = product?.stock || 1;
      }
      setStockMap(map);
    };
    fetchStocks();
  }, [cart]);

  const renderItem = ({ item }: any) => {
    const key = `${item.productId}_${item.size}_${item.color}`;
    const maxStock = stockMap[key] ?? 99;
    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>
            Beden: {item.size} Renk: {item.color}
          </Text>
          <Text style={styles.price}>{item.price} TL</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 4,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 6,
                borderWidth: 1,
                borderColor: "#e91e63",
                borderRadius: 6,
                marginRight: 8,
              }}
              onPress={() =>
                decreaseCartItem(item.productId, item.size, item.color)
              }
              disabled={item.quantity <= 1}
            >
              <Text
                style={{
                  color: item.quantity <= 1 ? "#ccc" : "#e91e63",
                  fontSize: 18,
                }}
              >
                -
              </Text>
            </TouchableOpacity>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", marginHorizontal: 4 }}
            >
              {item.quantity}
            </Text>
            <TouchableOpacity
              style={{
                padding: 6,
                borderWidth: 1,
                borderColor: "#e91e63",
                borderRadius: 6,
                marginLeft: 8,
              }}
              onPress={() =>
                increaseCartItem(
                  item.productId,
                  item.size,
                  item.color,
                  maxStock
                )
              }
              disabled={item.quantity >= maxStock}
            >
              <Text
                style={{
                  color: item.quantity >= maxStock ? "#ccc" : "#e91e63",
                  fontSize: 18,
                }}
              >
                +
              </Text>
            </TouchableOpacity>
            <Text style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>
              (Stok: {maxStock})
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              removeFromCart(item.productId, item.size, item.color)
            }
          >
            <Text style={styles.remove}>Kaldır</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingLimit = 300;
  const shippingFee = total >= freeShippingLimit ? 0 : 50;
  const grandTotal = total + shippingFee;

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Sepetinizde henüz ürün bulunmuyor.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
      />
      <View style={styles.summaryContainer}>
        {shippingFee > 0 && (
          <Text
            style={{ color: "#e91e63", fontWeight: "bold", marginBottom: 8 }}
          >
            Ücretsiz kargo için {(300 - total).toFixed(2)} TL'lik daha ürün
            ekleyin!
          </Text>
        )}
        <Text style={styles.totalText}>
          Ürünler Toplamı: {total.toFixed(2)} TL
        </Text>
        <Text style={styles.totalText}>
          Kargo: {shippingFee === 0 ? "Ücretsiz" : `${shippingFee} TL`}{" "}
          {shippingFee === 0 && (
            <Text style={{ color: "#2ecc71" }}>(300 TL ve üzeri ücretsiz)</Text>
          )}
        </Text>
        <Text style={[styles.totalText, { fontSize: 20 }]}>
          Genel Toplam: {grandTotal.toFixed(2)} TL
        </Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("CheckoutScreen")}
        >
          <Text style={styles.checkoutButtonText}>Ödemeye Geç</Text>
        </TouchableOpacity>
      </View>
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
  detail: {
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
  summaryContainer: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: "#e91e63",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartScreen;