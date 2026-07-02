import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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

const sampleArticles = [
  {
    title: "Pengaruh Teknologi AI dalam Pendidikan",
    category: "Teknologi",
    status: "Published"
  },
  {
    title: "Meningkatkan Kesadaran Kesehatan Mental Mahasiswa",
    category: "Kesehatan",
    status: "Pending Review"
  },
  {
    title: "Strategi Menulis Karya Ilmiah yang Tembus Jurnal Internasional",
    category: "Akademik",
    status: "Draft"
  },
  {
    title: "Pengembangan Kurikulum Berbasis Kampus Merdeka",
    category: "Pendidikan",
    status: "Published"
  },
  {
    title: "Dampak Perubahan Iklim terhadap Pertanian Lokal",
    category: "Lingkungan",
    status: "Published"
  },
  {
    title: "Panduan Mengajukan Beasiswa Luar Negeri",
    category: "Akademik",
    status: "Draft"
  },
  {
    title: "Peran Organisasi Mahasiswa dalam Membangun Soft Skills",
    category: "Kemahasiswaan",
    status: "Pending Review"
  },
  {
    title: "Inovasi Energi Terbarukan di Lingkungan Kampus",
    category: "Teknologi",
    status: "Published"
  },
  {
    title: "Pentingnya Literasi Keuangan Bagi Mahasiswa Rantau",
    category: "Ekonomi",
    status: "Published"
  },
  {
    title: "Mengatasi Prokrastinasi Selama Penyusunan Skripsi",
    category: "Psikologi",
    status: "Draft"
  }
];

async function seedData() {
  try {
    console.log(`Logging in user ${ADMIN_EMAIL}...`);
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    const user = userCredential.user;
    
    console.log(`User UID: ${user.uid}. Seeding ${sampleArticles.length} articles...`);
    
    const articlesRef = collection(db, "articles");
    
    for (const article of sampleArticles) {
      await addDoc(articlesRef, {
        title: article.title,
        category: article.category,
        status: article.status,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added article: ${article.title}`);
    }

    console.log("✅ Seed data inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
}

seedData();
