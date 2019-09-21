/* eslint-disable max-statements, max-lines-per-function */

const {
	isCommentedOut,
	isSection,
	normalizeValue,
	normalizeListItem,
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

		if (firstEqual > 0) { // key= value/list
			const [key, rawValue] = getKeyValue(line, firstEqual);

			if (rawValue.startsWith('[')) { // List
				// single line list
				if (rawValue.endsWith(']')) {
					const value = extractFromWrapper(rawValue); // .trim()
					const listItems = normalizeListItem(value)
					// const listItems = value.split(',').map(normalizeValue);

					currentObj[key] = listItems;
				}
				// multiline list
				else {
					currentObj[key] = currentList = [];
					const items = normalizeListItem(rawValue);

					items.forEach((item) => {
						item && currentList.push(item);
					});
				}

			}
			else { // key=value
				currentObj[key] = normalizeValue(rawValue);
			}
		}
		// multiline item, with or without the closing bracket ]
		else if (currentList) {
			if (line === ']') {
				currentList = null;
			}
			else {
				// continue multiline list or an error
				currentList.push(...normalizeListItem(line));
			}
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
