import { auth } from "@clerk/nextjs"
import Mux from "@mux/mux-node"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"

const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(
	req: Request,
	{
		params
	}: {
		params: { courseId: string; chapterId: string }
	}
) {
	try {
		const { userId } = auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const ownCourse = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId
			}
		})

		if (!ownCourse) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const chapter = await db.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			}
		})

		if (!chapter) {
			return new NextResponse("Not Found", { status: 404 })
		}

		if (chapter.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: params.chapterId
				}
			})

			if (existingMuxData) {
				// >(11-1-2024:3)
				await Video.Assets.del(existingMuxData.assetId)
				await db.muxData.delete({
					where: {
						id: existingMuxData.id
					}
				})
			}
		}

		const deletedChapter = await db.chapter.delete({
			where: {
				id: params.chapterId
			}
		})

		const publishedChaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true
			}
		})

		if (!publishedChaptersInCourse.length) {
			await db.course.update({
				where: {
					id: params.courseId
				},
				data: {
					isPublished: false
				}
			})
		}

		return NextResponse.json(deletedChapter)
	} catch (error) {
		console.log("[CHAPTER_ID_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth()
		const { isPublished, ...values } = await req.json()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const ownCourse = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId
			}
		})

		if (!ownCourse) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const chapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			},
			data: {
				...values
			}
		})

		if (values.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: params.chapterId
				}
			})

			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assetId)
				await db.muxData.delete({
					where: {
						id: existingMuxData.id
					}
				})
			}

			// >(11-1-2024:3)
			const asset = await Video.Assets.create({
				input: values.videoUrl,
				playback_policy: "public",
				test: false
			})

			await db.muxData.create({
				data: {
					chapterId: params.chapterId,
					// >(11-1-2024:3)
					// - assetId is id of your video on MUX platform, we use it incase we need to delete the video
					assetId: asset.id,
					// - the playbackId is the id of the video on MUX platform, we use it to play the video using the MUXPlayer component
					playbackId: asset.playback_ids?.[0]?.id
				}
			})
		}

		return NextResponse.json(chapter)
	} catch (error) {
		console.log("[COURSES_CHAPTER_ID]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
