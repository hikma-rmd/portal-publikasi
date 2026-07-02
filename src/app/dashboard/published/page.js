"use client";

import styles from "../articles/page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getArticlesByStatus } from "@/firebase/db";

export default function PublishedArticles() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await getArticlesByStatus("published");
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching published articles:", error);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

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
          <h2 className={`${styles.title} font-headline-lg`}>Published Articles</h2>
          <p className={`${styles.subtitle} font-body-md`}>View all officially published articles across the university.</p>
        </div>
      </div>

      {/* Data Table Card */}
      <div className={styles.tableSection}>
        {/* Table Toolbar */}
        <div className={styles.tableToolbar}>
          <div className={styles.searchContainer}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input 
              className={`${styles.searchInput} font-body-sm`} 
              placeholder="Search published articles..." 
              type="text" 
            />
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.selectContainer}>
              <select className={`${styles.selectInput} font-body-sm`} defaultValue="">
                <option disabled value="">All Categories</option>
                <option value="announcements">Official Announcements</option>
                <option value="events">Campus Events</option>
                <option value="research">Research & Innovation</option>
                <option value="student-life">Student Life</option>
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
                <th className="font-label-sm">Title</th>
                <th className="font-label-sm">Category</th>
                <th className="font-label-sm">Status</th>
                <th className={`font-label-sm ${styles.hiddenLg}`}>Published Date</th>
                <th className={`font-label-sm ${styles.actionCell}`}>Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-on-surface-variant">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">Loading published articles...</td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">No published articles found.</td>
                </tr>
              ) : (
                articles.map(article => (
                  <tr key={article.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.articleTitleBlock}>
                        <Link href={`/dashboard/articles/${article.id}`} className={`${styles.articleTitle} font-body-sm hover:text-primary transition-colors`}>
                          {article.title}
                        </Link>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.categoryText} font-body-sm`}>{article.category || "Uncategorized"}</span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${getBadgeClass(article.status)} font-label-sm`} style={{ textTransform: 'capitalize' }}>
                        {article.status}
                      </span>
                    </td>
                    <td className={styles.hiddenLg}>{formatDate(article.updatedAt || article.createdAt)}</td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionGroup}>
                        <Link href={`/dashboard/articles/${article.id}`} className={styles.actionBtn} title="Read Article">
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>visibility</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
