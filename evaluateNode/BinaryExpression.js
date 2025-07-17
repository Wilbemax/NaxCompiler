import { evaluate } from '../interpreter.js';

export const BinaryExpression = (node, env) => {
	const left = evaluate(node.left, env);
	const right = evaluate(node.right, env);
console.log('node', node, 'env', env, 'left', left, 'right', right, "in binary expression");

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
};
