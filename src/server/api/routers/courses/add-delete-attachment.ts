import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { TRPCError } from "@trpc/server"
export async function addAttachment({
	courseId,
	url,
	userId,
	db,
}: {
	courseId: string
	userId: string
	url: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const courseOwner = await db.course.findUnique({
		where: {
			id: courseId,
			userId: userId,
		},
	})

	if (!courseOwner)
		throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	const attachment = await db.attachment.create({
		data: {
			url,
			name: url.split("/").pop() ?? "",
			courseId: courseId,
		},
	})

	return attachment
}

export async function deleteAttachment({
	attachmentId,
	courseId,
	userId,
	db,
}: {
	attachmentId: string
	courseId: string
	userId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const courseOwner = await db.course.findUnique({
		where: {
			id: courseId,
			userId: userId,
		},
	})

	if (!courseOwner)
		throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })
	const attachment = await db.attachment.delete({
		where: {
			courseId: courseId,
			id: attachmentId,
		},
	})

	return attachment
}
