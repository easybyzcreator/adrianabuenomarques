import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  onSnapshot, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5UDpq_1rnFq98fzbt2rVP5-74S00z5Io",
  authDomain: "ld-adriana-bueno.firebaseapp.com",
  projectId: "ld-adriana-bueno",
  storageBucket: "ld-adriana-bueno.firebasestorage.app",
  messagingSenderId: "29645065279",
  appId: "1:29645065279:web:bc7a8b9cb34e439792fc8a",
  measurementId: "G-G76PFDD5P7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Sign in anonymously for secure operation
export async function authenticateAnonymously() {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Erro na autenticação anônima:", error);
    }
  }
}

// Global default password if not set in DB
export const DEFAULT_PASSWORD_FALLBACK = "1306";

// Helpers to track data
export async function trackClick(canal: string, tipo: "whatsapp" | "instagram" | "email" | "maps" | "facebook") {
  try {
    await addDoc(collection(db, "cliques"), {
      canal,
      tipo,
      dataHora: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao registrar clique:", error);
  }
}

export async function saveTriagem(triagem: {
  nome: string;
  relacao: string;
  email: string;
  telefone: string;
  mensagem: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "triagens"), {
      ...triagem,
      dataHora: new Date().toISOString(),
      status: "pendente",
      valorFaturamento: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar triagem:", error);
    throw error;
  }
}
