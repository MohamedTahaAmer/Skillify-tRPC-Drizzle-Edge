"use client"

import { CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import { useCourse } from "@/hooks/use-course"
import { useProgressMap } from "@/hooks/use-progress-map"
import { api } from "@/trpc/react"

interface CourseProgressButtonProps {
	chapterId: string
	isCompleted?: boolean
	nextChapterId?: string
	isLastChapterToFinishTheCourse?: boolean
}

export const CourseProgressButton = ({
	chapterId,
	isCompleted,
	isLastChapterToFinishTheCourse,
}: CourseProgressButtonProps) => {
	const router = useRouter()
	const confetti = useConfettiStore()
	const [isLoading, setIsLoading] = useState(false)

	let { nextChapterId, courseId, numberOfChapters } = useCourse()
	let { progressMap, setProgressMap } = useProgressMap()

	let updateProgress = api.courses.updateProgress.useMutation({
		onMutate: () => {
			setIsLoading(true)
		},
		onSettled: () => {
			setIsLoading(false)
		},
		onSuccess: () => {
			if (!isCompleted && isLastChapterToFinishTheCourse) {
				confetti.onOpen()
			}

			if (!isCompleted && nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
			}

			toast.success("Progress updated")
			if (progressMap && courseId) {
				let shouldDecrease = isCompleted ? 1 : -1
				let newCourseProgress = Math.floor(progressMap[courseId]! - (shouldDecrease / numberOfChapters) * 100)

				let newProgressMap = {
					...progressMap,
					[courseId]: newCourseProgress,
				}

				setProgressMap(newProgressMap)
			}
			router.refresh()
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const Icon = isCompleted ? XCircle : CheckCircle

	return (
		<Button
			onClick={() => updateProgress.mutate({ chapterId, isCompleted: !isCompleted })}
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
