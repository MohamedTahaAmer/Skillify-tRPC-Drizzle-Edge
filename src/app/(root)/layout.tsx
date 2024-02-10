import { ConfettiProvider } from "@/components/providers/confetti-provider"
import { ToastProvider } from "@/components/providers/toaster-provider"
import { TRPCReactProvider } from "@/trpc/react"
import ClientClerkProvider from "./_components/client-clerk-provider"
import { Navbar } from "./_components/navbar"
import { Suspense } from "react"

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<ConfettiProvider />
			<ToastProvider />
			<TRPCReactProvider>
				<div className="fixed inset-x-0 top-0 z-10 h-14 w-full">
					<ClientClerkProvider>
						<Suspense fallback={null}>
							<Navbar />
						</Suspense>
					</ClientClerkProvider>
				</div>
				<div className="pt-14">{children}</div>
			</TRPCReactProvider>
		</>
	)
}
