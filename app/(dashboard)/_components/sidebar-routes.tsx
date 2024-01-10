"use client"

import { BarChart, Compass, Layout, List } from "lucide-react"
import { usePathname } from "next/navigation"

import { SidebarItem } from "./sidebar-item"

const guestRoutes = [
	{
		icon: Layout,
		label: "Dashboard",
		activePath: "/"
	},
	{
		icon: Compass,
		label: "Browse",
		activePath: "/search"
	}
]

const teacherRoutes = [
	{
		icon: List,
		label: "Courses",
		activePath: "/teacher/courses"
	},
	{
		icon: BarChart,
		label: "Analytics",
		activePath: "/teacher/analytics"
	}
]

export const SidebarRoutes = () => {
	const pathname = usePathname()

	const routes = pathname?.includes("/teacher") ? teacherRoutes : guestRoutes

	return (
		<div className="flex flex-col w-full">
			{routes.map((route) => (
				<SidebarItem
					key={route.activePath}
					icon={route.icon}
					label={route.label}
					activePath={route.activePath}
				/>
			))}
		</div>
	)
}
