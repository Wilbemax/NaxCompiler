import { walk } from "./walk.js";

export function parserBlock(tokens, pos) {
	const body = [];
	while (
		pos < tokens.length &&
		!(tokens[pos].type === 'operator' && tokens[pos].value === '}')
	) {
		body.push(walk(tokens, pos));
	}

	if (tokens[pos].value !== '}') {
		throw new Error('Expected "}" at the end of the block');
	}

	pos++;
	return {
		type: 'BlockStatement',
		body,
	};
}
