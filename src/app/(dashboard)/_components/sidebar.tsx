import Link from "next/link"
import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"

export const Sidebar = () => {
	return (
		<div className=" flex flex-col border-r bg-white shadow-sm md:h-full">
			<Link href="/" className="p-6">
				<Logo />
			</Link>
			<div className="flex w-full flex-col">
				<SidebarRoutes />
			</div>
		</div>
	)
}
