export interface TriangularPendulumResult {
  alphaRad: number;
  alphaDeg: number;
  sinAlpha: number;
  cosAlpha: number;
  tanAlpha: number;
  dCm: number;
  inertia: number;
  ellEff: number;
  omega: number;
  freq: number;
  period: number;
  stringTension: number;
  rodCompression: number;
}

export function computeTriangularPendulum(
  m: number,
  ell: number,
  s: number,
  g = 9.8
): TriangularPendulumResult {
  if (ell <= 0 || m <= 0 || s < 0 || s >= 2 * ell) {
    throw new Error('Parameter geometri tidak fisis: pastikan s < 2l dan m, l > 0.');
  }
  const sinAlpha = s / (2 * ell);
  const cosAlpha = Math.sqrt(1 - sinAlpha * sinAlpha);
  const alphaRad = Math.asin(sinAlpha);
  const alphaDeg = (alphaRad * 180) / Math.PI;
  const tanAlpha = sinAlpha / cosAlpha;
  const dCm = ell * cosAlpha;
  const inertia = 2 * m * ell * ell;
  const ellEff = ell / cosAlpha;
  const omega = Math.sqrt((g * cosAlpha) / ell);
  const freq = omega / (2 * Math.PI);
  const period = (2 * Math.PI) / omega;
  const stringTension = (m * g) / cosAlpha;
  const rodCompression = m * g * tanAlpha;

  return {
    alphaRad,
    alphaDeg,
    sinAlpha,
    cosAlpha,
    tanAlpha,
    dCm,
    inertia,
    ellEff,
    omega,
    freq,
    period,
    stringTension,
    rodCompression,
  };
}

export function solveQuestion4RatioForFreqRatio(freqRatio: number): number {
  // f(s0)/f(0) = (1 - s0^2 / (4 l^2))^(1/4)
  const cosAlpha = freqRatio * freqRatio;
  return 2 * Math.sqrt(1 - cosAlpha * cosAlpha);
}

export function computeOutOfPlaneOmega(ell: number, s: number, g = 9.8): number {
  const sinAlpha = s / (2 * ell);
  const cosAlpha = Math.sqrt(1 - sinAlpha * sinAlpha);
  return Math.sqrt(g / (ell * cosAlpha));
}

export function computeAsymmetricTriangleOmega(
  m1: number,
  m2: number,
  ell: number,
  twoAlphaDeg: number,
  g = 10.0
): {
  rKg: number;
  dCm: number;
  inertia: number;
  omega: number;
  eqTiltDeg: number;
} {
  const twoAlphaRad = (twoAlphaDeg * Math.PI) / 180;
  const alphaRad = twoAlphaRad / 2;
  const rKg = Math.sqrt(m1 * m1 + m2 * m2 + 2 * m1 * m2 * Math.cos(twoAlphaRad));
  const mTot = m1 + m2;
  const dCm = (ell * rKg) / mTot;
  const inertia = mTot * ell * ell;
  const omega = Math.sqrt((g * rKg) / (mTot * ell));
  // Bisector tilt from vertical: tan(phi_eq) = ((m2 - m1)/(m1 + m2)) * tan(alpha)
  const eqTiltRad = Math.atan(((m2 - m1) / mTot) * Math.tan(alphaRad));
  const eqTiltDeg = (eqTiltRad * 180) / Math.PI;
  return { rKg, dCm, inertia, omega, eqTiltDeg };
}

export function computeMassiveRodTriangleOmega(
  m: number,
  mb: number,
  ell: number,
  s: number,
  g = 10.0
): {
  cosAlpha: number;
  h: number;
  inertia: number;
  kappa: number;
  omega: number;
} {
  const sinAlpha = s / (2 * ell);
  const cosAlpha = Math.sqrt(1 - sinAlpha * sinAlpha);
  const h = ell * cosAlpha;
  const inertia = 2 * m * ell * ell + (mb * s * s) / 12 + mb * h * h;
  const kappa = (2 * m + mb) * g * h;
  const omega = Math.sqrt(kappa / inertia);
  return { cosAlpha, h, inertia, kappa, omega };
}

export function computeAcceleratedTrainTriangleOmega(
  ell: number,
  s: number,
  g: number,
  a: number
): {
  gEff: number;
  eqTiltDeg: number;
  omega: number;
} {
  const gEff = Math.sqrt(g * g + a * a);
  const eqTiltDeg = (Math.atan2(a, g) * 180) / Math.PI;
  const cosAlpha = Math.sqrt(1 - Math.pow(s / (2 * ell), 2));
  const omega = Math.sqrt((gEff * cosAlpha) / ell);
  return { gEff, eqTiltDeg, omega };
}

