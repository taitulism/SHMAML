/* eslint-disable */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

const parse = require('../');
const parseSync = parse.sync;

describe('SHMAML\n  ──────', () => {
	describe('* Arguments', () => {
		describe('[0] String - A path to a config file.', () => {
			it('[sync] throws if first param is not a string', () => {
				const shouldThrow = () => parseSync(4);
				expect(shouldThrow).to.throw('First argument "path" must be a string');
			});

			it('[sync] throws if first param is path to non-exist file', () => {
				const shouldThrow = () => parseSync('./nope.ini');
				expect(shouldThrow).to.throw('ENOENT: no such file or directory');
			});

			it('[async] rejects if first param is not a string', () => {
				const fn = () => parse(4);

				return expect(fn()).to.be.rejectedWith('First argument "path" must be a string');
			});

			it('[async] rejects if first param is path to non-exist file', () => {
				const fn = () => parse('./nope.ini');

				return expect(fn()).to.be.rejectedWith('ENOENT: no such file or directory');
			});
		});
	});

	describe('* Return: JSON object', () => {
		it('[sync] always returns an object', () => {
			const nonEmptyFile = parseSync('./tests/dummy-config-files/standard.ini');
			expect(nonEmptyFile).to.be.an('object');

			const emptyFile = parseSync('./tests/dummy-config-files/empty.ini');
			expect(emptyFile).to.be.an('object');
		});

		it('[async] always resolves with an object', async () => {
			const nonEmptyFile = await parse('./tests/dummy-config-files/standard.ini');
			expect(nonEmptyFile).to.be.an('object');

			const emptyFile = await parse('./tests/dummy-config-files/empty.ini');
			expect(emptyFile).to.be.an('object');
		});

		it('even for empty files', async () => {
			const emptyFileSync = parseSync('./tests/dummy-config-files/empty.ini');
			const emptyFile = await parse('./tests/dummy-config-files/empty.ini');
			expect(emptyFile).to.be.an('object');
			expect(emptyFile).to.deep.equal(emptyFileSync);
		});
	});

	describe('Standard `config.ini` with lists', () => {
		it('parses standard `config.ini` files', async () => {
			const configFile = './tests/dummy-config-files/standard.ini';

			const result = await parse(configFile);
			const resultSync = parseSync(configFile);

			expect(result).to.deep.equal(resultSync);
			expect(result).to.deep.equal({
				javadir: 'C:\\Program Files\\Java\\jdk-11.0.2\\bin\\',
				machine: {
					host: '127.0.0.1',
					machineKey: '820e73fc2dc8a8f2cd5ff167c0eb599b0f',
					datadir: '\\\\DESKTOP-FIFTH.DEV.company.com\\imdb',
					publicdir: '\\\\localhost\\shared\\public',
					localpublicdir: 'D:\\shared\\public',
					pythonpath: 'C:\\ProgramData\\Anaconda3\\python.exe',
					localdbport: 12220,
				},
				db: {
					dbhost: '168.192.0.2',
					database: 'product',
					port: 5001 ,
					type: 'mysql',
					username: 'Admin',
					password: 1234,
				},
				router: {
					wwwport: 12230,
					tcpPort: 12240,
				}
			});
		});
	});

	describe('* Conventions', () => {
		describe('key=value', () => {
			it('key=value', async () => {
				const configFile = './tests/dummy-config-files/key-value-pairs.ini';

				const result = await parse(configFile);
				const resultSync = parseSync(configFile);

				expect(result).to.deep.equal(resultSync);
				expect(result).to.deep.equal({
					a: 'aa',
					b: 'b b',
					c: 'cc',
					d: 'dd',
					e: 'ee',
					f: 'ff',
					g: 'gg',
					h: 'hh',
					i: 'ii',
					j: "jj",
					k: ' kk ',
					ll: '  l l  ',
					m: 'mm',
					n: 'nn',
					o: 'o   o',
				});
			});

			it('parses numbers when are not quoted', async () => {
				const configFile = './tests/dummy-config-files/numbers.ini';

				const result = await parse(configFile);
				const resultSync = parseSync(configFile);

				expect(result).to.deep.equal(resultSync);
				expect(result).to.deep.equal({
					key1: 11,
					key2: 22,
					key3: 33,
					key4: 44,
					key5: '55',
					key6: '66',
				});
			});

			it('parses booleans when are not quoted', async () => {
				const configFile = './tests/dummy-config-files/booleans.ini';

				const result = await parse(configFile);
				const resultSync = parseSync(configFile);

				expect(result).to.deep.equal(resultSync);
				expect(result).to.deep.equal({
					key1: true,
					key2: false,
					key3: true,
					key4: false,
					key5: 'true',
					key6: 'false',
				});
			});
		});

		describe('Sections', () => {
			it('[Category]', async () => {
				const configFile = './tests/dummy-config-files/sections.ini';

				const result = await parse(configFile);
				const resultSync = parseSync(configFile);

				expect(result).to.deep.equal(resultSync);
				expect(result).to.deep.equal({
					Category1: {
						a: 'aaa',
					},
					Category2: {
						a: 'aaa',
					},
					'Category 3': {
						a: 'aaa',
					},
					" ' Category 4 ' ": {
						a: 'aaa',
					},
				});
			});
		});

		describe(';comments', () => {
			it('ignores full comment lines', async () => {
				const configFile = './tests/dummy-config-files/comment-lines.ini';

				const result = await parse(configFile);
				const resultSync = parseSync(configFile);

				expect(result).to.deep.equal(resultSync);
				expect(result).to.deep.equal({
					a: 'aa',
					c: 'cc',
					category: {
						a: 'aaa',
						c: 'ccc',
					}
				});
			});

			it('ignores inline comments', async () => {
				const configFile = './tests/dummy-config-files/inline-comments.ini';

				const result = await parse(configFile);
				const resultSync = parseSync(configFile);

				expect(result).to.deep.equal(resultSync);
				expect(result).to.deep.equal({
					a: 'aaa',
					b: 'bbb',
					c: 'ccc',
					d: 'ddd',
					e: 'eee',
					f: '; first char single quoted semicolon',
					g: '; first char single quoted semicolon, no inline comment',
					h: '; first char double quoted semicolon',
					i: '; first char double quoted semicolon, no inline comment',
					j: 'single quoted ; semicolon',
					k: 'single quoted ; semicolon, no inline comment',
					l: 'double quoted ; semicolon',
					m: 'double quoted ; semicolon, no inline comment',
					n: 'aa ; bb',
				});
			});
		});

		describe('Lists', () => {
			it('inline list', async () => {
				const configFile = './tests/dummy-config-files/inline-list.ini';

				const result = await parse(configFile);
				const resultSync = parseSync(configFile);

				expect(result).to.deep.equal(resultSync);
				expect(result).to.deep.equal({
					colors: [
						'blue',
						'yellow',
						'red'
					],
					key: 'value',
					category: {
						fruits: ['apple', 'banana', 'orange'],
						vegetables: ['potato', 'carrot', 'onion'],
						key: 'value'
					},
				});
			});

			it('multiline list', async () => {
				const configFile = './tests/dummy-config-files/multiline-list.ini';

				const resultSync = parseSync(configFile);
				const result = parseSync(configFile);

				expect(result).to.deep.equal(resultSync);
				expect(result).to.deep.equal({
					colors: [
						'blue',
						'yellow',
						'red'
					],
					key: 'value',
					super_heros: {
						names: ['Superman', 'Batman', 'Spiderman'],
						key: 'value'
					},
					fruits: [
						'apple',
						'banana',
						'orange',
						'mango',
						'water, melon'
					],
					vegetables: [
						'tomato',
						'onion',
						'cabbage',
						'lettuce',
						'cucumber',
					]
				});
			});
		});
	});
});
