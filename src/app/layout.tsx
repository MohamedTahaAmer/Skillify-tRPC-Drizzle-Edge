import { ConfettiProvider } from "@/components/providers/confetti-provider"
import { ToastProvider } from "@/components/providers/toaster-provider"
import { TRPCReactProvider } from "@/trpc/react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import NavbarWithClerkProvider from "./_components/navbar-with-clerk-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Skillify",
	description: "Level up your skills",
	icons: [{ rel: "icon", url: "/favicon.svg" }],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ConfettiProvider />
				<ToastProvider />
				<TRPCReactProvider>
					<div className="fixed inset-x-0 top-0 z-10 h-14 w-full">
						<NavbarWithClerkProvider />
					</div>
					<div className="pt-14">{children}</div>
				</TRPCReactProvider>
			</body>
		</html>
	)
}
