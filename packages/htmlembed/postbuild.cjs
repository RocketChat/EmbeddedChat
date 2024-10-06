const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, 'public'), { recursive: true });

files.forEach((file) => {
	const inPath = path.join(__dirname, 'public', file);
	const outPath = path.join(__dirname, 'dist', file);
	console.log("Copy: ",inPath);
	if (fs.statSync(inPath).isDirectory()) {
		if (!fs.existsSync(outPath)) {
			fs.mkdirSync(outPath, {recursive: true});
		}
	} else {
		fs.writeFileSync(
			outPath,
			fs.readFileSync(inPath)
		);
	}
});
