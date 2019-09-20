/* eslint-disable */

// const fs = require('fs');

const parse = require('../index');

(async () => {
	try {
		const obj = await parse('./playground/dummy.ini');

		console.log(obj);
	}
	catch (err) {
		console.log('ARRR:\n', err);
	}

})();








function handleFlag (line, currentObj) {
	currentObj.flags = currentObj.flags || [];

	line = removeInlineComments(line);

	if (isQuoted(line)) {
		line = extractFromWrapper(line);
	}

	if (!currentObj.flags.includes(line)) {
		if (isBooleanStr(line)) {
			const bool = getBoolean(line);
			currentObj.flags.push(bool);
		}
		else {
			currentObj.flags.push(line);
		}
	}
}
