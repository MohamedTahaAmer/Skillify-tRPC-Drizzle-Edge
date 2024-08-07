"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

import { Editor } from "@/components/editor"
import { Preview } from "@/components/preview"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { quillHeightCalculator } from "@/lib/quill-height-calculator"
import { cn } from "@/lib/utils"
import type { ChaptersSelect } from "@/server/db/schema"
import { api } from "@/trpc/react"

interface ChapterDescriptionFormProps {
	initialData: ChaptersSelect
	courseId: string
	chapterId: string
}

const formSchema = z.object({
	description: z.string().min(1),
})

export const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: ChapterDescriptionFormProps) => {
	const [isEditing, setIsEditing] = useState(false)

	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: initialData?.description ?? "",
		},
	})

	const { isSubmitting, isValid } = form.formState
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

	let { previewHeight, editorHeight } = quillHeightCalculator(initialData.description)

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Chapter description
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 size-4" />
							Edit description
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<div className={cn("mt-2 text-sm", !initialData.description && "italic text-slate-500")}>
					{!initialData.description && "No description"}
					{initialData.description && (
						<>
							<div style={{ height: previewHeight }}>
								<Preview value={initialData.description} />
							</div>
						</>
					)}
				</div>
			)}
			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div style={{ height: editorHeight }}>
											<Editor {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button disabled={!isValid ?? isSubmitting} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	)
}
