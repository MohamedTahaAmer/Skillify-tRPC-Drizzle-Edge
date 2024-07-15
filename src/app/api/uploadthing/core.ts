import { auth } from "@clerk/nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"

import { isTeacher } from "@/lib/teacher"

const f = createUploadthing()

const handleAuth = () => {
	const { userId } = auth()
	const isAuthorized = isTeacher(userId)

	if (!userId ?? !isAuthorized) throw new Error("Unauthorized")
	return { userId }
}

export const ourFileRouter = {
	courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(handleAuth)
		.onUploadComplete((image) => {
			console.log(image.file.name, "Was Uploaded")
		}),
	courseAttachment: f(["text", "image", "video", "audio", "pdf"])
		.middleware(handleAuth)
		.onUploadComplete((attachment) => {
			console.log(attachment.file.name, "Was Uploaded")
		}),
	chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
		.middleware(handleAuth)
		.onUploadComplete((video) => {
			console.log(video.file.name, "Was Uploaded")
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
