import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { TRPCError } from "@trpc/server"
export async function reorderChapters({
	courseId,
	list,
	userId,
	db,
}: {
	courseId: string
	userId: string
	list: {
		id: string
		position: number
	}[]
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const ownCourse = await db.course.findUnique({
		where: {
			id: courseId,
			userId: userId,
		},
	})

	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

	for (let item of list) {
		await db.chapter.update({
			where: { id: item.id },
			data: { position: item.position },
		})
	}

	return "Success"
}
