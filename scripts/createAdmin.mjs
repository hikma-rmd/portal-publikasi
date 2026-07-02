import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^=]+)\s*=\s*(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyB-EitcLkO-Gm9ObJ6hBEFsOurgafUhwA4",
  authDomain: "portal-publikasi-organisasi.firebaseapp.com",
  projectId: "portal-publikasi-organisasi",
  storageBucket: "portal-publikasi-organisasi.firebasestorage.app",
  messagingSenderId: "516199087734",
  appId: "1:516199087734:web:1feae60006795960d92957"
};

console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "admin@university.edu";
const ADMIN_PASSWORD = "adminpassword123";

async function createAdmin() {
  try {
    console.log(`Logging in user ${ADMIN_EMAIL}...`);
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    const user = userCredential.user;

    console.log(`User created with UID: ${user.uid}. Setting admin role in Firestore...`);
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
      email: ADMIN_EMAIL,
      role: "admin",
      createdAt: serverTimestamp()
    });

    console.log("✅ Admin account created successfully!");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
