export const runtime = "edge"
export const preferredRegion = "cle1"

import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { Banner } from "@/components/banner"
import { Preview } from "@/components/preview"
import { Separator } from "@/components/ui/separator"

import { logTime } from "@/lib/helpers"
import { db, schema } from "@/server/db"
import { eq } from "drizzle-orm"
import ChapterButton from "./_components/chapter-button"
import ShowAttachments from "./_components/show-attachments"
import ShowBanner from "./_components/show-banner"
import { VideoPlayer } from "./_components/video-player"

const ChapterIdPage = async ({ params }: { params: { chapterId: string } }) => {
	let startTime = Date.now()
	let { userId } = auth()
	let chapterId = params.chapterId

	// - with the chapter I can get the course, this will
	// 1- save us from using 'useCourse' store
	// 2- allow better code, by server side checking before rendering certain components
	// . but I'm leaving it this way as
	// 1- it has no bad impact on performance, it's acutally slightly better performance
	// not having to make the course join on the db server, and no need to pass the course over the wire
	// 2- referance incase the layout really was fetching data that we can't get on the child pages without making a hole new query, or having to use 'fetch' to utalize next.js req momoization or deduplication
	let chapter = await db.query.chapters.findFirst({
		where: eq(schema.chapters.id, chapterId),
		with: {
			userProgress: userId
				? { where: eq(schema.userProgress.userId, userId) }
				: undefined,
			muxData: true,
		},
	})
	if (!chapter) {
		return redirect("/")
	}
	let { muxData } = chapter
	let userProgress = chapter.userProgress?.[0]

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
