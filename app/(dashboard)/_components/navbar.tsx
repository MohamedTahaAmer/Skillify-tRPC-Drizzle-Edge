import { NavbarRoutes } from "@/components/navbar-routes"

import { MobileSidebar } from "./mobile-sidebar"
import { auth } from "@clerk/nextjs"

export const Navbar = () => {
	let { userId } = auth()
	return (
		<div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
			<MobileSidebar />
			<NavbarRoutes userId={userId} />
		</div>
	)
}
