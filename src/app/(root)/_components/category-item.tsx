"use client"

import qs from "query-string"
import type { IconType } from "react-icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import type { Route } from "next"
import { FcEngineering, FcMultipleDevices, FcOldTimeCamera, FcSalesPerformance, FcSportsMode } from "react-icons/fc"

const iconMap: Record<string, IconType> = {
	Photography: FcOldTimeCamera as IconType,
	Fitness: FcSportsMode as IconType,
	Accounting: FcSalesPerformance as IconType,
	"Computer Science": FcMultipleDevices as IconType,
	Engineering: FcEngineering as IconType,
}
interface CategoryItemProps {
	label: string
	value?: string
	iconName: string
}

export const CategoryItem = ({ label, value, iconName }: CategoryItemProps) => {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()

	const currentCategoryId = searchParams.get("categoryId")
	let searchParamsValues = Object.fromEntries(searchParams.entries())

	const isSelected = currentCategoryId === value

	const onClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					...searchParamsValues,
					categoryId: isSelected ? null : value,
				},
			},
			{ skipNull: true, skipEmptyString: true },
		) as Route

		router.push(url)
	}

	let Icon = iconMap[iconName]

	return (
		<button
			onClick={onClick}
			className={cn(
				"flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700",
				isSelected && "border-sky-700 bg-sky-200/20 text-sky-800",
			)}
			type="button"
		>
			{Icon && <Icon size={20} />}
			<div className="truncate">{label}</div>
		</button>
	)
}
