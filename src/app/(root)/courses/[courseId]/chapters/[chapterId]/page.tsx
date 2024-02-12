export const runtime = "edge"
export const preferredRegion = "cle1"

import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { getChapter } from "@/actions/get-chapter"
import { Banner } from "@/components/banner"
import { Preview } from "@/components/preview"
import { Separator } from "@/components/ui/separator"

import { logTime } from "@/lib/helpers"
import ChapterButton from "./_components/chapter-button"
import ShowBanner from "./_components/show-banner"
import { VideoPlayer } from "./_components/video-player"
import ShowAttachments from "./_components/show-attachments"

const ChapterIdPage = async ({
	params,
}: {
	params: { courseId: string; chapterId: string }
}) => {
	let startTime = Date.now()
	let { userId } = auth()

	const { chapter, muxData, userProgress } = await getChapter({
		userId,
		chapterId: params.chapterId,
		courseId: params.courseId,
	})

	if (!chapter) {
		return redirect("/")
	}

	let isCompleted = !userProgress?.isCompleted
	let isFreeChapter = chapter.isFree ?? false
	logTime({ title: "ChapterIdPage", startTime })

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner variant="success" label="You already completed this chapter." />
			)}
			{!isFreeChapter && <ShowBanner />}
			<div className="mx-auto flex max-w-4xl flex-col pb-20">
				<div className="p-4">
					<VideoPlayer
						chapterId={params.chapterId}
						title={chapter.title}
						courseId={params.courseId}
						// >(11-1-2024:3)
						playbackId={muxData?.playbackId ?? ""}
						isFreeChapter={isFreeChapter}
						isCompleted={isCompleted}
					/>
				</div>
				<div>
					<div className="flex flex-col items-center justify-between p-4 md:flex-row">
						<h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
						<ChapterButton
							chapterId={chapter.id}
							isCompleted={userProgress?.isCompleted ?? false}
						/>
					</div>
					<Separator />
					<div>
						<Preview value={chapter?.description ?? ""} />
					</div>
					<ShowAttachments />
				</div>
			</div>
		</div>
	)
}

export default ChapterIdPage
