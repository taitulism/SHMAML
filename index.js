const parseIniFile = require('./src/parse-ini-file');
const parseIniFileSync = require('./src/parse-ini-file-sync');

parseIniFile.sync = parseIniFileSync;

module.exports = parseIniFile;
