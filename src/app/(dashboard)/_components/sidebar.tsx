import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"

export const Sidebar = () => {
	return (
		<div className=" border-r md:h-full flex flex-col bg-white shadow-sm">
			<div className="p-6">
				<Logo />
			</div>
			<div className="flex flex-col w-full">
				<SidebarRoutes />
			</div>
		</div>
	)
}
