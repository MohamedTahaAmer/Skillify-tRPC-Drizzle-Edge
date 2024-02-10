import { useSearchParams } from "next/navigation"

const SearchParam = () => {
  let searchParams = Object.fromEntries(useSearchParams().entries())
	return (
		<>
			<div className="">search-param - {searchParams.categoryId}</div>
		</>
	)
}

export default SearchParam
