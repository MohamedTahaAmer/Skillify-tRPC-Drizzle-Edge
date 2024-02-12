"use client"
import MuxPlayer from "@mux/mux-player-react"
import { Loader2, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"

import { useConfettiStore } from "@/hooks/use-confetti-store"
import { useCourse } from "@/hooks/use-course"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"

interface VideoPlayerProps {
	playbackId: string
	chapterId: string
	isFreeChapter: boolean
	isCompleted: boolean
	title: string
}

export const VideoPlayer = ({
	playbackId,
	chapterId,
	isFreeChapter,
	isCompleted,
	title,
}: VideoPlayerProps) => {
	const [isReady, setIsReady] = useState(false)
	const router = useRouter()

	const confetti = useConfettiStore()
	let { isPurchased, isLastChapterToFinishTheCourse, nextChapterId, courseId } =
		useCourse()

	let isLocked = !isFreeChapter && !isPurchased

	// - if there is a purchase and the chapter wasn't completed, then mark as completed when the video ends
	let completeOnEnd = !isCompleted && isPurchased

	let updateProgress = api.courses.updateProgress.useMutation({
		onSuccess: () => {
			if (!nextChapterId && isLastChapterToFinishTheCourse) {
				confetti.onOpen()
			}

			toast.success("Progress updated")
			router.refresh()

			if (nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
			}
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const onEnd = async () => {
		if (completeOnEnd) {
			updateProgress.mutate({ chapterId, isCompleted: true })
		}
	}

	return (
		<div className="relative aspect-video">
			{!isReady && !isLocked && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800">
					<Loader2 className="size-8 animate-spin text-secondary" />
				</div>
			)}
			{isLocked && (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
					<Lock className="size-8" />
					<p className="text-sm">This chapter is locked</p>
				</div>
			)}
			{!isLocked && (
				<MuxPlayer
					title={title}
					className={cn(!isReady && "hidden")}
					onCanPlay={() => setIsReady(true)}
					onEnded={onEnd}
					// autoPlay
					playbackId={playbackId}
				/>
			)}
		</div>
	)
}
