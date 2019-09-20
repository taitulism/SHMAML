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

		if (firstEqual === NONE) return;

		const [key, value] = getKeyValue(line, firstEqual);

		currentObj[key] = normalizeValue(value);
	};
}

module.exports = getLineHandler;

function getKeyValue (line, firstEqual) {
	// split once by equal
	const key = line.substr(0, firstEqual).trim();
	const value = line.substr(firstEqual + 1).trim();

	return [key, value];
}
