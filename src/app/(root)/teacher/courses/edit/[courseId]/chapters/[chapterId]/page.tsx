export const runtime1 = "edge"
export const preferredRegion = "cle1"
import { db, schema } from "@/server/db"
import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Banner } from "@/components/banner"
import { IconBadge } from "@/components/icon-badge"

import { ChapterAccessForm } from "./_components/chapter-access-form"
import { ChapterActions } from "./_components/chapter-actions"
import { ChapterDescriptionForm } from "./_components/chapter-description-form"
import { ChapterTitleForm } from "./_components/chapter-title-form"
import { ChapterVideoForm } from "./_components/chapter-video-form"

const ChapterIdPage = async ({
	params,
}: {
	params: {
		courseId: schema.CoursesSelect["id"]
		chapterId: schema.ChaptersSelect["id"]
	}
}) => {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	let chapter = await db.query.chapters.findFirst({
		where: and(
			eq(schema.chapters.id, params.chapterId),
			eq(schema.chapters.courseId, params.courseId),
		),
		with: {
			muxData: true,
		},
	})
	if (!chapter) {
		return redirect("/")
	}

	const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length

	const completionText = `(${completedFields}/${totalFields})`

	const isComplete = requiredFields.every(Boolean)

	return (
		<>
			{!chapter.isPublished && (
				<Banner
					variant="warning"
					label="This chapter is unpublished. It will not be visible in the course"
				/>
			)}
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="w-full">
						<Link
							href={`/teacher/courses/edit/${params.courseId}`}
							className="mb-6 flex items-center text-sm transition hover:opacity-75"
						>
							<ArrowLeft className="mr-2 size-4" />
							Back to course setup
						</Link>
						<div className="flex w-full items-center justify-between">
							<div className="flex flex-col gap-y-2">
								<h1 className="text-2xl font-medium">Chapter Creation</h1>
								<span className="text-sm text-slate-700">
									Complete all fields {completionText}
								</span>
							</div>
							<ChapterActions
								disabled={!isComplete}
								courseId={params.courseId}
								chapterId={params.chapterId}
								isPublished={!!chapter.isPublished}
							/>
						</div>
					</div>
				</div>
				<div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="space-y-4">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={LayoutDashboard} />
								<h2 className="text-xl">Customize your chapter</h2>
							</div>
							<ChapterTitleForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
							<ChapterDescriptionForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
						</div>
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={Eye} />
								<h2 className="text-xl">Access Settings</h2>
							</div>
							<ChapterAccessForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={Video} />
							<h2 className="text-xl">Add a video</h2>
						</div>
						<ChapterVideoForm
							initialData={chapter}
							chapterId={params.chapterId}
							courseId={params.courseId}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default ChapterIdPage
