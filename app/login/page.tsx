"use client";

import { AuthForm } from "@/components/auth/AuthForm"
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
    router.push("/") // redirect to home after login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  )
}