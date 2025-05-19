const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} = require("firebase/firestore");

require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    name: "Erkek Tişört",
    description: "Pamuklu siyah tişört",
    price: 129.99,
    category: "Tişört",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Erkek+Tişört",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Siyah", "Beyaz"],
    stock: 20,
  },
  {
    name: "Kadın Elbise",
    description: "Şık siyah elbise",
    price: 299.99,
    category: "Elbise",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Kadın+Elbise",
    sizes: ["S", "M", "L"],
    colors: ["Siyah"],
    stock: 15,
  },
  {
    name: "Unisex Hoodie",
    description: "Kapüşonlu sweatshirt",
    price: 199.99,
    category: "Sweatshirt",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Hoodie",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gri", "Siyah"],
    stock: 25,
  },
  {
    name: "Kadın Bluz",
    description: "Rahat beyaz bluz",
    price: 149.99,
    category: "Bluz",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Kadın+Bluz",
    sizes: ["S", "M", "L"],
    colors: ["Beyaz", "Pembe"],
    stock: 18,
  },
  {
    name: "Erkek Gömlek",
    description: "Klasik mavi gömlek",
    price: 179.99,
    category: "Gömlek",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Erkek+Gömlek",
    sizes: ["M", "L", "XL"],
    colors: ["Mavi"],
    stock: 12,
  },
  {
    name: "Kadın Ceket",
    description: "Şık siyah ceket",
    price: 399.99,
    category: "Ceket",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Kadın+Ceket",
    sizes: ["S", "M", "L"],
    colors: ["Siyah"],
    stock: 10,
  },
  {
    name: "Unisex Şort",
    description: "Rahat yazlık şort",
    price: 89.99,
    category: "Şort",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Şort",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Lacivert", "Gri"],
    stock: 30,
  },
  {
    name: "Kadın Etek",
    description: "Diz boyu etek",
    price: 159.99,
    category: "Etek",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Kadın+Etek",
    sizes: ["S", "M", "L"],
    colors: ["Kırmızı", "Siyah"],
    stock: 14,
  },
  {
    name: "Erkek Mont",
    description: "Kışlık kalın mont",
    price: 499.99,
    category: "Mont",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Erkek+Mont",
    sizes: ["M", "L", "XL"],
    colors: ["Siyah", "Kahverengi"],
    stock: 8,
  },
  {
    name: "Unisex Spor Ayakkabı",
    description: "Rahat spor ayakkabı",
    price: 249.99,
    category: "Ayakkabı",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Spor+Ayakkabı",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
    colors: ["Beyaz", "Siyah"],
    stock: 22,
  },
];

async function addProducts() {
  for (const product of products) {
    await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`${product.name} eklendi.`);
  }
  console.log("Tüm ürünler başarıyla eklendi!");
}

addProducts();
