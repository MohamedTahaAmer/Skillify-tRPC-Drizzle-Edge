"use client"
import { Separator } from "@/components/ui/separator"
import { useCourse } from "@/hooks/use-course"
import { File } from "lucide-react"

const ShowAttachments = () => {
	let { attachments } = useCourse()
	return (
		<>
			{!!attachments.length && (
				<>
					<Separator />
					<div className="p-4">
						{attachments.map((attachment) => (
							<a
								href={attachment.url}
								target="_blank"
								key={attachment.id}
								className="flex w-full items-center gap-2 rounded-md border bg-sky-200 p-3 text-sky-700 hover:underline"
							>
								<File />
								<p className="line-clamp-1">{attachment.name}</p>
							</a>
						))}
					</div>
				</>
			)}
		</>
	)
}

export default ShowAttachments
