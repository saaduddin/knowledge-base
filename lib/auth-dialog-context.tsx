"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AuthDialogContextType {
  isOpen: boolean
  openAuthDialog: () => void
  closeAuthDialog: () => void
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(undefined)

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AuthDialogContext.Provider
      value={{
        isOpen,
        openAuthDialog: () => setIsOpen(true),
        closeAuthDialog: () => setIsOpen(false),
      }}
    >
      {children}
    </AuthDialogContext.Provider>
  )
}

export function useAuthDialog() {
  const context = useContext(AuthDialogContext)
  if (!context) {
    throw new Error("useAuthDialog must be used within AuthDialogProvider")
  }
  return context
}
