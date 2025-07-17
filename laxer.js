const isSpace = (char) => /\s/.test(char);
const isDigit = (char) => /[0-9]/.test(char);
const isIdentifierStart = (char) => /[a-zA-Z_]/.test(char);
const isIdentifierChar = (char) => /[a-zA-Z0-9_]/.test(char);

export function tokenize(str) {
	const tokens = [];
	let pos = 0;

	while (pos < str.length) {
		const char = str[pos];

		// Пробелы пропускаем
		if (isSpace(char)) {
			pos++;
			continue;
		}

		// Число
		if (isDigit(char)) {
			let num = '';
			while (isDigit(str[pos])) {
				num += str[pos++];
			}
			tokens.push({ type: 'number', value: num });
			continue;
		}

		// Строка
		if (char === '"') {
			let strVal = '';
			pos++;
			while (pos < str.length && str[pos] !== '"') {
				strVal += str[pos++];
			}
			if (str[pos] !== '"') throw new Error('Unterminated string literal');
			pos++;
			tokens.push({ type: 'string', value: strVal });
			continue;
		}

		// Идентификаторы и ключевые слова
		if (isIdentifierStart(char)) {
			let word = '';
			while (isIdentifierChar(str[pos])) {
				word += str[pos++];
			}

			if (['let', 'print', 'if', 'else', 'while'].includes(word)) {
				tokens.push({ type: 'keyword', value: word });
			} else {
				tokens.push({ type: 'identifier', value: word });
			}
			continue;
		}

		// Операторы
		const twoCharOps = ['==', '!=', '>=', '<='];
		const oneCharOps = ['+', '-', '*', '/', '=', '(', ')', '{', '}', '>', '<'];

		let twoChar = str.slice(pos, pos + 2);
		if (twoCharOps.includes(twoChar)) {
			tokens.push({ type: 'operator', value: twoChar });
			pos += 2;
			continue;
		}

		if (oneCharOps.includes(char)) {
			tokens.push({ type: 'operator', value: char });
			pos++;
			continue;
		}

		// Точка с запятой
		if (char === ';') {
			tokens.push({ type: 'semicolon', value: char });
			pos++;
			continue;
		}

		// Неизвестный символ
		throw new Error(`Unexpected character: ${char}`);
	}

	return tokens;
}
