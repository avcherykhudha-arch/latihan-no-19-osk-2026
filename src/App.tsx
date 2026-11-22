import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  PlayCircle,
  Calculator,
  BarChart3,
  ListOrdered,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { QUESTIONS } from './data/questions';
import { QuestionAttemptRecord } from './utils/evaluation';
import { useMisterJoTTS } from './hooks/useMisterJoTTS';
import { MisterJoVoiceBar, SpeakButton } from './components/MisterJoVoiceBar';
import { TheoryView } from './components/TheoryView';
import { QuestionWorkspace } from './components/QuestionWorkspace';
import { PhysicsSimulation } from './components/PhysicsSimulation';
import { FormulaSheetView } from './components/FormulaSheetView';
import { EvaluationDashboard } from './components/EvaluationDashboard';

type AppView = 'home' | 'theory' | 'practice' | 'simulation' | 'formulas' | 'evaluation';

const STORAGE_KEY = 'osk_physics_challenge_2026_v1';

interface StoredProgress {
  records: Record<number, QuestionAttemptRecord>;
  activeQuestionIndex: number;
}

function loadStoredProgress(): StoredProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { records: {}, activeQuestionIndex: 0 };
    const parsed = JSON.parse(raw) as StoredProgress;
    return {
      records: parsed.records || {},
      activeQuestionIndex:
        typeof parsed.activeQuestionIndex === 'number' &&
        parsed.activeQuestionIndex >= 0 &&
        parsed.activeQuestionIndex < QUESTIONS.length
          ? parsed.activeQuestionIndex
          : 0,
    };
  } catch {
    return { records: {}, activeQuestionIndex: 0 };
  }
}

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'practice';
      }
    }
    return 'home';
  });

  const initialStored = React.useMemo(() => loadStoredProgress(), []);
  const [records, setRecords] = useState<Record<number, QuestionAttemptRecord>>(
    initialStored.records
  );
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(
    initialStored.activeQuestionIndex
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const voice = useMisterJoTTS();

  useEffect(() => {
    try {
      const payload: StoredProgress = { records, activeQuestionIndex };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [records, activeQuestionIndex]);

  const handleRecordAnswer = (
    questionId: number,
    userInput: string,
    isCorrect: boolean,
    elapsedDeltaSec: number
  ) => {
    setRecords((prev) => {
      const existing = prev[questionId];
      return {
        ...prev,
        [questionId]: {
          questionId,
          userInput,
          isAttempted: true,
          isCorrect,
          attemptsCount: (existing?.attemptsCount || 0) + 1,
          timeSpentSec: (existing?.timeSpentSec || 0) + elapsedDeltaSec,
        },
      };
    });
  };

  const handleClearAnswer = (questionId: number) => {
    setRecords((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleResetProgress = () => {
    setRecords({});
    setActiveQuestionIndex(0);
  };

  const navigateTo = (nextView: AppView) => {
    setView(nextView);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const attemptedCount = Object.values(records).filter((r) => r.isAttempted).length;
  const correctCount = Object.values(records).filter((r) => r.isCorrect).length;
  const progressPercent = Math.round((attemptedCount / QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-white text-green-950">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-base md:text-lg font-bold tracking-tight text-green-950 whitespace-nowrap shrink-0 cursor-pointer hover:text-orange-700 transition-colors"
          >
            OSK Physics Challenge 2026
          </button>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav aria-label="Menu Utama" className="hidden md:flex items-center gap-6 text-sm font-medium">
            {[
              { id: 'theory', label: 'Teori Dasar' },
              { id: 'practice', label: 'Bank Soal' },
              { id: 'simulation', label: 'Simulasi' },
              { id: 'formulas', label: 'Rumus' },
              { id: 'evaluation', label: 'Evaluasi' },
            ].map((item) => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id as AppView)}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-orange-600 text-orange-700 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-green-950'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('practice')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{attemptedCount > 0 ? 'Lanjutkan Latihan' : 'Mulai Latihan'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg border border-green-900/20 text-green-950 hover:bg-green-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navigasi Seluler"
            className="md:hidden border-t border-green-900/15 bg-white px-4 py-3 space-y-1"
          >
            {[
              { id: 'home', label: 'Beranda' },
              { id: 'theory', label: 'Teori Dasar' },
              { id: 'practice', label: 'Bank Soal 1–15' },
              { id: 'simulation', label: 'Simulasi Animasi' },
              { id: 'formulas', label: 'Rumus Penting' },
              { id: 'evaluation', label: 'Evaluasi Hasil' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id as AppView)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  view === item.id
                    ? 'bg-green-900 text-white'
                    : 'text-green-950 hover:bg-green-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
        {view === 'home' && (
          <div className="space-y-10">
            {/* Hero & Mentor Split */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-green-900/15 pb-8">
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-orange-700 tracking-wide">
                    15 Latihan Pendalaman Konsep – Adaptasi Soal Nomor 19 OSK 2026
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-950 tracking-tight text-balance">
                    OSK PHYSICS CHALLENGE 2026
                  </h1>
                  <p className="text-base text-slate-700 max-w-2xl leading-relaxed">
                    Kuasai tuntas fenomena osilasi bandul fisis segitiga terhubung tongkat kaku dari dasar hingga tantangan HOTS Olimpiade Sains Tingkat Kota.
                  </p>
                  <p className="text-xs font-semibold text-green-900">
                    Alur Belajar: Belajar Konsep → Memahami Fenomena → Melihat Pembuktian Animasi → Menganalisis Persamaan → Menyelesaikan Soal
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateTo('theory')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
                  >
                    <span>Pelajari Teori Dasar</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('practice')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-green-900 text-green-950 text-sm font-semibold hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <span>Kerjakan Bank Soal 1–15</span>
                  </button>
                </div>
              </div>

              {/* Mentor Identity Card (MISTER JO) & Progress */}
              <div className="lg:col-span-4 rounded-xl border border-green-900/25 bg-white p-6 flex flex-col justify-between space-y-5">
                <div className="flex items-start gap-4">
                  {/* Geometric Scientific Mentor Emblem */}
                  <div
                    aria-hidden="true"
                    className="w-14 h-14 rounded-xl bg-green-900 text-white flex items-center justify-center shrink-0"
                  >
                    <svg viewBox="0 0 48 48" className="w-9 h-9">
                      <line x1="8" y1="10" x2="40" y2="10" stroke="#FFFFFF" strokeWidth="2.5" />
                      <line x1="24" y1="10" x2="12" y2="34" stroke="#FFFFFF" strokeWidth="2" />
                      <line x1="24" y1="10" x2="36" y2="34" stroke="#FFFFFF" strokeWidth="2" />
                      <line x1="12" y1="34" x2="36" y2="34" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="12" cy="34" r="4" fill="#F97316" />
                      <circle cx="36" cy="34" r="4" fill="#F97316" />
                      <circle cx="24" cy="10" r="3" fill="#F97316" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-orange-700">
                      Guru Pembimbing
                    </div>
                    <div className="text-lg font-bold text-green-950">MISTER JO</div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Pembimbing Olimpiade Fisika & narator suara interaktif untuk seluruh materi dan pembahasan.
                    </p>
                  </div>
                </div>

                <SpeakButton
                  title="Sambutan MISTER JO — OSK Physics Challenge 2026"
                  text="Halo pejuang Olimpiade Fisika, saya Mister Jo. Selamat datang di OSK Physics Challenge 2026. Seluruh materi dan 15 soal latihan ini dirancang khusus dari pendalaman Soal Nomor 19 OSK 2026 tentang osilasi dua pendulum terhubung tongkat kaku. Mulailah dari menu Teori Dasar, uji intuisi Anda di Simulasi Animasi, lalu taklukkan ke-15 soal isian numerik dengan ketelitian satu angka di belakang koma."
                  voice={voice}
                  label="Dengarkan Sambutan MISTER JO"
                />

                {/* Learning Progress */}
                <div className="pt-4 border-t border-green-900/15 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-green-950">Progres Belajar Anda</span>
                    <span className="font-mono-tabular font-semibold text-orange-700">
                      {attemptedCount}/15 soal ({progressPercent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-green-900/10 overflow-hidden">
                    <div
                      className="h-full bg-orange-600 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 font-mono-tabular">
                    Benar: {correctCount} · Belum dicoba: {QUESTIONS.length - attemptedCount}
                  </div>
                </div>
              </div>
            </section>

            {/* 5 Core Learning Menus */}
            <section aria-label="Menu Pembelajaran Utama" className="space-y-4">
              <h2 className="text-lg font-bold text-green-950">
                Pusat Pembelajaran & Latihan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <MenuCard
                  icon={<BookOpen className="w-5 h-5 text-orange-600" aria-hidden="true" />}
                  title="Teori Dasar"
                  description="13 tahap materi terstruktur dari konsep dasar hingga strategi Olimpiade."
                  actionLabel="Buka Teori"
                  onClick={() => navigateTo('theory')}
                />
                <MenuCard
                  icon={<ListOrdered className="w-5 h-5 text-green-800" aria-hidden="true" />}
                  title="Bank Soal 1–15"
                  description="15 soal isian numerik bertahap dengan pembahasan buka-tutup 7 tahap."
                  actionLabel="Kerjakan Soal"
                  onClick={() => navigateTo('practice')}
                />
                <MenuCard
                  icon={<PlayCircle className="w-5 h-5 text-orange-600" aria-hidden="true" />}
                  title="Simulasi Animasi"
                  description="Lab interaktif pembuktian fenomena dengan kontrol Play, Pause, dan Vektor."
                  actionLabel="Buka Simulasi"
                  onClick={() => navigateTo('simulation')}
                />
                <MenuCard
                  icon={<Calculator className="w-5 h-5 text-green-800" aria-hidden="true" />}
                  title="Rumus Penting"
                  description="Kumpulan persamaan utama, makna simbol, satuan SI, dan dimensi."
                  actionLabel="Lihat Rumus"
                  onClick={() => navigateTo('formulas')}
                />
                <MenuCard
                  icon={<BarChart3 className="w-5 h-5 text-orange-600" aria-hidden="true" />}
                  title="Evaluasi Hasil"
                  description="Analisis skor, penguasaan per level, dan rekomendasi materi."
                  actionLabel="Lihat Evaluasi"
                  onClick={() => navigateTo('evaluation')}
                />
              </div>
            </section>

            {/* 15 Question Cards Grid */}
            <section aria-label="Daftar Kartu 15 Soal Latihan" className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-green-950">
                    Peta Kurikulum 15 Soal Adaptasi Nomor 19 OSK 2026
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Pilih kartu soal mana saja untuk langsung berlatih dan membuka animasi pembuktiannya.
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  Seluruh jawaban menggunakan 1 angka desimal bertanda koma
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUESTIONS.map((q, idx) => {
                  const rec = records[q.id];
                  let statusLabel = 'Belum dikerjakan';
                  let statusColor = 'text-slate-500';
                  if (rec?.isAttempted) {
                    if (rec.isCorrect) {
                      statusLabel = `Benar (${rec.userInput} ${q.unit})`;
                      statusColor = 'text-green-800 font-semibold';
                    } else {
                      statusLabel = `Perlu diperbaiki (${rec.userInput})`;
                      statusColor = 'text-orange-700 font-semibold';
                    }
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setActiveQuestionIndex(idx);
                        navigateTo('practice');
                      }}
                      className="text-left rounded-xl border border-green-900/20 bg-white p-5 hover:border-orange-600 transition-colors flex flex-col justify-between gap-3 cursor-pointer"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-mono-tabular font-bold text-orange-700">
                            Soal {String(q.id).padStart(2, '0')}
                          </span>
                          <span>{q.tierLabel}</span>
                        </div>
                        <h3 className="text-sm font-bold text-green-950 leading-snug">
                          {q.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {q.competency}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-green-900/10 flex items-center justify-between text-xs">
                        <span className={statusColor}>{statusLabel}</span>
                        <span className="font-semibold text-green-950">Buka →</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {view === 'theory' && (
          <TheoryView voice={voice} onStartPractice={() => navigateTo('practice')} />
        )}

        {view === 'practice' && (
          <QuestionWorkspace
            questions={QUESTIONS}
            activeQuestionIndex={activeQuestionIndex}
            onSelectQuestion={(idx) => setActiveQuestionIndex(idx)}
            records={records}
            onRecordAnswer={handleRecordAnswer}
            onClearAnswer={handleClearAnswer}
            voice={voice}
            onOpenEvaluation={() => navigateTo('evaluation')}
          />
        )}

        {view === 'simulation' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-green-900/15 pb-5">
              <div>
                <p className="text-xs font-semibold text-orange-700">
                  Laboratorium Fisika Virtual · Hukum Gerak Real-Time
                </p>
                <h2 className="mt-1 text-2xl font-bold text-green-950">
                  Simulasi Animasi Pembuktian Fenomena Soal 19 & Variasinya
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
                  Ubah mode fenomena, panjang tongkat s, panjang tali l, maupun percepatan kereta untuk mengamati perubahan frekuensi, energi, dan vektor gaya secara langsung.
                </p>
              </div>
              <SpeakButton
                title="Panduan Laboratorium Simulasi"
                text="Di laboratorium simulasi ini Anda dapat menguji seluruh 8 mode fenomena fisika yang terkait dengan Soal Nomor 19 OSK 2026. Ubah panjang tongkat s untuk membuktikan bahwa frekuensi turun menuju nol saat s mendekati dua l."
                voice={voice}
                label="Panduan Suara"
              />
            </div>

            <PhysicsSimulation
              allowModeSwitch
              title="Simulator Interaktif Bandul Fisis Segitiga & Variasi OSK 2026"
              initialParams={{
                mode: 'triangle-inplane',
                m: 1.0,
                m2: 1.0,
                mb: 0,
                ell: 1.5,
                s: 2.598,
                g: 9.8,
                aTrain: 7.5,
                kSpring: 32,
                theta0Deg: 10,
                v0Impact: 2.0,
              }}
            />
          </div>
        )}

        {view === 'formulas' && <FormulaSheetView voice={voice} />}

        {view === 'evaluation' && (
          <EvaluationDashboard
            questions={QUESTIONS}
            records={records}
            onJumpToQuestion={(idx) => {
              setActiveQuestionIndex(idx);
              navigateTo('practice');
            }}
            onResetProgress={handleResetProgress}
            voice={voice}
          />
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-green-900/15 bg-white py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            OSK Physics Challenge 2026 · Adaptasi Soal Nomor 19 OSK Fisika SMA 2026
          </span>
          <span>Guru Pembimbing: MISTER JO</span>
        </div>
      </footer>

      {/* MISTER JO Floating Voice Control Bar (only appears when speaking/paused) */}
      <MisterJoVoiceBar voice={voice} />
    </div>
  );
}

const MenuCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
}> = ({ icon, title, description, actionLabel, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-left rounded-xl border border-green-900/20 bg-white p-5 hover:border-orange-600 transition-colors flex flex-col justify-between gap-4 cursor-pointer"
  >
    <div className="space-y-2">
      <div>{icon}</div>
      <h3 className="text-sm font-bold text-green-950">{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
    </div>
    <span className="text-xs font-semibold text-orange-700">{actionLabel} →</span>
  </button>
);
