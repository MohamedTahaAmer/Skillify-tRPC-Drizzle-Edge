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
	FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Combobox } from "@/components/ui/combobox"
import { api } from "@/trpc/react"
import type { CategoriesSelect, CoursesSelect } from "@/server/db/schema"

interface CategoryFormProps {
	initialCategoryId: CategoriesSelect["id"]
	courseId: CoursesSelect["id"]
	options: { label: CategoriesSelect['name']; value: CategoriesSelect['id'] }[]
}

const formSchema = z.object({
	categoryId: z.string().min(1)
})

export const CategoryForm = ({
	initialCategoryId,
	courseId,
	options
}: CategoryFormProps) => {
	const [isEditing, setIsEditing] = useState(false)

	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categoryId: initialCategoryId 
		}
	})

	const { isSubmitting, isValid } = form.formState
  let patchCourse = api.courses.patchCourse.useMutation()

	const onSubmit = async (courseNewValues: z.infer<typeof formSchema>) => {
		try {
      await patchCourse.mutateAsync({ courseId: courseId ?? '', courseNewValues })

			toast.success("Course updated")
			toggleEdit()
			router.refresh()
		} catch {
			toast.error("Something went wrong")
		}
	}

	const selectedOption = options.find(
		(option) => option.value === initialCategoryId
	)

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Course category
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 size-4" />
							Edit category
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						"mt-2 text-sm",
						!initialCategoryId && "italic text-slate-500"
					)}
				>
					{selectedOption?.label ?? "No category"}
				</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-4 space-y-4"
					>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Combobox
                      options={...options}
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
