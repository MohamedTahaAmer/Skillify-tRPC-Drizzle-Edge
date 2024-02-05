"use client"

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts"

import { Card } from "@/components/ui/card"

interface ChartProps {
	data: {
		name: string
		total: number
	}[]
	title: string
}

export const Chart = ({ data, title }: ChartProps) => {
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
		<Card className="p-6 pb-2 pl-0 pt-3">
			<h1 className="pb-3 text-center text-xl font-bold text-sky-800">
				{title}
			</h1>
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
						allowDecimals={false}
						axisLine={false}
						tickFormatter={(value) => `${value}`}
					/>
					<Bar dataKey="total" fill="#A3FFAE" radius={[4, 4, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</Card>
	)
}
