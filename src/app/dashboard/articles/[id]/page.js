"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getArticleById } from "@/firebase/db";
import { useAuth } from "@/context/AuthContext";

export default function ArticleDetail() {
  const params = useParams();
  const id = params.id;
  
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center py-20 font-headline-md">Loading document...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center py-20 font-headline-md">Document not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumbs & Actions */}
      <div className={styles.header}>
        <Link href="/dashboard/articles" className={`${styles.backLink} font-label-md`}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
          Back to Articles
        </Link>
        <div className={styles.actionGroup}>
          <button className={`${styles.actionBtn} ${styles.btnEdit} font-label-md`}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
            Edit
          </button>
          <button className={`${styles.actionBtn} ${styles.btnDelete} font-label-md`}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
            Delete
          </button>
        </div>
      </div>

      {/* Notes / Revision Section (Shows up if rejected or has notes) */}
      {article.editorialNotes && (
        <div className="mb-6 bg-error-container text-on-error-container p-6 rounded-2xl border border-error">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-error" style={{ fontSize: "28px" }}>error</span>
            <div>
              <h3 className="font-headline-sm mb-2 text-error">Catatan Perbaikan dari Editor</h3>
              <p className="font-body-md whitespace-pre-wrap">{article.editorialNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Article Header Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroDeco}></div>
        <div className={styles.heroContent}>
          <div className={styles.metaTop}>
            <span className={`${styles.badgeCategory} font-label-sm`}>{article.category || "Uncategorized"}</span>
            <span className="font-label-sm" style={{ padding: "4px 8px", backgroundColor: "var(--surface-container-highest)", borderRadius: "12px", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.5px" }}>
              {article.documentType === 'lpj' ? 'LPJ' : 'Mading'}
            </span>
            <span className={`${styles.badgeStatus} font-label-sm`} style={{ 
              backgroundColor: article.status === 'published' ? 'var(--primary-container)' : article.status === 'rejected' ? 'var(--error-container)' : 'var(--secondary-container)',
              color: article.status === 'published' ? 'var(--on-primary-container)' : article.status === 'rejected' ? 'var(--on-error-container)' : 'var(--on-secondary-container)',
              textTransform: 'capitalize'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                {article.status === 'published' ? 'check_circle' : article.status === 'rejected' ? 'cancel' : 'schedule'}
              </span>
              {article.status === 'Published' ? 'Disetujui' : article.status === 'Pending Review' ? 'Menunggu' : article.status === 'rejected' ? 'Ditolak' : article.status}
            </span>
            <span className={`${styles.dateText} font-body-sm`}>{formatDate(article.createdAt)}</span>
          </div>
          <h1 className={`${styles.heroTitle} font-headline-xl`}>{article.title}</h1>
        </div>
      </div>

      {/* Content Area - Bento Grid Layout */}
      <div className={styles.layoutGrid}>
        
        {/* Main Article Content */}
        <div className={styles.mainCol}>
          <div className={styles.articleCard}>
            <div 
              className={`${styles.articleBody} font-body-lg`}
              dangerouslySetInnerHTML={{ __html: article.content || "<p>Tidak ada konten teks.</p>" }}
            >
            </div>
          </div>
        </div>

        {/* Sidebar Meta & Media */}
        <div className={styles.sidebarCol}>
          
          {/* Media Assets Card */}
          <div className={styles.sidebarCard}>
            <h3 className={`${styles.cardTitle} font-headline-md`}>
              <span className="material-symbols-outlined text-primary">perm_media</span>
              Lampiran Dokumen
            </h3>
            <div className={styles.mediaList}>
              {article.fileUrl ? (
                <div className={styles.mediaItem}>
                  <div className={styles.mediaIcon}>
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className={styles.mediaInfo} style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                    <a href={article.fileUrl} target="_blank" rel="noopener noreferrer" className={`${styles.mediaName} font-label-md text-primary hover:underline break-words`}>
                      {article.fileName || "Unduh Dokumen"}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="font-body-sm text-on-surface-variant">Tidak ada file yang dilampirkan.</p>
              )}
            </div>
          </div>

          {/* Details Card */}
          <div className={styles.sidebarCard}>
            <h3 className={`${styles.cardTitle} font-headline-md`}>
              <span className="material-symbols-outlined text-primary">tune</span>
              Detail Sistem
            </h3>
            <div className={styles.detailsList}>
              <div>
                <p className={`${styles.detailLabel} font-label-sm`}>ID Dokumen</p>
                <p className={`${styles.detailValueBox} font-body-sm`}>
                  {article.id}
                </p>
              </div>
              
              <div>
                <p className={`${styles.detailLabel} font-label-sm`}>Terakhir Diperbarui</p>
                <p className="font-body-md text-on-surface">
                  {formatDate(article.updatedAt)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
