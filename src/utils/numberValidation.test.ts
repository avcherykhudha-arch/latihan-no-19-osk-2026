import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasExactOneDecimalComma,
  parseIndonesianDecimal,
  formatIndonesianOneDecimal,
  evaluateNumericAnswer,
} from './numberValidation';

test('hasExactOneDecimalComma enforces comma with exactly one decimal digit', () => {
  assert.equal(hasExactOneDecimalComma('12,5'), true);
  assert.equal(hasExactOneDecimalComma('0,8'), true);
  assert.equal(hasExactOneDecimalComma('125,0'), true);
  assert.equal(hasExactOneDecimalComma('-3,7'), true);
  assert.equal(hasExactOneDecimalComma('-13,4'), true);

  assert.equal(hasExactOneDecimalComma('12.5'), false);
  assert.equal(hasExactOneDecimalComma('12'), false);
  assert.equal(hasExactOneDecimalComma('12,50'), false);
  assert.equal(hasExactOneDecimalComma('12,'), false);
  assert.equal(hasExactOneDecimalComma(',5'), false);
});

test('parseIndonesianDecimal parses comma decimals and rejects dots', () => {
  assert.equal(parseIndonesianDecimal('1,7'), 1.7);
  assert.equal(parseIndonesianDecimal('-13,4'), -13.4);
  assert.equal(parseIndonesianDecimal('2,0'), 2.0);
  assert.equal(parseIndonesianDecimal('1.7'), null);
  assert.equal(parseIndonesianDecimal('abc'), null);
});

test('formatIndonesianOneDecimal formats integers and negative numbers cleanly', () => {
  assert.equal(formatIndonesianOneDecimal(2), '2,0');
  assert.equal(formatIndonesianOneDecimal(Math.sqrt(3)), '1,7');
  assert.equal(formatIndonesianOneDecimal(-13.397), '-13,4');
  assert.equal(formatIndonesianOneDecimal(-0.01), '0,0');
});

test('evaluateNumericAnswer validates format and numerical tolerance properly', () => {
  const ok = evaluateNumericAnswer('1,7', 1.7, 0.05);
  assert.equal(ok.isValidFormat, true);
  assert.equal(ok.isCorrect, true);
  assert.equal(ok.feedbackType, 'correct');

  const dotErr = evaluateNumericAnswer('1.7', 1.7, 0.05);
  assert.equal(dotErr.isValidFormat, false);
  assert.equal(dotErr.isCorrect, false);
  assert.equal(dotErr.feedbackType, 'dot_instead_of_comma');

  const noDecimal = evaluateNumericAnswer('2', 2.0, 0.05);
  assert.equal(noDecimal.isValidFormat, false);
  assert.equal(noDecimal.feedbackType, 'missing_one_decimal');

  const negOk = evaluateNumericAnswer('-13,4', -13.4, 0.2);
  assert.equal(negOk.isCorrect, true);
});
