import type { AttachmentsSelect } from "@/server/db/schema"
import { create } from "zustand"

type CourseStore = {
	courseId?: string
	nextChapterId?: string
	isPurchased: boolean
	isLastChapterToFinishTheCourse: boolean
	attachments: AttachmentsSelect[]
	coursePrice?: number
	numberOfChapters: number

	setCourseId: (chapter: string) => void
	setNextChapterId: (chapter: string) => void
	setIsPurchased: (isPurchased: boolean) => void
	setIsLastChapterToFinishTheCourse: (
		islastChapterToFinishTheCourse: boolean,
	) => void
	setAttachments: (attachments: AttachmentsSelect[]) => void
	setCoursePrice: (coursePrice: number) => void
	setNumberOfChapters: (numberOfChapters: number) => void
}

export const useCourse = create<CourseStore>((set) => ({
	courseId: undefined,
	setCourseId: (courseId: string) => set({ courseId }),

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

	numberOfChapters: 0,
	setNumberOfChapters: (numberOfChapters: number) => set({ numberOfChapters }),
}))
