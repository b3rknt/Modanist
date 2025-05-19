import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    address: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as any);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfile({ firstName: '', lastName: '', address: '' });
    } catch (error: any) {
      Alert.alert('Çıkış Hatası', error.message);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), profile);
      setEditMode(false);
      Alert.alert('Başarılı', 'Profil güncellendi!');
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  if (loading) {
    return <View style={styles.container}><Text>Yükleniyor...</Text></View>;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profilim</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilim</Text>
      <Text style={styles.label}>E-posta:</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.label}>Ad:</Text>
      <TextInput
        style={styles.input}
        value={profile.firstName}
        onChangeText={text => setProfile({ ...profile, firstName: text })}
        editable={editMode}
        placeholder="Adınız"
      />
      <Text style={styles.label}>Soyad:</Text>
      <TextInput
        style={styles.input}
        value={profile.lastName}
        onChangeText={text => setProfile({ ...profile, lastName: text })}
        editable={editMode}
        placeholder="Soyadınız"
      />
      <Text style={styles.label}>Adres:</Text>
      <TextInput
        style={styles.input}
        value={profile.address}
        onChangeText={text => setProfile({ ...profile, address: text })}
        editable={editMode}
        placeholder="Adresiniz"
      />
      {editMode ? (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
          <Text style={styles.buttonText}>Profili Düzenle</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#aaa' }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  input: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#e91e63',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 