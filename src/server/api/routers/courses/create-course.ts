import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { revalidatePath } from "next/cache"

export async function createCourse({
	title,
	userId,
	db,
}: {
	title: string
	userId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const course = await db.course.create({
		data: {
			userId,
			title,
		},
	})
	revalidatePath("/teacher/courses")

	return course
}
