import { evaluate } from '../interpreter.js';

export const BlockStatement = (node, env) => {
	for (const stmt of node.body) {
		evaluate(stmt, env);
	}
	return;
};
