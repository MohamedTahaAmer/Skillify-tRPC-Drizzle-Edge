"use client"
import MuxPlayer from "@mux/mux-player-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Loader2, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import { api } from "@/trpc/react"

interface VideoPlayerProps {
	playbackId: string
	courseId: string
	chapterId: string
	nextChapterId?: string
	isLocked: boolean
	completeOnEnd: boolean
	title: string
}

export const VideoPlayer = ({
	playbackId,
	courseId,
	chapterId,
	nextChapterId,
	isLocked,
	completeOnEnd,
	title,
}: VideoPlayerProps) => {
	const [isReady, setIsReady] = useState(false)
	const router = useRouter()
	const confetti = useConfettiStore()
	let updateProgress = api.courses.updateProgress.useMutation({
		onSuccess: () => {
			if (!nextChapterId) {
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
