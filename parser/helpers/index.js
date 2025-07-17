export function isAddOp(token) {
	return (
		token.type === 'operator' && (token.value === '+' || token.value === '-')
	);
}

export function isMulOp(token) {
	return (
		token.type === 'operator' && (token.value === '*' || token.value === '/')
	);
}
export function isComparisonOp(token) {
	return (
		token.type === 'operator' &&
		['>', '<', '>=', '<=', '==', '!='].includes(token.value)
	);
}
