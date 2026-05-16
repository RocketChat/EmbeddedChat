const fs = require('fs');
const path = require('path');

const nvmrcPath = path.join(__dirname, '../.nvmrc');
const expectedVersion = fs.readFileSync(nvmrcPath).toString().trim();
const expectedMajor = parseInt(expectedVersion.replace('v', '').split('.')[0], 10);
const actualMajor = parseInt(process.version.replace('v', '').split('.')[0], 10);

if (actualMajor !== expectedMajor) {
	console.error(`Error: Required Node.js major version is ${expectedMajor}, but found ${process.version}. You can use nvm to manage multiple node versions on a system.`);
	process.exit(1);
}
