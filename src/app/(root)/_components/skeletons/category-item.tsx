import type { IconType } from "react-icons"

import { cn } from "@/lib/utils"
import {
	FcEngineering,
	FcMultipleDevices,
	FcOldTimeCamera,
	FcSalesPerformance,
	FcSportsMode,
} from "react-icons/fc"

const iconMap: Record<string, IconType> = {
	Photography: FcOldTimeCamera as IconType,
	Fitness: FcSportsMode as IconType,
	Accounting: FcSalesPerformance as IconType,
	"Computer Science": FcMultipleDevices as IconType,
	Engineering: FcEngineering as IconType,
}
interface CategoryItemSkeletonProps {
	label: string
	iconName: string
}

export const CategoryItemSkeleton = ({
	label,
	iconName,
}: CategoryItemSkeletonProps) => {
	let Icon = iconMap[iconName]

	return (
		<button
			className={cn(
				"flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700",
			)}
			type="button"
		>
			{Icon && <Icon size={20} />}
			<div className="truncate">{label}</div>
		</button>
	)
}
