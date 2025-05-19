import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation, setIsGuest }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifre girin.');
      return;
    }
    if (!/^\S+@gmail\.com$/.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir Gmail adresi girin. (ör: örnek@gmail.com)');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Başarılı', 'Giriş başarılı!');
      // Kullanıcı giriş yaptıktan sonra yönlendirme
      // Burada 'Profilim' ekranına yönlendirme yapılıyor.
      const parentNav = navigation.getParent && navigation.getParent();
      if (parentNav) {
        parentNav.navigate('Profilim');
      }
    } catch (error: any) {
      Alert.alert('Giriş Hatası', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Modanist</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Giriş Yap</Text>
        <View style={styles.underline} />
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#e91e63" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#e91e63" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Hesabın yok mu? <Text style={{ textDecorationLine: 'underline' }}>Kayıt ol</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsGuest && setIsGuest(true)}>
          <Text style={[styles.link, { color: '#888', marginTop: 8 }]}>Giriş yapmadan devam et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  appName: {
    fontSize: 20,
    color: '#e91e63',
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  card: {
    width: '100%',
    maxWidth: 370,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 8,
    textAlign: 'center',
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: '#e91e63',
    borderRadius: 2,
    marginBottom: 24,
    alignSelf: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
    paddingHorizontal: 8,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  button: {
    width: '100%',
    backgroundColor: '#e91e63',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  link: {
    color: '#e91e63',
    marginTop: 18,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoginScreen; 