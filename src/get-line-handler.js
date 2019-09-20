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
	let currentList = null;

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

		const [key, rawValue] = getKeyValue(line, firstEqual);

		// List
		if (rawValue.startsWith('[')) {
			if (rawValue.endsWith(']')) { // single line list
				const value = extractFromWrapper(rawValue);
				const listItems = value.split(/,\s?/u).map(normalizeValue);

				currentObj[key] = listItems;
			}
			else { // multiline list

			}
		}
		// key=value
		else {
			currentObj[key] = normalizeValue(rawValue);
		}
	};
}

module.exports = getLineHandler;

function getKeyValue (line, firstEqual) {
	// split once by equal
	const key = line.substr(0, firstEqual).trim();
	const value = line.substr(firstEqual + 1).trim();

	return [key, value];
}
