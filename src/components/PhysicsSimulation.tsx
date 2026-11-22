import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Eye } from 'lucide-react';
import {
  SimulationMode,
  SimulationParams,
  stepSimulationState,
} from '../utils/physicsModel';
import { formatIndonesianOneDecimal } from '../utils/numberValidation';
import { DisplayFormula } from './MathText';

interface PhysicsSimulationProps {
  initialParams: SimulationParams;
  allowModeSwitch?: boolean;
  title?: string;
  compact?: boolean;
}

const MODE_LABELS: Record<SimulationMode, string> = {
  'triangle-inplane': 'Bandul Segitiga (Soal 19)',
  'compare-outplane': 'Mode Tegak Lurus Bidang',
  asymmetric: 'Massa Asimetris (m₁ ≠ m₂)',
  'massive-rod': 'Batang Penghubung Bermassa',
  'accelerated-train': 'Kereta Dipercepat Horizontal',
  'spring-breathing': 'Pegas Mode Napas',
  'midpoint-mass': 'Massa Titik Tengah Tongkat',
  'collision-impact': 'Tumbukan Tak Lenting Plastisin',
};

export const PhysicsSimulation: React.FC<PhysicsSimulationProps> = ({
  initialParams,
  allowModeSwitch = false,
  title = 'Simulasi Pembuktian Fenomena Fisika',
  compact = false,
}) => {
  const [params, setParams] = useState<SimulationParams>(initialParams);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedScale, setSpeedScale] = useState<number>(1.0);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [simTime, setSimTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paramsRef = useRef<SimulationParams>(params);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const speedRef = useRef<number>(speedScale);
  const showVectorsRef = useRef<boolean>(showVectors);
  const timeRef = useRef<number>(0);
  const lastFrameRef = useRef<number | null>(null);
  const uiUpdateAccumRef = useRef<number>(0);

  useEffect(() => {
    setParams(initialParams);
    timeRef.current = 0;
    setSimTime(0);
  }, [initialParams]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speedScale;
  }, [speedScale]);

  useEffect(() => {
    showVectorsRef.current = showVectors;
  }, [showVectors]);

  useEffect(() => {
    let rafId = 0;

    const drawArrow = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
      label?: string
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len < 4) return;
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 8 * Math.cos(angle - 0.42), y2 - 8 * Math.sin(angle - 0.42));
      ctx.lineTo(x2 - 8 * Math.cos(angle + 0.42), y2 - 8 * Math.sin(angle + 0.42));
      ctx.closePath();
      ctx.fill();

      if (label) {
        ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(label, x2 + 6, y2 + 4);
      }
      ctx.restore();
    };

    const renderFrame = (timestamp: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
      }
      const rawDt = Math.min(0.05, (timestamp - lastFrameRef.current) / 1000);
      lastFrameRef.current = timestamp;

      if (isPlayingRef.current) {
        timeRef.current += rawDt * speedRef.current;
        uiUpdateAccumRef.current += rawDt;
        if (uiUpdateAccumRef.current >= 0.08) {
          uiUpdateAccumRef.current = 0;
          setSimTime(timeRef.current);
        }
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          const rect = canvas.getBoundingClientRect();
          const targetW = Math.max(320, Math.round(rect.width * dpr));
          const targetH = Math.max(240, Math.round(rect.height * dpr));
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }
          ctx.save();
          ctx.scale(dpr, dpr);

          const w = rect.width;
          const h = rect.height;
          const p = paramsRef.current;
          const state = stepSimulationState(p, timeRef.current);

          // Clear white canvas
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);

          // Subtle scientific reference grid
          ctx.strokeStyle = '#F1F5F9';
          ctx.lineWidth = 1;
          for (let gx = 40; gx < w; gx += 40) {
            ctx.beginPath();
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx, h);
            ctx.stroke();
          }
          for (let gy = 40; gy < h; gy += 40) {
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.lineTo(w, gy);
            ctx.stroke();
          }

          const ox = w * 0.5;
          const oy = 46;
          const pxPerMeter = Math.min((h - 95) / Math.max(p.ell, 1.0), 140);
          const Lpx = p.ell * pxPerMeter;

          // If accelerated train mode, draw train frame
          if (p.mode === 'accelerated-train') {
            ctx.save();
            ctx.strokeStyle = '#14532D';
            ctx.fillStyle = '#F8FAFC';
            ctx.lineWidth = 2;
            const frameW = Math.min(w - 60, 340);
            ctx.fillRect(ox - frameW / 2, oy - 8, frameW, h - oy - 26);
            ctx.strokeRect(ox - frameW / 2, oy - 8, frameW, h - oy - 26);
            drawArrow(ctx, ox + frameW / 2 - 80, oy + 20, ox + frameW / 2 - 18, oy + 20, '#EA580C', `a = ${p.aTrain} m/s²`);
            ctx.restore();
          } else {
            // Ceiling bracket
            ctx.strokeStyle = '#14532D';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(ox - 110, oy);
            ctx.lineTo(ox + 110, oy);
            ctx.stroke();
          }

          // Vertical equilibrium dashed line
          ctx.save();
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ox, h - 22);
          ctx.stroke();
          ctx.restore();

          // Compute positions of mass 1 & mass 2
          let x1 = 0;
          let y1 = 0;
          let x2 = 0;
          let y2 = 0;

          if (p.mode === 'compare-outplane') {
            // Perspective view of out-of-plane swing
            const halfS = (Lpx * Math.sin(state.alphaRad));
            const depthY = Lpx * Math.cos(state.alphaRad);
            const projCos = Math.cos(state.thetaRad);
            const foreshorten = 1 + 0.16 * Math.sin(state.thetaRad);
            x1 = ox - halfS * foreshorten;
            x2 = ox + halfS * foreshorten;
            y1 = oy + depthY * projCos;
            y2 = y1;
          } else if (p.mode === 'spring-breathing') {
            const aLeft = -(state.alphaRad + state.thetaRad);
            const aRight = +(state.alphaRad + state.thetaRad);
            x1 = ox + Lpx * Math.sin(aLeft);
            y1 = oy + Lpx * Math.cos(aLeft);
            x2 = ox + Lpx * Math.sin(aRight);
            y2 = oy + Lpx * Math.cos(aRight);
          } else {
            const centerAngle = state.eqTiltRad + state.thetaRad;
            const aLeft = centerAngle - state.alphaRad;
            const aRight = centerAngle + state.alphaRad;
            x1 = ox + Lpx * Math.sin(aLeft);
            y1 = oy + Lpx * Math.cos(aLeft);
            x2 = ox + Lpx * Math.sin(aRight);
            y2 = oy + Lpx * Math.cos(aRight);
          }

          const xMid = (x1 + x2) / 2;
          const yMid = (y1 + y2) / 2;

          // Draw arc trace of effective path
          ctx.save();
          ctx.strokeStyle = 'rgba(20, 83, 45, 0.16)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.arc(ox, oy, Lpx, Math.PI * 0.12, Math.PI * 0.88);
          ctx.stroke();
          ctx.restore();

          // Draw strings
          ctx.strokeStyle = '#14532D';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(x1, y1);
          ctx.moveTo(ox, oy);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Draw rod or spring
          if (p.mode === 'spring-breathing') {
            const coils = 10;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.hypot(dx, dy);
            const ux = dx / (len || 1);
            const uy = dy / (len || 1);
            const nx = -uy;
            const ny = ux;
            ctx.strokeStyle = '#EA580C';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            for (let i = 1; i < coils; i++) {
              const t = i / coils;
              const amp = i % 2 === 0 ? 7 : -7;
              ctx.lineTo(x1 + dx * t + nx * amp, y1 + dy * t + ny * amp);
            }
            ctx.lineTo(x2, y2);
            ctx.stroke();
          } else {
            ctx.strokeStyle = '#EA580C';
            ctx.lineWidth = p.mode === 'massive-rod' ? 6 : 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }

          // Center of mass marker (for asymmetric, weight-averaged)
          const m1Val = p.m;
          const m2Val = p.mode === 'asymmetric' ? p.m2 : p.m;
          const xCm = (m1Val * x1 + m2Val * x2) / (m1Val + m2Val);
          const yCm = (m1Val * y1 + m2Val * y2) / (m1Val + m2Val);

          // Draw incoming projectile before impact
          if (p.mode === 'collision-impact') {
            if (!state.hasCollided) {
              const startX = 32;
              const px = startX + (xMid - startX) * state.preImpactProgress;
              const py = yMid;
              ctx.fillStyle = '#EA580C';
              ctx.beginPath();
              ctx.arc(px, py, 8.5, 0, Math.PI * 2);
              ctx.fill();
              drawArrow(ctx, px + 10, py, px + 44, py, '#EA580C', `v₀=${p.v0Impact}`);
            } else {
              ctx.fillStyle = '#EA580C';
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(xMid, yMid, 9.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }

          // Midpoint mass M
          if (p.mode === 'midpoint-mass') {
            ctx.fillStyle = '#EA580C';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(xMid, yMid, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          // Draw masses m1 & m2
          const r1 = 9 + Math.min(4, p.m);
          const r2 = 9 + Math.min(5, m2Val);
          ctx.fillStyle = '#14532D';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x1, y1, r1, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x2, y2, r2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // CM dot
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#EA580C';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(xCm, yCm, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Pivot dot
          ctx.fillStyle = '#EA580C';
          ctx.strokeStyle = '#14532D';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ox, oy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Optional FBD force vectors & velocity vector
          if (showVectorsRef.current) {
            // Gravity vector at CM
            drawArrow(ctx, xCm, yCm, xCm, yCm + 42, '#14532D', 'W');
            // Tension on right mass along string
            const ux2 = (ox - x2) / (Lpx || 1);
            const uy2 = (oy - y2) / (Lpx || 1);
            drawArrow(ctx, x2, y2, x2 + ux2 * 44, y2 + uy2 * 44, '#166534', 'T');
            // Tangential velocity indicator at CM
            const vScale = Math.max(-46, Math.min(46, state.thetaDot * 32));
            if (Math.abs(vScale) > 3 && p.mode !== 'spring-breathing') {
              const tangX = Math.cos(state.eqTiltRad + state.thetaRad);
              const tangY = -Math.sin(state.eqTiltRad + state.thetaRad);
              drawArrow(ctx, xCm, yCm, xCm + tangX * vScale, yCm + tangY * vScale, '#EA580C', 'v');
            }
          }

          // Clean corner telemetry label on canvas
          ctx.fillStyle = '#0F2419';
          ctx.font = '600 11.5px "IBM Plex Mono", monospace';
          const degTheta = ((state.thetaRad * 180) / Math.PI).toFixed(1).replace('.', ',');
          ctx.fillText(`t = ${timeRef.current.toFixed(2).replace('.', ',')} s   θ = ${degTheta}°`, 14, 22);

          ctx.restore();
        }
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    rafId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const currentSnapshot = stepSimulationState(params, simTime);
  const ratioFreq = Math.sqrt(currentSnapshot.cosAlpha);

  const handleReset = () => {
    timeRef.current = 0;
    setSimTime(0);
  };

  const maxS = Math.max(0.1, Number((1.9 * params.ell).toFixed(2)));

  return (
    <section
      aria-label={title}
      className="rounded-xl border border-green-900/25 bg-white overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-green-900/15 bg-green-950/[0.03] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-green-950">{title}</h4>
          <p className="text-xs text-slate-600">
            {MODE_LABELS[params.mode]} · Simulasi Hukum Gerak Real-Time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-900/25 text-green-950 text-xs font-medium hover:bg-green-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-1 border border-green-900/20 rounded-lg p-0.5 bg-white">
            {[0.25, 0.5, 1.0].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeedScale(spd)}
                className={`px-2 py-1 text-[11px] font-mono-tabular rounded transition-colors cursor-pointer ${
                  speedScale === spd
                    ? 'bg-green-900 text-white font-semibold'
                    : 'text-green-950 hover:bg-green-50'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowVectors((v) => !v)}
            aria-pressed={showVectors}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showVectors
                ? 'border-green-900 bg-green-900 text-white'
                : 'border-green-900/25 text-green-950 hover:bg-green-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Vektor</span>
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? 'lg:grid-cols-12' : 'lg:grid-cols-12'} divide-y lg:divide-y-0 lg:divide-x divide-green-900/15`}>
        {/* Interactive Canvas Stage */}
        <div className="lg:col-span-7 p-4 bg-white">
          <div className={`w-full ${compact ? 'h-[270px]' : 'h-[340px]'} rounded-lg border border-green-900/15 overflow-hidden`}>
            <canvas
              ref={canvasRef}
              data-testid="physics-simulation-canvas"
              className="w-full h-full block"
            />
          </div>

          {/* Live Dynamic Equation Box */}
          <div className="mt-3 rounded-lg border border-green-900/15 bg-green-950/[0.02] p-3">
            <div className="text-xs font-semibold text-green-950 mb-1">
              Persamaan Dinamis Terhitung Langsung
            </div>
            <DisplayFormula
              latex={`\\omega = \\sqrt{\\frac{\\kappa}{I}} = ${formatIndonesianOneDecimal(currentSnapshot.omegaSystem)}\\text{ rad/s}, \\quad \\frac{f(s)}{f(0)} = ${ratioFreq.toFixed(2).replace('.', ',')}, \\quad T = ${formatIndonesianOneDecimal(currentSnapshot.periodSec)}\\text{ s}`}
            />
          </div>
        </div>

        {/* Parameter Controls & Quantitative Readout */}
        <div className="lg:col-span-5 p-4 space-y-4 bg-white">
          {allowModeSwitch && (
            <div>
              <label htmlFor="sim-mode-select" className="block text-xs font-semibold text-green-950 mb-1.5">
                Mode Fenomena Fisika
              </label>
              <select
                id="sim-mode-select"
                value={params.mode}
                onChange={(e) => {
                  const nextMode = e.target.value as SimulationMode;
                  setParams((prev) => ({
                    ...prev,
                    mode: nextMode,
                    mb: nextMode === 'massive-rod' || nextMode === 'midpoint-mass' || nextMode === 'collision-impact' ? Math.max(prev.mb, 2.0) : 0,
                    aTrain: nextMode === 'accelerated-train' ? Math.max(prev.aTrain, 7.5) : 0,
                    v0Impact: nextMode === 'collision-impact' ? Math.max(prev.v0Impact, 2.0) : 0,
                  }));
                  timeRef.current = 0;
                }}
                className="w-full rounded-lg border border-green-900/30 bg-white px-3 py-2 text-xs font-medium text-green-950 focus:outline-2 focus:outline-orange-600"
              >
                {Object.entries(MODE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Parameter Sliders */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="slider-s" className="font-medium text-slate-700">
                  Panjang Tongkat (s)
                </label>
                <span className="font-mono-tabular font-semibold text-orange-700">
                  {params.s.toFixed(2).replace('.', ',')} m
                </span>
              </div>
              <input
                id="slider-s"
                type="range"
                min={0}
                max={maxS}
                step={0.05}
                value={Math.min(params.s, maxS)}
                onChange={(e) => setParams((prev) => ({ ...prev, s: Number(e.target.value) }))}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="slider-ell" className="font-medium text-slate-700">
                  Panjang Tali (l)
                </label>
                <span className="font-mono-tabular font-semibold text-green-950">
                  {params.ell.toFixed(2).replace('.', ',')} m
                </span>
              </div>
              <input
                id="slider-ell"
                type="range"
                min={0.5}
                max={3.0}
                step={0.05}
                value={params.ell}
                onChange={(e) => {
                  const newEll = Number(e.target.value);
                  setParams((prev) => ({
                    ...prev,
                    ell: newEll,
                    s: Math.min(prev.s, Number((1.9 * newEll).toFixed(2))),
                  }));
                }}
                className="w-full accent-green-800 cursor-pointer"
              />
            </div>

            {params.mode !== 'collision-impact' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="slider-theta0" className="font-medium text-slate-700">
                    Amplitudo Sudut (θ₀)
                  </label>
                  <span className="font-mono-tabular font-semibold text-green-950">
                    {params.theta0Deg.toFixed(1).replace('.', ',')}°
                  </span>
                </div>
                <input
                  id="slider-theta0"
                  type="range"
                  min={2}
                  max={18}
                  step={0.5}
                  value={params.theta0Deg}
                  onChange={(e) => setParams((prev) => ({ ...prev, theta0Deg: Number(e.target.value) }))}
                  className="w-full accent-green-800 cursor-pointer"
                />
              </div>
            )}

            {params.mode === 'accelerated-train' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="slider-atrain" className="font-medium text-slate-700">
                    Percepatan Kereta (a)
                  </label>
                  <span className="font-mono-tabular font-semibold text-orange-700">
                    {params.aTrain.toFixed(1).replace('.', ',')} m/s²
                  </span>
                </div>
                <input
                  id="slider-atrain"
                  type="range"
                  min={0}
                  max={15}
                  step={0.5}
                  value={params.aTrain}
                  onChange={(e) => setParams((prev) => ({ ...prev, aTrain: Number(e.target.value) }))}
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Live Physical Quantities Table */}
          <div className="border-t border-green-900/15 pt-3">
            <div className="text-xs font-semibold text-green-950 mb-2">
              Besaran Fisis Real-Time
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <dt className="text-slate-500">cos(α)</dt>
                <dd className="font-mono-tabular font-semibold text-green-950">
                  {currentSnapshot.cosAlpha.toFixed(3).replace('.', ',')}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Jarak Pusat Massa (d_cm)</dt>
                <dd className="font-mono-tabular font-semibold text-green-950">
                  {currentSnapshot.dCm.toFixed(2).replace('.', ',')} m
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Momen Inersia (I)</dt>
                <dd className="font-mono-tabular font-semibold text-green-950">
                  {currentSnapshot.inertia.toFixed(2).replace('.', ',')} kg·m²
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Frekuensi (f)</dt>
                <dd className="font-mono-tabular font-semibold text-orange-700">
                  {currentSnapshot.freqHz.toFixed(3).replace('.', ',')} Hz
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Energi Kinetik (K)</dt>
                <dd className="font-mono-tabular font-semibold text-green-950">
                  {currentSnapshot.kineticEnergy.toFixed(3).replace('.', ',')} J
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Energi Potensial (U)</dt>
                <dd className="font-mono-tabular font-semibold text-green-950">
                  {currentSnapshot.potentialEnergy.toFixed(3).replace('.', ',')} J
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
