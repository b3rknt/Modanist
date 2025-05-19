import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MaskedTextInput } from "react-native-mask-text";

const CheckoutScreen = ({ navigation }: any) => {
  const { cart } = useAppContext();
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAddress(docSnap.data().address || "");
        }
      }
    };
    fetchAddress();
  }, []);

  const handlePayment = () => {
    if (!address || !cardNumber || !cardName || !expiry || !cvv) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }
    // Gerçek ödeme entegrasyonu yok(şimdilik), sadece başarı mesajı
    Alert.alert("Başarılı", "Ödemeniz başarıyla tamamlandı!", [
      { text: "Tamam", onPress: () => navigation.navigate("Ana Sayfa") },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teslimat Adresi</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Adresinizi girin"
        multiline
      />
      <Text style={styles.title}>Kredi Kartı Bilgileri</Text>
      <TextInput
        style={styles.input}
        value={cardName}
        onChangeText={setCardName}
        placeholder="Kart Üzerindeki İsim"
      />
      <MaskedTextInput
        style={styles.input}
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholder="Kart Numarası"
        keyboardType="numeric"
        mask="9999 9999 9999 9999"
        maxLength={19}
      />
      <View style={styles.row}>
        <MaskedTextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          value={expiry}
          onChangeText={setExpiry}
          placeholder="AA/YY"
          mask="99/99"
          keyboardType="numeric"
          maxLength={5}
        />
        <MaskedTextInput
          style={[styles.input, { flex: 1 }]}
          value={cvv}
          onChangeText={setCvv}
          placeholder="CVV"
          keyboardType="numeric"
          mask="999"
          maxLength={3}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Ödemeyi Tamamla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e91e63",
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#e91e63",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
