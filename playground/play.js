const fs = require('fs');
const readline = require('readline');

const {parseIniFile} = require('../index');

(async () => {
	try {
		const rs = fs.createReadStream('qwedasd')

		rs.on('error', (er) => {
			console.log('errrrrrrrr', er);
		})

		console.log(rs);
	}
	catch (err) {
		console.log('cought', err);
	}

	setTimeout(() => {
		console.log(234);
	}, 5000);
	// const qwe = await parseIniFile('../dsffd.ini')
	// console.log(qwe);
})();
