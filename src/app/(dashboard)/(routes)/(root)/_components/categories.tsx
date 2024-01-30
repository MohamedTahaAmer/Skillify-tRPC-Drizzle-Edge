"use client"

import type { Category } from "@prisma/client"
import {
	FcEngineering,
	FcFilmReel,
	FcMultipleDevices,
	FcMusic,
	FcOldTimeCamera,
	FcSalesPerformance,
	FcSportsMode,
} from "react-icons/fc"
import type { IconType } from "react-icons"

import { CategoryItem } from "./category-item"
import Purchased from "./Purchased"
import ClearFilters from "./ClearFilters"

interface CategoriesProps {
	items: Category[]
}

const iconMap: Record<string, IconType> = {
	Music: FcMusic as IconType,
	Photography: FcOldTimeCamera as IconType,
	Fitness: FcSportsMode as IconType,
	Accounting: FcSalesPerformance as IconType,
	"Computer Science": FcMultipleDevices as IconType,
	Filming: FcFilmReel as IconType,
	Engineering: FcEngineering as IconType,
}

export const Categories = ({ items }: CategoriesProps) => {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-x-2 overflow-x-auto pb-2">
				{items.map((item) => (
					<CategoryItem
						key={item.id}
						label={item.name}
						icon={iconMap[item.name]}
						value={item.id}
					/>
				))}
			</div>
			<div className="flex items-center gap-2 pb-2">
				<Purchased />
				<ClearFilters />
			</div>
		</div>
	)
}
