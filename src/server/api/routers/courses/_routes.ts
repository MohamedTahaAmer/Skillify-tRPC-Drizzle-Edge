import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { addAttachment, addAttachmentDTO, deleteAttachment, deleteAttachmentDTO } from "./add-delete-attachment"
import { checkout, checkoutDTO } from "./checkout"
import { createCourse, createCourseDTO } from "./create-course"
import { deleteCourse, deleteCourseDTO, patchCourse, patchCourseDTO } from "./delete-patch-course"
import { publishCourse, publishCourseDTO, unpublishCourse, unpublishCourseDTO } from "./un-publish"
import updateProgress, { updateProgressDTO } from "./update-progress"
import { z } from "zod"

export const coursesRouter = createTRPCRouter({
	checkout: protectedProcedure.input(checkoutDTO).output(z.promise(z.string().nullable())).mutation(checkout),
	updateProgress: protectedProcedure.input(updateProgressDTO).mutation(updateProgress),
	publish: protectedProcedure.input(publishCourseDTO).mutation(publishCourse),
	unpublish: protectedProcedure.input(unpublishCourseDTO).mutation(unpublishCourse),
	patchCourse: protectedProcedure.input(patchCourseDTO).mutation(patchCourse),
	deleteCourse: protectedProcedure.input(deleteCourseDTO).mutation(deleteCourse),
	addAttachment: protectedProcedure.input(addAttachmentDTO).mutation(addAttachment),
	deleteAttachment: protectedProcedure.input(deleteAttachmentDTO).mutation(deleteAttachment),
	create: protectedProcedure.input(createCourseDTO).mutation(createCourse),
})
