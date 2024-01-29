"use client"

import { Course } from "@prisma/client"
import axios from "axios"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import toast from "react-hot-toast"
import * as z from "zod"

import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"

interface ImageFormProps {
	initialData: Course
	courseId: string
}

const formSchema = z.object({
	imageUrl: z.string().min(1, {
		message: "Image is required"
	})
})

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [img, setImg] = useState(initialData.imageUrl)

	const toggleEdit = () => setIsEditing((current) => !current)

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values)
			toast.success("Course updated")
		} catch {
			toast.error("Something went wrong")
		}
	}

	return (
		<div className="mt-6 border h-[347px] flex flex-col justify-center bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && !img && (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add an image
						</>
					)}
					{!isEditing && img && (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit image
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!img ? (
					<div className="flex items-center justify-center grow bg-slate-200 rounded-md">
						<ImageIcon className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<Image
							alt="Upload"
							fill
							className="object-cover rounded-md"
							src={img}
						/>
					</div>
				))}
			{isEditing && (
				<div>
					<FileUpload
						className="m-0 h-[241.6px]"
						endpoint="courseImage"
						onUploadComplete={(url) => {
							if (url) {
								setImg(url)
								setIsEditing(false)
								onSubmit({ imageUrl: url })
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						16:9 aspect ratio recommended
					</div>
				</div>
			)}
		</div>
	)
}
