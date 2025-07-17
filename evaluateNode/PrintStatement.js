import { evaluate } from '../interpreter.js';

export const PrintStatement = (node, env) => {
	const result = evaluate(node.argument, env);
	console.log(result);
	return;
};
