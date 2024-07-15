import { TRPCReactProvider } from "@/trpc/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	console.log("src/app/r-test/fetch-trpc/layout.tsx")
	return (
		<TRPCReactProvider>
			<div>{children}</div>
		</TRPCReactProvider>
	)
}
