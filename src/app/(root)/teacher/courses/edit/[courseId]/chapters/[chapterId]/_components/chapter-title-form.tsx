"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Pencil } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"

interface ChapterTitleFormProps {
	initialData: {
		title: string
	}
	courseId: string
	chapterId: string
}

const formSchema = z.object({
	title: z.string().min(1),
})

export const ChapterTitleForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterTitleFormProps) => {
	const [isEditing, setIsEditing] = useState(false)

	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
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

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Chapter title
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 size-4" />
							Edit title
						</>
					)}
				</Button>
			</div>
			{!isEditing && <p className="mt-2 text-sm">{initialData.title}</p>}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-4 space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Introduction to the course'"
											{...field}
										/>
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