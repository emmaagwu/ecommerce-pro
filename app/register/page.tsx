"use client";

import { AuthForm } from "@/components/auth/AuthForm"
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register)
  const router = useRouter()

  const handleRegister = async (email: string, password: string, fullName?: string) => {
    await register(email, password, fullName || "")
    router.push("/") // redirect to home after registration
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  )
}