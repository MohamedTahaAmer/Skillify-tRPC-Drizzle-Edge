import ClientClerkProvider from "../(root)/_components/client-clerk-provider"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClientClerkProvider>
			<div className="flex h-full items-center justify-center">{children}</div>
		</ClientClerkProvider>
	)
}

export default AuthLayout
