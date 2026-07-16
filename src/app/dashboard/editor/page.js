"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getArticlesByStatus, getUserProfile } from "@/firebase/db";

export default function EditorDashboard() {
  const [pendingArticles, setPendingArticles] = useState([]);
  const [authorNames, setAuthorNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const articles = await getArticlesByStatus("pending");
        setPendingArticles(articles);
        
        // Fetch author names based on authorId
        const uids = [...new Set(articles.map(a => a.authorId))].filter(Boolean);
        const nameMap = {};
        await Promise.all(uids.map(async (uid) => {
          try {
            const profile = await getUserProfile(uid);
            if (profile && profile.name) {
              nameMap[uid] = profile.name;
            } else {
              nameMap[uid] = `ID: ${uid.substring(0, 6)}...`;
            }
          } catch (e) {
            console.error(`Error fetching profile for ${uid}:`, e);
            nameMap[uid] = `ID: ${uid.substring(0, 6)}...`;
          }
        }));
        setAuthorNames(nameMap);
      } catch (error) {
        console.error("Error fetching pending articles:", error);
      }
      setLoading(false);
    };
    fetchPending();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={`${styles.title} font-headline-xl`}>Dashboard Validasi</h1>
        <p className={`${styles.subtitle} font-body-lg`}>Pantau status pengajuan dokumen dan antrean validasi.</p>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {/* Card 1 */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} font-label-md`}>Total Menunggu Validasi</h3>
            <div className={`${styles.iconWrapper} ${styles.iconPending}`}>
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <p className={`${styles.cardValue} font-headline-lg`}>{loading ? "-" : pendingArticles.length}</p>
        </div>

        {/* Card 2 */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} font-label-md`}>Disetujui Hari Ini</h3>
            <div className={`${styles.iconWrapper} ${styles.iconApproved}`}>
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <p className={`${styles.cardValue} font-headline-lg`}>0</p>
        </div>

        {/* Card 3 */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} font-label-md`}>Ditolak Hari Ini</h3>
            <div className={`${styles.iconWrapper} ${styles.iconRejected}`}>
              <span className="material-symbols-outlined">cancel</span>
            </div>
          </div>
          <p className={`${styles.cardValue} font-headline-lg`}>0</p>
        </div>

        {/* Card 4 */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} font-label-md`}>Total Arsip & Tayang</h3>
            <div className={`${styles.iconWrapper} ${styles.iconPublished}`}>
              <span className="material-symbols-outlined">publish</span>
            </div>
          </div>
          <p className={`${styles.cardValue} font-headline-lg`}>0</p>
        </div>
      </div>

      {/* Review Queue Table Section */}
      <div className={styles.queueSection}>
        <div className={styles.queueHeader}>
          <h2 className={`${styles.queueTitle} font-headline-md`}>Antrean Validasi</h2>
          <button className={`${styles.filterBtn} font-label-md`}>
            <span className={`material-symbols-outlined ${styles.filterIcon}`}>filter_list</span>
            Filter
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className="font-label-md">
              <tr>
                <th>Judul</th>
                <th>Pengirim</th>
                <th>Kategori</th>
                <th>Jenis</th>
                <th>Tanggal Masuk</th>
                <th>Status</th>
                <th className={styles.textRight}>Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-on-surface-variant">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Memuat antrean...</td>
                </tr>
              ) : pendingArticles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Tidak ada dokumen yang perlu divalidasi.</td>
                </tr>
              ) : (
                pendingArticles.map((article) => (
                  <tr key={article.id} className={styles.tableRow}>
                    <td>
                      <p className={`${styles.articleTitle} font-body-md`}>{article.title}</p>
                    </td>
                    <td>
                      <p className={`${styles.authorName} font-body-sm`}>
                        {authorNames[article.authorId] || article.authorId}
                      </p>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeCategory}`}>{article.category || "None"}</span>
                    </td>
                    <td>
                      <span className="font-label-sm" style={{ padding: "4px 8px", backgroundColor: "var(--surface-container-high)", borderRadius: "12px", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.5px" }}>
                        {article.documentType === 'lpj' ? 'LPJ' : 'Mading'}
                      </span>
                    </td>
                    <td className={styles.dateText}>{formatDate(article.createdAt)}</td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgePending}`}>Menunggu</span>
                    </td>
                    <td className={styles.textRight}>
                      <Link href={`/dashboard/review/${article.id}`} className={`${styles.reviewBtn} font-label-md`}>
                        Validasi
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <p className={`${styles.pageInfo} font-body-sm`}>
            Showing {pendingArticles.length > 0 ? 1 : 0} to {pendingArticles.length} of {pendingArticles.length} entries
          </p>
          <div className={styles.pageControls}>
            <button className={`${styles.pageBtn} font-body-sm`} disabled>Previous</button>
            <button className={`${styles.pageBtn} font-body-sm`} disabled={pendingArticles.length <= 10}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
