"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type { ChaptersSelect, CoursesSelect } from "@/server/db/schema"
import { api } from "@/trpc/react"
import { ChaptersList } from "./chapters-list"

interface ChaptersFormProps {
	initialData: CoursesSelect & { chapters: ChaptersSelect[] }
	courseId: CoursesSelect["id"]
}

const formSchema = z.object({
	title: z.string().min(1),
})

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
	const [isCreating, setIsCreating] = useState(false)
	const [isUpdating, setIsUpdating] = useState(false)

	const toggleCreating = () => {
		setIsCreating((current) => !current)
	}

	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	})

	const { isSubmitting, isValid } = form.formState
	let addChapter = api.chapters.addChapter.useMutation()
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await addChapter.mutateAsync({
				courseId,
				title: values.title,
			})
			toast.success("Chapter created")
			toggleCreating()
			form.reset()
			// >(12-1-2024:3.1)
			router.refresh()
		} catch {
			toast.error("Something went wrong")
		}
	}

	let reorderChapters = api.chapters.reorderChapters.useMutation()
	const onReorder = async (updateData: { id: string; position: number }[]) => {
		try {
			setIsUpdating(true)
			await reorderChapters.mutateAsync({
				courseId,
				list: updateData,
			})
			toast.success("Chapters reordered")
			router.refresh()
		} catch {
			toast.error("Something went wrong")
		} finally {
			setIsUpdating(false)
		}
	}

	const onEdit = (id: string) => {
		router.push(`/teacher/courses/edit/${courseId}/chapters/${id}`)
	}

	return (
		<div className="relative mt-6 rounded-md border bg-slate-100 p-4">
			{isUpdating && (
				<div className="absolute right-0 top-0 flex size-full items-center justify-center rounded-md bg-slate-500/20">
					<Loader2 className="size-6 animate-spin text-sky-700" />
				</div>
			)}
			<div className="flex items-center justify-between font-medium">
				Course chapters
				<Button onClick={toggleCreating} variant="ghost">
					{isCreating ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className="mr-2 size-4" />
							Add a chapter
						</>
					)}
				</Button>
			</div>
			{isCreating && (
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
						<Button disabled={!isValid ?? isSubmitting} type="submit">
							Create
						</Button>
					</form>
				</Form>
			)}
			{!isCreating && (
				<div
					className={cn(
						"mt-2 text-sm",
						!initialData.chapters.length && "italic text-slate-500",
					)}
				>
					{!initialData.chapters.length && "No chapters"}
					<ChaptersList
						onEdit={onEdit}
						onReorder={onReorder}
						items={initialData.chapters ?? []}
					/>
				</div>
			)}
			{!isCreating && (
				<p className="mt-4 text-xs text-muted-foreground">
					Drag and drop to reorder the chapters
				</p>
			)}
		</div>
	)
}
