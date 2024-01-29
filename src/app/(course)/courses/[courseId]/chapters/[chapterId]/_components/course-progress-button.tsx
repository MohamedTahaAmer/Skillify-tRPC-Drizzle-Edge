"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import { api } from "@/trpc/react"
import { set } from "zod"

interface CourseProgressButtonProps {
	chapterId: string
	courseId: string
	isCompleted?: boolean
	nextChapterId?: string
}

export const CourseProgressButton = ({
	chapterId,
	courseId,
	isCompleted,
	nextChapterId
}: CourseProgressButtonProps) => {
	const router = useRouter()
	const confetti = useConfettiStore()
	const [isLoading, setIsLoading] = useState(false)
	let updateProgress = api.courses.updateProgress.useMutation({
		onMutate: () => {
			setIsLoading(true)
		},
		onSettled: () => {
			setIsLoading(false)
		},
		onSuccess: () => {
			if (!isCompleted && !nextChapterId) {
				confetti.onOpen()
			}

			if (!isCompleted && nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
			}

			toast.success("Progress updated")
			router.refresh()
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

	const Icon = isCompleted ? XCircle : CheckCircle

	return (
		<Button
			onClick={() =>
				updateProgress.mutate({ chapterId, isCompleted: !isCompleted })
			}
			disabled={isLoading}
			type="button"
			variant={isCompleted ? "outline" : "success"}
			className="w-full md:w-auto"
		>
			{isCompleted ? "Not completed" : "Mark as complete"}
			<Icon className="ml-2 size-4" />
		</Button>
	)
}
