import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ToastProvider } from "@/components/providers/toaster-provider"
import { ConfettiProvider } from "@/components/providers/confetti-provider"
import { TRPCReactProvider } from "@/trpc/react"
import Run from "./Run"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Skillify",
	description: "Level up your skills",
	icons: [{ rel: "icon", url: "/favicon.svg" }]
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<ConfettiProvider />
					<ToastProvider />
					<TRPCReactProvider>
						{children}
						<Run />
					</TRPCReactProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}