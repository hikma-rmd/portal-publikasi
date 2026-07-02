"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getArticlesByStatus } from "@/firebase/db";

export default function EditorDashboard() {
  const [pendingArticles, setPendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const articles = await getArticlesByStatus("pending");
        setPendingArticles(articles);
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
        <h1 className={`${styles.title} font-headline-xl`}>Editor Dashboard</h1>
        <p className={`${styles.subtitle} font-body-lg`}>Overview of publication status and review queue.</p>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {/* Card 1 */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} font-label-md`}>Total Pending Review</h3>
            <div className={`${styles.iconWrapper} ${styles.iconPending}`}>
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <p className={`${styles.cardValue} font-headline-lg`}>{loading ? "-" : pendingArticles.length}</p>
        </div>

        {/* Card 2 */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} font-label-md`}>Approved Today</h3>
            <div className={`${styles.iconWrapper} ${styles.iconApproved}`}>
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <p className={`${styles.cardValue} font-headline-lg`}>0</p>
        </div>

        {/* Card 3 */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} font-label-md`}>Rejected Today</h3>
            <div className={`${styles.iconWrapper} ${styles.iconRejected}`}>
              <span className="material-symbols-outlined">cancel</span>
            </div>
          </div>
          <p className={`${styles.cardValue} font-headline-lg`}>0</p>
        </div>

        {/* Card 4 */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} font-label-md`}>Total Published</h3>
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
          <h2 className={`${styles.queueTitle} font-headline-md`}>Review Queue</h2>
          <button className={`${styles.filterBtn} font-label-md`}>
            <span className={`material-symbols-outlined ${styles.filterIcon}`}>filter_list</span>
            Filter
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className="font-label-md">
              <tr>
                <th>Title</th>
                <th>Author ID</th>
                <th>Category</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th className={styles.textRight}>Action</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-on-surface-variant">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading review queue...</td>
                </tr>
              ) : pendingArticles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No pending articles to review.</td>
                </tr>
              ) : (
                pendingArticles.map((article) => (
                  <tr key={article.id} className={styles.tableRow}>
                    <td>
                      <p className={`${styles.articleTitle} font-body-md`}>{article.title}</p>
                    </td>
                    <td>
                      <p className={`${styles.authorName} font-body-sm`}>{article.authorId}</p>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeCategory}`}>{article.category || "None"}</span>
                    </td>
                    <td className={styles.dateText}>{formatDate(article.createdAt)}</td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
                    </td>
                    <td className={styles.textRight}>
                      <Link href={`/dashboard/review/${article.id}`} className={`${styles.reviewBtn} font-label-md`}>
                        Review
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
          <p className={`${styles.pageInfo} font-body-sm`}>Showing 1 to 4 of 24 entries</p>
          <div className={styles.pageControls}>
            <button className={`${styles.pageBtn} font-body-sm`} disabled>Previous</button>
            <button className={`${styles.pageBtn} font-body-sm`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
