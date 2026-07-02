"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getArticlesByStatus } from "@/firebase/db";

const CATEGORY_META = {
  "announcements": { title: "Official Announcements", icon: "campaign" },
  "events": { title: "Campus Events", icon: "event" },
  "research": { title: "Research & Innovation", icon: "biotech" },
  "student-life": { title: "Student Life", icon: "school" },
  "uncategorized": { title: "Uncategorized", icon: "category" }
};

export default function CategoriesPage() {
  const [counts, setCounts] = useState({
    "announcements": 0,
    "events": 0,
    "research": 0,
    "student-life": 0,
    "uncategorized": 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const articles = await getArticlesByStatus("published");
        const newCounts = { ...counts };
        
        articles.forEach(article => {
          const cat = article.category || "uncategorized";
          if (newCounts[cat] !== undefined) {
            newCounts[cat]++;
          } else {
            newCounts["uncategorized"]++;
          }
        });
        
        setCounts(newCounts);
      } catch (error) {
        console.error("Error fetching articles for categories:", error);
      }
      setLoading(false);
    };

    fetchCounts();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={`${styles.title} font-headline-lg`}>Categories</h2>
        <p className={`${styles.subtitle} font-body-md`}>Browse published articles organized by topics.</p>
      </div>

      <div className={styles.grid}>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <Link href={`/dashboard/published?category=${key}`} className={styles.card} key={key}>
            <div className={styles.iconWrapper}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                {meta.icon}
              </span>
            </div>
            <div className={styles.cardContent}>
              <h3 className={`${styles.cardTitle} font-body-lg`}>{meta.title}</h3>
              <div className={`${styles.cardCount} font-label-sm`}>
                {loading ? "..." : counts[key]} Articles
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
