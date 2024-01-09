"use client"

import { LucideIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

interface SidebarItemProps {
	icon: LucideIcon
	label: string
	activePath: string
}

export const SidebarItem = ({
	icon: Icon,
	label,
	activePath
}: SidebarItemProps) => {
	const pathname = usePathname()
	const router = useRouter()

	// >(8-1-2024:2)
	let exactMatch = pathname === activePath
	let isNestedChild = pathname.startsWith(`${activePath}/`)
	const isActive = exactMatch || isNestedChild

	const onClick = () => {
		router.push(activePath)
	}

	return (
		<button
			onClick={onClick}
			type="button"
			// >(9-1-2024:1)
			// this was a flex, but hence we wanna the strip to be of the height of it's parent, we had to convert it to a grid
			// - so use flex if you don't wanna control the size of any child, as flex will grow to take the height of it's tallest child, but using self-stretch on the other child won't work, as for the child it's parent 'the flex' is of height 0 as we didn't explicitly set it's height
			// - but with grid, we don't have to set the height explicitly, and self-stretch on the other child will stretch him to match his tallest sibling
			className={cn(
				"grid-cols-2 grid items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
				isActive &&
					"text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
			)}
		>
			<div className="flex items-center gap-x-2 py-4">
				<Icon
					size={22}
					className={cn("text-slate-500", isActive && "text-sky-700")}
				/>
				{label}
			</div>
			<div
				className={cn(
					" opacity-0 border-2 border-sky-700 self-stretch justify-self-end w-0 transition-all",
					isActive && "opacity-100"
				)}
			/>
		</button>
	)
}
