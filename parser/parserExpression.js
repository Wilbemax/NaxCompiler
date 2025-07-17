import { parseTerm } from "./parserTerm.js";
import { parseComparison } from "./parseComparison.js";
import { isComparisonOp, isAddOp } from "./helpers/index.js";
export function parseExpression(tokens, pos) {
	let node = parseTerm(tokens, pos);

	if (isComparisonOp(tokens[pos])) {
		while (pos < tokens.length && isComparisonOp(tokens[pos])) {
			const operator = tokens[pos].value;
			pos++;
			const right = parseComparison(tokens, pos);
			node = {
				type: 'BinaryComparison',
				operator,
				left: node,
				right,
			};
		}
		return node;
	}

	while (pos < tokens.length && isAddOp(tokens[pos])) {
		const operator = tokens[pos].value;
		pos++;
		const right = parseTerm(tokens, pos);
		node = {
			type: 'BinaryExpression',
			operator,
			left: node,
			right,
		};
	}

	return node;
}
