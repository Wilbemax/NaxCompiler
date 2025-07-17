import {
	BinaryComparison,
	BinaryExpression,
	BlockStatement,
	Identifier,
	IfStatement,
	NumericLiteral,
	PrintStatement,
	StringLiteral,
	VariableDeclaration,
} from './evaluateNode/index.js';

export function evaluate(node, env) {
	if (!node) {
		throw new Error(`Invalid node: ${JSON.stringify(node)}`);
	}
	console.log(node, 'print node');
	
	switch (node.type) {
		case 'NumberLiteral':
			return NumericLiteral(node, env);
		case 'StringLiteral':
			return StringLiteral(node, env);
		case 'Identifier':
			return Identifier(node, env);
		case 'BinaryExpression':
			return BinaryExpression(node, env);
		case 'BinaryComparison':
			return BinaryComparison(node, env);
		case 'VariableDeclaration':
			return VariableDeclaration(node, env);
		case 'PrintStatement':
			return PrintStatement(node, env);
		case 'IfStatement':
			return IfStatement(node, env);
		case 'BlockStatement':
			return BlockStatement(node, env);
		default:
			throw new Error(`Unknown node type "${node.type}"`);
	}
}

export function interpreter(ast) {
	const env = {};
	for (const node of ast) {
		evaluate(node, env);
	}
}
