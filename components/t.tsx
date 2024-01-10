interface TProps extends React.HTMLAttributes<HTMLDivElement> {}
const T: React.FC<TProps> = ({ className, ...props }) => {
	return (
		<div className={className} {...props}>
			t
		</div>
	)
}

export default T
