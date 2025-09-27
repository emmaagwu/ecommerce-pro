"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface AuthFormProps {
  type: "login" | "register"
  onSubmit: (email: string, password: string, fullName?: string) => Promise<void>
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(email, password, fullName)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
      autoComplete="on"
      aria-label={type === "login" ? "Login form" : "Register form"}
    >
      {type === "register" && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1 text-gray-700">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input input-bordered w-full py-2 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition"
            required
            autoComplete="name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="e.g. you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full py-2 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition"
          required
          autoComplete="email"
        />
      </div>

      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full py-2 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition pr-10"
          required
          minLength={6}
          autoComplete={type === "login" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute top-8 right-3 flex items-center text-gray-400 hover:text-primary"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        className="w-full py-2 font-semibold text-base rounded-lg"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Please wait...
          </span>
        ) : type === "login" ? "Login" : "Register"}
      </Button>
    </form>
  )
}