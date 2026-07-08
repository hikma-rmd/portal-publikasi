"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { addArticle, updateArticle } from "@/firebase/db";

export default function NewArticle() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [documentType, setDocumentType] = useState("pengumuman");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [articleId, setArticleId] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState("");
  const [lastSavedData, setLastSavedData] = useState("");
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB limit
    if (file.size > MAX_SIZE) {
      alert("Error: File size exceeds the 2MB limit. Image was rejected.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
      document.execCommand('insertImage', false, event.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      const content = editorRef.current?.innerHTML || "";
      const finalTitle = title.trim() || "Untitled Draft";
      
      const currentData = JSON.stringify({ title: finalTitle, category, documentType, content, fileUrl });
      
      if (currentData !== lastSavedData && (title.trim() || content.trim() !== "")) {
        setAutosaveStatus("Menyimpan otomatis...");
        try {
          const articleData = {
            title: finalTitle,
            category,
            documentType,
            content,
            fileUrl,
            authorId: user.uid,
            status: 'draft',
          };
          
          let newId = articleId;
          if (articleId) {
            await updateArticle(articleId, articleData);
          } else {
            newId = await addArticle(articleData);
            setArticleId(newId);
          }
          
          setLastSavedData(currentData);
          setAutosaveStatus("Draft tersimpan (Autosave)");
          setTimeout(() => setAutosaveStatus(""), 3000);
        } catch (e) {
          console.error(e);
          setAutosaveStatus("Gagal autosave");
        }
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [title, category, documentType, fileUrl, articleId, lastSavedData, user]);

  const handleSubmit = async (status) => {
    if (status === 'pending' && !title.trim()) {
      alert("Please enter a title before submitting for validation");
      return;
    }
    
    setLoading(true);
    try {
      const content = editorRef.current.innerHTML;
      const finalTitle = title.trim() || "Untitled Draft";
      
      const articleData = {
        title: finalTitle,
        category,
        documentType,
        content,
        fileUrl,
        authorId: user.uid,
        status, // 'draft' or 'pending'
      };
      
      if (articleId) {
        await updateArticle(articleId, articleData);
      } else {
        await addArticle(articleData);
      }
      
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
        <div>
          <h2 className={`${styles.title} font-headline-lg`}>Buat Dokumen Baru</h2>
          <p className={`${styles.subtitle} font-body-md`}>Buat draf pengumuman publik atau laporan pertanggungjawaban (LPJ).</p>
        </div>
        {autosaveStatus && (
          <div className="font-label-md" style={{ padding: '8px 16px', backgroundColor: 'var(--surface-container-high)', borderRadius: '20px', color: 'var(--on-surface-variant)' }}>
            {autosaveStatus}
          </div>
        )}
      </div>

      {/* Main Form Card (Bento/Spacious Style) */}
      <div className={styles.formCard}>
        <div className={styles.formContent}>
          
          {/* Top Row: Title */}
          <div className={styles.fieldGroup}>
            <label className={`${styles.label} font-label-md`} htmlFor="articleTitle">
              Judul Dokumen <span className={styles.required}>*</span> <span className="font-body-sm text-on-surface-variant">(Boleh kosong untuk draft)</span>
            </label>
            <input 
              className={`${styles.input} font-body-lg`} 
              id="articleTitle" 
              placeholder="Masukkan judul dokumen dengan jelas..." 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Second Row: Category & URL */}
          <div className={styles.twoCols}>
            {/* Document Type Dropdown */}
            <div className={styles.fieldGroup}>
              <label className={`${styles.label} font-label-md`} htmlFor="documentType">
                Jenis Dokumen
              </label>
              <div className={styles.selectContainer}>
                <select 
                  className={`${styles.selectInput} font-body-md`} 
                  id="documentType" 
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  disabled={loading}
                >
                  <option value="pengumuman">Pengumuman Publik (Mading)</option>
                  <option value="lpj">Laporan Pertanggungjawaban (LPJ)</option>
                </select>
                <div className={styles.selectIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>expand_more</span>
                </div>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className={styles.fieldGroup}>
              <label className={`${styles.label} font-label-md`} htmlFor="category">
                Kategori
              </label>
              <div className={styles.selectContainer}>
                <select 
                  className={`${styles.selectInput} font-body-md`} 
                  id="category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                >
                  <option disabled value="">Pilih kategori...</option>
                  <option value="beasiswa">Beasiswa & Bantuan</option>
                  <option value="akademik">Akademik & Perkuliahan</option>
                  <option value="karir">Karir & Magang</option>
                  <option value="event">Acara Kampus (Event)</option>
                  <option value="kemahasiswaan">Prestasi & Kemahasiswaan</option>
                </select>
                <div className={styles.selectIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>expand_more</span>
                </div>
              </div>
            </div>

            {/* File URL */}
            <div className={styles.fieldGroup}>
              <label className={`${styles.label} font-label-md`} htmlFor="fileUrl">
                Link Dokumen (G-Drive / Opsional)
              </label>
              <div className={styles.urlContainer}>
                <div className={styles.urlIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>link</span>
                </div>
                <input 
                  className={`${styles.urlInput} font-body-md`} 
                  id="fileUrl" 
                  type="url"
                  placeholder="https://drive.google.com/..." 
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Third Row: Rich Text Editor */}
          <div className={styles.editorContainer}>
            <label className={`${styles.label} font-label-md`} style={{ marginBottom: "8px" }}>
              Isi Dokumen / Laporan
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
                  <button 
                    className={styles.toolbarBtn} 
                    title="Insert Image" 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>image</span>
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Editor Area */}
              <div 
                ref={editorRef}
                className={`${styles.editorContent} font-body-md`} 
                contentEditable={!loading}
                suppressContentEditableWarning={true}
                placeholder="Mulai menulis dokumen di sini..."
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
              Simpan Draft
            </button>
            <button 
              className={`${styles.btn} ${styles.btnSubmit} font-label-md`} 
              type="button"
              onClick={() => handleSubmit('pending')}
              disabled={loading}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>send</span>
              Ajukan Validasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
