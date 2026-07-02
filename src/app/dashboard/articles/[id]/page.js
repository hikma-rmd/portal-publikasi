"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ArticleDetail() {
  const params = useParams();
  const id = params.id;

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

      {/* Article Header Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroDeco}></div>
        <div className={styles.heroContent}>
          <div className={styles.metaTop}>
            <span className={`${styles.badgeCategory} font-label-sm`}>Campus Life</span>
            <span className={`${styles.badgeStatus} font-label-sm`}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check_circle</span>
              Published
            </span>
            <span className={`${styles.dateText} font-body-sm`}>Oct 24, 2026 • 10:30 AM</span>
          </div>
          <h1 className={`${styles.heroTitle} font-headline-xl`}>The Future of Sustainable Architecture on Campus</h1>
          
          <div className={styles.authorSection}>
            <div className={styles.authorAvatar}>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" 
                alt="Author" 
              />
            </div>
            <div>
              <p className={`${styles.authorName} font-label-md`}>Dr. Elena Rostova</p>
              <p className={`${styles.authorDept} font-body-sm`}>Department of Environmental Design</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - Bento Grid Layout */}
      <div className={styles.layoutGrid}>
        
        {/* Main Article Content */}
        <div className={styles.mainCol}>
          <div className={styles.articleCard}>
            <div className={`${styles.articleBody} font-body-lg`}>
              <p>
                The university's latest initiative to integrate sustainable architecture into the core campus infrastructure marks a significant shift in how educational institutions approach long-term environmental responsibility. This project, spearheaded by the Department of Environmental Design, aims to transform traditional learning spaces into living laboratories for ecological innovation.
              </p>
              
              <h2 className={`${styles.articleSubtitle} font-headline-md`}>Key Objectives and Milestones</h2>
              
              <p>
                Over the next five years, the focus will primarily be on retrofitting existing buildings with advanced energy-capture systems, including high-efficiency solar panels and smart climate control networks. These upgrades are projected to reduce the campus carbon footprint by an estimated 40%.
              </p>
              
              <div className={styles.articleImageContainer}>
                <img 
                  className={styles.articleImage}
                  src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2055&auto=format&fit=crop" 
                  alt="Sustainable Building Concept" 
                />
                <p className={`${styles.imageCaption} font-body-sm`}>
                  Conceptual rendering of the new Science Wing exterior.
                </p>
              </div>
              
              <p>
                Student involvement remains a critical component of the rollout. Engineering and architecture students will have unprecedented access to the structural planning phases, allowing them to earn practical experience while contributing to their own academic environment.
              </p>
              
              <blockquote className={styles.articleQuote}>
                "We are not just building classrooms; we are constructing a curriculum you can walk through and interact with daily." - Dr. Elena Rostova
              </blockquote>
            </div>
          </div>
        </div>

        {/* Sidebar Meta & Media */}
        <div className={styles.sidebarCol}>
          
          {/* Media Assets Card */}
          <div className={styles.sidebarCard}>
            <h3 className={`${styles.cardTitle} font-headline-md`}>
              <span className="material-symbols-outlined text-primary">perm_media</span>
              Attached Media
            </h3>
            <div className={styles.mediaList}>
              <div className={styles.mediaItem}>
                <div className={styles.mediaIcon}>
                  <span className="material-symbols-outlined">image</span>
                </div>
                <div className={styles.mediaInfo}>
                  <p className={`${styles.mediaName} font-label-md`}>header_hero_concept.jpg</p>
                  <p className={`${styles.mediaSize} font-body-sm`}>2.4 MB</p>
                </div>
              </div>
              
              <div className={styles.mediaItem}>
                <div className={styles.mediaIcon}>
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div className={styles.mediaInfo}>
                  <p className={`${styles.mediaName} font-label-md`}>budget_breakdown_2026.pdf</p>
                  <p className={`${styles.mediaSize} font-body-sm`}>845 KB</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO & Settings Card */}
          <div className={styles.sidebarCard}>
            <h3 className={`${styles.cardTitle} font-headline-md`}>
              <span className="material-symbols-outlined text-primary">tune</span>
              Publishing Details
            </h3>
            <div className={styles.detailsList}>
              <div>
                <p className={`${styles.detailLabel} font-label-sm`}>Slug</p>
                <p className={`${styles.detailValueBox} font-body-sm`}>
                  /campus-life/sustainable-architecture-initiative
                </p>
              </div>
              
              <div>
                <p className={`${styles.detailLabel} font-label-sm`}>Tags</p>
                <div className={styles.tagsContainer}>
                  <span className={`${styles.tag} font-body-sm`}>Sustainability</span>
                  <span className={`${styles.tag} font-body-sm`}>Architecture</span>
                  <span className={`${styles.tag} font-body-sm`}>Initiatives</span>
                </div>
              </div>
              
              <div>
                <p className={`${styles.detailLabel} font-label-sm`}>Visibility</p>
                <p className={`${styles.visibilityRow} font-body-md`}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>public</span>
                  Public (All Students & Faculty)
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
