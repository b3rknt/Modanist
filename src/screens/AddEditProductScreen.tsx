import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ProductFormData } from "../models/Product";
import { productService } from "../services/productService";
import styles from "../screens/AddEditProductScreen.styles";

const initialForm: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "",
  imageUrl: "",
  sizes: [],
  colors: [],
  stock: 0,
};

const TagInput = ({
  label,
  value,
  onChange,
  tags,
  onAdd,
  onRemove,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  tags: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}) => (
  <View style={{ marginVertical: 10 }}>
    <Text style={styles.label}>{label} *</Text>
    <View style={styles.tagInputContainer}>
      <TextInput
        style={[styles.input, styles.tagInput]}
        value={value}
        onChangeText={onChange}
        placeholder={`${label.toLowerCase()} giriniz`}
      />
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={styles.addButtonText}>Ekle</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tag}
          onPress={() => onRemove(index)}
        >
          <Text style={styles.tagText}>{tag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export const AddEditProductScreen = ({ route, navigation }: any) => {
  const { productId } = route.params || {};
  const [formData, setFormData] = useState<ProductFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    if (productId) loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const product = await productService.getProductById(productId);
      if (product) setFormData(product);
    } catch (e) {
      console.error("Ürün yüklenirken hata oluştu:", e);
      Alert.alert("Hata", "Ürün detayları yüklenemedi");
    }
  };

  const validateForm = () => {
    const {
      name,
      description,
      category,
      imageUrl,
      price,
      stock,
      sizes,
      colors,
    } = formData;
    if (!name || !description || !category || !imageUrl) {
      Alert.alert("Hata", "Lütfen tüm zorunlu alanları doldurun");
      return false;
    }
    if (price <= 0) {
      Alert.alert("Hata", "Fiyat 0'dan büyük olmalıdır");
      return false;
    }
    if (stock < 0) {
      Alert.alert("Hata", "Stok negatif olamaz");
      return false;
    }
    if (sizes.length === 0) {
      Alert.alert("Hata", "Lütfen en az bir beden ekleyin");
      return false;
    }
    if (colors.length === 0) {
      Alert.alert("Hata", "Lütfen en az bir renk ekleyin");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (productId) {
        await productService.updateProduct(productId, formData);
      } else {
        await productService.createProduct(formData);
      }
      Alert.alert(
        "Başarılı",
        productId ? "Ürün güncellendi" : "Ürün oluşturuldu"
      );
      navigation.goBack();
    } catch (e) {
      console.error("Ürün kaydedilirken hata oluştu:", e);
      Alert.alert("Hata", "Ürün kaydedilemedi");
    } finally {
      setLoading(false);
    }
  };

  const updateListField = (field: "sizes" | "colors", value: string) => {
    if (!value.trim()) return;
    if (formData[field].includes(value.trim())) return; // Aynı değeri tekrar ekleme
    setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
    if (field === "sizes") setSizeInput("");
    else setColorInput("");
  };

  const removeFromList = (field: "sizes" | "colors", index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        {[
          { label: "İsim", key: "name", numeric: false, multiline: false },
          {
            label: "Açıklama",
            key: "description",
            numeric: false,
            multiline: true,
          },
          { label: "Fiyat", key: "price", numeric: true, multiline: false },
          {
            label: "Kategori",
            key: "category",
            numeric: false,
            multiline: false,
          },
          {
            label: "Resim URL'si",
            key: "imageUrl",
            numeric: false,
            multiline: false,
          },
          { label: "Stok", key: "stock", numeric: true, multiline: false },
        ].map(({ label, key, numeric, multiline }) => (
          <View key={key} style={{ marginBottom: 15 }}>
            <Text style={styles.label}>{label} *</Text>
            <TextInput
              style={[styles.input, multiline && styles.textArea]}
              value={
                key === "price" || key === "stock"
                  ? formData[key as keyof ProductFormData].toString()
                  : (formData[key as keyof ProductFormData] as string)
              }
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  [key]: numeric ? parseFloat(text) || 0 : text,
                } as ProductFormData)
              }
              placeholder={`${label.toLowerCase()} giriniz`}
              keyboardType={numeric ? "numeric" : "default"}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
            />
          </View>
        ))}

        <TagInput
          label="Bedenler"
          value={sizeInput}
          onChange={setSizeInput}
          tags={formData.sizes}
          onAdd={() => updateListField("sizes", sizeInput)}
          onRemove={(i) => removeFromList("sizes", i)}
        />

        <TagInput
          label="Renkler"
          value={colorInput}
          onChange={setColorInput}
          tags={formData.colors}
          onAdd={() => updateListField("colors", colorInput)}
          onRemove={(i) => removeFromList("colors", i)}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading
              ? "Kaydediliyor..."
              : productId
              ? "Ürünü Güncelle"
              : "Ürün Ekle"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
