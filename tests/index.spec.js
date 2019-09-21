/* eslint-disable */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

const parse = require('../');
const parseSync = parse.sync;

describe('SHMAML\n  ──────', () => {

	describe('parse()', () => {
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
				const nonEmptyFile = parseSync('./tests/ini-files/standard.ini');
				expect(nonEmptyFile).to.be.an('object');

				const emptyFile = parseSync('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});

			it('[async] always resolves with an object', async () => {
				const nonEmptyFile = await parse('./tests/ini-files/standard.ini');
				expect(nonEmptyFile).to.be.an('object');

				const emptyFile = await parse('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});

			it('even for empty files', async () => {
				const emptyFileSync = parseSync('./tests/ini-files/empty.ini');
				const emptyFile = await parse('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
				expect(emptyFile).to.deep.equal(emptyFileSync);
			});
		});

		describe('* Features', () => {
			describe('{key:value}', () => {
				it('key=value', async () => {
					const returnedValueSync = parseSync('./tests/ini-files/key-value-pairs.ini');
					const returnedValue = await parse('./tests/ini-files/key-value-pairs.ini');

					expect(returnedValue).to.deep.equal(returnedValueSync);
					expect(returnedValue).to.deep.equal({
						a: 'aaa',
						b: 'bbb',
						c: 'ccc',
						d: 'ddd',
						e: 'eee',
					});
				});
			});

			describe('; ignore comment lines', () => {
				it('ignored', async () => {
					const returnedValueSync = parseSync('./tests/ini-files/comments.ini');
					const returnedValue = await parse('./tests/ini-files/comments.ini');

					expect(returnedValue).to.deep.equal(returnedValueSync);
					expect(returnedValue).to.haveOwnProperty('a');
					expect(returnedValue).to.not.haveOwnProperty('comment');
				});
			});

			describe('ignore inline ;comments', () => {
				it('ignored', async () => {
					const returnedValueSync = parseSync('./tests/ini-files/comments.ini');
					const returnedValue = await parse('./tests/ini-files/comments.ini');

					expect(returnedValue).to.deep.equal(returnedValueSync);
					expect(returnedValue).to.deep.equal({
						a: 'value',
						b: 'value',
						c: 'value',
						d: 'value',
						e: 'value with ; semicolons',
						f: 'value with ; semicolons',
						g: 'value with ; semicolons and no inline comment',
						h: 'value with ; semicolons and no inline comment',
					});
				});
			});

			describe('{ prop: {key:value} }', () => {
				it('[section]', async () => {
					const returnedValueSync = parseSync('./tests/ini-files/section.ini');
					const returnedValue = await parse('./tests/ini-files/section.ini');

					expect(returnedValue).to.deep.equal(returnedValueSync);
					expect(returnedValue).to.deep.equal({
						section1: {
							a: 'aaa',
							b: 'bbb',
						},
						section2: {
							a: 'aaa',
							b: 'bbb',
						},
					});
				});
			});

			describe('{ list: [] }', () => {
				it('inline list [item1, item2, item3]', async () => {
					const returnedValueSync = parseSync('./tests/ini-files/list.ini');
					const returnedValue = await parse('./tests/ini-files/list.ini');

					expect(returnedValue).to.deep.equal(returnedValueSync);
					expect(returnedValue).to.deep.equal({
						colors: [
							'blue',
							'yellow'
						],
						key: 'value',
						super_heros: {
							names: ['Superman', 'Batman', 'Spiderman'],
							key: 'value'
						},
					});
				});

				it('multiline list', async () => {
					const returnedValueSync = parseSync('./tests/ini-files/list2.ini');
					const returnedValue = parseSync('./tests/ini-files/list2.ini');

					expect(returnedValue).to.deep.equal(returnedValueSync);
					expect(returnedValue).to.deep.equal({
						colors: [ 'blue', 'yellow' ],
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
						]
					});
				});
			});

			it('parses standard ini files', async () => {
				const returnedValueSync = parseSync('./tests/ini-files/standard.ini');
				const returnedValue = await parse('./tests/ini-files/standard.ini');

				expect(returnedValue).to.deep.equal(returnedValueSync);
				expect(returnedValue).to.deep.equal({
					rootKey: 'rootValue',
					SectionA: {
						a: 5,
						aa: '55',
						aaa: 555,
						aaaa: ' 5555',
					},
					SectionB: {
						list: ['aaa', 'bbb', 'ccc'],
						key: 'value',
						boolTrue: true,
						boolFalse: false,
						strTrue: 'True',
						strFalse: 'False',
					},
				});
			});
		});
	});
});
