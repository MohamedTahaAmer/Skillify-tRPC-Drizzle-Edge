"use client"
import { DollarsSVG } from "@/components/SVGs/Dollars"
import qs from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Route } from "next"

const Purchased = () => {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	let isPurchased = searchParams.get("purchased")
	let searchParamsValues = Object.fromEntries(searchParams.entries())
	const onClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					...searchParamsValues,
					purchased: isPurchased ? null : "true",
				},
			},
			{ skipNull: true, skipEmptyString: true },
		) as Route

		router.push(url)
	}
	return (
		<div className="justify-self-end">
			<button
				onClick={onClick}
				className={cn(
					"flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700",
					isPurchased && "border-sky-700 bg-sky-200/20 text-sky-800",
				)}
				type="button"
			>
				<DollarsSVG className="size-5" />
				<p className="truncate">Purchased</p>
			</button>
		</div>
	)
}

export default Purchased
