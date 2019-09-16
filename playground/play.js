/* eslint-disable */

// const fs = require('fs');

const parse = require('../index');

(async () => {
	try {
		const obj = await parse('./playground/dummy.ini');

		console.log(obj);
	}
	catch (err) {
		console.log('ARRR:\n', err);
	}

})();
