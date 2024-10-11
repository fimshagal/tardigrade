const fs = require("fs");
const path = require('path');

const distDir = path.join(__dirname, './../dist');
const indexPath = path.join(distDir, './../index.js');

const esModuleFile = fs.readdirSync(distDir).find(file => file.endsWith('es.js'));
const exportStatement = `export * from './dist/${esModuleFile}';\n`;

fs.writeFileSync(indexPath, exportStatement, 'utf-8');

console.log(`"index.js" file was created`);