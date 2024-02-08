"use client"
import { cn } from "@/lib/utils"
import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"
import qs from "query-string"
import { FcClearFilters } from "react-icons/fc"

const ClearFilters = () => {
	const pathname = usePathname()
	const router = useRouter()
	const onClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {},
			},
			{ skipNull: true, skipEmptyString: true },
		) as Route

		router.push(url)
	}

	return (
		<button
			onClick={onClick}
			className={cn(
				"flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700",
			)}
			type="button"
		>
			<FcClearFilters className="size-5" />
			<div className="truncate">Clear</div>
		</button>
	)
}

export default ClearFilters
