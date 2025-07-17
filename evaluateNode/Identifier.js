export const Identifier = (node, env) => {
	console.log(env);
	
	if (env.hasOwnProperty(node.value)) {
		return env[node.value];
	} else {
		throw new Error(`Undefined variable "${node.value}"`);
	}
};
