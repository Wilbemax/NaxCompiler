import fs from 'fs';

import {interpreter} from './interpreter.js';
import {tokenize} from './laxer.js'
import {parser} from './parser.js'




const startBuild = new Date();
const fileName = process.argv[2];
if (!fileName) {
	console.error('❌ No input file provided');
	process.exit(1);
}

const code = fs.readFileSync(fileName, 'utf-8');



const tokens = tokenize(code);

const AST = parser(tokens);

console.log(tokens);
fs.writeFileSync('./render.txt', JSON.stringify(AST, null, 2));
interpreter(AST);
const finishBuild = new Date();
console.log('Compiling time: ', finishBuild - startBuild, 'ms');
