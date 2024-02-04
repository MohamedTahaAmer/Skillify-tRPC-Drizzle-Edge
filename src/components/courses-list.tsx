import { CourseCard } from "@/components/course-card"
import type {
	CategoriesSelect,
	ChaptersSelect,
	CoursesSelect,
} from "@/server/db/schema"

type CourseWithProgressWithCategory = CoursesSelect & {
	category: CategoriesSelect | null
	chapters: { id: ChaptersSelect["id"] }[]
	progress?: number
}

interface CoursesListProps {
	items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({ items }: CoursesListProps) => {
	return (
		<div className="">
			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
				{items.map((item) => (
					<CourseCard
						key={item.id}
						id={item.id}
						title={item.title}
						imageUrl={item.imageUrl!}
						chaptersLength={item.chapters.length}
						price={item.price!}
						progress={item.progress}
						category={item?.category?.name ?? ""}
					/>
				))}
			</div>
			{items.length === 0 && (
				<div className="mt-10 text-center text-sm text-muted-foreground">
					No courses found
				</div>
			)}
		</div>
	)
}
