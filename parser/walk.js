import { parseExpression } from "./parserExpression.js";
import { parserBlock } from "./parserBlock.js";


export function walk(tokens, pos) {
		const token = tokens[pos];
		console.log('walk():', token);
		if (token.type === 'keyword') {
			switch (token.value) {
				case 'let':
					pos++;
					const variableName = tokens[pos];
					if (variableName.type !== 'identifier') {
						throw new Error(`Expected identifier, got ${variableName.type}`);
					}
					const name = variableName.value;
					pos++;
					let operator = tokens[pos];
					if (operator.type !== 'operator' || operator.value !== '=') {
						throw new Error(`Expected '=', got ${operator.type}`);
					}
					pos++;

					let valueNode = parseExpression(tokens, pos);

					if (tokens[pos]?.type === 'semicolon') pos++;
					return {
						type: 'VariableDeclaration',
						name,
						value: valueNode,
					};

				case 'print':
					pos++;
					if (tokens[pos].type !== 'operator' || tokens[pos].value !== '(') {
						throw new Error("Expected '(' after 'print'");
					}

					pos++;
					const arg = parseExpression(tokens, pos);

					const argumentNode = {
						type: arg.type,
						value: arg.value,
					};

					if (tokens[pos].type !== 'operator' || tokens[pos].value !== ')') {
						throw new Error("Expected ')' after print argument");
					}

					pos++;
					if (tokens[pos]?.type === 'semicolon') pos++;

					return {
						type: 'PrintStatement',
						argument: arg,
					};

				case 'if':
					pos++;
					if (tokens[pos].type !== 'operator' || tokens[pos].value !== '(') {
						throw new Error("Expected '(' after 'if'");
					}
					pos++;

					const condition = parseExpression(tokens, pos);
					console.log(tokens[pos]);

					if (tokens[pos].type !== 'operator' || tokens[pos].value !== ')') {
						throw new Error("Expected ')' after condition");
					}
					pos++;

					let consequent = null;
					if (tokens[pos].type === 'operator' && tokens[pos].value === '{') {
						pos++;
						consequent = parserBlock(tokens, pos);
					} else {
						consequent = walk(tokens, pos);
					}

					let alternate = null;
					if (tokens[pos]?.type === 'keyword' && tokens[pos].value === 'else') {
						pos++;
						if (tokens[pos].type === 'operator' && tokens[pos].value === '{') {
							pos++;
							alternate = parserBlock(tokens, pos);
						} else {
							alternate = walk(tokens, pos);
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

		const expr = parseExpression(tokens, pos);

		if (tokens[pos]?.type === 'semicolon') pos++;

		return {
			type: 'ExpressionStatement',
			expression: expr,
		};
	}