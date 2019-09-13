const fs = require('fs');
const {EOL} = require('os');

const getLineHandler = require('./get-line-handler');
const {createConfigs, finalizeConfigs} = require('./utilities');

function parseIniFileSync (path) {
	const content = fs.readFileSync(path, 'utf-8');

	const lines = content.split(EOL);
	const cfg = createConfigs();
	const lineHandler = getLineHandler(cfg);

	lines.forEach(lineHandler);

	return finalizeConfigs(cfg);
}

module.exports = parseIniFileSync;
