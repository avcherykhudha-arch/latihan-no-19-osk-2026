import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeTriangularPendulum,
  solveQuestion4RatioForFreqRatio,
  computeOutOfPlaneOmega,
  computeAsymmetricTriangleOmega,
  computeMassiveRodTriangleOmega,
  computeAcceleratedTrainTriangleOmega,
  computeSpringBreathingModeOmega,
  computeMidpointMassRatio,
  computeInelasticMidpointRodLength,
  stepSimulationState,
} from './physicsModel';
import { formatIndonesianOneDecimal } from './numberValidation';
import { QUESTIONS } from '../data/questions';

test('Independent mathematical verification of all 15 OSK Physics Challenge questions', () => {
  // Q1: l = 2.5, s = 3.0 -> dCm = 2.0 m
  const q1 = computeTriangularPendulum(1.2, 2.5, 3.0, 10.0);
  assert.equal(formatIndonesianOneDecimal(q1.dCm), QUESTIONS[0].expectedAnswer);

  // Q2: l = 2.0, s = 2.4 -> ellEff = 2.5 m
  const q2 = computeTriangularPendulum(0.5, 2.0, 2.4, 10.0);
  assert.equal(formatIndonesianOneDecimal(q2.ellEff), QUESTIONS[1].expectedAnswer);

  // Q3: l = 0.50, s = 0.60, g = 10.0 -> omega = 4.0 rad/s
  const q3 = computeTriangularPendulum(1.0, 0.5, 0.6, 10.0);
  assert.equal(formatIndonesianOneDecimal(q3.omega), QUESTIONS[2].expectedAnswer);

  // Q4 (OSK 2026 #19): f(s0)/f(0) = 1/sqrt(2) -> s0/l = sqrt(3) -> 1,7
  const q4 = solveQuestion4RatioForFreqRatio(1 / Math.sqrt(2));
  assert.ok(Math.abs(q4 - Math.sqrt(3)) < 1e-12);
  assert.equal(formatIndonesianOneDecimal(q4), QUESTIONS[3].expectedAnswer);

  // Q5: l = 1.25, alpha = 60 deg (s = sqrt(3)*l), theta0 = 0.12, g = 10.0 -> v_max = 0.3 m/s
  const q5 = computeTriangularPendulum(1.5, 1.25, Math.sqrt(3) * 1.25, 10.0);
  const vMax5 = 1.25 * 0.12 * q5.omega;
  assert.equal(formatIndonesianOneDecimal(vMax5), QUESTIONS[4].expectedAnswer);

  // Q6: m = 2.0, l = 2.5, s = 3.0, g = 10.0 -> F_rod = 15.0 N
  const q6 = computeTriangularPendulum(2.0, 2.5, 3.0, 10.0);
  assert.equal(formatIndonesianOneDecimal(q6.rodCompression), QUESTIONS[5].expectedAnswer);

  // Q7: T^2 = 3.20 * sec(alpha), l = 0.80, s = 0.96 -> T = 2.0 s
  const q7 = computeTriangularPendulum(1.0, 0.8, 0.96, 9.87);
  const secAlpha7 = 1 / q7.cosAlpha;
  const period7 = Math.sqrt(3.2 * secAlpha7);
  assert.equal(formatIndonesianOneDecimal(period7), QUESTIONS[6].expectedAnswer);

  // Q8: s = 1.6 * l -> f_parallel / f_perp = cos(alpha) = 0.6
  const q8in = computeTriangularPendulum(1.0, 1.0, 1.6, 10.0).omega;
  const q8out = computeOutOfPlaneOmega(1.0, 1.6, 10.0);
  assert.equal(formatIndonesianOneDecimal(q8in / q8out), QUESTIONS[7].expectedAnswer);

  // Q9: l = 1.00, s1 = 1.20, s2 = 1.60 -> % delta f = -13,4 %
  const f1 = computeTriangularPendulum(1.0, 1.0, 1.2, 9.8).freq;
  const f2 = computeTriangularPendulum(1.0, 1.0, 1.6, 9.8).freq;
  const pct9 = ((f2 - f1) / f1) * 100;
  assert.equal(formatIndonesianOneDecimal(pct9), QUESTIONS[8].expectedAnswer);

  // Q10: m1 = 3.0, m2 = 5.0, l = 1.40, 2alpha = 60 deg, g = 10.0 -> omega = 2.5 rad/s
  const q10 = computeAsymmetricTriangleOmega(3.0, 5.0, 1.4, 60, 10.0);
  assert.equal(formatIndonesianOneDecimal(q10.omega), QUESTIONS[9].expectedAnswer);

  // Q11: m = 1.0, mb = 2.0, l = 1.25, s = 1.50, g = 10.0 -> omega = 2.7 rad/s
  const q11 = computeMassiveRodTriangleOmega(1.0, 2.0, 1.25, 1.5, 10.0);
  assert.equal(formatIndonesianOneDecimal(q11.omega), QUESTIONS[10].expectedAnswer);

  // Q12: l = 1.00, s = 1.20, g = 10.0, a = 7.5 -> omega = 3.2 rad/s
  const q12 = computeAcceleratedTrainTriangleOmega(1.0, 1.2, 10.0, 7.5);
  assert.equal(formatIndonesianOneDecimal(q12.omega), QUESTIONS[11].expectedAnswer);

  // Q13: m = 1.0, l = 1.0, cosAlpha0 = 0.5, k = 32.0, g = 10.0 -> omega_napas = 6.0 rad/s
  const q13 = computeSpringBreathingModeOmega(1.0, 1.0, 0.5, 32.0, 10.0);
  assert.equal(formatIndonesianOneDecimal(q13), QUESTIONS[12].expectedAnswer);

  // Q14: m = 4.0, M = 5.5, cosAlpha = 0.50 -> f_baru/f_lama = 1.2
  const q14 = computeMidpointMassRatio(4.0, 5.5, 0.5);
  assert.equal(formatIndonesianOneDecimal(q14), QUESTIONS[13].expectedAnswer);

  // Q15: m = 1.0, m0 = 2.0, l = 2.0, v0 = 2.0, thetaMax = 0.20, g = 10.0 -> s = 3.5 m
  const q15 = computeInelasticMidpointRodLength(1.0, 2.0, 2.0, 2.0, 0.2, 10.0);
  assert.ok(Math.abs(q15.cosAlpha - 0.5) < 1e-12);
  assert.equal(formatIndonesianOneDecimal(q15.s), QUESTIONS[14].expectedAnswer);
});

test('All 15 questions strictly follow 1-decimal comma formatting and unique IDs', () => {
  assert.equal(QUESTIONS.length, 15);
  QUESTIONS.forEach((q, idx) => {
    assert.equal(q.id, idx + 1);
    assert.match(q.expectedAnswer, /^-?\d+,\d$/);
    assert.equal(q.solutionStages.length, 7);
  });
});

test('Simulation physics conserves total mechanical energy during harmonic oscillation', () => {
  const params = {
    mode: 'triangle-inplane' as const,
    m: 1.5,
    m2: 1.5,
    mb: 0,
    ell: 1.5,
    s: 1.8,
    g: 9.8,
    aTrain: 0,
    kSpring: 20,
    theta0Deg: 10,
    v0Impact: 0,
  };
  const s0 = stepSimulationState(params, 0);
  const s1 = stepSimulationState(params, 0.37);
  const s2 = stepSimulationState(params, 1.13);
  assert.ok(Math.abs(s0.totalEnergy - s1.totalEnergy) < 1e-9);
  assert.ok(Math.abs(s0.totalEnergy - s2.totalEnergy) < 1e-9);
});
