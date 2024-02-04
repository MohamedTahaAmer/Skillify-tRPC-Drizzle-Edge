import Image from "next/image"
import Link from "next/link"
import { BookOpen } from "lucide-react"

import { IconBadge } from "@/components/icon-badge"
import { formatPrice } from "@/lib/format"
import { CourseProgress } from "@/components/course-progress"

interface CourseCardProps {
	id: string
	title: string
	imageUrl: string
	chaptersLength: number
	price: number
	progress?: number
	category: string
}

export const CourseCard = ({
	id,
	title,
	imageUrl,
	chaptersLength,
	price,
	progress,
	category,
}: CourseCardProps) => {
	console.log(progress)
	return (
		<Link href={`/courses/${id}`}>
			<div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
				<div className="relative aspect-video w-full overflow-hidden rounded-md">
					<Image fill className="object-cover" alt={title} src={imageUrl} />
				</div>
				<div className="flex flex-col pt-2">
					<div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
						{title}
					</div>
					<p className="text-xs text-muted-foreground">{category}</p>
					<div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
						<div className="flex items-center gap-x-1 text-slate-500">
							<IconBadge size="sm" icon={BookOpen} />
							<span>
								{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
							</span>
						</div>
					</div>
					{progress !== undefined ? (
						<CourseProgress
							variant={progress === 100 ? "success" : "default"}
							size="sm"
							value={progress ?? 0}
						/>
					) : (
						<p className="text-base font-medium text-slate-700 md:text-sm">
							{formatPrice(price)}
						</p>
					)}
				</div>
			</div>
		</Link>
	)
}
