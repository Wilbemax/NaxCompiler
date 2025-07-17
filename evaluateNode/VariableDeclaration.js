import { evaluate } from '../interpreter.js';

export const VariableDeclaration = (node, env) => {
	const value = evaluate(node.value, env);
	env[node.name] = value;
	return;
};
