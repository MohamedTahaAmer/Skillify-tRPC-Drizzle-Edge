import { isTeacher } from "@/lib/teacher"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
	const { userId } = auth()

	if (!isTeacher(userId)) {
		return redirect("/")
	}

	return <div className="container px-0 md:px-8">{children}</div>
}

export default TeacherLayout
