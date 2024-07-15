import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import type { CategoriesSelect } from "@/server/db/schema"
import { Menu } from "lucide-react"
import { CategoryItem } from "./category-item"
import ClearFilters from "./clear-filters"
import { MobileCategoryItem } from "./mobile-category-items"
import ShowPurchased from "./show-purchased"
import { Suspense } from "react"
import { MobileCategoryItemSkeleton } from "./skeletons/mobile-category-item"
import { CategoryItemSkeleton } from "./skeletons/category-item"

interface CategoriesProps {
	items: (CategoriesSelect | null)[]
}
export const Categories = ({ items }: CategoriesProps) => {
	return (
		<div className="flex w-full items-center justify-between pb-4 xl:mx-auto xl:w-[1200px]">
			{/* mobile Categories */}
			<div className="xl:hidden">
				<Sheet>
					<SheetTrigger className="flex items-center gap-x-2 rounded-full border border-slate-200 px-3 py-2 pr-4 text-sm transition hover:border-sky-700 hover:opacity-75 xl:hidden">
						Categories
						<Menu className="size-5" />
					</SheetTrigger>
					<SheetContent side="left" className="w-1/2 bg-white p-0 sm:max-w-64">
						<SheetClose asChild>
							<div className="flex flex-col pt-10">
								{items.map(
									(item) =>
										item && (
											<Suspense
												key={item.id}
												fallback={<MobileCategoryItemSkeleton label={item.name} iconName={item.name} />}
											>
												<MobileCategoryItem label={item.name} iconName={item.name} value={item.id} />
											</Suspense>
										),
								)}
							</div>
						</SheetClose>
					</SheetContent>
				</Sheet>
			</div>

			{/* Desctop Categories */}
			<div className="hidden items-center gap-x-2 overflow-x-auto xl:flex">
				{items.map(
					(item) =>
						item && (
							<Suspense key={item.id} fallback={<CategoryItemSkeleton label={item.name} iconName={item.name} />}>
								<CategoryItem label={item.name} iconName={item.name} value={item.id} />
							</Suspense>
						),
				)}
			</div>

			<div className="flex items-center gap-2">
				<Suspense fallback={null}>
					<ShowPurchased />
				</Suspense>
				<ClearFilters />
			</div>
		</div>
	)
}
