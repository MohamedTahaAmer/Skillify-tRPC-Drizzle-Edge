const CSSMistery = () => {
	// @tailwind base;
	// @tailwind components;
	// @tailwind utilities;

	// @layer components{
	//   * {
	//     @apply border-2 border-red-500
	//   }
	// }

	// - I think the issue, is that all of this is inisde a 'fixed' which loses it's height in the base root,
	return (
		<>
			<div className="fixed bottom-2/3 left-0 top-0 w-3/4 flex-col bg-orange-300">
				{/* hence this flex has no height set, the h-full on child 2 has no effect */}

				<div className="flex h-10 flex-col items-center bg-slate-400">
					<div className="flex">
						<div className="h-40 bg-red-100">Child 1</div>
						<div className="h-full bg-yellow-100">Child 2</div>
					</div>
				</div>
			</div>
			<div className="fixed bottom-1/3 left-0 top-1/3 w-3/4 flex-col bg-orange-300">
				<div className="flex flex-col items-center bg-slate-500">
					<div className="flex h-48">
						<div className="h-40 bg-red-100">Child 1</div>
						<div className="h-full bg-yellow-100">Child 2</div>
					</div>
				</div>
			</div>
			<div className="fixed bottom-0 left-0 top-2/3 w-3/4 flex-col bg-orange-300">
				{/* hence this flex has no height set, the h-full on child 2 has no effect */}

				<div className="flex flex-col items-center bg-slate-400">
					<div className="flex">
						<div className="h-40 bg-red-100">Child 1</div>
						<div className="h-full bg-yellow-100">Child 2</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CSSMistery
