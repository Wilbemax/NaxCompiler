import { walk } from "./parser/walk.js";

export function parser(tokens) {
	
	const context = {
		tokens,
		pos: 0
	}
	
	
	const ast = [];

	while (context.pos < tokens.length) {
		
		
		ast.push(walk(context));
	}

	return ast;
}
