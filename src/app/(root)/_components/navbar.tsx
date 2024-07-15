"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import { isTeacher } from "@/lib/teacher"
import { cn } from "@/lib/utils"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import { useUser as useZustandUser } from "@/hooks/useUser"
import { useEffect } from "react"

export const Navbar = () => {
	const { isLoaded, user } = useUser()
	let { setUser } = useZustandUser()

	useEffect(() => {
		setUser(user)
	}, [user, setUser])

	let pathName = usePathname()
	let isTeacherCourses = pathName.includes("/teacher/courses")
	let isTeacherAnalytics = pathName.includes("/teacher/analytics")
	let insideTeacherRoutes = pathName.includes("/teacher")
	let isCreateCourse = pathName.includes("/teacher/create")
	let isEditCourse = pathName.includes("/teacher/courses/edit/")
	let navRightLink: {
		href: Route
		text: string
	} | null = null
	if (isTeacherCourses) navRightLink = { href: "/teacher/analytics", text: "Analytics" }
	if (isTeacherAnalytics || isCreateCourse || isEditCourse) navRightLink = { href: "/teacher/courses", text: "Courses" }
	if (!insideTeacherRoutes && isTeacher(user?.id)) navRightLink = { href: "/teacher/courses", text: "Teacher mode" }

	return (
		<div className="flex h-full items-center border-b bg-white px-6 shadow-sm">
			<Link href="/" className="p-2">
				<Logo />
			</Link>

			<div className="ml-auto flex gap-x-2">
				{navRightLink && (
					<Link className={cn(buttonVariants({ variant: "secondary" }))} href={navRightLink.href}>
						{navRightLink.text}
					</Link>
				)}

				{/* auth buttons */}
				<div className="aspect-square w-8">
					<UserButton afterSignOutUrl="/" />
				</div>
				{!user && isLoaded && (
					<SignInButton afterSignInUrl={pathName}>
						<Button variant={"secondary"}>Login</Button>
					</SignInButton>
				)}
			</div>
		</div>
	)
}
