import { db, storage } from "./config";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- ARTICLES ---

/**
 * Creates a new article in Firestore.
 * @param {Object} articleData - The article details including fileUrl if any
 */
export const addArticle = async (articleData) => {
  const newArticle = {
    ...articleData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "articles"), newArticle);
  return docRef.id;
};

/**
 * Updates an existing article in Firestore.
 * @param {string} id - The article ID
 * @param {Object} data - The updated article data
 */
export const updateArticle = async (id, data) => {
  const docRef = doc(db, "articles", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Gets all articles authored by a specific user.
 * @param {string} userId - The author's UID
 */
export const getUserArticles = async (userId) => {
  const q = query(
    collection(db, "articles"), 
    where("authorId", "==", userId)
  );
  
  const querySnapshot = await getDocs(q);
  const articles = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Sort in memory to avoid Firestore index requirements
  articles.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  return articles;
};

/**
 * Gets all articles with a specific status (handles capitalization variations)
 */
export const getArticlesByStatus = async (status) => {
  let statuses = [status];
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus === "published") {
    statuses = ["published", "Published"];
  } else if (lowerStatus === "pending" || lowerStatus === "pending review") {
    statuses = ["pending", "Pending Review", "pending review", "Pending"];
  } else if (lowerStatus === "draft") {
    statuses = ["draft", "Draft"];
  } else if (lowerStatus === "rejected") {
    statuses = ["rejected", "Rejected"];
  }

  const q = query(
    collection(db, "articles"), 
    where("status", "in", statuses)
  );
  
  const querySnapshot = await getDocs(q);
  const articles = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Sort in memory to avoid Firestore index requirements
  articles.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  return articles;
};

/**
 * Get a single article by ID
 */
export const getArticleById = async (id) => {
  const docRef = doc(db, "articles", id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Article not found");
  }
};

/**
 * Update article status (and optionally other fields)
 */
export const updateArticleStatus = async (id, status, editorialNotes = "") => {
  const docRef = doc(db, "articles", id);
  await updateDoc(docRef, {
    status,
    editorialNotes,
    updatedAt: serverTimestamp()
  });
};

// --- USERS ---

/**
 * Get user profile details
 */
export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() };
  }
  return null;
};

/**
 * Create user profile
 */
export const createUserProfile = async (uid, email, role = "user") => {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, {
    email,
    role,
    createdAt: serverTimestamp()
  });
};
