import { parseExpression } from "./parserExpression.js";

export function parseFactor(context) {
	const token = context.tokens[context.pos];

	if ( context.tokens[context.pos].type === 'number') {
		context.pos++;
		return {
			type: 'NumberLiteral',
			value: token.value,
		};
	}

	if ( context.tokens[context.pos].type === 'identifier') {
		context.pos++;
		return {
			type: 'Identifier',
			value: token.value,
		};
	}

	if ( context.tokens[context.pos].type === 'string') {
		context.pos++;
		return {
			type: 'StringLiteral',
			value: token.value,
		};
	}

	if (token.type === 'operator' && token.value === '(') {
		context.pos++;
		const node = parseExpression(context);
		if (token.type === 'operator' && token.value === ')') {
			context.pos++;
			return node;
		} else {
			throw new Error("Expected ')'");
		}
	}

	throw new Error(`Unexpected token in factor: ${token.type} ${token.value}`);
}
