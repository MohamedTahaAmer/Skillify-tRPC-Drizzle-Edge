import { NavbarRoutes } from "@/components/navbar-routes"

import { MobileSidebar } from "./mobile-sidebar"
import { auth } from "@clerk/nextjs"

export const Navbar = () => {
	let { userId } = auth()
	return (
		<div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
			<MobileSidebar />
			<NavbarRoutes userId={userId} />
		</div>
	)
}
