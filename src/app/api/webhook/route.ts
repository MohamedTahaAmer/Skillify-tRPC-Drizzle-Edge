export const runtime1 = "edge"
export const preferredRegion = "cle1"

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { env } from "@/env"
import { stripe } from "@/lib/stripe"
import { db, schema } from "@/server/db"
export async function POST(req: Request) {
	const body = await req.text()
	const signature = headers().get("Stripe-Signature")!

	let event: Stripe.Event | null = null

	try {
		event = await stripe.webhooks.constructEventAsync(
			body,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
		)
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log("\x1b[31m%s\x1b[0m", "Stripe webhook error:", error.message)
			return new NextResponse(`Webhook Error: ${error.message}`, {
				status: 400,
			})
		}
		console.log("\x1b[31m%s\x1b[0m", "Stripe webhook error: Unknown error")
	}

	const session = event?.data.object as Stripe.Checkout.Session
	const userId = session?.metadata?.userId
	const courseId = session?.metadata?.courseId

	if (event?.type === "checkout.session.completed") {
		console.log("\x1b[31m%s\x1b[0m", "Got checkout session completed event")
		if (!userId || !courseId) {
			return new NextResponse(`Webhook Error: Missing metadata`, {
				status: 400,
			})
		}

		console.log(
			"\x1b[31m%s\x1b[0m",
			"Purchasing course",
			courseId,
			"for user",
			userId,
		)
		await db.insert(schema.purchases).values({
			courseId: courseId,
			userId: userId,
		})
	} else {
		console.log("\x1b[31m%s\x1b[0m", "Got unhandled event type", event?.type)
		return new NextResponse(
			`Webhook Error: Unhandled event type ${event?.type}`,
			{ status: 200 },
		)
	}

	return new NextResponse(null, { status: 200 })
}
