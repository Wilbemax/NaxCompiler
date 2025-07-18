export const Identifier = (node, env) => {
	if (env.hasOwnProperty(node.value)) {
		return env[node.value];
	} else {
		throw new Error(`Undefined variable "${node.value}"`);
	}
};
