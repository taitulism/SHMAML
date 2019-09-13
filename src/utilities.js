function isSection (line) {
    // starts with '[' and ands with ']'
    // e.g. [data]
	return isWrappedWith('[', line, ']');
}

function getSectionName (line) {
    // extract "text" out of "[text]"
	return extractFromWrapper(line).trim();
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

function isCommentedOut (line) {
	return line[0] === ';';
}

function normalizeValue (value) {
	value = removeInlineComments(value);

	if (isQuoted(value)) {
		return extractFromWrapper(value);
	}

	if (isNumbersOnly(value)) {
		return parseInt(value, 10);
	}

	return value;
}

const NONE = -1;
const QUOTES = ['"', "'"];
const isQuoteMark = aChar => QUOTES.includes(aChar);

function removeInlineComments (str) {
	const lastSemiColon = str.lastIndexOf(';');

	if (lastSemiColon === NONE) return str;

	const withoutLastSemicolon = str.substr(0, lastSemiColon).trimRight();
	const firstChar = withoutLastSemicolon[0];
	const lastChar = withoutLastSemicolon[withoutLastSemicolon.length - 1];

	if (isQuoteMark(firstChar)) {
		if (firstChar === lastChar) {
			return withoutLastSemicolon;
		}
		return str;
	}

	return withoutLastSemicolon;
}

module.exports = {
	isSection,
	getSectionName,
	normalizeValue,
	isCommentedOut,
};
