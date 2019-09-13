const {
	isCommentedOut,
	isSection,
	normalizeValue,
	getSectionName,
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
			rootObj[sectionName] = {};
			currentObj = rootObj[sectionName];

			return;
		}

		const firstEqual = line.indexOf('=');

		// flags
		if (firstEqual === NONE) {
			currentObj.flags = currentObj.flags || [];
			currentObj.flags.push(line);
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
