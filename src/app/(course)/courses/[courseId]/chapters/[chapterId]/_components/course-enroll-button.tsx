"use client"

import { useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { api } from "@/trpc/react"

interface CourseEnrollButtonProps {
	price: number
	courseId: string
}

export const CourseEnrollButton = ({
	price,
	courseId
}: CourseEnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false)
	let checkout = api.courses.checkout.useMutation({
		onSuccess(data, _variables, _context) {
			window.location.assign(data.url ?? "")
		}
	})

	const onClick = async () => {
		try {
			setIsLoading(true)

			checkout.mutate({ courseId })
		} catch {
			toast.error("Something went wrong")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			size="sm"
			className="w-full md:w-auto"
		>
			Enroll for {formatPrice(price)}
		</Button>
	)
}
