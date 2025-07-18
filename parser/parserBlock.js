import { walk } from "./walk.js";

export function parserBlock(context) {
	const body = [];
	while (
		context.pos < context.tokens.length &&
		!( context.tokens[context.pos].type === 'operator' &&  context.tokens[context.pos].value === '}')
	) {
		body.push(walk(context));
	}

	if ( context.tokens[context.pos].value !== '}') {
		throw new Error('Expected "}" at the end of the block');
	}

	context.pos++;
	return {
		type: 'BlockStatement',
		body,
	};
}
