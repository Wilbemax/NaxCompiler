import { parseExpression } from "./parserExpression.js";

export function parseFactor(tokens, pos) {
	const token = tokens[pos];

	if (token.type === 'number') {
		pos++;
		return {
			type: 'NumberLiteral',
			value: token.value,
		};
	}

	if (token.type === 'identifier') {
		pos++;
		return {
			type: 'Identifier',
			value: token.value,
		};
	}

	if (token.type === 'string') {
		pos++;
		return {
			type: 'StringLiteral',
			value: token.value,
		};
	}

	if (token.type === 'operator' && token.value === '(') {
		pos++;
		const node = parseExpression(tokens, pos);
		if (tokens[pos].type === 'operator' && tokens[pos].value === ')') {
			pos++;
			return node;
		} else {
			throw new Error("Expected ')'");
		}
	}

	throw new Error(`Unexpected token in factor: ${token.type} ${token.value}`);
}
