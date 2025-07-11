function evaluate(node, env) {
	switch (node.type) {
		case 'NumberLiteral':
			return Number(node.value);
		case 'StringLiteral':
			return node.value.toString()
		case 'Identifier':
			if (env.hasOwnProperty(node.value)) {
				return env[node.value];
			} else {
				throw new Error(`Undefined variable "${node.value}"`);
			}
		case 'BinaryExpression':
			const left = evaluate(node.left, env);
			const right = evaluate(node.right, env);

			switch (node.operator) {
				case '+':
					return left + right;
				case '-':
					return left - right;
				case '*':
					return left * right;
				case '/':
					if (right === 0) {
						throw new Error('Division by zero');
					} else {
						return left / right;
					}
				default:
					throw new Error(`Unknown operator: ${node.operator}`);
			}
		case 'VariableDeclaration':
			const value = evaluate(node.value, env);
			env[node.name] = value;
			return;
		case 'PrintStatement':
			const result = evaluate(node.argument, env);
			console.log(result);
			return;
		default:
			throw new Error(`Unknown node type "${node.type}"`);
	}
}

function interpreter(ast) {
	const env = {};
	for (const node of ast) {
		evaluate(node, env);
	}
}

module.exports = { interpreter };
