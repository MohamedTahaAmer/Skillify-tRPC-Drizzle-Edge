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
	courseId,
}: CourseEnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false)
	let checkout = api.courses.checkout.useMutation({
		onSuccess(data, _variables, _context) {
			window.location.assign(data.url ?? "")
		},
		onError(error, _variables, _context) {
			toast.error(error.message)
		},
		onSettled(_data, _error, _variables, _context) {
			setIsLoading(false)
		},
	})

	return (
		<Button
			onClick={() => checkout.mutate({ courseId })}
			disabled={isLoading}
			size="sm"
			className="w-full md:w-auto"
		>
			Enroll for {formatPrice(price)}
		</Button>
	)
}
