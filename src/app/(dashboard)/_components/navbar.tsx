import { NavbarRoutes } from "@/components/navbar-routes"

import { MobileSidebar } from "./mobile-sidebar"
import { auth } from "@clerk/nextjs"
import Link from "next/link"
import { Logo } from "./logo"

export const Navbar = () => {
	let { userId } = auth()
	return (
		<div className="flex h-full items-center border-b bg-white px-6 shadow-sm">
			<Link href="/" className="p-2">
				<Logo />
			</Link>
			<MobileSidebar />
			<NavbarRoutes userId={userId} />
		</div>
	)
}
