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
			it('rejects if first param is not a string', () => {
				const fn = () => parse(4);

				return expect(fn()).to.be.rejectedWith('First argument "path" must be a string');
			});

			it('rejects if first param is path to non-exist file', () => {
				const fn = () => parse('./nope.ini');

				return expect(fn()).to.be.rejectedWith('ENOENT: no such file or directory');
			});
		});

		describe('* Return {}', () => {
			it('always resolves with an object', async () => {
				const nonEmptyFile = await parse('./tests/ini-files/standard.ini');
				expect(nonEmptyFile).to.be.an('object');

				const emptyFile = await parse('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});
			it('even for empty files', async () => {
				const emptyFile = await parse('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});
		});

		describe('* Features', () => {
			describe('{key:value}', () => {
				it('key=value', async () => {
					const returnedValue = await parse('./tests/ini-files/key-value-pairs.ini');

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
					const returnedValue = await parse('./tests/ini-files/comments.ini');

					expect(returnedValue).to.haveOwnProperty('a');
					expect(returnedValue).to.not.haveOwnProperty('comment');
				});
			});

			describe('ignore inline ;comments', () => {
				it('ignored', async () => {
					const returnedValue = await parse('./tests/ini-files/comments.ini');

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
					const returnedValue = await parse('./tests/ini-files/section.ini');

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

			it('parses standard ini files', async () => {
				const returnedValue = await parse('./tests/ini-files/standard.ini');

				expect(returnedValue).to.deep.equal({
					rootKey: 'rootValue',
					SectionA: {
						a: 5,
						aa: '55',
						aaa: 555,
						aaaa: ' 5555',
					},
					SectionB: {
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


	describe('parse.sync()', () => {
		describe('* Arguments', () => {
			it('throws if first param is not a string', () => {
				const shouldThrow = () => parseSync(4);
				expect(shouldThrow).to.throw('First argument "path" must be a string');
			});

			it('throws if first param is path to non-exist file', () => {
				const shouldThrow = () => parseSync('./nope.ini');
				expect(shouldThrow).to.throw('ENOENT: no such file or directory');
			});
		});

		describe('* Return {}', () => {
			it('always returns an object', () => {
				const nonEmptyFile = parseSync('./tests/ini-files/standard.ini');
				expect(nonEmptyFile).to.be.an('object');

				const emptyFile = parseSync('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});
			it('even for empty files', () => {
				const emptyFile = parseSync('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});
		});

		describe('* Features', () => {
			describe('{key:value}', () => {
				it('key=value', () => {
					const returnedValue = parseSync('./tests/ini-files/key-value-pairs.ini');
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
				it('ignored', () => {
					const returnedValue = parseSync('./tests/ini-files/comments.ini');

					expect(returnedValue).to.haveOwnProperty('a');
					expect(returnedValue).to.not.haveOwnProperty('comment');
				});
			});

			describe('ignore inline ;comments', () => {
				it('ignored', () => {
					const returnedValue = parseSync('./tests/ini-files/comments.ini');

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
				it('[section]', () => {
					const returnedValue = parseSync('./tests/ini-files/section.ini');

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

			it('parses standard ini files', () => {
				const returnedValue = parseSync('./tests/ini-files/standard.ini');

				expect(returnedValue).to.deep.equal({
					rootKey: 'rootValue',
					SectionA: {
						a: 5,
						aa: '55',
						aaa: 555,
						aaaa: ' 5555',
					},
					SectionB: {
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

