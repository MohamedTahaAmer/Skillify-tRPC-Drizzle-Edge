import type { AttachmentsSelect } from "@/server/db/schema"
import { create } from "zustand"

type CourseStore = {
	nextChapterId?: string
	isPurchased: boolean
	isLastChapterToFinishTheCourse: boolean
	attachments: AttachmentsSelect[]
	coursePrice?: number

	setNextChapterId: (chapter: string) => void
	setIsPurchased: (isPurchased: boolean) => void
	setIsLastChapterToFinishTheCourse: (
		islastChapterToFinishTheCourse: boolean,
	) => void
	setAttachments: (attachments: AttachmentsSelect[]) => void
	setCoursePrice: (coursePrice: number) => void
}

export const useCourse = create<CourseStore>((set) => ({
	nextChapterId: undefined,
	setNextChapterId: (nextChapterId: string) => set({ nextChapterId }),

	isPurchased: false,
	setIsPurchased: (isPurchased: boolean) => set({ isPurchased }),

	isLastChapterToFinishTheCourse: false,
	setIsLastChapterToFinishTheCourse: (
		isLastChapterToFinishTheCourse: boolean,
	) => set({ isLastChapterToFinishTheCourse }),

	attachments: [],
	setAttachments: (attachments: AttachmentsSelect[]) => set({ attachments }),

	coursePrice: undefined,
	setCoursePrice: (coursePrice: number) => set({ coursePrice }),
}))
