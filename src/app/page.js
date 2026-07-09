"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import styles from "./page.module.css";

export default function PublicHomepage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublishedArticles = async () => {
      try {
        setLoading(true);
        const articlesRef = collection(db, "articles");
        // Using in-memory sorting since we might not have a composite index set up yet
        const q = query(
          articlesRef, 
          where("status", "==", "Published"),
          where("documentType", "==", "pengumuman")
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedArticles = [];
        querySnapshot.forEach((doc) => {
          fetchedArticles.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by createdAt descending in memory
        fetchedArticles.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedArticles();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("id-ID", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logoGroup}>
            <img src="/logo.svg" alt="Logo" className={styles.logo} />
            <span className="font-headline-md text-primary">SIMADU</span>
          </div>
          <div>
            <Link href="/login" className={`${styles.loginBtn} font-label-md`}>
              Login / Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className={styles.hero}>
         {/* Decorative Elements */}
         <div className={styles.heroDeco1}></div>
         <div className={styles.heroDeco2}></div>

         <div className={styles.heroContent}>
            <h1 className={`${styles.heroTitle} font-headline-xl`}>Mading Digital & Validasi Kampus</h1>
            <p className={`${styles.heroSubtitle} font-body-lg`}>
              Pusat informasi resmi mahasiswa dan layanan pengajuan dokumen/LPJ terpadu organisasi kampus.
            </p>
         </div>
      </div>

      {/* Articles Section */}
      <div className={styles.articlesSection}>
        <div className={styles.sectionHeader}>
          <h2 className="font-headline-lg text-on-surface">Pengumuman Terbaru</h2>
          <p className={`${styles.sectionSubtitle} font-body-md`}>Daftar informasi dan kegiatan kampus yang telah disetujui.</p>
        </div>

        {loading ? (
          <div className={`${styles.emptyState} font-body-lg text-on-surface-variant`}>
             Memuat pengumuman...
          </div>
        ) : articles.length === 0 ? (
          <div className={styles.emptyState}>
             <span className={`material-symbols-outlined ${styles.emptyIcon}`}>article</span>
             <h3 className="font-headline-md text-on-surface mb-2">Belum ada pengumuman</h3>
             <p className="font-body-md text-on-surface-variant">Belum ada pengumuman yang tayang saat ini.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {articles.map((article) => (
              <div key={article.id} className={styles.card}>
                {/* Article Header (Mock Cover Image) */}
                <div className={styles.cardHeader}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>news</span>
                  <div className={`${styles.cardCategory} font-label-sm`}>
                    {article.category === 'beasiswa' ? 'Beasiswa' : 
                     article.category === 'akademik' ? 'Akademik' :
                     article.category === 'karir' ? 'Karir' :
                     article.category === 'event' ? 'Event' :
                     article.category === 'kemahasiswaan' ? 'Prestasi' : 'Umum'}
                  </div>
                </div>
                
                {/* Article Content */}
                <div className={styles.cardBody}>
                  <h3 className={`${styles.cardTitle} font-headline-md`}>{article.title}</h3>
                  <div className={styles.cardSpacer}></div>
                  
                  {/* Footer Meta */}
                  <div className={styles.cardFooter}>
                    <div className={`${styles.cardDate} font-label-sm`}>
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {formatDate(article.createdAt)}
                    </div>
                    <Link href={`/article/${article.id}`} className={`${styles.readMore} font-label-sm`}>
                      Baca 
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className="font-body-sm text-on-surface-variant">
          © 2026 SIMADU UINAM. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
