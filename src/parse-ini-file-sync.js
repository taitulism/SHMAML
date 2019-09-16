const fs = require('fs');

const getLineHandler = require('./get-line-handler');

function parseIniFileSync (path) {
	if (typeof path !== 'string') {
		throw new Error('parseIniFile: First argument "path" must be a string.');
	}

	const rootObj = {};
	const lineHandler = getLineHandler(rootObj);
	const content = fs.readFileSync(path, 'utf-8');
	const lines = content.split(/\r?\n/u);

	lines.forEach(lineHandler);

	return rootObj;
}

module.exports = parseIniFileSync;
