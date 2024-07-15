"use client"

import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { api } from "@/trpc/react"
import { TRPCClientError } from "@trpc/client"
import { useUser } from "@/hooks/useUser"
import { useCourse } from "@/hooks/use-course"

export const CourseEnrollButton = () => {
	let { user } = useUser()
	let { courseId, coursePrice } = useCourse()
	let userId = user?.id
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
	let handleClick = () => {
		if (!userId) return toast.error("You Need to Sign In to Enroll.")
		if (!courseId) return null

		checkout.mutate({ courseId })
	}

	return (
		<Button
			onClick={handleClick}
			size="sm"
			disabled={checkout.isPending}
			className="w-full md:w-auto"
		>
			Enroll for {formatPrice(coursePrice ?? 0)}
		</Button>
	)
}
