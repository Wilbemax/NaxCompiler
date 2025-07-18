import { parseTerm } from './parserTerm.js';
import { parseComparison } from './parseComparison.js';
import { isComparisonOp, isAddOp } from './helpers/index.js';
export function parseExpression(context) {
	console.log(context.tokens[context.pos]);
	
	let node = parseTerm(context);
	if (isComparisonOp(context.tokens[context.pos])) {
		while (
			context.pos < context.tokens.length &&
			isComparisonOp(context.tokens[context.pos])
		) {
			const operator = context.tokens[context.pos].value;
			context.pos++;
			const right = parseTerm(context);
			node = {
				type: 'BinaryComparison',
				operator,
				left: node,
				right,
			};
		}
		return node;
	}

	while (context.pos < context.tokens.length && isAddOp(context.tokens[context.pos])) {
		const operator = context.tokens[context.pos].value;
		context.pos++;
		const right = parseTerm(context);
		node = {
			type: 'BinaryExpression',
			operator,
			left: node,
			right,
		};
	}

	return node;
}
