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
import { useEffect, useRef } from "react"
import { env } from "@/env"

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
	let { isRedirectedFromAuth } = Object.fromEntries(searchPramas.entries())
	let isRedirectedFromAuthRef = useRef(isRedirectedFromAuth)

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
		isRedirectedFromAuthRef.current = isRedirectedFromAuth
	}, [isRedirectedFromAuth])

	useEffect(() => {
		let redirectToCheckoutTimer: NodeJS.Timeout = setTimeout(() => {
			// - this is the correct way of doing it, using a ref, and then reseting it to undefined after using it
			if (isRedirectedFromAuthRef.current === "true") {
				isRedirectedFromAuthRef.current = undefined
				checkout.mutate({ courseId })
			}
		}, 1000)

		return () => {
			// - this is how to protect against calling checkout.mutate() twice, deu to the react mount and unmount during dev environment, and that's by clearing the timer if the component is unmounted within 1 second
			clearTimeout(redirectToCheckoutTimer)
		}
	}, [checkout, courseId])

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
					isRedirectedFromAuth: "true",
				},
			},
			{ skipNull: true, skipEmptyString: true },
		) as Route

		console.log("\x1b[33m%s\x1b[0m", "afterSignInUrl", url)
		url = (env.NEXT_PUBLIC_APP_URL + url) as Route
		console.log("\x1b[33m%s\x1b[0m", "afterSignInUrl", url)

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
