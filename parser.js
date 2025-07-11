function parser(tokens) {
	let pos = 0;

	function parseExpression() {
		let node = parseTerm();

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
			}
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
	function walk() {
		const token = tokens[pos];

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

					pos++;
					if (tokens[pos].type === 'semicolon') pos++;
					return {
						type: 'VariableDeclaration',
						name,
						value: valueNode,
					};
				case 'print':
					pos++;
					const leftParen = tokens[pos];
					if (leftParen.type !== 'operator' || leftParen.value !== '(') {
						throw new Error("Expected '(' after 'print'");
					}

					pos++;
					const arg = tokens[pos];
					if (arg.type !== 'identifier' && arg.type !== 'number' && arg.type !== 'string') {
						throw new Error('Expected identifier or number or string in print()');
					}
					
					const argumentNode = {
						type: arg.type === 'identifier' ? 'Identifier' :  arg.type === 'NumberLiteral' ? 'NumberLiteral' : 'StringLiteral',
						value: arg.value,
					};

					pos++;
					const rightParen = tokens[pos];
					if (rightParen.type !== 'operator' || rightParen.value !== ')') {
						throw new Error("Expected ')' after print argument");
					}

					pos++;
					if (tokens[pos]?.type === 'semicolon') pos++;

					return {
						type: 'PrintStatement',
						argument: argumentNode,
					};
			}
		}
	}

	const ast = [];

	while (pos < tokens.length) {
		ast.push(walk());
	}

	return ast;
}

module.exports = { parser };
