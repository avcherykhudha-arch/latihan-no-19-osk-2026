import React from 'react';
import { StimulusConfig } from '../data/questions';

interface StimulusVisualProps {
  stimulus: StimulusConfig;
  showFbdOverlay?: boolean;
}

export const StimulusVisual: React.FC<StimulusVisualProps> = ({
  stimulus,
  showFbdOverlay = false,
}) => {
  const { type, caption, labels, tableData } = stimulus;

  const renderGraphRatio = () => {
    // Exact plot of f(s)/f(0) = (1 - x^2 / 4)^(1/4) for x = s/l in [0, 2]
    const w = 420;
    const h = 250;
    const padL = 56;
    const padR = 24;
    const padT = 22;
    const padB = 42;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const toX = (x: number) => padL + (x / 2.0) * plotW;
    const toY = (y: number) => padT + (1 - y) * plotH;

    const pts: string[] = [];
    for (let i = 0; i <= 80; i++) {
      const x = (i / 80) * 1.999;
      const y = Math.pow(Math.max(0, 1 - (x * x) / 4), 0.25);
      pts.push(`${i === 0 ? 'M' : 'L'} ${toX(x).toFixed(1)} ${toY(y).toFixed(1)}`);
    }
    pts.push(`L ${toX(2.0).toFixed(1)} ${toY(0).toFixed(1)}`);

    const targetY = Math.SQRT1_2; // 0.7071

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto" role="img" aria-label={caption}>
        <rect x={0} y={0} width={w} height={h} fill="#FFFFFF" />
        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((yv) => (
          <g key={`gy-${yv}`}>
            <line x1={padL} y1={toY(yv)} x2={w - padR} y2={toY(yv)} stroke="#E2E8F0" strokeWidth={1} />
            <text x={padL - 8} y={toY(yv) + 4} textAnchor="end" fontSize="11" fill="#334155" fontFamily="IBM Plex Mono, monospace">
              {yv.toFixed(2).replace('.', ',')}
            </text>
          </g>
        ))}
        {[0, 0.5, 1.0, 1.5, 2.0].map((xv) => (
          <g key={`gx-${xv}`}>
            <line x1={toX(xv)} y1={padT} x2={toX(xv)} y2={h - padB} stroke="#E2E8F0" strokeWidth={1} />
            <text x={toX(xv)} y={h - padB + 16} textAnchor="middle" fontSize="11" fill="#334155" fontFamily="IBM Plex Mono, monospace">
              {xv.toFixed(1).replace('.', ',')}
            </text>
          </g>
        ))}
        {/* Axes */}
        <line x1={padL} y1={padT} x2={padL} y2={h - padB} stroke="#14532D" strokeWidth={1.8} />
        <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="#14532D" strokeWidth={1.8} />

        {/* Horizontal Target Line f(s0)/f(0) = 1/sqrt(2) */}
        <line
          x1={padL}
          y1={toY(targetY)}
          x2={w - padR}
          y2={toY(targetY)}
          stroke="#EA580C"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text x={padL + 8} y={toY(targetY) - 6} fontSize="11" fontWeight="600" fill="#C2410C">
          f(s₀)/f(0) = 1/√2 ≈ 0,707
        </text>

        {/* Curve */}
        <path d={pts.join(' ')} fill="none" stroke="#14532D" strokeWidth={2.5} />

        {/* Axis labels */}
        <text x={padL + plotW / 2} y={h - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="#14532D">
          Rasio s / l
        </text>
        <text
          x={15}
          y={padT + plotH / 2}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#14532D"
          transform={`rotate(-90 15 ${padT + plotH / 2})`}
        >
          f(s) / f(0)
        </text>
      </svg>
    );
  };

  const renderExperimentGraphAndTable = () => {
    const w = 400;
    const h = 230;
    const padL = 52;
    const padR = 20;
    const padT = 20;
    const padB = 40;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const toX = (secVal: number) => padL + ((secVal - 0.5) / 2.2) * plotW;
    const toY = (t2: number) => padT + (1 - t2 / 9.0) * plotH;
    const points = [
      { x: 1.0, y: 3.2 },
      { x: 1.5, y: 4.8 },
      { x: 2.0, y: 6.4 },
      { x: 2.5, y: 8.0 },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-7">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={caption}>
            <rect x={0} y={0} width={w} height={h} fill="#FFFFFF" />
            {[0, 2, 4, 6, 8].map((yv) => (
              <g key={`ey-${yv}`}>
                <line x1={padL} y1={toY(yv)} x2={w - padR} y2={toY(yv)} stroke="#E2E8F0" />
                <text x={padL - 8} y={toY(yv) + 4} textAnchor="end" fontSize="11" fill="#334155" fontFamily="IBM Plex Mono, monospace">
                  {yv},0
                </text>
              </g>
            ))}
            {[1.0, 1.5, 2.0, 2.5].map((xv) => (
              <g key={`ex-${xv}`}>
                <line x1={toX(xv)} y1={padT} x2={toX(xv)} y2={h - padB} stroke="#E2E8F0" />
                <text x={toX(xv)} y={h - padB + 16} textAnchor="middle" fontSize="11" fill="#334155" fontFamily="IBM Plex Mono, monospace">
                  {xv.toFixed(1).replace('.', ',')}
                </text>
              </g>
            ))}
            <line x1={padL} y1={padT} x2={padL} y2={h - padB} stroke="#14532D" strokeWidth={1.8} />
            <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="#14532D" strokeWidth={1.8} />
            <line
              x1={toX(0.5)}
              y1={toY(1.6)}
              x2={toX(2.65)}
              y2={toY(8.48)}
              stroke="#EA580C"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            {points.map((p, idx) => (
              <circle key={idx} cx={toX(p.x)} cy={toY(p.y)} r={4.5} fill="#14532D" stroke="#FFFFFF" strokeWidth={1.5} />
            ))}
            <text x={padL + plotW / 2} y={h - 6} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#14532D">
              sec(α) = 1 / cos(α)
            </text>
            <text
              x={14}
              y={padT + plotH / 2}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="600"
              fill="#14532D"
              transform={`rotate(-90 14 ${padT + plotH / 2})`}
            >
              T² (s²)
            </text>
          </svg>
        </div>

        <div className="md:col-span-5">
          <table className="w-full text-xs border border-green-900/20 rounded-lg overflow-hidden">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="py-2 px-3 text-left font-semibold">sec(α)</th>
                <th className="py-2 px-3 text-right font-semibold">T² (s²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-900/10 bg-white font-mono-tabular">
              {(tableData || []).map((row, idx) => (
                <tr key={idx}>
                  <td className="py-1.5 px-3 text-slate-800">{row.secAlpha}</td>
                  <td className="py-1.5 px-3 text-right font-medium text-green-950">{row.tSquared}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderModes3D = () => (
    <svg viewBox="0 0 460 220" className="w-full max-w-lg mx-auto" role="img" aria-label={caption}>
      <rect x={0} y={0} width={460} height={220} fill="#FFFFFF" />
      {/* Mode A: In-plane */}
      <g transform="translate(115, 28)">
        <text x={0} y={-10} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#14532D">
          Mode A: Di Dalam Bidang (f∥)
        </text>
        <line x1={-40} y1={0} x2={40} y2={0} stroke="#14532D" strokeWidth={2.5} />
        <circle cx={0} cy={0} r={3.5} fill="#EA580C" />
        {/* Pivot axis perpendicular to screen */}
        <circle cx={0} cy={0} r={8} fill="none" stroke="#EA580C" strokeWidth={1.2} strokeDasharray="2 2" />
        <line x1={0} y1={0} x2={-52} y2={110} stroke="#14532D" strokeWidth={2} />
        <line x1={0} y1={0} x2={52} y2={110} stroke="#14532D" strokeWidth={2} />
        <line x1={-52} y1={110} x2={52} y2={110} stroke="#EA580C" strokeWidth={4} />
        <circle cx={-52} cy={110} r={8} fill="#14532D" />
        <circle cx={52} cy={110} r={8} fill="#14532D" />
        {/* Swing arrows */}
        <path d="M -30 135 Q 0 148 30 135" fill="none" stroke="#EA580C" strokeWidth={1.8} markerEnd="url(#arrowOrange)" />
        <text x={0} y={165} textAnchor="middle" fontSize="10.5" fill="#334155">
          Jarak massa ke poros = l
        </text>
      </g>

      {/* Divider */}
      <line x1={230} y1={18} x2={230} y2={205} stroke="#E2E8F0" strokeWidth={1} />

      {/* Mode B: Out-of-plane */}
      <g transform="translate(345, 28)">
        <text x={0} y={-10} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#14532D">
          Mode B: Tegak Lurus Bidang (f⊥)
        </text>
        {/* Horizontal axis through pivot */}
        <line x1={-75} y1={0} x2={75} y2={0} stroke="#EA580C" strokeWidth={2} strokeDasharray="5 3" />
        <circle cx={0} cy={0} r={3.5} fill="#EA580C" />
        <line x1={0} y1={0} x2={-52} y2={110} stroke="#14532D" strokeWidth={2} />
        <line x1={0} y1={0} x2={52} y2={110} stroke="#14532D" strokeWidth={2} />
        <line x1={-52} y1={110} x2={52} y2={110} stroke="#EA580C" strokeWidth={4} />
        {/* Vertical distance h */}
        <line x1={0} y1={0} x2={0} y2={110} stroke="#64748B" strokeWidth={1.2} strokeDasharray="3 3" />
        <text x={8} y={62} fontSize="10.5" fill="#14532D" fontWeight="600">
          h = l cos α
        </text>
        <circle cx={-52} cy={110} r={8} fill="#14532D" />
        <circle cx={52} cy={110} r={8} fill="#14532D" />
        <text x={0} y={145} textAnchor="middle" fontSize="10.5" fill="#EA580C" fontWeight="600">
          Berayun keluar/masuk bidang
        </text>
        <text x={0} y={165} textAnchor="middle" fontSize="10.5" fill="#334155">
          Jarak massa ke sumbu = l cos α
        </text>
      </g>
    </svg>
  );

  const renderTriangleDiagram = () => {
    const w = 420;
    const h = 235;
    const ox = 210;
    const oy = 32;

    const isFbd = type === 'fbd-equilibrium' || showFbdOverlay;
    const isAsym = type === 'asymmetric-triangle';
    const isTrain = type === 'accelerated-train';
    const isSpring = type === 'spring-triangle';
    const isMidpoint = type === 'midpoint-mass' || type === 'inelastic-collision';
    const isCollision = type === 'inelastic-collision';
    const isMassiveRod = type === 'massive-rod';
    const isThermal = type === 'thermal-rod';
    const isEquiv = type === 'equivalent-length';

    if (isTrain) {
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md mx-auto" role="img" aria-label={caption}>
          <rect x={0} y={0} width={w} height={h} fill="#FFFFFF" />
          {/* Train roof + frame */}
          <rect x={70} y={24} width={280} height={175} rx={6} fill="#F8FAFC" stroke="#14532D" strokeWidth={2} />
          {/* Wheels */}
          <circle cx={115} cy={208} r={10} fill="#14532D" />
          <circle cx={305} cy={208} r={10} fill="#14532D" />
          <line x1={30} y1={219} x2={390} y2={219} stroke="#64748B" strokeWidth={1.5} />
          {/* Acceleration arrow */}
          <line x1={295} y1={52} x2={365} y2={52} stroke="#EA580C" strokeWidth={2.5} />
          <polygon points="365,47 377,52 365,57" fill="#EA580C" />
          <text x={335} y={42} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#EA580C">
            {labels.a || 'a = 7,5 m/s²'}
          </text>
          {/* Tilted triangle inside train */}
          <line x1={210} y1={24} x2={210} y2={160} stroke="#94A3B8" strokeWidth={1.2} strokeDasharray="4 3" />
          <g transform="translate(210, 24) rotate(26)">
            <line x1={0} y1={0} x2={-48} y2={105} stroke="#14532D" strokeWidth={2} />
            <line x1={0} y1={0} x2={48} y2={105} stroke="#14532D" strokeWidth={2} />
            <line x1={-48} y1={105} x2={48} y2={105} stroke="#EA580C" strokeWidth={4} />
            <circle cx={-48} cy={105} r={8} fill="#14532D" />
            <circle cx={48} cy={105} r={8} fill="#14532D" />
          </g>
          <text x={112} y={102} fontSize="11" fontWeight="600" fill="#14532D">
            {labels.ell || 'l'}
          </text>
          <text x={148} y={168} fontSize="11" fontWeight="600" fill="#C2410C">
            {labels.s || 's'}
          </text>
          <text x={242} y={88} fontSize="10.5" fill="#475569">
            g_eff
          </text>
        </svg>
      );
    }

    const tiltDeg = isAsym ? -10 : 0;
    const dx = isAsym ? 56 : 74;
    const dy = 128;

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md mx-auto" role="img" aria-label={caption}>
        <defs>
          <marker id="arrowOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#EA580C" />
          </marker>
          <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#14532D" />
          </marker>
        </defs>
        <rect x={0} y={0} width={w} height={h} fill="#FFFFFF" />

        {/* Support ceiling */}
        <line x1={ox - 95} y1={oy} x2={ox + 95} y2={oy} stroke="#14532D" strokeWidth={3} />
        {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((hx) => (
          <line key={hx} x1={ox + hx} y1={oy} x2={ox + hx - 8} y2={oy - 9} stroke="#14532D" strokeWidth={1.2} />
        ))}

        {/* Vertical axis */}
        <line x1={ox} y1={oy} x2={ox} y2={oy + 175} stroke="#94A3B8" strokeWidth={1.2} strokeDasharray="4 3" />

        {/* Coordinate axes when FBD active */}
        {isFbd && (
          <g transform={`translate(56, 70)`}>
            <line x1={0} y1={35} x2={38} y2={35} stroke="#334155" strokeWidth={1.4} markerEnd="url(#arrowGreen)" />
            <line x1={0} y1={35} x2={0} y2={-3} stroke="#334155" strokeWidth={1.4} markerEnd="url(#arrowGreen)" />
            <text x={42} y={39} fontSize="11" fontWeight="600" fill="#334155">+x</text>
            <text x={-6} y={-8} fontSize="11" fontWeight="600" fill="#334155">+y</text>
          </g>
        )}

        {/* Thermal comparison dashed outline */}
        {isThermal && (
          <g opacity={0.45}>
            <line x1={ox} y1={oy} x2={ox - 54} y2={oy + 140} stroke="#64748B" strokeWidth={1.5} strokeDasharray="4 3" />
            <line x1={ox} y1={oy} x2={ox + 54} y2={oy + 140} stroke="#64748B" strokeWidth={1.5} strokeDasharray="4 3" />
            <line x1={ox - 54} y1={oy + 140} x2={ox + 54} y2={oy + 140} stroke="#64748B" strokeWidth={2.5} strokeDasharray="4 3" />
            <text x={ox} y={oy + 156} textAnchor="middle" fontSize="10.5" fill="#475569">
              {labels.s1 || 's₁'}
            </text>
          </g>
        )}

        {/* Main rigid triangle */}
        <g transform={`translate(${ox}, ${oy}) rotate(${tiltDeg})`}>
          {/* Strings */}
          <line x1={0} y1={0} x2={-dx} y2={dy} stroke="#14532D" strokeWidth={2.2} />
          <line x1={0} y1={0} x2={dx} y2={dy} stroke="#14532D" strokeWidth={2.2} />

          {/* Connecting Rod or Spring */}
          {isSpring ? (
            <path
              d={`M ${-dx} ${dy} L ${-dx + 14} ${dy} L ${-dx + 22} ${dy - 8} L ${-dx + 34} ${dy + 8} L ${-dx + 46} ${dy - 8} L ${-dx + 58} ${dy + 8} L ${-dx + 70} ${dy - 8} L ${-dx + 82} ${dy + 8} L ${-dx + 94} ${dy - 8} L ${-dx + 106} ${dy + 8} L ${-dx + 118} ${dy - 8} L ${-dx + 130} ${dy} L ${dx} ${dy}`}
              fill="none"
              stroke="#EA580C"
              strokeWidth={2.4}
            />
          ) : (
            <line
              x1={-dx}
              y1={dy}
              x2={dx}
              y2={dy}
              stroke="#EA580C"
              strokeWidth={isMassiveRod ? 6 : 4}
              strokeLinecap="round"
            />
          )}

          {/* Angle arc */}
          <path d="M 0 36 A 36 36 0 0 1 18 31" fill="none" stroke="#EA580C" strokeWidth={1.5} />
          <text x={11} y={48} fontSize="11" fontWeight="600" fill="#C2410C">
            {labels.alpha || 'α'}
          </text>

          {/* String labels */}
          <text x={-dx / 2 - 12} y={dy / 2 - 4} textAnchor="end" fontSize="11.5" fontWeight="600" fill="#14532D">
            {labels.ell || 'l'}
          </text>
          <text x={dx / 2 + 12} y={dy / 2 - 4} textAnchor="start" fontSize="11.5" fontWeight="600" fill="#14532D">
            {labels.ell || 'l'}
          </text>

          {/* Rod label */}
          <text x={0} y={dy + 22} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#C2410C">
            {isSpring ? (labels.k || 'k') : isThermal ? (labels.s2 || 's₂') : (labels.s || 's')}
          </text>

          {/* Masses */}
          <circle cx={-dx} cy={dy} r={isAsym ? 9 : 10} fill="#14532D" stroke="#FFFFFF" strokeWidth={2} />
          <circle cx={dx} cy={dy} r={isAsym ? 12 : 10} fill="#14532D" stroke="#FFFFFF" strokeWidth={2} />

          {/* Midpoint mass M */}
          {isMidpoint && !isCollision && (
            <g>
              <circle cx={0} cy={dy} r={11} fill="#EA580C" stroke="#FFFFFF" strokeWidth={2} />
              <text x={0} y={dy - 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#C2410C">
                {labels.M || 'M'}
              </text>
            </g>
          )}

          {/* Collision incoming clay */}
          {isCollision && (
            <g>
              <circle cx={-125} cy={dy} r={8.5} fill="#EA580C" stroke="#FFFFFF" strokeWidth={1.5} />
              <line x1={-112} y1={dy} x2={-78} y2={dy} stroke="#EA580C" strokeWidth={2.2} markerEnd="url(#arrowOrange)" />
              <text x={-125} y={dy - 14} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#C2410C">
                {labels.m0 || 'm₀'}, {labels.v0 || 'v₀'}
              </text>
            </g>
          )}

          {/* Center of mass marker */}
          {!isAsym && !isMidpoint && (
            <circle cx={0} cy={dy} r={4} fill="#FFFFFF" stroke="#14532D" strokeWidth={2} />
          )}

          {/* Mass Labels */}
          <text x={-dx - 14} y={dy + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#14532D">
            {isAsym ? (labels.m1 || 'm₁') : (labels.m || 'm')}
          </text>
          <text
            x={isFbd ? dx + 12 : dx + 16}
            y={isFbd ? dy + 24 : dy + 4}
            textAnchor="start"
            fontSize="11"
            fontWeight="600"
            fill="#14532D"
          >
            {isAsym ? (labels.m2 || 'm₂') : (labels.m || 'm')}
          </text>

          {/* FBD vectors on right mass */}
          {isFbd && (
            <g transform={`translate(${dx}, ${dy})`}>
              {/* mg down */}
              <line x1={0} y1={10} x2={0} y2={58} stroke="#14532D" strokeWidth={2.2} markerEnd="url(#arrowGreen)" />
              <text x={6} y={56} fontSize="11.5" fontWeight="700" fill="#14532D">mg</text>
              {/* T along string */}
              <line x1={-4} y1={-8} x2={-30} y2={-54} stroke="#14532D" strokeWidth={2.2} markerEnd="url(#arrowGreen)" />
              <text x={-44} y={-44} fontSize="11.5" fontWeight="700" fill="#14532D">T</text>
              {/* N_tongkat pushing outward */}
              <line x1={10} y1={0} x2={52} y2={0} stroke="#EA580C" strokeWidth={2.4} markerEnd="url(#arrowOrange)" />
              <text x={32} y={-8} fontSize="11" fontWeight="700" fill="#C2410C">F_tongkat</text>
            </g>
          )}
        </g>

        {/* Equivalent simple pendulum on the right */}
        {isEquiv && (
          <g transform="translate(360, 32)">
            <line x1={-25} y1={0} x2={25} y2={0} stroke="#14532D" strokeWidth={2.5} />
            <line x1={0} y1={0} x2={0} y2={155} stroke="#EA580C" strokeWidth={2} strokeDasharray="5 3" />
            <circle cx={0} cy={155} r={9} fill="#EA580C" stroke="#FFFFFF" strokeWidth={2} />
            <text x={8} y={85} fontSize="11" fontWeight="700" fill="#C2410C">l_eff</text>
          </g>
        )}

        {/* Pivot dot */}
        <circle cx={ox} cy={oy} r={4.5} fill="#EA580C" stroke="#14532D" strokeWidth={1.5} />
      </svg>
    );
  };

  return (
    <figure className="rounded-xl border border-green-900/20 bg-white p-4">
      {type === 'graph-ratio' && renderGraphRatio()}
      {type === 'experiment-table-graph' && renderExperimentGraphAndTable()}
      {type === 'modes-3d' && renderModes3D()}
      {type !== 'graph-ratio' && type !== 'experiment-table-graph' && type !== 'modes-3d' && renderTriangleDiagram()}
      <figcaption className="mt-2.5 text-xs text-slate-600 text-center leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
};
