import { auth } from "@clerk/nextjs/server"
import { Menu } from "lucide-react"
import { redirect } from "next/navigation"

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logObjSize } from "@/lib/helpers"
import { CourseSidebar } from "./_components/course-sidebar"
import PopulateCourseStore from "./_components/populate-course-store"
import RedirectToFirstChapter from "./_components/redirect-to-first-chapter"
import cachedGetCourseWithChapters from "./_utils/get-courses-with-chapters"

const CourseLayout = async ({ children, params }: { children: React.ReactNode; params: { courseId: string } }) => {
	let { userId } = auth()
	let courseId = params.courseId

	let course = await cachedGetCourseWithChapters({ userId, courseId })
	logObjSize({ title: "course", obj: course })

	if (!course) {
		return redirect("/")
	}
	let firstChapterId = course.chapters[0]?.id

	return (
		<div className="h-full">
			{/* Desktop Sidebar */}
			<div className="inset-y-0 hidden h-full w-80 flex-col pt-14 xl:fixed xl:flex">
				<CourseSidebar course={course} />
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
								<CourseSidebar course={course} />
							</div>
						</SheetClose>
					</SheetContent>
				</Sheet>
			</div>
			{firstChapterId && <RedirectToFirstChapter firstChapterId={firstChapterId} />}
			<PopulateCourseStore course={course} />
			<main className="h-full xl:pl-80">{children}</main>
		</div>
	)
}

export default CourseLayout
