"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormLabel,
	FormMessage,
	FormItem,
} from "@/components/ui/form"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Title is required",
	}),
})

const CreatePage = () => {
	const router = useRouter()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	})

	const { isSubmitting, isValid } = form.formState
	let createCourse = api.courses.create.useMutation()
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			let response = await createCourse.mutateAsync({
				title: values.title,
			})
			router.push(`/teacher/courses/edit/${response.course.id}`)
			toast.success("Course created")
		} catch {
			toast.error("Something went wrong")
		}
	}

	return (
		<div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
			<div>
				<h1 className="text-2xl">Name your course</h1>
				<p className="text-sm text-slate-600">
					What would you like to name your course? Don&apos;t worry, you can
					change this later.
				</p>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-8 space-y-8"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course title</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Advanced web development'"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										What will you teach in this course?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button type="submit" disabled={!isValid ?? isSubmitting}>
								Continue
							</Button>
							<Link
								href="/teacher/courses"
								className={cn(buttonVariants({ variant: "ghost" }))}
							>
								Cancel
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}

export default CreatePage
