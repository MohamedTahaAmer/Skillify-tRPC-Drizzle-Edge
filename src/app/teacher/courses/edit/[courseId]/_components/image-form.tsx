"use client"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import toast from "react-hot-toast"
import * as z from "zod"

import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import type { CoursesSelect } from "@/server/db/schema"
import { api } from "@/trpc/react"

interface ImageFormProps {
	initialData: CoursesSelect
	courseId: CoursesSelect["id"]
}

const formSchema = z.object({
	imageUrl: z.string().min(1, {
		message: "Image is required",
	}),
})

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [img, setImg] = useState(initialData.imageUrl)

	const toggleEdit = () => setIsEditing((current) => !current)
	let patchCourse = api.courses.patchCourse.useMutation()

	const onSubmit = async (courseNewValues: z.infer<typeof formSchema>) => {
		try {
			await patchCourse.mutateAsync({ courseId, courseNewValues })

			toast.success("Course updated")
		} catch {
			toast.error("Something went wrong")
		}
	}

	return (
		<div className="mt-6 flex h-[347px] flex-col justify-center rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Course image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && !img && (
						<>
							<PlusCircle className="mr-2 size-4" />
							Add an image
						</>
					)}
					{!isEditing && img && (
						<>
							<Pencil className="mr-2 size-4" />
							Edit image
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!img ? (
					<div className="flex grow items-center justify-center rounded-md bg-slate-200">
						<ImageIcon className="size-10 text-slate-500" />
					</div>
				) : (
					<div className="relative mt-2 aspect-video">
						<Image
							alt="Upload"
							fill
							className="rounded-md object-cover"
							src={img}
						/>
					</div>
				))}
			{isEditing && (
				<div>
					<FileUpload
						className="m-0 h-[241.6px]"
						endpoint="courseImage"
						onUploadComplete={async (url) => {
							if (url) {
								setImg(url)
								setIsEditing(false)
								await onSubmit({ imageUrl: url })
							}
						}}
					/>
					<div className="mt-4 text-xs text-muted-foreground">
						16:9 aspect ratio recommended
					</div>
				</div>
			)}
		</div>
	)
}
