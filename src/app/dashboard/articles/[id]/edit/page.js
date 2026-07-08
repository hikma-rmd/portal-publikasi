"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getArticleById, updateArticle } from "@/firebase/db";

export default function EditArticle() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [documentType, setDocumentType] = useState("pengumuman");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState("");
  const [lastSavedData, setLastSavedData] = useState("");
  
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setTitle(data.title || "");
        setCategory(data.category || "");
        setDocumentType(data.documentType || "pengumuman");
        setFileUrl(data.fileUrl || "");
        
        if (editorRef.current) {
          editorRef.current.innerHTML = data.content || "";
        }
        
        const currentData = JSON.stringify({ 
          title: data.title || "", 
          category: data.category || "", 
          documentType: data.documentType || "pengumuman", 
          content: data.content || "", 
          fileUrl: data.fileUrl || "" 
        });
        setLastSavedData(currentData);
        
      } catch (error) {
        console.error("Error fetching article:", error);
        alert("Failed to load document data.");
      }
      setLoading(false);
    };
    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    if (!user || loading) return;
    
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
          };
          
          await updateArticle(id, articleData);
          
          setLastSavedData(currentData);
          setAutosaveStatus("Perubahan tersimpan (Autosave)");
          setTimeout(() => setAutosaveStatus(""), 3000);
        } catch (e) {
          console.error(e);
          setAutosaveStatus("Gagal autosave");
        }
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [title, category, documentType, fileUrl, id, lastSavedData, user, loading]);

  const handleSubmit = async (status) => {
    if (status === 'pending' && !title.trim()) {
      alert("Please enter a title before submitting for validation");
      return;
    }
    
    setSaving(true);
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
      
      await updateArticle(id, articleData);
      
      router.push(`/dashboard/articles/${id}`);
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center py-20 font-headline-md">Loading document...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h2 className={`${styles.title} font-headline-lg`}>Edit Dokumen</h2>
          <p className={`${styles.subtitle} font-body-md`}>Ubah detail atau konten dari dokumen Anda.</p>
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
              disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  <button className={styles.toolbarBtn} title="Insert Image" type="button">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>image</span>
                  </button>
                </div>
              </div>

              {/* Editor Area */}
              <div 
                ref={editorRef}
                className={`${styles.editorContent} font-body-md`} 
                contentEditable={!saving}
                suppressContentEditableWarning={true}
                placeholder="Mulai menulis dokumen di sini..."
              ></div>
            </div>
            <p className={`${styles.helpText} font-body-sm`}>
              Data Anda otomatis tersimpan setiap 15 detik jika ada perubahan.
            </p>
          </div>

        </div>

        {/* Actions Footer */}
        <div className={styles.footer}>
          <Link href={`/dashboard/articles/${id}`} className={`${styles.btn} ${styles.btnCancel} font-label-md`} type="button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            Cancel
          </Link>
          
          <div className={styles.actionGroup}>
            <button 
              className={`${styles.btn} ${styles.btnSave} font-label-md`} 
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={saving}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span>
              Simpan Draft
            </button>
            <button 
              className={`${styles.btn} ${styles.btnSubmit} font-label-md`} 
              type="button"
              onClick={() => handleSubmit('pending')}
              disabled={saving}
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
