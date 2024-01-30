import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { TRPCError } from "@trpc/server"
export async function addChapter({
	courseId,
	title,
	userId,
	db
}: {
	courseId: string
	userId: string
	title: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const courseOwner = await db.course.findUnique({
		where: {
			id: courseId,
			userId: userId
		}
	})

	if (!courseOwner) throw new TRPCError({ code: "FORBIDDEN" })

	const lastChapter = await db.chapter.findFirst({
		where: {
			courseId: courseId
		},
		orderBy: {
			position: "desc"
		}
	})

	const newPosition = lastChapter ? lastChapter.position + 1 : 1

	const chapter = await db.chapter.create({
		data: {
			title,
			courseId: courseId,
			position: newPosition
		}
	})

	return chapter
}
