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
    category: "akademik",
    documentType: "pengumuman",
    status: "Published"
  },
  {
    title: "Meningkatkan Kesadaran Kesehatan Mental Mahasiswa",
    category: "kemahasiswaan",
    documentType: "pengumuman",
    status: "Pending Review"
  },
  {
    title: "LPJ Kegiatan Bakti Sosial BEM",
    category: "event",
    documentType: "lpj",
    status: "Published"
  },
  {
    title: "Pengembangan Kurikulum Berbasis Kampus Merdeka",
    category: "akademik",
    documentType: "pengumuman",
    status: "Published"
  },
  {
    title: "LPJ Seminar Nasional Teknologi",
    category: "event",
    documentType: "lpj",
    status: "Draft"
  },
  {
    title: "Panduan Mengajukan Beasiswa Luar Negeri",
    category: "beasiswa",
    documentType: "pengumuman",
    status: "Draft"
  },
  {
    title: "Peran Organisasi Mahasiswa dalam Membangun Soft Skills",
    category: "kemahasiswaan",
    documentType: "pengumuman",
    status: "Pending Review"
  },
  {
    title: "LPJ UKM Paduan Suara - Kompetisi Nasional",
    category: "kemahasiswaan",
    documentType: "lpj",
    status: "Published"
  },
  {
    title: "Pentingnya Literasi Keuangan Bagi Mahasiswa Rantau",
    category: "akademik",
    documentType: "pengumuman",
    status: "Published"
  },
  {
    title: "LPJ Dana Kemahasiswaan Fakultas",
    category: "akademik",
    documentType: "lpj",
    status: "Pending Review"
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
        documentType: article.documentType,
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
