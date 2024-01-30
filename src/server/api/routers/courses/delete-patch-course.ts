import Mux from "@mux/mux-node"
import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { TRPCError } from "@trpc/server"

import { env } from "@/env"
import { z } from "zod"

const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET)
export async function deleteCourse({
	courseId,
	userId,
	db,
}: {
	courseId: string
	userId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const course = await db.course.findUnique({
		where: {
			id: courseId,
			userId: userId,
		},
		include: {
			chapters: {
				include: {
					muxData: true,
				},
			},
		},
	})

	if (!course)
		throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })
	for (const chapter of course.chapters) {
		if (chapter.muxData?.assetId) {
			await Video.Assets.del(chapter.muxData.assetId)
		}
	}

	const deletedCourse = await db.course.delete({
		where: {
			id: courseId,
		},
	})

	return deletedCourse
}

export let courseValidator = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	price: z.number().optional(),
	categoryId: z.string().optional(),
})
type courseValidatorType = z.infer<typeof courseValidator>
export async function patchCourse({
	courseId,
	userId,
	courseNewValues,
	db,
}: {
	courseId: string
	userId: string
	courseNewValues: courseValidatorType
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const course = await db.course.update({
		where: {
			id: courseId,
			userId,
		},
		data: {
			...courseNewValues,
		},
	})

	return course
}
