"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { createUserProfile } from "@/firebase/db";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save profile with role
      await createUserProfile(user.uid, email, role);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Email ini sudah terdaftar. Silakan gunakan email lain atau login.");
      } else {
        setError("Gagal mendaftar: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-academic-pattern min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Register Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle decorative background element in card */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-fixed rounded-full mix-blend-multiply filter opacity-50"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary-fixed rounded-full mix-blend-multiply filter opacity-50"></div>
          
          {/* Header Section */}
          <div className="text-center mb-8 relative z-10">
            <div className="flex justify-center mb-4">
              <img 
                alt="Portal Terpadu Kampus Logo" 
                className="w-20 h-20 object-contain rounded-lg" 
                src="/logo.svg"
              />
            </div>
            <h1 className="font-headline-md text-on-surface mb-2">Portal Terpadu Kampus</h1>
            <p className="font-body-sm text-on-surface-variant">Buat Akun Baru</p>
          </div>
          
          {/* Register Form */}
          <form className="space-y-6 relative z-10" onSubmit={handleRegister}>
            {/* Email Field */}
            <div>
              <label className="block font-label-md text-on-surface mb-2" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-sm focus:outline-none focus:ring-4 focus:border-primary transition-shadow" 
                  id="email" 
                  name="email" 
                  placeholder="admin@university.edu" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block font-label-md text-on-surface mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-sm focus:outline-none focus:ring-4 focus:border-primary transition-shadow" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>


            
            {/* Submit Button */}
            <div>
              {error && (
                <div className="mb-4 flex items-start gap-2 text-error font-body-sm bg-error-container p-3 rounded-lg border border-error text-left">
                  <span className="material-symbols-outlined shrink-0 text-[18px] mt-0.5">error</span>
                  <span>{error}</span>
                </div>
              )}
              <button 
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-on-primary bg-primary-container hover:bg-primary focus:outline-none focus:ring-4 transition-colors active:opacity-80 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="font-body-sm text-on-surface-variant">Already have an account? </span>
              <Link href="/" className="font-label-sm text-primary hover:text-primary-container transition-colors">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
