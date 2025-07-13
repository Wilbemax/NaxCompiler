function evaluate(node, env) {
	if (!node) {
		throw new Error(`Invalid node: ${JSON.stringify(node)}`);
	}
	let left = null;
	let right = null;
	switch (node.type) {
		case 'NumberLiteral':
			return Number(node.value);
		case 'StringLiteral':
			return node.value.toString();
		case 'Identifier':
			console.log(env);
			if (env.hasOwnProperty(node.value)) {
				return env[node.value];
			} else {
				throw new Error(`Undefined variable "${node.value}"`);
			}
		case 'BinaryExpression':
			left = evaluate(node.left, env);
			right = evaluate(node.right, env);

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

		case 'BinaryComparison':
			if (!node.left || !node.right || !node.operator) {
				throw new Error(
					`Incomplete BinaryComparison node: ${JSON.stringify(node)}`
				);
			}
			console.log(
				'left',
				left,
				'right',
				right,
				'node',
				node.operator,
				'env',
				env
			);
			left = evaluate(node.left, env);
			right = evaluate(node.right, env);

			switch (node.operator) {
				case '==':
					return left === right;
				case '!=':
					return left !== right;
				case '>':
					return left > right;
				case '<':
					return left < right;
				case '>=':
					return left >= right;
				case '<=':
					return left <= right;
				default:
					throw new Error(`Unknown comparison operator: ${node.operator}`);
			}
		case 'VariableDeclaration':
			const value = evaluate(node.value, env);
			env[node.name] = value;
			return;
		case 'PrintStatement':
			const result = evaluate(node.argument, env);
			console.log(result);
			return;
		case 'IfStatement':
			if (evaluate(node.condition, env)) {
				evaluate(node.consequent, env);
			} else if (node.alternate) {
				evaluate(node.alternate, env);
			}
			return;
		case 'BlockStatement':
			for (const stmt of node.body) {
				evaluate(stmt, env);
			}
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
