import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function createCategory(name: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'categories'), { name });
  return docRef.id;
} 