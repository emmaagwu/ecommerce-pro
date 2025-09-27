"use client";

import { AuthForm } from "@/components/auth/AuthForm"
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register)
  const router = useRouter()

  const handleRegister = async (email: string, password: string, fullName?: string) => {
    await register(email, password, fullName || "")
    router.push("/") // redirect to home after registration
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-border">
        {/* Left: Illustration / Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-primary-50 px-8 py-12 w-1/2 relative">
          <Image
            src="/images/register-illustration.svg"
            alt="Register Illustration"
            width={320}
            height={320}
            className="mb-8"
            priority
          />
          <h2 className="text-3xl font-bold text-primary mb-2">Create your account</h2>
          <p className="text-gray-500 text-lg text-center">
            Register to unlock the best deals, track orders, and more!
          </p>
        </div>
        {/* Right: Register Form */}
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
            <h1 className="text-2xl font-bold text-primary mb-1">Sign up to get started</h1>
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
          <AuthForm type="register" onSubmit={handleRegister} />
          <div className="mt-6 flex flex-col items-center">
            <div className="text-xs text-gray-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link> &{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}