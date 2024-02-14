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

interface MobileCategoryItemSkeletonProps {
	label: string
	iconName: string
}

export const MobileCategoryItemSkeleton = ({
	label,
	iconName,
}: MobileCategoryItemSkeletonProps) => {
	let Icon = iconMap[iconName]

	return (
		<button
			className={cn(
				"flex items-center justify-between gap-x-2 pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
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
				)}
			/>
		</button>
	)
}
