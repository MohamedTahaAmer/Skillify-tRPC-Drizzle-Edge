"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export const SearchInputSkeleton = () => {
	return (
		<div className="relative">
			<Search className="absolute left-3 top-3 size-4 text-slate-600" />
			<Input
				className="w-full rounded-full bg-sky-100 pl-9 ring-offset-slate-500 focus-visible:ring-blue-200"
				placeholder="Search for a course"
			/>
		</div>
	)
}
