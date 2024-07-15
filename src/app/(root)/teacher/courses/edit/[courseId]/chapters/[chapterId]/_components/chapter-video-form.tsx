"use client"
import MuxPlayer from "@mux/mux-player-react"
import { Pencil, PlusCircle, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import * as z from "zod"

import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import type { ChaptersSelect, MuxDataSelect } from "@/server/db/schema"
import { api } from "@/trpc/react"

interface ChapterVideoFormProps {
	initialData: ChaptersSelect & { muxData?: MuxDataSelect | null }
	courseId: string
	chapterId: string
}

const formSchema = z.object({
	videoUrl: z.string().min(1),
})

export const ChapterVideoForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterVideoFormProps) => {
	const [isEditing, setIsEditing] = useState(false)

	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter()
	let patchChapter = api.chapters.patchChapter.useMutation()

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await patchChapter.mutateAsync({
				courseId,
				chapterId,
				chapterNewValues: values,
			})
			toast.success("Chapter updated")
			toggleEdit()
			router.refresh()
		} catch {
			toast.error("Something went wrong")
		}
	}

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Chapter video
				{/* <Button
					onClick={() =>
						onSubmit({
							videoUrl:
								"https://utfs.io/f/7dd21ead-e5ce-4630-8f21-e1ad2ede9098-6zwtsa.mp4",
						})
					}
				>
					Testing
				</Button> */}
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && !initialData.videoUrl && (
						<>
							<PlusCircle className="mr-2 size-4" />
							Add a video
						</>
					)}
					{!isEditing && initialData.videoUrl && (
						<>
							<Pencil className="mr-2 size-4" />
							Edit video
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialData.videoUrl ? (
					<div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
						<Video className="size-10 text-slate-500" />
					</div>
				) : (
					<div className="relative mt-2 aspect-video">
						<MuxPlayer playbackId={initialData?.muxData?.playbackId ?? ""} />
					</div>
				))}
			{isEditing && (
				<div>
					<FileUpload
						endpoint="chapterVideo"
						onUploadComplete={async ({ url }) => {
							if (url) {
								await onSubmit({ videoUrl: url })
							}
						}}
					/>
					<div className="mt-4 text-xs text-muted-foreground">
						Upload this chapter&apos;s video
					</div>
				</div>
			)}
			{initialData.videoUrl && !isEditing && (
				<div className="mt-2 text-xs text-muted-foreground">
					Videos can take a few minutes to process. Refresh the page if video
					does not appear.
				</div>
			)}
		</div>
	)
}
