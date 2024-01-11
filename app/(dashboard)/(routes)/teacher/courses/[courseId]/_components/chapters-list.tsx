"use client"

import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react"
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult
} from "@hello-pangea/dnd"
import { Grip, Pencil } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ChaptersListProps {
	items: Chapter[]
	onReorder: (updateData: { id: string; position: number }[]) => void
	onEdit: (id: string) => void
}

export const ChaptersList = ({
	items,
	onReorder,
	onEdit
}: ChaptersListProps) => {
	const [isMounted, setIsMounted] = useState(false)
	const [chapters, setChapters] = useState(items)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	// - I'm Commenting this out, cause I haven't been able to test the benefit of it, tell now it seems to work fine without it
	// useEffect(() => {
	// 	setChapters(items)
	// }, [items])

	if (!isMounted) {
		return null
	}

	const onDragEnd = (result: DropResult) => {
		console.log("Expression")
		if (!result.destination) return

		const items = Array.from(chapters)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		const startIndex = Math.min(result.source.index, result.destination.index)
		const endIndex = Math.max(result.source.index, result.destination.index)

		const updatedChapters = items.slice(startIndex, endIndex + 1)

		setChapters(items)

		const bulkUpdateData = updatedChapters.map((chapter) => ({
			id: chapter.id,
			position: items.findIndex((item) => item.id === chapter.id)
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
											"flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
											chapter.isPublished &&
												"bg-sky-100 border-sky-200 text-sky-700"
										)}
										ref={draggable.innerRef}
										{...draggable.draggableProps}
									>
										<div
											className={cn(
												"px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
												chapter.isPublished &&
													"border-r-sky-200 hover:bg-sky-200"
											)}
											{...draggable.dragHandleProps}
										>
											<Grip className="h-5 w-5" />
										</div>
										{chapter.title}
										<div className="ml-auto pr-2 flex items-center gap-x-2">
											{chapter.isFree && <Badge>Free</Badge>}
											<Badge
												className={cn(
													"bg-slate-500",
													chapter.isPublished && "bg-sky-700"
												)}
											>
												{chapter.isPublished ? "Published" : "Draft"}
											</Badge>
											<Pencil
												onClick={() => onEdit(chapter.id)}
												className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
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
