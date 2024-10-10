const fs = require("fs");
const path = require('path');

const filePath = path.resolve(__dirname, './../sources/x/create.tardigrade.ts');

const pkg = require('./../package.json');
const version = `console.log('Tardigrade v${pkg.version}');`;

let fileContent = fs.readFileSync(filePath, 'utf-8');

const versionRegex = /\/\/\/ processing-version <<[\s\S]*?\/\/\/ processing-version >>/;

fileContent = fileContent.replace(versionRegex, `/// processing-version <<\n${version}\n/// processing-version >>`);

fs.writeFileSync(filePath, fileContent);

console.log(`Added text "${version}" in file "${filePath}"`);


