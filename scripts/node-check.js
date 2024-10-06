const fs = require('fs');
const path = require('path');

const nvmrcPath = path.join(__dirname, '../.nvmrc');
const expectedVersion = fs.readFileSync(nvmrcPath).toString().trim();

if (process.version !== expectedVersion) {
	console.error(`Error: Required Node.js version is ${expectedVersion}, but found ${process.version}. You can use nvm to manage multiple node versions on a system.`);
	process.exit(1);
}
