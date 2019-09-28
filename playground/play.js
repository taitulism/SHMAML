/* eslint-disable */
// const fs = require('fs');

const parse = require('../index');

(async () => {
	try {
		const obj = await parse('./playground/try.ini');

		console.log(obj);
		// console.log(obj.colors1);
		// console.log(obj.colors2);
		// console.log(obj.colors3);
		// console.log(obj.colors4);

		setTimeout(() => { }, 20000);
	}
	catch (err) {
		console.log('ARRR:\n', err);
	}

})();
