/* eslint-disable
	max-statements,
	max-lines-per-function,
	no-continue,
	id-length,
*/

const SINGLE_QUOTE = "'";
const DOUBLE_QUOTE = '"';
const COMMA = ',';
const SEMICOLON = ';';
const OPEN_BRCKT = '[';
const CLOSE_BRCKT = ']';
const BOOLEANS = ['true', 'false'];
const SECTION = 0;

function filter (line) {
	line = line.trim();

	if (!line || line[0] === SEMICOLON) return null;

	return line;
}

const EVEN = 2;

function isEven (num) {
	return num % EVEN === 0;
}

function parse (line) {
	if (line[0] === OPEN_BRCKT) {
		return parseSection(line);
	}

	const obj = {type: null};
	const len = line.length;

	let isQuoting = false;
	let quote = null;
	let singles = 0;
	let doubles = 0;
	let brackets = 0;
	let semicolon = null;

	for (let i = 0; i < len; i++) {
		const char = line[i];

	}

	return obj;
}

function cleanLine (line) {
	line = filter(line);

	if (!line) return null;

	const len = line.length;
	let singleOpen = false;
	let doubleOpen = false;
	let semicolIndex = null;

	for (let i = 0; i < len; i++) {
		const char = line[i];

		if (semicolIndex) break;

		switch (char) {
			case SINGLE_QUOTE:
				singleOpen = !singleOpen;
				if (!singleOpen) semicolIndex = null;
				break;

			case DOUBLE_QUOTE:
				doubleOpen = !doubleOpen;
				if (!doubleOpen) semicolIndex = null;
				break;

			case SEMICOLON:
				if (!singleOpen && !doubleOpen) {
					semicolIndex = semicolIndex || i;
				}

				break;

			default:
				break;
		}
	}

	if (semicolIndex) {
		line = line.substr(0, semicolIndex);
	}

	return line.trimRight();
}

function parseSection (line) {
	const len = line.length;

	if (line[len - 1] === CLOSE_BRCKT) {
		return {
			type: SECTION,
			name: getSectionName(line),
		};
	}

	let isQuoting = false;
	let quote = null;
	let singles = 0;
	let doubles = 0;
	let closingBracket = 0;
	let semicolon = 0;

	for (let i = 0; i < len; i++) {
		const char = line[i];

		switch (char) {
			case SINGLE_QUOTE:
				if (isQuoting && quote === SINGLE_QUOTE) {
					singles--;
				}
				else if (!isQuoting) {
					singles++;
					// isQuoting = true;
					quote = SINGLE_QUOTE;
				}

				break;

			case DOUBLE_QUOTE:
				if (isQuoting && quote === DOUBLE_QUOTE) {
					doubles--;
				}
				else if (!isQuoting) {
					doubles++;
					// isQuoting = true;
					quote = DOUBLE_QUOTE;
				}
				break;

			case SEMICOLON:
				if (closingBracket && !semicolon) {
					semicolon = i;
				}
				break;

			case CLOSE_BRCKT:
				if (!closingBracket) {
					closingBracket = i;
				}
				break;

			default:
				break;
		}

		isQuoting = Boolean(singles || doubles);
	}

	if (semicolon > closingBracket) {
		line = line.substr(0, semicolon).trimRight();
	}

	console.log(`*${getSectionName(line)}*`);

	return {
		type: SECTION,
		name: getSectionName(line),
	};
	// return line.trimRight();
}

function getSectionName (line) {
	const text = extractFromWrapper(line).trim();

	if (isQuoted(text)) {
		// unquote
		return extractFromWrapper(text);
	}
	return text;
}

function countOccurrences (target, str) {

}

function isWrappedWith (head, str, tail) {
	return str.startsWith(head) && str.endsWith(tail || head);
}

function isWrappedWithBrackets (str) {
	return isWrappedWith(OPEN_BRCKT, str, CLOSE_BRCKT);
}

function isQuoted (str) {
	return isWrappedWith(SINGLE_QUOTE, str) || isWrappedWith(DOUBLE_QUOTE, str);
}

function extractFromWrapper (str, wrapper) {
	const wrapLen = wrapper ? wrapper.length : 1;

	return str.substr(wrapLen, str.length - 1 - wrapLen);
}

function isNumbersOnly (str) {
	const num = parseInt(str, 10);

	return String(num) === str;
}

function isBooleanStr (str) {
	str = str.toLowerCase();

	return BOOLEANS.includes(str);
}

function getBoolean (str) {
	str = str.toLowerCase();

	if (str === BOOLEANS[0]) return true;
	if (str === BOOLEANS[1]) return false;
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

function isList (value) {
	return value.startsWith(OPEN_BRCKT);
}

function onlyStartsWithQuote (str) {
	str = str.trim();

	if (str.length === 1) return str === DOUBLE_QUOTE || str === SINGLE_QUOTE;

	const onlyOneSingle = str.startsWith(SINGLE_QUOTE) && !str.endsWith(SINGLE_QUOTE);
	const onlyOneDouble = str.startsWith(DOUBLE_QUOTE) && !str.endsWith(DOUBLE_QUOTE);
	return onlyOneSingle || onlyOneDouble;
}

function onlyEndsWithQuote (str) {
	str = str.trim();

	if (str.length === 1) return str === DOUBLE_QUOTE || str === SINGLE_QUOTE;

	const onlyOneSingle = !str.startsWith(SINGLE_QUOTE) && str.endsWith(SINGLE_QUOTE);
	const onlyOneDouble = !str.startsWith(DOUBLE_QUOTE) && str.endsWith(DOUBLE_QUOTE);
	return onlyOneSingle || onlyOneDouble;
}

function parseToList (listLine, isListStart) {
	if (isListStart) {
		listLine = listLine.substr(1).trimLeft();
		if (!listLine) return [];
	}

	if (listLine.endsWith(CLOSE_BRCKT) || listLine.endsWith(COMMA)) {
		listLine = listLine.substr(0, listLine.length - 1).trimRight();
		if (!listLine) return null;
	}

	const items = listLine.split(COMMA);
	const itemsLen = items.length;

	const list = [];
	let currentItem = '';

	for (let i = 0; i < itemsLen; i++) {
		let item = items[i];

		if (!item) continue;

		if (currentItem) {
			currentItem += COMMA + item;

			if (onlyEndsWithQuote(item)) {
				currentItem = normalizeValue(currentItem.trim());
				list.push(currentItem);
				currentItem = null;
			}
		}
		else if (onlyStartsWithQuote(item)) {
			currentItem = item;
		}
		else {
			item = normalizeValue(item.trim());
			list.push(item);
		}
	}

	return list;
}

function getKeyValue (line, firstEqual) {
	// split once by equal
	const key = line.substr(0, firstEqual).trimRight();
	const value = line.substr(firstEqual + 1).trimLeft();

	return [key, value];
}

module.exports = {
	cleanLine,
	parse,
	isWrappedWithBrackets,
	getSectionName,
	getKeyValue,
	normalizeValue,
	parseToList,
	isList,
};