export function computeSpringBreathingModeOmega(
  m: number,
  ell: number,
  cosAlpha0: number,
  k: number,
  g = 10.0
): number {
  return Math.sqrt(g / (ell * cosAlpha0) + (2 * k * cosAlpha0 * cosAlpha0) / m);
}

export function computeMidpointMassRatio(m: number, M: number, cosAlpha: number): number {
  return Math.sqrt((2 * m + M) / (2 * m + M * cosAlpha * cosAlpha));
}

export function computeInelasticMidpointRodLength(
  m: number,
  m0: number,
  ell: number,
  v0: number,
  thetaMax: number,
  g = 10.0
): { cosAlpha: number; s: number } {
  // Equation: C * cos^2(alpha) - cos(alpha) + C = 0 where C = (2m + m0)*g*ell*thetaMax^2 / (m0^2 * v0^2) ... wait:
  // Let's re-verify:
  // K = L^2 / (2I) = (m0^2 v0^2 ell^2 cos^2 a) / (2 ell^2 (2m + m0 cos^2 a))
  // dU = (2m + m0) g ell cos a * (thetaMax^2 / 2)
  // Equating and dividing by cos a:
  // m0^2 v0^2 cos a = (2m + m0) g ell thetaMax^2 * (2m + m0 cos^2 a)
  // Let Q = (2m + m0) * g * ell * thetaMax^2 / (m0^2 * v0^2)
  // Then: m0 * Q * cos^2(a) - cos(a) + 2m * Q = 0
  const Q = ((2 * m + m0) * g * ell * thetaMax * thetaMax) / (m0 * m0 * v0 * v0);
  const A = m0 * Q;
  const B = -1;
  const C = 2 * m * Q;
  const disc = B * B - 4 * A * C;
  if (disc < 0) {
    throw new Error('Tidak ada solusi real untuk cos(alpha).');
  }
  const r1 = (-B - Math.sqrt(disc)) / (2 * A);
  const r2 = (-B + Math.sqrt(disc)) / (2 * A);
  const cosAlpha = r1 > 0 && r1 <= 1 ? r1 : r2;
  const sinAlpha = Math.sqrt(1 - cosAlpha * cosAlpha);
  return { cosAlpha, s: 2 * ell * sinAlpha };
}

export type SimulationMode =
  | 'triangle-inplane'
  | 'compare-outplane'
  | 'asymmetric'
  | 'massive-rod'
  | 'accelerated-train'
  | 'spring-breathing'
  | 'midpoint-mass'
  | 'collision-impact';

export interface SimulationParams {
  mode: SimulationMode;
  m: number;
  m2: number;
  mb: number;
  ell: number;
  s: number;
  g: number;
  aTrain: number;
  kSpring: number;
  theta0Deg: number;
  v0Impact: number;
}

export interface SimulationSnapshot {
  thetaRad: number;
  thetaDot: number;
  thetaDDot: number;
  omegaSystem: number;
  freqHz: number;
  periodSec: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  alphaRad: number;
  eqTiltRad: number;
  cosAlpha: number;
  dCm: number;
  inertia: number;
  stringTension: number;
  rodForce: number;
  preImpactProgress: number;
  hasCollided: boolean;
}

