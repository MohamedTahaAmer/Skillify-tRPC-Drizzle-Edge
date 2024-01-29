"use client"

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip
} from "recharts"

import { Card } from "@/components/ui/card"
import { randCourseNames } from "./random-course-names"

interface ChartProps {
	data: {
		name: string
		total: number
	}[]
}

export const Chart = ({ data }: ChartProps) => {
	let randData = null
	// randData = data
	// 	.map((item) =>
	// 		data.map((item) => ({
	// 			name: randCourseNames[
	// 				Math.floor(Math.random() * randCourseNames.length)
	// 			],
	// 			total: Math.floor(Math.random() * 1000)
	// 		}))
	// 	)
	// 	.flat()
	return (
		<Card className="p-6 pb-2 pl-0">
			<ResponsiveContainer width="100%" height={350}>
				<BarChart data={randData ?? data}>
					<Tooltip trigger="hover" />

					<XAxis
						dataKey="name"
						stroke="#888888"
						fontSize={12}
						className="font-bold"
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						className="font-bold"
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => `$${value}`}
					/>
					<Bar dataKey="total" fill="#0369a1" radius={[4, 4, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</Card>
	)
}
