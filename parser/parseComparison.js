import { parseTerm } from "./parserTerm.js";
import { isComparisonOp } from "./helpers/index.js";

export function parseComparison(tokens, pos) {
		let node = parseTerm();

		while (pos < tokens.length && isComparisonOp(tokens[pos])) {
			const operator = tokens[pos].value;
			pos++;
			const right = parseTerm(tokens, pos);
			node = {
				type: 'BinaryComparison',
				operator,
				left: node,
				right,
			};
		}

		return node;
	}