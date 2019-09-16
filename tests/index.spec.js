/* eslint-disable */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

const parseIniFile = require('../');
const parseIniFileSync = parseIniFile.sync;

describe('parseIniFile()\n  ──────────────', () => {

	describe('[async]', () => {
		describe('* Arguments', () => {
			it('rejects if first param is not a string', () => {
				const fn = () => parseIniFile(4);

				return expect(fn()).to.be.rejectedWith('First argument "path" must be a string');
			});

			it('rejects if first param is path to non-exist file', () => {
				const fn = () => parseIniFile('./nope.ini');

				return expect(fn()).to.be.rejectedWith('ENOENT: no such file or directory');
			});
		});

		describe('* Return {}', () => {
			it('always resolves with an object', async () => {
				const nonEmptyFile = await parseIniFile('./tests/ini-files/standard.ini');
				expect(nonEmptyFile).to.be.an('object');

				const emptyFile = await parseIniFile('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});
			it('even for empty files', async () => {
				const emptyFile = await parseIniFile('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});
		});

		describe('* Features', () => {
			describe('{key:value}', () => {
				it('key=value', async () => {
					const returnedValue = await parseIniFile('./tests/ini-files/key-value-pairs.ini');

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
					const returnedValue = await parseIniFile('./tests/ini-files/comments.ini');

					expect(returnedValue).to.not.haveOwnProperty('comment');
					expect(returnedValue).to.not.haveOwnProperty('flags');
				});
			});

			describe('ignore inline ;comments', () => {
				it('ignored', async () => {
					const returnedValue = await parseIniFile('./tests/ini-files/comments.ini');

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
					const returnedValue = await parseIniFile('./tests/ini-files/section.ini');

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

			describe('{ flags: [...] }', () => {
				it('handle non-key-value pairs (when no equal sign)', async () => {
					const returnedValue = await parseIniFile('./tests/ini-files/flags.ini');

					expect(returnedValue).to.deep.equal({
						flags: [
							'AAA',
							'BBB',
						],
						section: {
							key: 'value',
							flags: ['SECTION_FLAG'],
						},
					});
				});
			});


			it('parses standard ini files', async () => {
				const returnedValue = await parseIniFile('./tests/ini-files/standard.ini');

				expect(returnedValue).to.deep.equal({
					rootKey: 'rootValue',
					flags: [
						'useFeatureA',
						'useFeatureB',
					],
					SectionA: {
						a: 5,
						aa: '55',
						aaa: 555,
						aaaa: ' 5555',
					},
					SectionB: {
						flags: ['useFeatureB', true],
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


	describe('[sync]', () => {
		describe('* Arguments', () => {
			it('throws if first param is not a string', () => {
				const shouldThrow = () => parseIniFileSync(4);
				expect(shouldThrow).to.throw('First argument "path" must be a string');
			});

			it('throws if first param is path to non-exist file', () => {
				const shouldThrow = () => parseIniFileSync('./nope.ini');
				expect(shouldThrow).to.throw('ENOENT: no such file or directory');
			});
		});

		describe('* Return {}', () => {
			it('always returns an object', () => {
				const nonEmptyFile = parseIniFileSync('./tests/ini-files/standard.ini');
				expect(nonEmptyFile).to.be.an('object');

				const emptyFile = parseIniFileSync('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});
			it('even for empty files', () => {
				const emptyFile = parseIniFileSync('./tests/ini-files/empty.ini');
				expect(emptyFile).to.be.an('object');
			});
		});

		describe('* Features', () => {
			describe('{key:value}', () => {
				it('key=value', () => {
					const returnedValue = parseIniFileSync('./tests/ini-files/key-value-pairs.ini');
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
					const returnedValue = parseIniFileSync('./tests/ini-files/comments.ini');

					expect(returnedValue).to.not.haveOwnProperty('comment');
					expect(returnedValue).to.not.haveOwnProperty('flags');
				});
			});

			describe('ignore inline ;comments', () => {
				it('ignored', () => {
					const returnedValue = parseIniFileSync('./tests/ini-files/comments.ini');

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
					const returnedValue = parseIniFileSync('./tests/ini-files/section.ini');

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

			describe('{ flags: [...] }', () => {
				it('handle non-key-value pairs (when no equal sign)', () => {
					const returnedValue = parseIniFileSync('./tests/ini-files/flags.ini');

					expect(returnedValue).to.deep.equal({
						flags: [
							'AAA',
							'BBB',
						],
						section: {
							key: 'value',
							flags: ['SECTION_FLAG'],
						},
					});
				});
			});


			it('parses standard ini files', () => {
				const returnedValue = parseIniFileSync('./tests/ini-files/standard.ini');

				expect(returnedValue).to.deep.equal({
					rootKey: 'rootValue',
					flags: [
						'useFeatureA',
						'useFeatureB',
					],
					SectionA: {
						a: 5,
						aa: '55',
						aaa: 555,
						aaaa: ' 5555',
					},
					SectionB: {
						flags: ['useFeatureB', true],
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
