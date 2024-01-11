export let quillHeightCalculator = (text: string | null | undefined) => {
	let previewHeight = 0
	let quillLineHeight = 22.71
	let quillEditorPadding = 24
	if (text) {
		previewHeight =
			(text.match(/<p>/g) || []).length * quillLineHeight + quillEditorPadding
	}
	let editModeMargin = 1
	let toolbarHeight = 43
	let emptyEditorHeight = 44
	let editorHeight =
		previewHeight || emptyEditorHeight + toolbarHeight + editModeMargin

	return { previewHeight, editorHeight }
}
