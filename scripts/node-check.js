const fs = require('fs');
const path = require('path');
const semver = require('semver');

// Skip version check in automated dependency update environments
if (process.env.DEPENDABOT || process.env.DEPENDABOT_HOME) process.exit(0);

const nvmrcPath = path.join(__dirname, '../.nvmrc');
const expectedVersion = fs.readFileSync(nvmrcPath).toString().trim();
const expectedMajor = semver.major(expectedVersion);

if (!semver.satisfies(process.version, `^${expectedMajor}`)) {
	console.error(`Error: Required Node.js major version is ${expectedMajor}, but found ${process.version}. You can use nvm to manage multiple node versions on a system.`);
	process.exit(1);
}
