const fs = require('fs');
const readline = require('readline');

const getLineHandler = require('./get-line-handler');

function parse (path) {
	return new Promise((resolve, reject) => {
		if (typeof path !== 'string') {
			return reject(new Error('SHMAML: First argument "path" must be a string.'));
		}

		const rootObj = {};
		const lineReader = createFileLineReader(path);
		const lineHandler = getLineHandler(rootObj);

		lineReader
			.on('line', lineHandler)
			.on('close', () => {
				resolve(rootObj);
			})
			.on('error', (err) => {
				reject(err);
			});
	});
}

module.exports = parse;

function createFileLineReader (path) {
	const fileStream = fs.createReadStream(path);

	const lineReader = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	// pass the "error" event from the filestream to the returned lineReader.
	fileStream.on('error', (err) => {
		lineReader.emit('error', err);
	});

	return lineReader;
}
