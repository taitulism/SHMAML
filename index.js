const parse = require('./src/parse');
const parseSync = require('./src/parse-sync');

parse.sync = parseSync;

module.exports = parse;
