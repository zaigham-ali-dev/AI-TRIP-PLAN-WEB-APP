"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "An account with this email address already exists. Please sign in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "Google sign up was cancelled.";
      case "auth/popup-blocked":
        return "Sign up popup was blocked by your browser. Please allow popups.";
      default:
        return "An error occurred during account creation. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || googleLoading) return;
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName.trim(),
      });

      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          fullName: fullName.trim(),
          email: user.email,
          createdAt: serverTimestamp(),
        });
      } catch (firestoreErr) {
        console.error("Firestore write failed:", firestoreErr);
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err?.code || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (loading || googleLoading) return;
    setError(null);

    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = "/dashboard";
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(getFriendlyErrorMessage(err?.code || ""));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafc] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="w-full max-w-[980px] mx-auto flex flex-col items-center">

        {/* Main Card Container */}
        <div className="w-full bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100/90 overflow-hidden flex flex-col lg:flex-row min-h-[640px] transition-all">

          {/* Left Panel - Image with Top-Left Logo */}
          <div className="relative w-full lg:w-[46%] min-h-[260px] sm:min-h-[300px] lg:min-h-full overflow-hidden select-none">
            <Image
              src="/images/signup-hero.jpg"
              alt="Traveler standing on a mountain peak looking at magnificent valleys"
              fill
              priority
              className="object-cover object-center"
            />

            {/* Gradient overlays for top logo readability & bottom text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80 pointer-events-none" />

            {/* Top-Left Triply Logo inside Image Panel */}
            <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-black/20 group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4.5 h-4.5 text-white"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight drop-shadow-sm">
                Triply
              </span>
            </Link>

            {/* Bottom Overlay Text */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9 z-10">
              <h2 className="text-[26px] sm:text-[32px] font-extrabold text-white leading-[1.15] tracking-tight">
                Start your adventure!
              </h2>
              <p className="mt-2 text-[14px] sm:text-[15px] text-white/85 font-medium leading-relaxed max-w-[280px]">
                Join thousands of smart travelers planning better with Triply.
              </p>
            </div>
          </div>

          {/* Right Panel - Sign Up Form */}
          <div className="flex-1 flex flex-col justify-between px-6 sm:px-12 lg:px-14 py-8 sm:py-10 lg:py-12">

            <div>
              {/* Top Bar inside Right Panel: Back to Triply Link */}
              <div className="flex items-center justify-end mb-6 sm:mb-7">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Triply</span>
                </Link>
              </div>

              {/* Heading */}
              <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0e1326] tracking-tight leading-tight">
                Create an account
              </h1>
              <p className="mt-1.5 text-[14px] text-[#64748b] font-medium">
                Join Triply today! Please enter your details.
              </p>

              {/* Error Alert Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200/80 rounded-xl text-red-600 text-[13px] font-medium leading-snug">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 sm:mt-7 flex flex-col gap-4.5">
                {/* Full Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="signup-name"
                    className="text-[13px] font-bold text-[#0e1326] tracking-tight"
                  >
                    Full name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading || googleLoading}
                    className="w-full h-[46px] px-4 bg-white border border-slate-200/90 rounded-xl text-[14px] text-slate-800 placeholder-slate-400 font-normal outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all disabled:opacity-60 disabled:bg-slate-50"
                  />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="signup-email"
                    className="text-[13px] font-bold text-[#0e1326] tracking-tight"
                  >
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={loading || googleLoading}
                    className="w-full h-[46px] px-4 bg-white border border-slate-200/90 rounded-xl text-[14px] text-slate-800 placeholder-slate-400 font-normal outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all disabled:opacity-60 disabled:bg-slate-50"
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="signup-password"
                    className="text-[13px] font-bold text-[#0e1326] tracking-tight"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      disabled={loading || googleLoading}
                      className="w-full h-[46px] px-4 pr-12 bg-white border border-slate-200/90 rounded-xl text-[14px] text-slate-800 placeholder-slate-400 font-normal outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all disabled:opacity-60 disabled:bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || googleLoading}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-[18px] h-[18px]" />
                      ) : (
                        <Eye className="w-[18px] h-[18px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center gap-2.5 mt-0.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={agreeTerms}
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    disabled={loading || googleLoading}
                    className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-60 ${agreeTerms
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-slate-300 hover:border-slate-400"
                      }`}
                  >
                    {agreeTerms && (
                      <svg
                        className="w-3 h-3 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <span className="text-[13px] font-medium text-[#4b5563]">
                    I agree to the{" "}
                    <Link href="#" className="text-blue-600 font-semibold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-blue-600 font-semibold hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full h-[48px] bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-[15px] rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              {/* Sign In Link */}
              <p className="mt-5 text-center text-[13.5px] text-[#64748b] font-medium">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Social Login Footer Section */}
            <div className="mt-6 pt-4 border-t border-slate-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-200/80" />
                <span className="text-[12px] text-[#94a3b8] font-semibold whitespace-nowrap">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-slate-200/80" />
              </div>

              {/* Social Login Buttons */}
              <div className="flex items-center justify-center gap-4">
                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading || googleLoading}
                  className="w-[52px] h-[52px] rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer hover:border-slate-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Sign up with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="w-[52px] h-[52px] rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer hover:border-slate-300 active:scale-95"
                  aria-label="Sign up with Apple"
                >
                  <svg className="w-5 h-5 text-[#0e1326]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  className="w-[52px] h-[52px] rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer hover:border-slate-300 active:scale-95"
                  aria-label="Sign up with Facebook"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full text-center py-4 mt-2">
          <span className="text-[11.5px] text-[#94a3b8] font-medium">
            © 2026 Triply. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
