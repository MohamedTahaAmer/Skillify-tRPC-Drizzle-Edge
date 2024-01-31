"use client"

import { Trash } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { api } from "@/trpc/react"

interface ChapterActionsProps {
	disabled: boolean
	courseId: string
	chapterId: string
	isPublished: boolean
}

export const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
}: ChapterActionsProps) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	let unpublish = api.chapters.unPublishChapter.useMutation()
	let publish = api.chapters.publishChapter.useMutation()
	const onClick = async () => {
		try {
			setIsLoading(true)

			if (isPublished) {
				await unpublish.mutateAsync({
					courseId,
					chapterId,
				})
				toast.success("Chapter unpublished")
			} else {
				await publish.mutateAsync({
					courseId,
					chapterId,
				})
				toast.success("Chapter published")
			}

			router.refresh()
		} catch {
			toast.error("Something went wrong")
		} finally {
			setIsLoading(false)
		}
	}

	let deleteChapter = api.chapters.deleteChapter.useMutation()
	const onDelete = async () => {
		try {
			setIsLoading(true)
			await deleteChapter.mutateAsync({
				courseId,
				chapterId,
			})

			toast.success("Chapter deleted")
			router.push(`/teacher/courses/edit/${courseId}`)
			router.refresh()
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
