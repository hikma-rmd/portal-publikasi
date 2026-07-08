"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticleById, updateArticleStatus } from "@/firebase/db";

export default function ReviewArticle() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
      setLoading(false);
    };
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === "rejected" && !notes.trim()) {
      alert("Harap berikan catatan perbaikan untuk dokumen yang ditolak.");
      return;
    }
    
    setActionLoading(true);
    try {
      await updateArticleStatus(id, newStatus, notes);
      router.push("/dashboard/editor");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center py-20 font-headline-md">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center py-20 font-headline-md">Article not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div>
          <div className={`${styles.breadcrumb} font-body-sm`}>
            <Link href="/dashboard/editor" className={styles.breadcrumbLink}>Pending Review</Link>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span>
            <span>Article ID: #{id.substring(0,6).toUpperCase()}</span>
          </div>
          <h2 className={`${styles.title} font-headline-lg`}>Review: {article.title}</h2>
        </div>
        <div>
          <span className={`${styles.statusBadge} font-label-sm`} style={{ textTransform: 'capitalize' }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              {article.status?.toLowerCase().includes('pending') ? 'schedule' : article.status?.toLowerCase() === 'published' ? 'check_circle' : 'cancel'}
            </span>
            {article.status}
          </span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className={styles.layoutGrid}>
        
        {/* Left Canvas: Article Content (8 cols) */}
        <div className={styles.mainContent}>
          {/* Main Article Card */}
          <div className={styles.articleCard}>
            <div className={styles.articleHeader}>
              <div>
                <h3 className={`${styles.articleTitle} font-headline-md`}>{article.title}</h3>
                <div className={`${styles.metaInfo} font-body-sm`}>
                  <div className={styles.metaItem}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>person</span>
                    {article.authorId}
                  </div>
                  <div className={styles.metaItem}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>calendar_today</span>
                    Submitted: {formatDate(article.createdAt)}
                  </div>
                  <div className={styles.metaItem}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>folder</span>
                    {article.category || "Uncategorized"}
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content Preview */}
            <div 
              className={`${styles.articleBody} font-body-md`}
              dangerouslySetInnerHTML={{ __html: article.content || "<p>No content provided.</p>" }}
            >
            </div>
          </div>

          {/* Metadata/Assets Card */}
          <div className={styles.assetsCard}>
            <h3 className={`${styles.assetsTitle} font-headline-md`}>
              <span className="material-symbols-outlined">attachment</span>
              Attached Assets & Metadata
            </h3>
            
            <div className={styles.assetsGrid}>
              {article.fileUrl ? (
                <div className={styles.assetBox}>
                  <span className={`${styles.assetLabel} font-label-sm`}>Dokumen Lampiran</span>
                  <div className={styles.assetItem}>
                    <div className={styles.assetIconBox}>
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <a href={article.fileUrl} target="_blank" rel="noopener noreferrer" className={`${styles.assetName} font-body-sm hover:underline text-primary`}>
                        Buka Dokumen ({article.fileName || "File"})
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.assetBox}>
                  <p className="font-body-sm text-on-surface-variant">Tidak ada lampiran dokumen.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Canvas: Review Panel (4 cols) */}
        <div className={styles.sidebarContent}>
          {/* Action Panel */}
          <div className={styles.reviewPanel}>
            <h3 className={`${styles.panelTitle} font-headline-md`}>Editor Review</h3>
            
            {/* Notes */}
            <div className={styles.notesSection}>
              <label className={`${styles.notesLabel} font-label-md`}>Catatan Perbaikan (Dilihat Mahasiswa)</label>
              <textarea 
                className={`${styles.notesArea} font-body-sm`} 
                placeholder="Tulis alasan penolakan atau perbaikan yang dibutuhkan..." 
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={actionLoading}
              ></textarea>
            </div>
            
            {/* Actions */}
            {(article.status?.toLowerCase() === 'pending' || article.status?.toLowerCase() === 'pending review') && (
              <div className={styles.actionStack}>
                <button 
                  className={`${styles.btnApprove} font-label-md`} 
                  onClick={() => handleStatusUpdate('published')}
                  disabled={actionLoading}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>publish</span>
                  Setujui & Tayangkan
                </button>
                
                <div className={styles.secondaryActions}>
                  <button 
                    className={`${styles.btnReject} font-label-md w-full`}
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={actionLoading}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>block</span>
                    Tolak / Minta Revisi
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}
