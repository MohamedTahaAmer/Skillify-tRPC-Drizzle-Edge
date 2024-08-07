import { env } from "@/env"
import { stripe } from "@/lib/stripe"
import { schema } from "@/server/db"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import type Stripe from "stripe"
import { z } from "zod"
import { ProtectedCTX } from "../../trpc"

export let checkoutDTO = z.object({ courseId: z.string().min(1) })
type CheckoutDTO = z.infer<typeof checkoutDTO>
export async function checkout({ ctx, input }: { ctx: ProtectedCTX; input: CheckoutDTO }) {
	let { db, user } = ctx
	let { courseId } = input
	if (!user?.id || !user.emailAddresses?.[0]?.emailAddress) throw new TRPCError({ code: "UNAUTHORIZED" })

	let course = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.isPublished, true)))
	)[0]

	if (!course) throw new TRPCError({ code: "NOT_FOUND" })

	let purchase = (
		await db
			.selectDistinct()
			.from(schema.purchases)
			.where(and(eq(schema.purchases.userId, user.id), eq(schema.purchases.courseId, courseId)))
	)[0]

	if (purchase) throw new TRPCError({ code: "CONFLICT" })

	let stripeCustomer = (
		await db
			.selectDistinct({
				stripeCustomerId: schema.stripeCustomers.stripeCustomerId,
			})
			.from(schema.stripeCustomers)
			.where(eq(schema.stripeCustomers.userId, user.id))
	)[0]

	if (!stripeCustomer?.stripeCustomerId) {
		const customer = await stripe.customers.create({
			email: user.emailAddresses[0].emailAddress,
		})

		await db.insert(schema.stripeCustomers).values({
			userId: user.id,
			stripeCustomerId: customer.id,
		})
		stripeCustomer = (
			await db
				.selectDistinct({
					stripeCustomerId: schema.stripeCustomers.stripeCustomerId,
				})
				.from(schema.stripeCustomers)
				.where(and(eq(schema.stripeCustomers.stripeCustomerId, customer.id)))
		)[0]!
	}

	const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
		{
			quantity: 1,
			price_data: {
				currency: "USD",
				product_data: {
					name: course.title,
					description: course.description ?? "",
				},
				unit_amount: Math.round(course.price! * 100),
			},
		},
	]

	const session = await stripe.checkout.sessions.create({
		customer: stripeCustomer.stripeCustomerId ?? "",
		line_items,
		mode: "payment",
		success_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
		cancel_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
		metadata: {
			courseId: course.id,
			userId: user.id,
		},
	})

	return session.url
}
