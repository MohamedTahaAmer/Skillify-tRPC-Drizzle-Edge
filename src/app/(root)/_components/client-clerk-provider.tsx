"use client"
import { ClerkProvider } from "@clerk/nextjs"

const ClientClerkProvider = ({ children }: { children: React.ReactNode }) => {
	return <ClerkProvider>{children}</ClerkProvider>
}

export default ClientClerkProvider
