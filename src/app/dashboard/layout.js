"use client";

import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();

  const userRole = userData?.role || "user";
  const displayRole = userRole === "admin" ? "Administrator" : 
                      userRole === "editor" ? "Editor" : "User / Author";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-headline-md text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.layout}>
      {/* SideNavBar Shared Component */}
      <aside className={styles.sidebar}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={`${styles.title} font-headline-md`}>Portal Terpadu Kampus</h1>
          <p className="font-body-sm text-on-surface-variant">{displayRole}</p>
        </div>

        {/* Navigation Tabs */}
        <nav className={styles.nav}>
          {/* Active Tab: Dashboard */}
          <Link href="/dashboard" className={`${styles.navLink} ${styles.navLinkActive}`}>
            <span className={`material-symbols-outlined ${styles.icon}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span className="font-label-md">Dashboard</span>
          </Link>
          {/* Inactive Tabs */}
          {(userRole === "user" || userRole === "admin") && (
            <>
              <Link href="/dashboard/articles" className={styles.navLink}>
                <span className={`material-symbols-outlined ${styles.icon}`}>description</span>
                <span className="font-label-md">Dokumen Saya</span>
              </Link>
              <Link href="/dashboard/new" className={styles.navLink}>
                <span className={`material-symbols-outlined ${styles.icon}`}>add_box</span>
                <span className="font-label-md">Buat Dokumen</span>
              </Link>
            </>
          )}
          {userRole === "admin" && (
            <Link href="/dashboard/categories" className={styles.navLink}>
              <span className={`material-symbols-outlined ${styles.icon}`}>category</span>
              <span className="font-label-md">Categories</span>
            </Link>
          )}
          {(userRole === "admin" || userRole === "editor") && (
            <>
              <Link href="/dashboard/editor" className={styles.navLink}>
                <span className={`material-symbols-outlined ${styles.icon}`}>pending_actions</span>
                <span className="font-label-md">Menunggu Validasi</span>
              </Link>
              <Link href="/dashboard/published" className={styles.navLink}>
                <span className={`material-symbols-outlined ${styles.icon}`}>task_alt</span>
                <span className="font-label-md">Arsip Dokumen</span>
              </Link>
            </>
          )}
          <Link href="/dashboard/profile" className={styles.navLink}>
            <span className={`material-symbols-outlined ${styles.icon}`}>person</span>
            <span className="font-label-md">Profile</span>
          </Link>
        </nav>

        {/* Footer Tab */}
        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutLink}>
            <span className={`material-symbols-outlined ${styles.icon}`}>logout</span>
            <span className="font-label-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className={styles.main}>
        {/* TopNavBar Shared Component */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={`font-headline-md ${styles.brand}`}>Workspace</div>
            {/* Search Bar */}
            <div className={styles.searchBar}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                className={`${styles.searchInput} font-body-sm`}
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>

          {/* Trailing Actions */}
          <div className={styles.topBarRight}>
            <button className={styles.actionBtn}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className={styles.actionBtn}>
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className={styles.divider}></div>
            <div className={styles.profileInfo}>
              <img
                alt={`${displayRole} Profile`}
                className={styles.avatar}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyqH4S_qH4qSmNFjcIWLYgJ80VHG2x7YJepbC84y-iZaUqGPiEDJmEbLx1Sw_GZ32vwGCDRlGLl3hS1EtQkE5gOefpxSYRjK1NBc-7mXmCGsxxxlCikCUAeyBrx7gAuNBq8vPsam9g9E22NS2ka0plXtDciLOrM6C3bBZbgiAPyNPImi9_uUD5ZKlzL8CR5vZqCTZmnqKUsv2womNdByHIM5krTIlWxnsZolWRApo7psA7Y4n7aKxTu7sLJ9mwIXmlI_umrm_VNO0"
              />
              <span className={`font-label-md ${styles.adminName}`}>{user?.email?.split('@')[0] || "User"}</span>
            </div>
            <button onClick={handleLogout} className={`font-label-md ${styles.logoutBtn}`}>Logout</button>
          </div>
        </header>

        {/* Dashboard Content */}
        {children}
      </main>
    </div>
  );
}
