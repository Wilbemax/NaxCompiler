import { parseTerm } from './parserTerm.js';
import { isComparisonOp } from './helpers/index.js';

export function parseComparison(context) {
	let node = parseTerm(context);
	const token = context.tokens[context.pos];
	while (context.pos < context.tokens.length && isComparisonOp(token)) {
		const operator = token.value;
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
