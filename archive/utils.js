function createConfigs () {
	return {
		currentSection: null,
		flags: [],
	};
}


function isSection (line) {
    // starts with '[' and ands with ']'
    // e.g. [data]
	return isWrappedWith('[', line, ']');
}

function getSectionName (line) {
    // extract "text" out of "[text]"
	return extractFromWrapper(line);
}

function isWrappedWith (head, str, tail) {
	return str.startsWith(head) && str.endsWith(tail || head);
}

function isQuoted (value) {
	return isWrappedWith('\'', value) || isWrappedWith('"', value);
}

function extractFromWrapper (str, wrapper) {
	const wrapLen = wrapper ? wrapper.length : 1;

	return str.substr(wrapLen, str.length - 1 - wrapLen);
}

function isNumbersOnly (str) {
	const num = parseInt(str, 10);
	return String(num) === str;
}

function normalizeValue (value) {
	if (isQuoted(value)) {
		return extractFromWrapper(value);
	}

	if (isNumbersOnly(value)) {
		return parseInt(value, 10);
	}

	return value;
}

function isCommentedOut (line) {
	return line[0] === ';';
}

function finalizeConfigs (cfg) {
	if (!cfg.flags.length) cfg.flags = null;

	delete cfg.currentSection;

	return cfg;
}

module.exports = {
	createConfigs,
	isSection,
	getSectionName,
	normalizeValue,
	isCommentedOut,
	finalizeConfigs,
};
