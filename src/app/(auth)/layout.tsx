export const runtime = "edge"
export const preferredRegion = "cle1"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex h-full items-center justify-center">{children}</div>
	)
}

export default AuthLayout
