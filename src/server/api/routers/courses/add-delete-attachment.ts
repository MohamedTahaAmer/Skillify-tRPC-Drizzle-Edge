import { TRPCError } from "@trpc/server"
import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"
export async function addAttachment({
	courseId,
	url,
	name,
	userId,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	userId: schema.CoursesSelect["userId"]
	url: schema.AttachmentsSelect["url"]
	name: schema.AttachmentsSelect["url"]
	db: PlanetScaleDatabase<typeof schema>
}) {
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]
	if (!ownCourse)
		throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	await db.insert(schema.attachments).values({
		url,
		name,
		courseId: courseId,
	})
	let attachment = (
		await db
			.selectDistinct()
			.from(schema.attachments)
			.where(
				and(
					eq(schema.attachments.url, url),
					eq(schema.attachments.courseId, courseId),
				),
			)
	)[0]
	return attachment
}

export async function deleteAttachment({
	attachmentId,
	courseId,
	userId,
	db,
}: {
	attachmentId: schema.AttachmentsSelect["id"]
	courseId: schema.CoursesSelect["id"]
	userId: schema.CoursesSelect["userId"]
	db: PlanetScaleDatabase<typeof schema>
}) {
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]

	if (!ownCourse)
		throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	let attachment = (
		await db
			.selectDistinct()
			.from(schema.attachments)
			.where(
				and(
					eq(schema.attachments.id, attachmentId),
					eq(schema.attachments.courseId, courseId),
				),
			)
	)[0]

	await db
		.delete(schema.attachments)
		.where(
			and(
				eq(schema.attachments.id, attachmentId),
				eq(schema.attachments.courseId, courseId),
			),
		)

	return attachment
}
