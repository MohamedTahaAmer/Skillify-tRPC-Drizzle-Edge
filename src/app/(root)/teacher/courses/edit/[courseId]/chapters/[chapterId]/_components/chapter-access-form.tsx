"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import type { ChaptersSelect } from "@/server/db/schema"
import { api } from "@/trpc/react"

interface ChapterAccessFormProps {
	initialData: ChaptersSelect
	courseId: string
	chapterId: string
}

const formSchema = z.object({
	isFree: z.boolean().default(false),
})

export const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {
	const [isEditing, setIsEditing] = useState(false)

	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isFree: !!initialData.isFree,
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

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Chapter access
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 size-4" />
							Edit access
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p className={cn("mt-2 text-sm", !initialData.isFree && "italic text-slate-500")}>
					{initialData.isFree ? <>This chapter is free for preview.</> : <>This chapter is not free.</>}
				</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="isFree"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormDescription>Check this box if you want to make this chapter free for preview</FormDescription>
									</div>
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
