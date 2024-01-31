import { auth } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { redirect } from "next/navigation"

import { getProgress } from "@/actions/get-progress"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet"
import { db } from "@/lib/db"

import { CourseSidebar } from "./_components/course-sidebar"

const CourseLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode
	params: { courseId: string }
}) => {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
		include: {
			chapters: {
				where: {
					isPublished: true,
				},
				include: {
					userProgress: {
						where: {
							userId,
						},
					},
				},
				orderBy: {
					position: "asc",
				},
			},
		},
	})

	if (!course) {
		return redirect("/")
	}

	const progressCount = await getProgress(userId, course.id)

	return (
		<div className="h-full">
			{/* Desctop Sidebar */}
			<div className="inset-y-0 hidden h-full w-80 flex-col pt-14 xl:fixed xl:flex">
				<CourseSidebar course={course} progressCount={progressCount} />
			</div>

			{/* Mobile Sidebar */}
			<div className="fixed left-1/2 top-2 z-20 -translate-x-1/2 xl:hidden">
				<Sheet>
					<SheetTrigger className="flex items-center gap-2 rounded-full border border-sky-300 bg-slate-100 px-4 py-1 text-lg font-bold text-sky-800 transition hover:opacity-75 xl:hidden">
						Chapters
						<Menu />
					</SheetTrigger>
					<SheetContent side="left" className="w-72 bg-white p-0">
						<SheetClose asChild>
							<div>
								<CourseSidebar course={course} progressCount={progressCount} />
							</div>
						</SheetClose>
					</SheetContent>
				</Sheet>
			</div>
			<main className="h-full xl:pl-80">{children}</main>
		</div>
	)
}

export default CourseLayout
