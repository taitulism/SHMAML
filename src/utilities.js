/* eslint-disable max-statements */

function isSection (line) {
    // e.g. [section]
	return isWrappedWith('[', line, ']');
}

function getSectionName (line) {
	// extract "text" out of "[text]"
	const text = extractFromWrapper(line).trim();

	if (isQuoted(text)) {
		// unquote
		return extractFromWrapper(text);
	}
	return text;
}

function isWrappedWith (head, str, tail) {
	return str.startsWith(head) && str.endsWith(tail || head);
}

function isQuoted (str) {
	return isWrappedWith("'", str) || isWrappedWith('"', str);
}

function extractFromWrapper (str, wrapper) {
	const wrapLen = wrapper ? wrapper.length : 1;

	return str.substr(wrapLen, str.length - 1 - wrapLen);
}

function isNumbersOnly (str) {
	const num = parseInt(str, 10);

	return String(num) === str;
}

const BOOLEANS = ['true', 'false'];

function isBooleanStr (str) {
	str = str.toLowerCase();

	return BOOLEANS.includes(str);
}

function getBoolean (str) {
	str = str.toLowerCase();

	if (str === BOOLEANS[0]) return true;
	if (str === BOOLEANS[1]) return false;
}

function isCommentedOut (line) {
	return line[0] === ';';
}

function normalizeValue (value) {
	if (isQuoted(value)) {
		return extractFromWrapper(value);
	}

	if (isNumbersOnly(value)) {
		return parseInt(value, 10);
	}

	if (isBooleanStr(value)) {
		return getBoolean(value);
	}

	return value;
}

const LIST_SIGNS = [',', ']'];
function normalizeListItem (item) {
	let itemLen = item.length;
	const firstChar = item[0];
	const lastChar = item[itemLen - 1];

	if (firstChar === '[') {
		item = item.substr(1).trimLeft();
		itemLen = item.length;
	}

	if (LIST_SIGNS.includes(lastChar)) {
		item = item.substr(0, itemLen - 1);
	}

	let items = isQuoted(item) ? [item] : item.split(',');
	items = items
		.map(mapItem => normalizeValue(mapItem.trim()))
		.filter(filterItem => Boolean(filterItem));

	return items;
}

function getKeyValue (line, firstEqual) {
	// split once by equal
	const key = line.substr(0, firstEqual).trimRight();
	const value = line.substr(firstEqual + 1).trimLeft();

	return [key, value];
}

function cleanLine (line) {
	line = line.trimLeft();

	if (!line || line[0] === ';') return null;

	const len = line.length;
	let singleOpen = false;
	let doubleOpen = false;
	let semicolIndex = null;

	for (let i = 0; i < len; i++) {
		const char = line[i];

		if (char === "'") {
			singleOpen = !singleOpen;
			if (!singleOpen) semicolIndex = null;
		}

		if (char === '"') {
			doubleOpen = !doubleOpen;
			if (!doubleOpen) semicolIndex = null;
		}

		if (char === ';') semicolIndex = semicolIndex || i;
	}

	if (semicolIndex) {
		line = line.substr(0, semicolIndex);
	}

	return line.trimRight();
}

module.exports = {
	cleanLine,
	isSection,
	getSectionName,
	getKeyValue,
	normalizeValue,
	normalizeListItem,
	extractFromWrapper,
};
