import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./src/screens/HomeScreen";
import CartScreen from "./src/screens/CartScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import { ProductListScreen } from "./src/screens/ProductListScreen";
import { ProductDetailScreen } from "./src/screens/ProductDetailScreen";
import { AddEditProductScreen } from "./src/screens/AddEditProductScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import { AppProvider } from "./src/context/AppContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/config/firebase";

type RootStackParamList = {
  HomeScreen: undefined;
  ProductListScreen: undefined;
  ProductDetailScreen: { productId: string };
  AddProductScreen: undefined;
  CartScreen: undefined;
  CheckoutScreen: undefined;
  FavoritesScreen: undefined;
  ProfileScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  "Ana Sayfa": undefined;
};
type RootTabParamList = {
  "Ana Sayfa": undefined;
  Ürünler: undefined;
  Sepet: undefined;
  Favoriler: undefined;
  Profilim: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const ProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProductListScreen"
      component={ProductListScreen}
      options={{ title: "Ürünler" }}
    />
    <Stack.Screen
      name="ProductDetailScreen"
      component={ProductDetailScreen}
      options={{ title: "Ürün Detayı" }}
    />
    <Stack.Screen
      name="AddProductScreen"
      component={AddEditProductScreen}
      options={{ title: "Ürün Ekle" }}
    />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CartScreen"
      component={CartScreen}
      options={{ title: "Sepet" }}
    />
    <Stack.Screen
      name="CheckoutScreen"
      component={CheckoutScreen}
      options={{ title: "Ödeme" }}
    />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FavoritesScreen"
      component={FavoritesScreen}
      options={{ title: "Favoriler" }}
    />
    <Stack.Screen
      name="ProductDetailScreen"
      component={ProductDetailScreen}
      options={{ title: "Ürün Detayı" }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ title: "Profilim" }}
    />
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{ title: "Giriş Yap" }}
    />
    <Stack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{ title: "Kayıt Ol" }}
    />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ title: "Ana Sayfa" }}
    />
  </Stack.Navigator>
);

const AuthStack = ({ setIsGuest }: { setIsGuest: (v: boolean) => void }) => (
  <Stack.Navigator>
    <Stack.Screen name="LoginScreen">
      {(props) => <LoginScreen {...props} setIsGuest={setIsGuest} />}
    </Stack.Screen>
    <Stack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{ title: "Kayıt Ol" }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === "Ana Sayfa") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Sepet") {
          iconName = focused ? "cart" : "cart-outline";
        } else if (route.name === "Favoriler") {
          iconName = focused ? "heart" : "heart-outline";
        } else if (route.name === "Ürünler") {
          iconName = focused ? "grid" : "grid-outline";
        } else if (route.name === "Profilim") {
          iconName = focused ? "person" : "person-outline";
        } else {
          iconName = "home";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#e91e63",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen
      name="Ana Sayfa"
      component={HomeStack}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Ürünler"
      component={ProductStack}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Sepet"
      component={CartStack}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Favoriler"
      component={FavoritesStack}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Profilim"
      component={ProfileStack}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isGuest, setIsGuest] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  const AuthStackWithProps = () => <AuthStack setIsGuest={setIsGuest} />;

  return (
    <AppProvider>
      <NavigationContainer>
        {isLoggedIn || isGuest ? <MainTabs /> : <AuthStackWithProps />}
      </NavigationContainer>
    </AppProvider>
  );
}
