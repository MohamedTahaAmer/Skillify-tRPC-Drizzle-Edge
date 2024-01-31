"use client"

import { BarChart, Compass, List, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import type { Route } from "next"
import { SidebarItem } from "./sidebar-item"

type Routes = {
	icon: LucideIcon
	label: string
	activePath: Route
}[]
const guestRoutes: Routes = [
	{
		icon: Compass,
		label: "Browse",
		activePath: "/",
	},
]

const teacherRoutes: Routes = [
	{
		icon: List,
		label: "Courses",
		activePath: "/teacher/courses",
	},
	{
		icon: BarChart,
		label: "Analytics",
		activePath: "/teacher/analytics",
	},
]

export const SidebarRoutes = () => {
	const pathname = usePathname()

	const routes = pathname?.includes("/teacher") ? teacherRoutes : guestRoutes

	return (
		<div className="flex w-full flex-col">
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
