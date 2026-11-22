import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeForSpeech } from './speechText';

test('sanitizeForSpeech converts LaTeX math and comma decimals into clean Indonesian speech', () => {
  const input = 'Rasio $\\frac{f(s_0)}{f(0)} = \\frac{1}{\\sqrt{2}}$ menghasilkan $s_0/\\ell = \\sqrt{3} \\approx 1,7$.';
  const spoken = sanitizeForSpeech(input);
  assert.ok(!spoken.includes('\\'));
  assert.ok(!spoken.includes('$'));
  assert.ok(spoken.includes('dibagi'));
  assert.ok(spoken.includes('akar'));
  assert.ok(spoken.includes('1 koma 7'));
});
