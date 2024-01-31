import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd"
import type { Chapter } from "@prisma/client"
import { Grip, Pencil } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChaptersListProps {
	items: Chapter[]
	onReorder: (updateData: { id: string; position: number }[]) => void
	onEdit: (id: string) => void
}

export const ChaptersList = ({
	items,
	onReorder,
	onEdit,
}: ChaptersListProps) => {
	const [isMounted, setIsMounted] = useState(false)
	const [chapters, setChapters] = useState(items)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		setChapters(items)
	}, [items])

	if (!isMounted) {
		return (
			<div>
				{chapters.map((chapter) => (
					<div
						key={chapter.id}
						className={cn(
							"mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700",
							chapter.isPublished && "border-sky-200 bg-sky-100 text-sky-700",
						)}
					>
						<div
							className={cn(
								"rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300",
								chapter.isPublished && "border-r-sky-200 hover:bg-sky-200",
							)}
						>
							<Grip className="size-5" />
						</div>
						{chapter.title}
						<div className="ml-auto flex items-center gap-x-2 pr-2">
							{chapter.isFree && <Badge>Free</Badge>}
							<Badge
								className={cn(
									"bg-slate-500",
									chapter.isPublished && "bg-sky-700",
								)}
							>
								{chapter.isPublished ? "Published" : "Draft"}
							</Badge>
							<Pencil
								onClick={() => onEdit(chapter.id)}
								className="size-4 cursor-pointer transition hover:opacity-75"
							/>
						</div>
					</div>
				))}
			</div>
		)
	}

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return

		const items = Array.from(chapters)
		const [reorderedItem] = items.splice(result.source.index, 1)
		if (reorderedItem) items.splice(result.destination.index, 0, reorderedItem)

		const startIndex = Math.min(result.source.index, result.destination.index)
		const endIndex = Math.max(result.source.index, result.destination.index)

		const updatedChapters = items.slice(startIndex, endIndex + 1)

		setChapters(items)

		const bulkUpdateData = updatedChapters.map((chapter) => ({
			id: chapter.id,
			position: items.findIndex((item) => item.id === chapter.id),
		}))

		onReorder(bulkUpdateData)
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="chapters">
				{(droppable) => (
					<div {...droppable.droppableProps} ref={droppable.innerRef}>
						{chapters.map((chapter, index) => (
							<Draggable
								// - this Draggable needs a children of type function not of type JSX like the usuall children are,
								key={chapter.id}
								draggableId={chapter.id}
								index={index}
							>
								{(draggable) => (
									<div
										className={cn(
											"mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700",
											chapter.isPublished &&
												"border-sky-200 bg-sky-100 text-sky-700",
										)}
										ref={draggable.innerRef}
										{...draggable.draggableProps}
									>
										<div
											className={cn(
												"rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300",
												chapter.isPublished &&
													"border-r-sky-200 hover:bg-sky-200",
											)}
											{...draggable.dragHandleProps}
										>
											<Grip className="size-5" />
										</div>
										{chapter.title}
										<div className="ml-auto flex items-center gap-x-2 pr-2">
											{chapter.isFree && <Badge>Free</Badge>}
											<Badge
												className={cn(
													"bg-slate-500",
													chapter.isPublished && "bg-sky-700",
												)}
											>
												{chapter.isPublished ? "Published" : "Draft"}
											</Badge>
											<Pencil
												onClick={() => onEdit(chapter.id)}
												className="size-4 cursor-pointer transition hover:opacity-75"
											/>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{droppable.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}
