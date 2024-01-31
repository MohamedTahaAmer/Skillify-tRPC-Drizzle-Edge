import type { Chapter, Course, UserProgress } from "@prisma/client"
import { Menu } from "lucide-react"

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet"

import { CourseSidebar } from "./course-sidebar"

interface CourseMobileSidebarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null
		})[]
	}
	progressCount: number
}

export const CourseMobileSidebar = ({
	course,
	progressCount,
}: CourseMobileSidebarProps) => {
	return (
		<Sheet>
			<SheetTrigger className="flex items-center gap-2 rounded-full border border-sky-300 bg-slate-100 px-4 py-1 text-lg font-bold text-sky-800 transition hover:opacity-75 xl:hidden">
				Chapters
				<Menu />
			</SheetTrigger>
			<SheetContent side="left" className="w-72 bg-white p-0">
				<SheetClose asChild>
					<div>
						<h1 className="truncate px-8 pt-8 text-lg font-bold text-emerald-700">
							{course.title}
						</h1>
						<CourseSidebar course={course} progressCount={progressCount} />
					</div>
				</SheetClose>
			</SheetContent>
		</Sheet>
	)
}
