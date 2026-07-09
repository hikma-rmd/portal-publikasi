"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Email atau password salah. Silakan coba lagi.");
      } else {
        setError("Gagal login: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-academic-pattern min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle decorative background element in card */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-fixed rounded-full mix-blend-multiply filter opacity-50"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary-fixed rounded-full mix-blend-multiply filter opacity-50"></div>
          
          {/* Header Section */}
          <div className="text-center mb-8 relative z-10">
            <div className="flex justify-center mb-4">
              <img 
                alt="SIMADU Logo" 
                className="w-20 h-20 object-contain rounded-lg" 
                src="/logo.svg"
              />
            </div>
            <h1 className="font-headline-md text-on-surface mb-2">SIMADU</h1>
            <p className="font-body-sm text-on-surface-variant">Organisasi Kampus</p>
          </div>
          
          {/* Login Form */}
          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
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
              <div className="flex items-center justify-between mb-2">
                <label className="block font-label-md text-on-surface" htmlFor="password">Password</label>
                <a className="font-label-sm text-primary hover:text-primary-container transition-colors" href="#">Forgot password?</a>
              </div>
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
                />
              </div>
            </div>
            
            {/* Remember Me & Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  className="h-4 w-4 text-primary border-outline-variant rounded bg-surface-container-lowest" 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox"
                />
                <label className="ml-2 block font-body-sm text-on-surface-variant" htmlFor="remember-me">
                  Remember me
                </label>
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
                {loading ? "Logging in..." : "Login to Portal"}
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="font-body-sm text-on-surface-variant">Don't have an account? </span>
              <a href="/register" className="font-label-sm text-primary hover:text-primary-container transition-colors">
                Register here
              </a>
            </div>
          </form>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="font-body-sm text-on-surface-variant">
            © 2026 CampusPub CMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
