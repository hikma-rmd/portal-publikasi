"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { addArticle } from "@/firebase/db";

export default function NewArticle() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  const editorRef = useRef(null);

  const handleSubmit = async (status) => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    
    setLoading(true);
    try {
      const content = editorRef.current.innerHTML;
      
      const articleData = {
        title,
        category,
        docUrl,
        content,
        authorId: user.uid,
        status, // 'draft' or 'pending'
      };
      
      await addArticle(articleData);
      router.push("/dashboard/articles");
    } catch (error) {
      console.error("Error adding article:", error);
      alert("Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h2 className={`${styles.title} font-headline-lg`}>Create New Article</h2>
        <p className={`${styles.subtitle} font-body-md`}>Draft and format official communications for the university portal.</p>
      </div>

      {/* Main Form Card (Bento/Spacious Style) */}
      <div className={styles.formCard}>
        <div className={styles.formContent}>
          
          {/* Top Row: Title */}
          <div className={styles.fieldGroup}>
            <label className={`${styles.label} font-label-md`} htmlFor="articleTitle">
              Article Title <span className={styles.required}>*</span>
            </label>
            <input 
              className={`${styles.input} font-body-lg`} 
              id="articleTitle" 
              placeholder="Enter a clear, descriptive title..." 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Second Row: Category & URL */}
          <div className={styles.twoCols}>
            {/* Category Dropdown */}
            <div className={styles.fieldGroup}>
              <label className={`${styles.label} font-label-md`} htmlFor="category">
                Primary Category
              </label>
              <div className={styles.selectContainer}>
                <select 
                  className={`${styles.selectInput} font-body-md`} 
                  id="category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                >
                  <option disabled value="">Select a category...</option>
                  <option value="announcements">Official Announcements</option>
                  <option value="events">Campus Events</option>
                  <option value="research">Research & Innovation</option>
                  <option value="student-life">Student Life</option>
                </select>
                <div className={styles.selectIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>expand_more</span>
                </div>
              </div>
            </div>

            {/* Documentation URL */}
            <div className={styles.fieldGroup}>
              <label className={`${styles.label} font-label-md`} htmlFor="docUrl">
                Supporting Documentation URL
              </label>
              <div className={styles.urlContainer}>
                <div className={styles.urlIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>link</span>
                </div>
                <input 
                  className={`${styles.urlInput} font-body-md`} 
                  id="docUrl" 
                  placeholder="https://..." 
                  type="url" 
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Third Row: Rich Text Editor */}
          <div className={styles.editorContainer}>
            <label className={`${styles.label} font-label-md`} style={{ marginBottom: "8px" }}>
              Article Content
            </label>
            <div className={styles.editorBox}>
              {/* Toolbar */}
              <div className={styles.editorToolbar}>
                <div className={styles.toolbarGroup}>
                  <button className={styles.toolbarBtn} title="Bold" type="button" onClick={() => document.execCommand('bold')}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_bold</span>
                  </button>
                  <button className={styles.toolbarBtn} title="Italic" type="button" onClick={() => document.execCommand('italic')}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_italic</span>
                  </button>
                  <button className={styles.toolbarBtn} title="Underline" type="button" onClick={() => document.execCommand('underline')}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_underlined</span>
                  </button>
                </div>
                <div className={styles.toolbarGroup}>
                  <button className={styles.toolbarBtn} title="Heading 1" type="button" onClick={() => document.execCommand('formatBlock', false, 'H1')}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_h1</span>
                  </button>
                  <button className={styles.toolbarBtn} title="Heading 2" type="button" onClick={() => document.execCommand('formatBlock', false, 'H2')}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_h2</span>
                  </button>
                </div>
                <div className={styles.toolbarGroup}>
                  <button className={styles.toolbarBtn} title="Bulleted List" type="button" onClick={() => document.execCommand('insertUnorderedList')}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_list_bulleted</span>
                  </button>
                  <button className={styles.toolbarBtn} title="Numbered List" type="button" onClick={() => document.execCommand('insertOrderedList')}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_list_numbered</span>
                  </button>
                </div>
                <div className={styles.toolbarGroup} style={{ borderRight: "none" }}>
                  <button className={styles.toolbarBtn} title="Insert Link" type="button">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_link</span>
                  </button>
                  <button className={styles.toolbarBtn} title="Insert Image" type="button">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>image</span>
                  </button>
                </div>
              </div>

              {/* Editor Area */}
              <div 
                ref={editorRef}
                className={`${styles.editorContent} font-body-md`} 
                contentEditable={!loading}
                suppressContentEditableWarning={true}
                placeholder="Start writing your article here..."
              ></div>
            </div>
            <p className={`${styles.helpText} font-body-sm`}>
              Press <kbd className={styles.kbd}>Ctrl</kbd> + <kbd className={styles.kbd}>S</kbd> to quick save draft.
            </p>
          </div>

        </div>

        {/* Actions Footer */}
        <div className={styles.footer}>
          <Link href="/dashboard/articles" className={`${styles.btn} ${styles.btnCancel} font-label-md`} type="button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            Cancel
          </Link>
          
          <div className={styles.actionGroup}>
            <button 
              className={`${styles.btn} ${styles.btnSave} font-label-md`} 
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={loading}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span>
              Save Draft
            </button>
            <button 
              className={`${styles.btn} ${styles.btnSubmit} font-label-md`} 
              type="button"
              onClick={() => handleSubmit('pending')}
              disabled={loading}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>send</span>
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
