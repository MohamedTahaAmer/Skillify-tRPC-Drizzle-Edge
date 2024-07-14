"use client"
import { CourseCard } from "@/components/course-card"
import { useProgressMap } from "@/hooks/use-progress-map"
import { useUser } from "@/hooks/useUser"
import type {
	CategoriesSelect,
	ChaptersSelect,
	CoursesSelect,
} from "@/server/db/schema"
import { api } from "@/trpc/react"
import { useSearchParams } from "next/navigation"

type CourseWithProgressWithCategory = CoursesSelect & {
	category: CategoriesSelect | null
	chapters: { id: ChaptersSelect["id"] }[]
	progress?: number
}

interface CoursesListProps {
	items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({ items }: CoursesListProps) => {
	let searchParams = Object.fromEntries(useSearchParams().entries())
	let categoryId = searchParams.categoryId
	let title = searchParams.title

	let filteredItems = items
	categoryId &&
		(filteredItems = filteredItems.filter(
			(course) => course.categoryId === categoryId,
		))

	// - weird TS error, it should be able to infer the title will be string only after && check
	// this is happening only in this file, in 'progress-info-cards.tsx' it works fine
	title?.length &&
		(filteredItems = filteredItems.filter((course) => {
			return course.title.includes(title!)
		}))

	let { user } = useUser()
	let userId = user?.id
	let { progressMap, setProgressMap } = useProgressMap()

	api.get.getUserCoursesWithProgress.useQuery(
		{
			userId: userId ?? "",
		},
		{
			enabled: !!userId,
			refetchOnMount: false,
			onSuccess: (data) => {
				let originalProgressMap = data.reduce(
					(acc, course) => {
						let totalNumOfChapters = course.chapters.length
						let numOfCompletedChapters = course.chapters.reduce(
							(acc, chapter) => {
								if (chapter.userProgress[0]?.isCompleted) {
									acc++
								}
								return acc
							},
							0,
						)
						let progress = Math.round(
							(numOfCompletedChapters / totalNumOfChapters) * 100,
						)
						acc[course.id] = progress
						return acc
					},
					{} as Record<string, number>,
				)
				setProgressMap(originalProgressMap)
			},
		},
	)

	return (
		<>
			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
				{items.map((item) => (
					<CourseCard
						key={item.id}
						id={item.id}
						title={item.title}
						imageUrl={item.imageUrl!}
						chaptersLength={item.chapters.length}
						price={item.price!}
						progress={progressMap?.[item.id]}
						category={item?.category?.name ?? ""}
					/>
				))}
			</div>
			{items.length === 0 && (
				<div className="mt-10 text-center text-sm text-muted-foreground">
					No courses found
				</div>
			)}
		</>
	)
}
