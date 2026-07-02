"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function StaffDashboard() {
  const { user, userData } = useAuth();
  const userRole = userData?.role || "user";

  const [stats, setStats] = useState({ total: 0, draft: 0, pending: 0, published: 0 });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const articlesRef = collection(db, "articles");
        
        let baseQuery = articlesRef;
        if (userRole === "user") {
          baseQuery = query(articlesRef, where("authorId", "==", user.uid));
        }

        // Fetch counts
        const totalSnap = await getCountFromServer(baseQuery);
        
        const draftQ = userRole === "user" 
          ? query(articlesRef, where("authorId", "==", user.uid), where("status", "==", "Draft")) 
          : query(articlesRef, where("status", "==", "Draft"));
        const draftSnap = await getCountFromServer(draftQ);
        
        const pendingQ = userRole === "user" 
          ? query(articlesRef, where("authorId", "==", user.uid), where("status", "==", "Pending Review")) 
          : query(articlesRef, where("status", "==", "Pending Review"));
        const pendingSnap = await getCountFromServer(pendingQ);
        
        const pubQ = userRole === "user" 
          ? query(articlesRef, where("authorId", "==", user.uid), where("status", "==", "Published")) 
          : query(articlesRef, where("status", "==", "Published"));
        const pubSnap = await getCountFromServer(pubQ);

        setStats({
          total: totalSnap.data().count,
          draft: draftSnap.data().count,
          pending: pendingSnap.data().count,
          published: pubSnap.data().count,
        });

        // Fetch recent articles and sort in memory to avoid missing Firestore index errors
        const allDocsSnap = await getDocs(baseQuery);
        let articles = [];
        allDocsSnap.forEach(doc => {
          articles.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by createdAt descending
        articles.sort((a, b) => {
           const timeA = a.createdAt?.seconds || 0;
           const timeB = b.createdAt?.seconds || 0;
           return timeB - timeA;
        });
        
        setRecentArticles(articles.slice(0, 4));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userRole]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h2 className={`${styles.title} font-headline-lg`}>Dashboard Overview</h2>
        <p className={`${styles.subtitle} font-body-md`}>Welcome back. Here is the current status of your workspace.</p>
      </div>

      {/* Top Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.statLabel} font-label-md`}>{userRole === 'user' ? 'My Articles' : 'Total Articles'}</span>
            <div className={`${styles.statIconWrapper} ${styles.statIconWrapperPrimary}`}>
              <span className="material-symbols-outlined">library_books</span>
            </div>
          </div>
          <div className={`${styles.statValue} font-headline-xl`}>
            {loading ? "..." : stats.total}
          </div>
          <div className={`${styles.statFooter} font-label-sm`}>
             Total records
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.statLabel} font-label-md`}>Draft Articles</span>
            <div className={`${styles.statIconWrapper} ${styles.statIconWrapperSecondary}`}>
              <span className="material-symbols-outlined">edit_document</span>
            </div>
          </div>
          <div className={`${styles.statValue} font-headline-xl`}>
            {loading ? "..." : stats.draft}
          </div>
          <div className={`${styles.statFooter} font-label-sm`}>
             Work in progress
          </div>
        </div>

        {(userRole === "admin" || userRole === "editor") && (
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={`${styles.statLabel} font-label-md`}>Pending Review</span>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperTertiary}`}>
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
            </div>
            <div className={`${styles.statValue} font-headline-xl`}>
              {loading ? "..." : stats.pending}
            </div>
            <div className={`${styles.statFooter} font-label-sm`}>
              Awaiting approval
            </div>
          </div>
        )}

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={`${styles.statLabel} font-label-md`}>Published</span>
            <div className={`${styles.statIconWrapper} ${styles.statIconWrapperAction}`}>
              <span className="material-symbols-outlined">task_alt</span>
            </div>
          </div>
          <div className={`${styles.statValue} font-headline-xl`}>
            {loading ? "..." : stats.published}
          </div>
          <div className={`${styles.statFooter} font-label-sm`}>
            Live on portal
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className={styles.lowerGrid}>
        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3 className={`${styles.sectionTitle} font-headline-md`}>Recent Articles</h3>
            <Link href="/dashboard/articles" className={`${styles.viewAll} font-label-md`}>
              View All <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </Link>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className="font-label-sm">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className={styles.textRight}>Date</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-on-background">
                {loading ? (
                  <tr><td colSpan="4" style={{textAlign: "center", padding: "20px"}}>Loading data...</td></tr>
                ) : recentArticles.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign: "center", padding: "20px"}}>No articles found.</td></tr>
                ) : (
                  recentArticles.map((article) => (
                    <tr key={article.id} className={styles.tableRow}>
                      <td className={`${styles.tableRowTitle} font-label-md`}>{article.title}</td>
                      <td className={styles.tableRowSubtitle}>{article.category || "Uncategorized"}</td>
                      <td>
                        <span className={`${styles.badge} ${
                          article.status === 'Published' ? styles.badgePublished :
                          article.status === 'Pending Review' ? styles.badgePending :
                          styles.badgeDraft
                        } font-label-sm`}>
                          {article.status}
                        </span>
                      </td>
                      <td className={`${styles.tableRowSubtitle} ${styles.textRight}`}>
                        {formatDate(article.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action Panel */}
        <div className={styles.actionsSection}>
          <h3 className={`${styles.actionsSectionTitle} font-headline-md`}>Quick Actions</h3>
          <p className={`${styles.actionsSectionSubtitle} font-body-sm`}>Common tasks and shortcuts.</p>
          
          <div className={styles.actionsContainer}>
            {(userRole === "user" || userRole === "admin") && (
              <Link href="/dashboard/new" style={{width: "100%", textDecoration: "none"}}>
                <button className={`${styles.btnPrimary} font-label-md`}>
                  <span className="material-symbols-outlined">add_circle</span>
                  Create New Article
                </button>
              </Link>
            )}
            <Link href="/dashboard/profile" style={{width: "100%", textDecoration: "none"}}>
              <button className={`${styles.btnOutline} font-label-md`}>
                <span className="material-symbols-outlined">person</span>
                View Profile
              </button>
            </Link>
          </div>
          
          <div className={styles.systemUpdate}>
            <span className={`material-symbols-outlined ${styles.systemUpdateIcon}`}>lightbulb</span>
            <div>
              <h4 className={`${styles.systemUpdateTitle} font-label-md`}>System Info</h4>
              <p className={`${styles.systemUpdateText} font-body-sm`}>You are currently logged in as a <strong>{userRole}</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
