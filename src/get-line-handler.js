/* eslint-disable max-statements */

const {
	isCommentedOut,
	isSection,
	normalizeValue,
	getSectionName,
	isQuoted,
	extractFromWrapper,
	isBooleanStr,
	getBoolean,
	removeInlineComments,
} = require('./utilities');

const NONE = -1;

function getLineHandler (rootObj) {
	let currentObj = rootObj;
	return (line) => {
		line = line.trim();

		if (!line || isCommentedOut(line)) return;

		// [section]
		if (isSection(line)) {
			const sectionName = getSectionName(line);
			rootObj[sectionName] = rootObj[sectionName] || {};
			currentObj = rootObj[sectionName];

			return;
		}

		const firstEqual = line.indexOf('=');

		// flags
		if (firstEqual === NONE) {
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

			return;
		}

		// key=value pairs
		// split once by equal
		const key = line.substr(0, firstEqual).trim();
		const value = line.substr(firstEqual + 1).trim();

		currentObj[key] = normalizeValue(value);
	};
}

module.exports = getLineHandler;
