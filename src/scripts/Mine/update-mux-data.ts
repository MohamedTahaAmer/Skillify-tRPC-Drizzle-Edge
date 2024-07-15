import { env } from "@/env"
import { db, schema } from "@/server/db"
import Mux from "@mux/mux-node"
const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET)

export default async function updateMuxDate() {
	try {
		const asset = await Video.Assets.create({
			input: "https://utfs.io/f/29dc41e5-d9a2-4ef7-93f0-5d243cb4aaa4-nae63u.mp4",
			playback_policy: "public",
			test: false,
		})

		await db.update(schema.muxData).set({
			assetId: asset.id,
			playbackId: asset.playback_ids?.[0]?.id,
		})
		console.log("updated mux data")
	} catch (error) {
		console.log("Error updating mux data", error)
	}
}
