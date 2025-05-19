import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { Product } from "../models/Product";
import { productService } from "../services/productService";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const TagSelector = ({ items, selected, onSelect }: any) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ marginBottom: 12 }}
  >
    <TouchableOpacity
      style={[styles.modalTag, !selected && styles.modalTagSelected]}
      onPress={() => onSelect("")}
    >
      <Text
        style={[styles.modalTagText, !selected && styles.modalTagTextSelected]}
      >
        Tümü
      </Text>
    </TouchableOpacity>
    {items.map((item: string, i: number) => {
      const isSelected = selected === item;
      return (
        <TouchableOpacity
          key={i}
          style={[styles.modalTag, isSelected && styles.modalTagSelected]}
          onPress={() => onSelect(isSelected ? "" : item)}
        >
          <Text
            style={[
              styles.modalTagText,
              isSelected && styles.modalTagTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const HomeScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const allSizes = useMemo(() => {
    const raw = products.flatMap((p) => p.sizes || []).filter(Boolean);
    const numbers = [...new Set(raw.filter((s) => !isNaN(Number(s))))].sort(
      (a, b) => Number(a) - Number(b)
    );
    const letters = [...new Set(raw.filter((s) => isNaN(Number(s))))].sort(
      (a, b) => a.localeCompare(b, "tr")
    );
    return [...letters, ...numbers];
  }, [products]);

  const allColors = useMemo(
    () => [...new Set(products.flatMap((p) => p.colors || []))],
    [products]
  );

  useEffect(() => {
    (async () => {
      try {
        const list = await productService.getAllProducts();
        setProducts(list);
        setCategories([...new Set(list.map((p) => p.category))]);
      } catch (e) {
        console.error("Ürünler yüklenirken hata oluştu:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const match = (val: boolean) => val !== false;
        return (
          match(!selectedCategory || p.category === selectedCategory) &&
          match(
            p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.description.toLowerCase().includes(search.toLowerCase()) ||
              p.category.toLowerCase().includes(search.toLowerCase())
          ) &&
          match(!filterMinPrice || p.price >= parseFloat(filterMinPrice)) &&
          match(!filterMaxPrice || p.price <= parseFloat(filterMaxPrice)) &&
          match(!filterSize || p.sizes?.includes(filterSize)) &&
          match(!filterColor || p.colors?.includes(filterColor)) &&
          match(!filterCategory || p.category === filterCategory)
        );
      }),
    [
      products,
      selectedCategory,
      search,
      filterMinPrice,
      filterMaxPrice,
      filterSize,
      filterColor,
      filterCategory,
    ]
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCardShadow}>
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate("Ürünler", {
            screen: "ProductDetailScreen",
            params: { productId: item.id },
          })
        }
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.imageOverlay} />
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{item.price} TL</Text>
          </View>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading)
    return (
      <View style={styles.centered}>
        <Text>Yükleniyor...</Text>
      </View>
    );

  return (
    <LinearGradient colors={["#f8eafc", "#f5f5f5"]} style={styles.gradient}>
      {/* Arama ve Filtre */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color="#e91e63"
            style={{ marginHorizontal: 6 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Ürün, kategori veya açıklama ara..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={22} color="#e91e63" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Modanist</Text>

      {/* Kategori */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <FlatList
            data={[
              { name: "Tümü", isAll: true },
              ...categories.map((c) => ({ name: c, isAll: false })),
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => {
              const selected = item.isAll
                ? !selectedCategory
                : selectedCategory === item.name;
              return (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selected && styles.selectedCategory,
                  ]}
                  onPress={() =>
                    setSelectedCategory(item.isAll ? null : item.name)
                  }
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.selectedCategoryText,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        }
      />

      {/* Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrele</Text>

            <Text style={styles.modalLabel}>Fiyat Aralığı (TL)</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                style={styles.modalInput}
                placeholder="Min"
                keyboardType="numeric"
                value={filterMinPrice}
                onChangeText={setFilterMinPrice}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Max"
                keyboardType="numeric"
                value={filterMaxPrice}
                onChangeText={setFilterMaxPrice}
              />
            </View>

            <Text style={styles.modalLabel}>Kategori</Text>
            <TagSelector
              items={categories}
              selected={filterCategory}
              onSelect={setFilterCategory}
            />

            <Text style={styles.modalLabel}>Beden</Text>
            <TagSelector
              items={allSizes}
              selected={filterSize}
              onSelect={setFilterSize}
            />

            <Text style={styles.modalLabel}>Renk</Text>
            <TagSelector
              items={allColors}
              selected={filterColor}
              onSelect={setFilterColor}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 18,
              }}
            >
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#eee" }]}
                onPress={() => {
                  setFilterMinPrice("");
                  setFilterMaxPrice("");
                  setFilterSize("");
                  setFilterColor("");
                  setFilterCategory("");
                }}
              >
                <Text style={{ color: "#e91e63", fontWeight: "bold" }}>
                  Temizle
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#e91e63" }]}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Uygula
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

import styles from "./HomeScreen.styles";
export default HomeScreen;
