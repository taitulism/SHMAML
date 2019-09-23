/* eslint-disable no-multi-assign */

const {
	cleanLine,
	isWrappedWithBrackets,
	getKeyValue,
	normalizeValue,
	getSectionName,
	parseToList,
	isList,
} = require('./utilities');

function getLineHandler (rootObj) {
	let currentObj = rootObj;
	let currentList = null;

	return (line) => {
		line = cleanLine(line);

		if (!line) return;

		// [section]
		if (isWrappedWithBrackets(line)) {
			const sectionName = getSectionName(line);
			currentObj = rootObj[sectionName] = {};
			return;
		}

		const firstEqual = line.indexOf('=');

		// key= value/list
		if (firstEqual > 0) {
			const [key, rawValue] = getKeyValue(line, firstEqual);

			if (isList(rawValue)) {
				currentObj[key] = parseToList(rawValue, true);
				currentList = rawValue.endsWith(']') ? null : currentObj[key];
			}
			else { // key=value
				currentObj[key] = normalizeValue(rawValue);
			}
		}
		// multiline list item, with or without closing bracket ]
		else if (currentList) {
			// List End
			if (line === ']') currentList = null;

			// List Continues (multiline)
			else currentList.push(...parseToList(line, false));
		}
	};
}

module.exports = getLineHandler;
