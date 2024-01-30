import { Navbar } from "./_components/navbar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full">
			<div className="fixed inset-x-0 top-0 z-10 h-14 w-full">
				<Navbar />
			</div>
			<main className="h-full pt-10">{children}</main>
		</div>
	)
}

export default DashboardLayout
