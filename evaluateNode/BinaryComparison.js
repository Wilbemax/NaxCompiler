import { evaluate } from '../interpreter.js';

export const BinaryComparison = (node, env) => {
	if (!node.left || !node.right || !node.operator) {
		throw new Error(
			`Incomplete BinaryComparison node: ${JSON.stringify(node)}`
		);
	}
	const left = evaluate(node.left, env);
	const right = evaluate(node.right, env);

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
};
