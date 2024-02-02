import type Stripe from "stripe"
import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { env } from "@/env"
import { stripe } from "@/lib/stripe"
import type { User } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
export async function checkout({
	user,
	courseId,
	db,
}: {
	user: User
	courseId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	if (!user?.id || !user.emailAddresses?.[0]?.emailAddress)
		throw new TRPCError({ code: "UNAUTHORIZED" })

	const course = await db.course.findUnique({
		where: {
			id: courseId,
			isPublished: true,
		},
	})

	const purchase = await db.purchase.findUnique({
		where: {
			userId_courseId: {
				userId: user.id,
				courseId,
			},
		},
	})

	if (purchase) throw new TRPCError({ code: "CONFLICT" })

	if (!course) throw new TRPCError({ code: "NOT_FOUND" })

	let stripeCustomer = await db.stripeCustomer.findUnique({
		where: {
			userId: user.id,
		},
		select: {
			stripeCustomerId: true,
		},
	})

	if (!stripeCustomer) {
		const customer = await stripe.customers.create({
			email: user.emailAddresses[0].emailAddress,
		})

		stripeCustomer = await db.stripeCustomer.create({
			data: {
				userId: user.id,
				stripeCustomerId: customer.id,
			},
		})
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

	// >(10-1-2024) creating a checkout session on the fly
	const session = await stripe.checkout.sessions.create({
		customer: stripeCustomer.stripeCustomerId,
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