export function stepSimulationState(
  params: SimulationParams,
  timeSec: number
): SimulationSnapshot {
  const { mode, m, m2, mb, ell, s, g, aTrain, kSpring, theta0Deg, v0Impact } = params;
  const safeS = Math.min(Math.max(s, 0), 1.94 * ell);
  const sinAlpha = safeS / (2 * ell);
  const cosAlpha = Math.sqrt(1 - sinAlpha * sinAlpha);
  const alphaRad = Math.asin(sinAlpha);
  const theta0Rad = (theta0Deg * Math.PI) / 180;

  let eqTiltRad = 0;
  let inertia = 2 * m * ell * ell;
  let omegaSystem = Math.sqrt((g * cosAlpha) / ell);
  let dCm = ell * cosAlpha;
  let kappa = 2 * m * g * dCm;
  let thetaRad = 0;
  let thetaDot = 0;
  let preImpactProgress = 1;
  let hasCollided = true;

  if (mode === 'triangle-inplane') {
    thetaRad = theta0Rad * Math.cos(omegaSystem * timeSec);
    thetaDot = -theta0Rad * omegaSystem * Math.sin(omegaSystem * timeSec);
  } else if (mode === 'compare-outplane') {
    omegaSystem = Math.sqrt(g / (ell * cosAlpha));
    inertia = 2 * m * Math.pow(ell * cosAlpha, 2);
    kappa = 2 * m * g * (ell * cosAlpha);
    thetaRad = theta0Rad * Math.cos(omegaSystem * timeSec);
    thetaDot = -theta0Rad * omegaSystem * Math.sin(omegaSystem * timeSec);
  } else if (mode === 'asymmetric') {
    const twoAlphaDeg = ((2 * alphaRad) * 180) / Math.PI;
    const asym = computeAsymmetricTriangleOmega(m, m2, ell, twoAlphaDeg, g);
    omegaSystem = asym.omega;
    inertia = asym.inertia;
    dCm = asym.dCm;
    kappa = (m + m2) * g * dCm;
    eqTiltRad = (asym.eqTiltDeg * Math.PI) / 180;
    thetaRad = theta0Rad * Math.cos(omegaSystem * timeSec);
    thetaDot = -theta0Rad * omegaSystem * Math.sin(omegaSystem * timeSec);
  } else if (mode === 'massive-rod') {
    const mr = computeMassiveRodTriangleOmega(m, mb, ell, safeS, g);
    omegaSystem = mr.omega;
    inertia = mr.inertia;
    kappa = mr.kappa;
    thetaRad = theta0Rad * Math.cos(omegaSystem * timeSec);
    thetaDot = -theta0Rad * omegaSystem * Math.sin(omegaSystem * timeSec);
  } else if (mode === 'accelerated-train') {
    const tr = computeAcceleratedTrainTriangleOmega(ell, safeS, g, aTrain);
    omegaSystem = tr.omega;
    eqTiltRad = -(tr.eqTiltDeg * Math.PI) / 180;
    kappa = 2 * m * tr.gEff * dCm;
    thetaRad = theta0Rad * Math.cos(omegaSystem * timeSec);
    thetaDot = -theta0Rad * omegaSystem * Math.sin(omegaSystem * timeSec);
  } else if (mode === 'spring-breathing') {
    omegaSystem = computeSpringBreathingModeOmega(m, ell, cosAlpha, kSpring, g);
    // In breathing mode, thetaRad represents deltaAlpha oscillation
    const deltaAlphaAmp = Math.min(theta0Rad, 0.25);
    thetaRad = deltaAlphaAmp * Math.cos(omegaSystem * timeSec);
    thetaDot = -deltaAlphaAmp * omegaSystem * Math.sin(omegaSystem * timeSec);
    kappa = inertia * omegaSystem * omegaSystem;
  } else if (mode === 'midpoint-mass') {
    const h = ell * cosAlpha;
    inertia = 2 * m * ell * ell + mb * h * h;
    kappa = (2 * m + mb) * g * h;
    omegaSystem = Math.sqrt(kappa / inertia);
    thetaRad = theta0Rad * Math.cos(omegaSystem * timeSec);
    thetaDot = -theta0Rad * omegaSystem * Math.sin(omegaSystem * timeSec);
  } else if (mode === 'collision-impact') {
    const impactTime = 1.0;
    const h = ell * cosAlpha;
    const iAfter = 2 * m * ell * ell + mb * h * h;
    const kappaAfter = (2 * m + mb) * g * h;
    omegaSystem = Math.sqrt(kappaAfter / iAfter);
    inertia = iAfter;
    kappa = kappaAfter;
    if (timeSec < impactTime) {
      preImpactProgress = timeSec / impactTime;
      hasCollided = false;
      thetaRad = 0;
      thetaDot = 0;
    } else {
      preImpactProgress = 1;
      hasCollided = true;
      const dt = timeSec - impactTime;
      const omega0 = (mb * v0Impact * h) / iAfter;
      const amp = omega0 / omegaSystem;
      thetaRad = amp * Math.sin(omegaSystem * dt);
      thetaDot = omega0 * Math.cos(omegaSystem * dt);
    }
  }

  const thetaDDot = -omegaSystem * omegaSystem * thetaRad;
  const kineticEnergy =
    mode === 'collision-impact' && !hasCollided
      ? 0.5 * mb * v0Impact * v0Impact
      : 0.5 * inertia * thetaDot * thetaDot;
  const potentialEnergy = 0.5 * kappa * thetaRad * thetaRad;
  const totalEnergy = kineticEnergy + potentialEnergy;
  const freqHz = omegaSystem / (2 * Math.PI);
  const periodSec = (2 * Math.PI) / omegaSystem;
  const stringTension = (m * g) / cosAlpha;
  const rodForce = m * g * (sinAlpha / cosAlpha);

  return {
    thetaRad,
    thetaDot,
    thetaDDot,
    omegaSystem,
    freqHz,
    periodSec,
    kineticEnergy,
    potentialEnergy,
    totalEnergy,
    alphaRad,
    eqTiltRad,
    cosAlpha,
    dCm,
    inertia,
    stringTension,
    rodForce,
    preImpactProgress,
    hasCollided,
  };
}
