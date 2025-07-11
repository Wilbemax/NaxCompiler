const isSpace = (char) => {
	return /\s/.test(char) || char === '';
};

const isDigit = (char) => {
	return /[0-9]/.test(char);
};

const isLetter = (char) => {
	return /[a-zA-Z]/.test(char);
};

function tokenize(str) {
	const token = [];
	let pos = 0;

	while (pos < str.length) {
		const char = str[pos];
		try {
			if (isSpace(char)) {
				pos++;
				continue;
			}

			if (isDigit(char)) {
				let num = '';

				while (isDigit(str[pos])) {
					num += str[pos++];
				}

				token.push({
					type: 'number',
					value: num,
				});
				continue;
			}

			if (char === '"') {
				let strVal = '';
				pos++; 

				while (pos < str.length && str[pos] !== '"') {
					strVal += str[pos++];
				}

				if (str[pos] !== '"') {
					throw new Error('Unterminated string literal');
				}

				pos++; 

				token.push({
					type: 'string',
					value: strVal,
				});
				continue;
			}

			if (isLetter(str[pos])) {
				let word = '';
				while (isLetter(str[pos])) {
					word += str[pos++];
				}

				if (word === 'let' || word === 'print') {
					token.push({
						type: 'keyword',
						value: word,
					});
				} else {
					token.push({
						type: 'identifier',
						value: word,
					});
				}
				continue;
			}

			if ('+-/*=()'.includes(char)) {
				token.push({
					type: 'operator',
					value: char,
				});
				pos++;
				continue;
			}

			if (char === ';') {
				token.push({ type: 'semicolon', value: char });
				pos++;
				continue;
			}
		} catch (e) {
			throw new Error(`Unexpected character: ${char}`);
		}
	}

	return token;
}

module.exports = { tokenize };
