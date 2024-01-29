"use client"

import { UserButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { isTeacher } from "@/lib/teacher"

import { SearchInput } from "./search-input"

export const NavbarRoutes = ({ userId }: { userId: string | null }) => {
	const pathname = usePathname()

	const isTeacherPage = pathname?.startsWith("/teacher")
	const isCoursePage = pathname?.includes("/courses")
	const isSearchPage = pathname === "/search"

	return (
		<>
			{isSearchPage && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}
			<div className="ml-auto flex gap-x-2">
				{isTeacherPage ?? isCoursePage ? (
					<Link className={buttonVariants({ variant: "ghost" })} href="/">
						<LogOut className="mr-2 size-4" />
						Exit
					</Link>
				) : isTeacher(userId) ? (
					<Link href="/teacher/courses">
						<Button size="sm" variant="secondary">
							Teacher mode
						</Button>
					</Link>
				) : null}
				<div className="aspect-square w-8">
					<UserButton afterSignOutUrl="/" />
				</div>
			</div>
		</>
	)
}
