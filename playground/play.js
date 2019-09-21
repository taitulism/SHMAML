/* eslint-disable */
// const fs = require('fs');

const parse = require('../index');

(async () => {
	try {
		const obj = await parse('./playground/try.ini');

		console.log(obj);

		setTimeout(() => { }, 5000);
	}
	catch (err) {
		console.log('ARRR:\n', err);
	}

})();
