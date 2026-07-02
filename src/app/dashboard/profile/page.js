"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function UserProfile() {
  const { user, userData } = useAuth();
  
  const userRole = userData?.role || "user";
  const displayRole = userRole === "admin" ? "Administrator" : 
                      userRole === "editor" ? "Editor" : "User / Author";

  const [articleCount, setArticleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchArticleCount = async () => {
      try {
        setLoading(true);
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where("authorId", "==", user.uid));
        const countSnap = await getCountFromServer(q);
        setArticleCount(countSnap.data().count);
      } catch (error) {
        console.error("Error fetching article count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleCount();
  }, [user]);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1 className={`${styles.title} font-headline-lg`}>User Profile</h1>
          <p className={`${styles.subtitle} font-body-md`}>Manage your administrative identity and access credentials.</p>
        </div>
      </div>

      {/* Content Grid (Bento Style Profile Layout) */}
      <div className={styles.bentoGrid}>
        {/* Identity Card (Left Col) */}
        <div className={styles.leftCol}>
          <div className={styles.identityCard}>
            {/* Cover Area */}
            <div 
              className={styles.coverArea}
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0gitGtqVcwAXLXQvBsCFO8H1D3kSMMyA_JIcrQvejcT453-ysHF3klOz0JOMUFiQO_XypemYB6azzAItwJVhtPS8etmvN4AQLD3NDUa8juWcJiY9i8y7RJiHuhYhbePpbztThp3HiPpHNhFgKCY1x8PtXfmnbbRf44-UpBv7nLAoD2ZQKjWjLnZYJ4VJfhiTjXf8a2TMXzopEcruTOV6iDDB-lV5l4HLfUGdVgabqF8LNAA_RUjtlhvMhmyN7rEpHyf6A6-tAeGk')" }}
            ></div>
            {/* Avatar & Info */}
            <div className={styles.avatarInfo}>
              <div className={styles.avatarWrapper}>
                <img 
                  alt="Profile Picture" 
                  className={styles.avatar} 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9RJzGBkBIn7Ba_Fnm_b9SqXSOJtTymDMB8HzsgrWRkS5FXm9tQblsW4oIVAyQ5hqim8RqLgUdYURY5mh1ev8TQwR78dERnXjMqu-ZJSCBlxi-My0Cp5UeBSMiVY18kpbVKYUrs7bUOsjJz2t0vSUJG4Qhz4meDZl1HF-b5DYp1a6zKufo0BwIL0VPKx-KcpaYfVdrNJOUNzeAht4zoPVl02v_YloxX68xeE0ciFY3ZHDQ7j7R7rMv-KadBwp_NjkxCU7dNumuwLQ" 
                />
              </div>
              <h2 className={`${styles.name} font-headline-md`}>{user?.email?.split('@')[0] || "User"}</h2>
              {/* Role Badge */}
              <div className={`${styles.roleBadge} font-label-sm`}>
                {displayRole}
              </div>
              <div className={`${styles.contactInfo} font-body-sm`}>
                <span className={`material-symbols-outlined ${styles.iconSmall}`}>mail</span>
                {user?.email || "No Email Provided"}
              </div>
            </div>
            {/* Quick Stats / Info Footer */}
            <div className={styles.quickStats}>
              <div className={styles.statItem}>
                <p className={`${styles.statValue} font-headline-md`}>{loading ? "..." : articleCount}</p>
                <p className={`${styles.statLabel} font-label-sm`}>Articles</p>
              </div>
              <div className={styles.statItem}>
                <p className={`${styles.statValue} font-headline-md`}>Active</p>
                <p className={`${styles.statLabel} font-label-sm`}>Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Details (Right Col) */}
        <div className={styles.rightCol}>
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <h3 className={`${styles.cardTitle} font-headline-md`}>Personal Information</h3>
              <button className={`${styles.editBtn} font-label-md`}>
                <span className={`material-symbols-outlined ${styles.iconSmall}`}>edit</span>
                Edit Profile
              </button>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={`${styles.infoLabel} font-label-sm`}>Full Name</span>
                <span className={`${styles.infoValue} font-body-md`}>{user?.email?.split('@')[0] || "User"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={`${styles.infoLabel} font-label-sm`}>Email Address</span>
                <span className={`${styles.infoValue} font-body-md`}>{user?.email || "No Email Provided"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={`${styles.infoLabel} font-label-sm`}>Account Type</span>
                <span className={`${styles.infoValue} font-body-md`}>{displayRole}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={`${styles.infoLabel} font-label-sm`}>Member Since</span>
                <span className={`${styles.infoValue} font-body-md`}>
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.securityCard}>
            <div className={styles.securityInfo}>
              <h3 className={`${styles.securityTitle} font-headline-md`}>Security Settings</h3>
              <p className={`${styles.securityDesc} font-body-sm`}>Ensure your account is using a long, random password to stay secure.</p>
            </div>
            <button className={`${styles.changePwdBtn} font-label-md`}>
              <span className={`material-symbols-outlined ${styles.iconSmall}`}>lock_reset</span>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
