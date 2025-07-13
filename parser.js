function parser(tokens) {
	let pos = 0;

	function parseExpression() {
		let node = parseTerm();

		if (isComparisonOp(tokens[pos])) {
			while (pos < tokens.length && isComparisonOp(tokens[pos])) {
				const operator = tokens[pos].value;
				pos++;
				const right = parseComparison();
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
			const right = parseTerm();
			node = {
				type: 'BinaryExpression',
				operator,
				left: node,
				right,
			};
		}

		return node;
	}

	function parseTerm() {
		let node = parseFactor();

		while (pos < tokens.length && isMulOp(tokens[pos])) {
			const operator = tokens[pos].value;
			pos++;
			const right = parseFactor();
			node = {
				type: 'BinaryExpression',
				operator,
				left: node,
				right,
			};
		}

		return node;
	}

	function parseFactor() {
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
			const node = parseExpression();
			if (tokens[pos].type === 'operator' && tokens[pos].value === ')') {
				pos++;
				return node;
			} else {
				throw new Error("Expected ')'");
			}
		}

		throw new Error(`Unexpected token in factor: ${token.type} ${token.value}`);
	}

	function parserBlock() {
		const body = [];
		while (
			pos < tokens.length &&
			!(tokens[pos].type === 'operator' && tokens[pos].value === '}')
		) {
			body.push(walk());
		}

		if (tokens[pos].value !== '}') {
			throw new Error('Expected "}" at the end of the block');
		}

		pos++;
		return {
			type: 'BlockStatement',
			body,
		};
	}

	function isAddOp(token) {
		return (
			token.type === 'operator' && (token.value === '+' || token.value === '-')
		);
	}

	function isMulOp(token) {
		return (
			token.type === 'operator' && (token.value === '*' || token.value === '/')
		);
	}
	function isComparisonOp(token) {
		return (
			token.type === 'operator' &&
			['>', '<', '>=', '<=', '==', '!='].includes(token.value)
		);
	}

	function parseComparison() {
		let node = parseTerm();

		while (pos < tokens.length && isComparisonOp(tokens[pos])) {
			const operator = tokens[pos].value;
			pos++;
			const right = parseTerm();
			node = {
				type: 'BinaryComparison',
				operator,
				left: node,
				right,
			};
		}

		return node;
	}

	function walk() {
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

					let valueNode = parseExpression();

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
					const arg = parseExpression();

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

					const condition = parseExpression();
					console.log(tokens[pos]);

					if (tokens[pos].type !== 'operator' || tokens[pos].value !== ')') {
						throw new Error("Expected ')' after condition");
					}
					pos++;

					let consequent = null;
					if (tokens[pos].type === 'operator' && tokens[pos].value === '{') {
						pos++;
						consequent = parserBlock();
					} else {
						consequent = walk();
					}

					let alternate = null;
					if (tokens[pos]?.type === 'keyword' && tokens[pos].value === 'else') {
						pos++;
						if (tokens[pos].type === 'operator' && tokens[pos].value === '{') {
							pos++;
							alternate = parserBlock();
						} else {
							alternate = walk();
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

		const expr = parseExpression();

		if (tokens[pos]?.type === 'semicolon') pos++;

		return {
			type: 'ExpressionStatement',
			expression: expr,
		};
	}

	const ast = [];

	while (pos < tokens.length) {
		ast.push(walk());
	}

	return ast;
}

module.exports = { parser };
