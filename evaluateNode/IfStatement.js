import { evaluate } from '../interpreter.js';

export const IfStatement = (node, env) => {
	if (evaluate(node.condition, env)) {
		evaluate(node.consequent, env);
	} else if (node.alternate) {
		evaluate(node.alternate, env);
	}
	return;
};
