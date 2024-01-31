"use client"

import qs from "query-string"
import type { IconType } from "react-icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import type { Route } from "next"

interface MobileCategoryItemProps {
	label: string
	value?: string
	icon?: IconType
}

export const MobileCategoryItem = ({
	label,
	value,
	icon: Icon,
}: MobileCategoryItemProps) => {
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

	return (
		<button
			onClick={onClick}
			className={cn(
				"flex items-center justify-between gap-x-2 pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
				isSelected &&
					"bg-sky-200/20 text-sky-700 hover:bg-sky-200/40 hover:text-sky-700",
			)}
			type="button"
		>
			<div className="flex items-center gap-x-2 py-4">
				{Icon && <Icon size={20} />}
				<div className="truncate">{label}</div>
			</div>
			<div
				className={cn(
					"w-0 self-stretch justify-self-end border-2 border-sky-700 opacity-0 transition-all",
					isSelected && "opacity-100",
				)}
			/>
		</button>
	)
}
