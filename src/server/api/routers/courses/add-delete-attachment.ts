import { TRPCError } from "@trpc/server"
import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { z } from "zod"
import { ProtectedCTX } from "../../trpc"

export let addAttachmentDTO = z.object({
	courseId: z.string().min(1),
	url: z.string().min(1),
	name: z.string().min(1),
})

type AddAttachmentDTO = z.infer<typeof addAttachmentDTO>
export async function addAttachment({ ctx, input }: { ctx: ProtectedCTX; input: AddAttachmentDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { courseId, url, name } = input
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]
	if (!ownCourse) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	await db.insert(schema.attachments).values({
		url,
		name,
		courseId: courseId,
	})
	let attachment = (
		await db
			.selectDistinct()
			.from(schema.attachments)
			.where(and(eq(schema.attachments.url, url), eq(schema.attachments.courseId, courseId)))
	)[0]
	return attachment
}

export let deleteAttachmentDTO = z.object({
	courseId: z.string().min(1),
	attachmentId: z.string().min(1),
})

type DeleteAttachmentDTO = z.infer<typeof deleteAttachmentDTO>
export async function deleteAttachment({ ctx, input }: { ctx: ProtectedCTX; input: DeleteAttachmentDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { courseId, attachmentId } = input
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]

	if (!ownCourse) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	let attachment = (
		await db
			.selectDistinct()
			.from(schema.attachments)
			.where(and(eq(schema.attachments.id, attachmentId), eq(schema.attachments.courseId, courseId)))
	)[0]

	await db
		.delete(schema.attachments)
		.where(and(eq(schema.attachments.id, attachmentId), eq(schema.attachments.courseId, courseId)))

	return attachment
}
