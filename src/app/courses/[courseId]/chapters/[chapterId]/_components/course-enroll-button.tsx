"use client"

import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { api } from "@/trpc/react"
import { SignInButton } from "@clerk/nextjs"
import { TRPCClientError } from "@trpc/client"
import type { Route } from "next"
import { usePathname, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useEffect } from "react"

interface CourseEnrollButtonProps {
	price: number
	courseId: string
	userId: string | null
}

export const CourseEnrollButton = ({
	price,
	courseId,
	userId,
}: CourseEnrollButtonProps) => {
	let searchPramas = useSearchParams()
	let pathName = usePathname()
	let { redirectedFromAuth } = Object.fromEntries(searchPramas.entries())

	let checkout = api.courses.checkout.useMutation({
		onSuccess(data, _variables, _context) {
			window.location.assign(data.url ?? "")
		},
		onError(error, _variables, _context) {
			if (error instanceof TRPCClientError)
				return toast.error("You Need to Sign In to Enroll.")
			toast.error(error.message)
		},
	})
	useEffect(() => {
		// - here we are delaying the redierct by 1 sec, as react in dev mode will mount the component twice, which will couse checkout.mutate() to be called twice, and by waiting this second, if the new render came before 1 sec, we will clear the previouse call and start a new one ' debouncing the component mount'
		let redirectToCheckoutTimer = setTimeout(() => {
			if (redirectedFromAuth === "true") {
				checkout.mutate({ courseId })
			}
		}, 1000)
		return () => {
			clearTimeout(redirectToCheckoutTimer)
		}

		// - here we can't include the checkout() in the dependency array, as calling checkout.mutate() will trigger a re-render which will create a new checkout() function and cause an infinite loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [redirectedFromAuth, courseId])

	let toCheckOut = (
		<Button
			onClick={() => checkout.mutate({ courseId })}
			size="sm"
			disabled={checkout.isLoading}
			className="w-full md:w-auto"
		>
			Enroll for {formatPrice(price)}
		</Button>
	)

	let toSignIn = () => {
		let url = queryString.stringifyUrl(
			{
				url: pathName,
				// to trigger redirectToCheckoutTimer after coming back from sign in
				query: {
					redirectedFromAuth: "true",
				},
			},
			{ skipNull: true, skipEmptyString: true },
		) as Route

		return (
			<SignInButton afterSignInUrl={url}>
				<Button size="sm" className="w-full md:w-auto">
					Enroll for {formatPrice(price)}
				</Button>
			</SignInButton>
		)
	}

	return <>{userId ? toCheckOut : toSignIn()}</>
}
