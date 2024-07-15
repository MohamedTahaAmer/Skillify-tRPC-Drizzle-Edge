import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { addChapter, addChapterDTO } from "./add-chapter"
import { deleteChapter, deleteChapterDTO } from "./delete-chapter"
import { patchChapter, patchChapterDTO } from "./patch-chapter"
import { reorderChapters, reorderChaptersDTO } from "./reorder-chapters"
import { publishChapter, publishChapterDTO, unpublishChapter, unpublishChapterDTO } from "./un-publish"
export const chaptersRouter = createTRPCRouter({
	addChapter: protectedProcedure.input(addChapterDTO).mutation(addChapter),
	reorderChapters: protectedProcedure.input(reorderChaptersDTO).mutation(reorderChapters),
	deleteChapter: protectedProcedure.input(deleteChapterDTO).mutation(deleteChapter),
	patchChapter: protectedProcedure.input(patchChapterDTO).mutation(patchChapter),
	publishChapter: protectedProcedure.input(publishChapterDTO).mutation(publishChapter),
	unPublishChapter: protectedProcedure.input(unpublishChapterDTO).mutation(unpublishChapter),
})
