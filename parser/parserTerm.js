import { isMulOp } from "./helpers/index.js";
import { parseFactor } from "./parserFactor.js";

export function parseTerm(context) {
		let node = parseFactor(context);

		while (context.pos < context.tokens.length && isMulOp(context.tokens[context.pos])) {
			const operator = context.tokens[context.pos].value;
			context.pos++;
			const right = parseFactor(context);
			node = {
				type: 'BinaryExpression',
				operator,
				left: node,
				right,
			};
		}

		return node;
	}