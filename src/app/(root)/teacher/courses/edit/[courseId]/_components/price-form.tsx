"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { CoursesSelect } from "@/server/db/schema"
import { api } from "@/trpc/react"

interface PriceFormProps {
	initialData: CoursesSelect
	courseId: string
}

const formSchema = z.object({
	price: z.coerce.number(),
})

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
	const [isEditing, setIsEditing] = useState(false)

	const toggleEdit = () => setIsEditing((current) => !current)

	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			price: initialData?.price ?? undefined,
		},
	})

	const { isSubmitting, isValid } = form.formState
	let patchCourse = api.courses.patchCourse.useMutation()

	const onSubmit = async (courseNewValues: z.infer<typeof formSchema>) => {
		try {
			await patchCourse.mutateAsync({ courseId, courseNewValues })

			toast.success("Course updated")
			toggleEdit()
			router.refresh()
		} catch {
			toast.error("Something went wrong")
		}
	}

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Course price
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 size-4" />
							Edit price
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p className={cn("mt-2 text-sm", !initialData.price && "italic text-slate-500")}>
					{initialData.price ? formatPrice(initialData.price) : "No price"}
				</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											disabled={isSubmitting}
											placeholder="Set a price for your course"
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
