"use client"
import type { Attachment, Course } from "@prisma/client"
import { File, Loader2, PlusCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import * as z from "zod"

import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"

interface AttachmentFormProps {
	initialData: Course & { attachments: Attachment[] }
	courseId: string
}

const formSchema = z.object({
	url: z.string().min(1),
})

export const AttachmentForm = ({
	initialData,
	courseId,
}: AttachmentFormProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter()
	let addAttachment = api.courses.addAttachment.useMutation()

	const onSubmit = async ({ url }: z.infer<typeof formSchema>) => {
		try {
			await addAttachment.mutateAsync({
				courseId,
				url,
			})
			toast.success("Course updated")
			toggleEdit()
			router.refresh()
		} catch {
			toast.error("Something went wrong")
		}
	}

	let deleteAttachment = api.courses.deleteAttachment.useMutation()

	const onDelete = async (id: string) => {
		try {
			setDeletingId(id)
			await deleteAttachment.mutateAsync({ attachmentId: id, courseId })
			toast.success("Attachment deleted")
			router.refresh()
		} catch {
			toast.error("Something went wrong")
		} finally {
			setDeletingId(null)
		}
	}

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Course attachments
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && (
						<>
							<PlusCircle className="mr-2 size-4" />
							Add a file
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<>
					{initialData.attachments.length === 0 && (
						<p className="mt-2 text-sm italic text-slate-500">
							No attachments yet
						</p>
					)}
					{initialData.attachments.length > 0 && (
						<div className="space-y-2">
							{initialData.attachments.map((attachment) => (
								<div
									key={attachment.id}
									className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
								>
									<File className="mr-2 size-4 shrink-0" />
									<p className="line-clamp-1 text-xs">{attachment.name}</p>
									{deletingId === attachment.id && (
										<div>
											<Loader2 className="size-4 animate-spin" />
										</div>
									)}
									{deletingId !== attachment.id && (
										<button
											onClick={() => onDelete(attachment.id)}
											className="ml-auto transition hover:opacity-75"
										>
											<X className="size-4" />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}
			{isEditing && (
				<div>
					<FileUpload
						endpoint="courseAttachment"
						onUploadComplete={async (url) => {
							if (url) {
								await onSubmit({ url: url })
							}
						}}
					/>
					<div className="mt-4 text-xs text-muted-foreground">
						Add anything your students might need to complete the course.
					</div>
				</div>
			)}
		</div>
	)
}
