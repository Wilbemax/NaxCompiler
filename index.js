const fs = require('fs');
const { tokenize } = require('./laxer');
const { parser } = require('./parser');
const { interpreter } = require('./interpreter');

const startBuild = new Date();
const fileName = process.argv[2];
const code = fs.readFileSync(fileName, 'utf-8');

const tokens = tokenize(code);

const AST = parser(tokens);

// console.log(tokens);
fs.writeFileSync('./render.txt', JSON.stringify(AST, null, 2));
interpreter(AST)
const finishBuild = new Date();
console.log('Compiling time: ', finishBuild - startBuild, 'ms');
