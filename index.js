const fs = require('fs');
const { tokenize } = require('./laxer');
const { parser } = require('./parser');
const { interpreter } = require('./interpreter');
console.log(1);

const startBuild = new Date();
const fileName = process.argv[2];
if (!fileName) {
	console.error('❌ No input file provided');
	process.exit(1);
}console.log(2);

const code = fs.readFileSync(fileName, 'utf-8');

console.log(3);

const tokens = tokenize(code);
console.log(4);

const AST = parser(tokens);

console.log(tokens);
fs.writeFileSync('./render.txt', JSON.stringify(AST, null, 2));
interpreter(AST);
const finishBuild = new Date();
console.log('Compiling time: ', finishBuild - startBuild, 'ms');
