"use client"

import { Trash } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import { api } from "@/trpc/react"

interface ActionsProps {
	disabled: boolean
	courseId: string
	isPublished: boolean
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
	const router = useRouter()
	const confetti = useConfettiStore()
	const [isLoading, setIsLoading] = useState(false)

	let publish = api.courses.publish.useMutation({})
	let unpublish = api.courses.unpublish.useMutation({})

	const onClick = async () => {
		try {
			setIsLoading(true)

			if (isPublished) {
				await unpublish.mutateAsync({ courseId })
				toast.success("Course unpublished")
			} else {
				await publish.mutateAsync({ courseId })
				toast.success("Course published")
				confetti.onOpen()
			}

			router.refresh()
		} catch {
			toast.error("Something went wrong")
		} finally {
			setIsLoading(false)
		}
	}

	let deleteCourse = api.courses.deleteCourse.useMutation()

	const onDelete = async () => {
		try {
			setIsLoading(true)

			await deleteCourse.mutateAsync({ courseId })

			toast.success("Course deleted")
			router.refresh()
			router.push(`/teacher/courses`)
		} catch {
			toast.error("Something went wrong")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={onClick}
				disabled={disabled ?? isLoading}
				variant="outline"
				size="sm"
			>
				{isPublished ? "Unpublish" : "Publish"}
			</Button>
			<ConfirmModal onConfirm={onDelete}>
				<Button size="sm" disabled={isLoading}>
					<Trash className="size-4" />
				</Button>
			</ConfirmModal>
		</div>
	)
}
