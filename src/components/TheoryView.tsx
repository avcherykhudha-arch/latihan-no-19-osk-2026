import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { THEORY_SECTIONS } from '../data/theoryContent';
import { MisterJoVoiceState } from '../hooks/useMisterJoTTS';
import { SpeakButton } from './MisterJoVoiceBar';
import { MathText, DisplayFormula } from './MathText';
import { StimulusVisual } from './StimulusVisual';
import { PhysicsSimulation } from './PhysicsSimulation';

interface TheoryViewProps {
  voice: MisterJoVoiceState;
  onStartPractice: () => void;
}

export const TheoryView: React.FC<TheoryViewProps> = ({ voice, onStartPractice }) => {
  const [activeId, setActiveId] = useState<number>(1);
  const current = THEORY_SECTIONS.find((s) => s.id === activeId) || THEORY_SECTIONS[0];

  const renderSectionVisual = () => {
    if (current.visualType === 'osk19-geometry') {
      return (
        <StimulusVisual
          stimulus={{
            type: 'geometry',
            caption: 'Model Soal Nomor 19 OSK 2026: Dua pendulum identik (l, m) digantung pada satu poros dan dihubungkan tongkat tak bermassa sepanjang s.',
            labels: { ell: 'l', s: 's', m: 'm', alpha: 'α' },
          }}
        />
      );
    }
    if (current.visualType === 'fbd-equilibrium') {
      return (
        <StimulusVisual
          stimulus={{
            type: 'fbd-equilibrium',
            caption: 'Free Body Diagram keseimbangan statis satu massa: berat mg ke bawah, tegangan tali T menuju poros, dan gaya tekan tongkat F_tongkat.',
            labels: { ell: 'l', s: 's', m: 'm', alpha: 'α' },
          }}
          showFbdOverlay
        />
      );
    }
    if (current.visualType === 'graph-ratio') {
      return (
        <StimulusVisual
          stimulus={{
            type: 'graph-ratio',
            caption: 'Kurva eksak fungsi frekuensi f(s)/f(0) = (1 - s²/4l²)^(1/4) beserta titik target f(s₀)/f(0) = 1/√2.',
            labels: {},
          }}
        />
      );
    }
    if (current.visualType === 'modes-comparison') {
      return (
        <StimulusVisual
          stimulus={{
            type: 'modes-3d',
            caption: 'Perbedaan sumbu putar antara ayunan di dalam bidang segitiga (Soal 19) dan ayunan tegak lurus bidang.',
            labels: {},
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-green-900/15 pb-6">
        <div>
          <p className="text-xs font-semibold text-orange-700 tracking-wide">
            Pembelajaran Terstruktur · Adaptasi Soal 19 OSK 2026
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-green-950 text-balance">
            Penguasaan Konsep Bandul Fisis Segitiga dari Nol hingga Olimpiade
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Ikuti 13 tahapan materi sistematis bersama MISTER JO sebelum memasuki 15 soal latihan numerik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <SpeakButton
            title="Tujuan Pembelajaran Bandul Segitiga"
            text="Selamat datang di Pembelajaran Terstruktur OSK Physics Challenge 2026 bersama Mister Jo. Pada modul ini kita akan mengupas tuntas sistem dua pendulum terhubung tongkat pada Soal Nomor 19 OSK 2026, mulai dari konsep dasar hingga strategi penyelesaian soal tingkat Olimpiade Kota."
            voice={voice}
            label="Narasi Pengantar"
          />
          <button
            type="button"
            onClick={onStartPractice}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Lanjut ke 15 Soal</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 2-Column Theory Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Index (13 stages) */}
        <nav aria-label="Daftar 13 Tahap Teori Dasar" className="lg:col-span-4 border border-green-900/20 rounded-xl bg-white divide-y divide-green-900/10">
          {THEORY_SECTIONS.map((sec) => {
            const isActive = sec.id === activeId;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveId(sec.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-green-900 text-white'
                    : 'bg-white text-green-950 hover:bg-green-50/70'
                }`}
              >
                <span
                  className={`font-mono-tabular text-xs font-semibold mt-0.5 shrink-0 ${
                    isActive ? 'text-orange-300' : 'text-orange-700'
                  }`}
                >
                  {String(sec.id).padStart(2, '0')}.
                </span>
                <span className="text-xs font-medium leading-snug">{sec.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Content Reader */}
        <article className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-green-900/20 bg-white p-6 md:p-8 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-green-900/10 pb-4">
              <div>
                <div className="text-xs text-slate-500">
                  Bagian {current.id} dari {THEORY_SECTIONS.length} · Materi Inti Soal 19
                </div>
                <h3 className="mt-1 text-xl font-bold text-green-950">{current.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{current.subtitle}</p>
              </div>
              <SpeakButton
                title={`Teori Bagian ${current.id}: ${current.title}`}
                text={current.speechScript}
                voice={voice}
              />
            </div>

            <div className="space-y-4 text-[15px] text-slate-800 leading-relaxed">
              {current.content.map((para, i) => (
                <p key={i}>
                  <MathText text={para} />
                </p>
              ))}
            </div>

            {current.calloutTitle && current.calloutBody && (
              <div className="rounded-lg border border-orange-600/35 bg-orange-50/60 p-4">
                <div className="text-xs font-bold text-orange-800 mb-1">
                  {current.calloutTitle}
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">
                  <MathText text={current.calloutBody} />
                </p>
              </div>
            )}

            {current.keyEquations && current.keyEquations.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-green-950 tracking-wide">
                  Persamaan Kunci
                </h4>
                {current.keyEquations.map((eq, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-green-900/20 bg-green-950/[0.02] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-green-900">{eq.label}</span>
                      <SpeakButton
                        title={`Persamaan ${eq.label}`}
                        text={`${eq.label}. ${eq.latex}. ${eq.meaning}`}
                        voice={voice}
                        label="Bacakan Rumus"
                        compact
                      />
                    </div>
                    <DisplayFormula latex={eq.latex} />
                    <p className="mt-1 text-xs text-slate-600">{eq.meaning}</p>
                  </div>
                ))}
              </div>
            )}

            {renderSectionVisual()}

            <div className="flex items-center justify-between pt-4 border-t border-green-900/10">
              <button
                type="button"
                disabled={activeId === 1}
                onClick={() => setActiveId((id) => Math.max(1, id - 1))}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-green-900/25 text-xs font-medium text-green-950 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>Bagian Sebelumnya</span>
              </button>

              <button
                type="button"
                disabled={activeId === THEORY_SECTIONS.length}
                onClick={() => setActiveId((id) => Math.min(THEORY_SECTIONS.length, id + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-900 text-white text-xs font-semibold hover:bg-green-950 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Bagian Berikutnya</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Interactive Lab embedded right in Theory so students prove the concept immediately */}
          <PhysicsSimulation
            title="Eksplorasi Interaktif Konsep Soal Nomor 19 (Ubah s dan l Secara Langsung)"
            initialParams={{
              mode: 'triangle-inplane',
              m: 1.0,
              m2: 1.0,
              mb: 0,
              ell: 1.5,
              s: 1.8,
              g: 9.8,
              aTrain: 0,
              kSpring: 20,
              theta0Deg: 10,
              v0Impact: 0,
            }}
            compact
          />
        </article>
      </div>
    </div>
  );
};
