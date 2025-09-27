"use client";

import { AuthForm } from "@/components/auth/AuthForm"
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
    router.push("/") // redirect to home after login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-border">
        {/* Left: Illustration / Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-primary-50 px-8 py-12 w-1/2 relative">
          <Image
            src="/images/login-illustration.svg"
            alt="Login Illustration"
            width={320}
            height={320}
            className="mb-8"
            priority
          />
          <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back!</h2>
          <p className="text-gray-500 text-lg text-center">
            Log in to access your account and explore our amazing deals.
          </p>
        </div>
        {/* Right: Login Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 py-10 px-6 md:px-12">
          <div className="mb-8 flex flex-col items-center">
            <Image
              src="/logo.svg"
              alt="App Logo"
              width={64}
              height={64}
              className="mb-3"
              priority
            />
            <h1 className="text-2xl font-bold text-primary mb-1">Sign in to your account</h1>
            <p className="text-gray-500 text-sm">New here? <Link href="/register" className="text-primary hover:underline font-medium">Create an account</Link></p>
          </div>
          <AuthForm type="login" onSubmit={handleLogin} />
          <div className="mt-6 flex flex-col items-center">
            <Link href="/forgot-password" className="text-xs text-primary hover:underline mb-3">Forgot Password?</Link>
            <div className="text-xs text-gray-400">
              By continuing, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms</Link> & <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}