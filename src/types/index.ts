import type { schema } from "@/server/db"

export type ChapterWithProgress = schema.ChaptersSelect & {
	userProgress: schema.UserProgressSelect[]
}
export type Course = schema.CoursesSelect & {
	chapters: ChapterWithProgress[]
	purchases: schema.PurchasesSelect[]
  attachments: schema.AttachmentsSelect[]
}
