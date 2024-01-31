import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider, auth } from "@clerk/nextjs"
import { ToastProvider } from "@/components/providers/toaster-provider"
import { ConfettiProvider } from "@/components/providers/confetti-provider"
import { TRPCReactProvider } from "@/trpc/react"
import { Navbar } from "./(dashboard)/_components/navbar"

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
	const { userId } = auth()
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<ConfettiProvider />
					<ToastProvider />
					<TRPCReactProvider>
						<div className="fixed inset-x-0 top-0 z-10 h-14 w-full">
							<Navbar userId={userId ?? ""} />
						</div>
						<div className="pt-14">{children}</div>
						{/* <Run /> */}
					</TRPCReactProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
