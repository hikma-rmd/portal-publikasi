"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserArticles } from "@/firebase/db";

export default function MyArticles() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      if (user) {
        try {
          const fetchedArticles = await getUserArticles(user.uid);
          setArticles(fetchedArticles);
        } catch (error) {
          console.error("Error fetching articles:", error);
        }
      }
      setLoading(false);
    };

    fetchArticles();
  }, [user]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    const matchesStatus = selectedStatus 
      ? (selectedStatus === 'pending' ? article.status?.toLowerCase().includes('pending') : article.status?.toLowerCase() === selectedStatus.toLowerCase())
      : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Format date helper
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'published': return styles.badgePublished;
      case 'pending': return styles.badgePending;
      case 'draft': return styles.badgeDraft;
      case 'rejected': return styles.badgeRejected;
      default: return styles.badgeDraft;
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h2 className={`${styles.title} font-headline-lg`}>Dokumen Saya</h2>
          <p className={`${styles.subtitle} font-body-md`}>Kelola, edit, dan pantau status dokumen Anda.</p>
        </div>
        <Link href="/dashboard/new" className={`${styles.addBtn} font-label-md`}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          Buat Dokumen
        </Link>
      </div>

      {/* Data Table Card (Bento/Modern UI) */}
      <div className={styles.tableSection}>
        {/* Table Toolbar */}
        <div className={styles.tableToolbar}>
          {/* Search specific to table */}
          <div className={styles.searchContainer}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input 
              className={`${styles.searchInput} font-body-sm`} 
              placeholder="Search title or keyword..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Filters & Actions */}
          <div className={styles.filterGroup}>
            <div className={styles.selectContainer}>
              <select 
                className={`${styles.selectInput} font-body-sm`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                <option value="beasiswa">Beasiswa</option>
                <option value="akademik">Akademik</option>
                <option value="karir">Karir</option>
                <option value="event">Acara</option>
              </select>
              <span className={`material-symbols-outlined ${styles.selectIcon}`}>arrow_drop_down</span>
            </div>
            
            <div className={styles.selectContainer}>
              <select 
                className={`${styles.selectInput} font-body-sm`}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Menunggu</option>
                <option value="published">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
              <span className={`material-symbols-outlined ${styles.selectIcon}`}>arrow_drop_down</span>
            </div>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className="font-label-sm">Judul</th>
                <th className="font-label-sm">Kategori</th>
                <th className="font-label-sm">Jenis</th>
                <th className="font-label-sm">Status</th>
                <th className={`font-label-sm ${styles.hiddenLg}`}>Dibuat</th>
                <th className={`font-label-sm ${styles.hiddenMd}`}>Diperbarui</th>
                <th className={`font-label-sm ${styles.actionCell}`}>Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-on-surface-variant">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Memuat dokumen...</td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Tidak ada dokumen yang cocok dengan pencarian/filter.</td>
                </tr>
              ) : (
                filteredArticles.map(article => (
                  <tr key={article.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.articleTitleBlock}>
                        <Link href={`/dashboard/articles/${article.id}`} className={`${styles.articleTitle} font-body-sm hover:text-primary transition-colors`}>
                          {article.title}
                        </Link>
                        <span className={`${styles.articleUpdatedMobile} font-label-sm`}>Updated: {formatDate(article.updatedAt)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.categoryText} font-body-sm`}>{article.category || "Uncategorized"}</span>
                    </td>
                    <td>
                      <span className="font-label-sm" style={{ padding: "4px 8px", backgroundColor: "var(--surface-container-high)", borderRadius: "12px", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.5px" }}>
                        {article.documentType === 'lpj' ? 'LPJ' : 'Mading'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${getBadgeClass(article.status.toLowerCase())} font-label-sm`} style={{ textTransform: 'capitalize' }}>
                        {article.status?.toLowerCase() === 'published' ? 'Disetujui' : 
                         (article.status?.toLowerCase() === 'pending review' || article.status?.toLowerCase() === 'pending') ? 'Menunggu' : 
                         article.status?.toLowerCase() === 'rejected' ? 'Ditolak' : 'Draft'}
                      </span>
                    </td>
                    <td className={styles.hiddenLg}>{formatDate(article.createdAt)}</td>
                    <td className={styles.hiddenMd}>{formatDate(article.updatedAt)}</td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionGroup}>
                        <Link href={`/dashboard/articles/${article.id}`} className={styles.actionBtn} title="View/Edit">
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>edit</span>
                        </Link>
                        {article.status?.toLowerCase() === 'rejected' && (
                          <Link href={`/dashboard/articles/${article.id}`} className={styles.actionBtn} title="Review Feedback">
                            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>comment</span>
                          </Link>
                        )}
                        <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title="Delete">
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className={styles.pagination}>
          <span className={`${styles.pageInfo} font-body-sm`}>Showing 1 to 4 of 24 entries</span>
          <div className={styles.pageControls}>
            <button className={styles.pageArrowBtn} disabled>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_left</span>
            </button>
            <button className={`${styles.pageNumberBtn} ${styles.pageNumberActive} font-label-sm`}>1</button>
            <button className={`${styles.pageNumberBtn} font-label-sm`}>2</button>
            <button className={`${styles.pageNumberBtn} font-label-sm`}>3</button>
            <span className={`${styles.pageEllipsis} font-label-sm`}>...</span>
            <button className={styles.pageArrowBtn}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
