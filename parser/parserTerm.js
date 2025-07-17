import { isMulOp } from "./helpers/index.js";
import { parseFactor } from "./parserFactor.js";

export function parseTerm(tokens, pos) {
		let node = parseFactor(tokens, pos);

		while (pos < tokens.length && isMulOp(tokens[pos])) {
			const operator = tokens[pos].value;
			pos++;
			const right = parseFactor(tokens, pos);
			node = {
				type: 'BinaryExpression',
				operator,
				left: node,
				right,
			};
		}

		return node;
	}