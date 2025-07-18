import { parseExpression } from './parserExpression.js';
import { parserBlock } from './parserBlock.js';

export function walk(context) {
	const token = context.tokens[context.pos];
	// console.log('walk():', context.tokens[context.pos], context);
	if (token.type === 'keyword') {
		switch (context.tokens[context.pos].value) {
			case 'let':
				context.pos++;
				const variableName = context.tokens[context.pos];
				if (variableName.type !== 'identifier') {
					throw new Error(`Expected identifier, got ${variableName.type}`);
				}
				const name = variableName.value;
				context.pos++;
				let operator = context.tokens[context.pos];
				if (operator.type !== 'operator' || operator.value !== '=') {
					throw new Error(`Expected '=', got ${operator.type}`);
				}
				context.pos++;

				let valueNode = parseExpression(context);

				if (context.tokens[context.pos]?.type === 'semicolon') context.pos++;
				return {
					type: 'VariableDeclaration',
					name,
					value: valueNode,
				};

			case 'print':
				context.pos++;
				if (
					context.tokens[context.pos].type !== 'operator' ||
					context.tokens[context.pos].value !== '('
				) {
					throw new Error("Expected '(' after 'print'");
				}

				context.pos++;
				const arg = parseExpression(context);

				const argumentNode = {
					type: arg.type,
					value: arg.value,
				};

				if (
					context.tokens[context.pos].type !== 'operator' ||
					context.tokens[context.pos].value !== ')'
				) {
					throw new Error("Expected ')' after print argument");
				}

				context.pos++;
				if (context.tokens[context.pos]?.type === 'semicolon') context.pos++;

				return {
					type: 'PrintStatement',
					argument: arg,
				};

			case 'if':
				context.pos++;
				if (
					context.tokens[context.pos].type !== 'operator' ||
					context.tokens[context.pos].value !== '('
				) {
					throw new Error("Expected '(' after 'if'");
				}
				context.pos++;

				const condition = parseExpression(context);

				if (
					context.tokens[context.pos].type !== 'operator' ||
					context.tokens[context.pos].value !== ')'
				) {
					throw new Error("Expected ')' after condition");
				}
				context.pos++;

				let consequent = null;
				if (
					context.tokens[context.pos].type === 'operator' &&
					context.tokens[context.pos].value === '{'
				) {
					context.pos++;
					consequent = parserBlock(context);
				} else {
					consequent = walk(context);
				}

				let alternate = null;
				if (
					context.tokens[context.pos]?.type === 'keyword' &&
					context.tokens[context.pos].value === 'else'
				) {
					context.pos++;
					if (
						context.tokens[context.pos].type === 'operator' &&
						context.tokens[context.pos].value === '{'
					) {
						context.pos++;
						alternate = parserBlock(context);
					} else {
						alternate = walk(context);
					}
				}

				return {
					type: 'IfStatement',
					condition,
					consequent,
					alternate,
				};
		}
	}

	const expr = parseExpression(context);

	if (context.tokens[context.pos]?.type === 'semicolon') context.pos++;

	return {
		type: 'ExpressionStatement',
		expression: expr,
	};
}
