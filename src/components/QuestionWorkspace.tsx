import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Compass,
  Calculator,
  ListChecks,
  Layers,
  Award,
} from 'lucide-react';
import { PhysicsQuestion } from '../data/questions';
import {
  AnswerEvaluationResult,
  evaluateNumericAnswer,
} from '../utils/numberValidation';
import { QuestionAttemptRecord } from '../utils/evaluation';
import { MisterJoVoiceState } from '../hooks/useMisterJoTTS';
import { SpeakButton } from './MisterJoVoiceBar';
import { MathText, DisplayFormula, InlineFormula } from './MathText';
import { StimulusVisual } from './StimulusVisual';
import { PhysicsSimulation } from './PhysicsSimulation';

interface QuestionWorkspaceProps {
  questions: PhysicsQuestion[];
  activeQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  records: Record<number, QuestionAttemptRecord>;
  onRecordAnswer: (
    questionId: number,
    userInput: string,
    isCorrect: boolean,
    elapsedDeltaSec: number
  ) => void;
  onClearAnswer: (questionId: number) => void;
  voice: MisterJoVoiceState;
  onOpenEvaluation: () => void;
}

type AccordionKey =
  | 'hint'
  | 'concept'
  | 'fbd'
  | 'formulas'
  | 'steps'
  | 'full'
  | 'finalAnswer';

export const QuestionWorkspace: React.FC<QuestionWorkspaceProps> = ({
  questions,
  activeQuestionIndex,
  onSelectQuestion,
  records,
  onRecordAnswer,
  onClearAnswer,
  voice,
  onOpenEvaluation,
}) => {
  const question = questions[activeQuestionIndex];
  const record = records[question.id];

  const [inputValue, setInputValue] = useState<string>(record?.userInput || '');
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResult | null>(null);
  const [openPanels, setOpenPanels] = useState<Record<AccordionKey, boolean>>({
    hint: false,
    concept: false,
    fbd: false,
    formulas: false,
    steps: false,
    full: false,
    finalAnswer: false,
  });
  const [questionStartMs, setQuestionStartMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const saved = records[question.id];
    setInputValue(saved?.userInput || '');
    if (saved?.isAttempted) {
      setEvaluation(
        evaluateNumericAnswer(saved.userInput, question.numericValue, question.tolerance)
      );
    } else {
      setEvaluation(null);
    }
    setOpenPanels({
      hint: false,
      concept: false,
      fbd: false,
      formulas: false,
      steps: false,
      full: false,
      finalAnswer: false,
    });
    setQuestionStartMs(Date.now());
  }, [question.id, question.numericValue, question.tolerance]);

  const togglePanel = (key: AccordionKey) => {
    setOpenPanels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const res = evaluateNumericAnswer(
      inputValue,
      question.numericValue,
      question.tolerance
    );
    setEvaluation(res);
    if (res.isValidFormat) {
      const deltaSec = Math.max(1, Math.round((Date.now() - questionStartMs) / 1000));
      setQuestionStartMs(Date.now());
      onRecordAnswer(question.id, inputValue.trim(), res.isCorrect, deltaSec);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setEvaluation(null);
    onClearAnswer(question.id);
  };

  const attemptedCount = Object.values(records).filter((r) => r.isAttempted).length;
  const correctCount = Object.values(records).filter((r) => r.isCorrect).length;

  return (
    <div className="space-y-6">
      {/* Bank Soal Navigation Grid (1-15) */}
      <section aria-label="Navigasi Daftar 15 Soal" className="rounded-xl border border-green-900/20 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-green-950">Bank Soal 1–15</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              {attemptedCount}/15 dikerjakan
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="font-mono-tabular text-green-800 font-semibold">
              {correctCount} benar
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenEvaluation}
            className="text-xs font-semibold text-orange-700 hover:text-orange-800 underline underline-offset-4 cursor-pointer"
          >
            Lihat Evaluasi Hasil Latihan
          </button>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-15 gap-2">
          {questions.map((q, idx) => {
            const rec = records[q.id];
            const isActive = idx === activeQuestionIndex;
            let statusClass = 'border-green-900/20 bg-white text-green-950 hover:border-orange-600';
            let statusWord = 'Belum dikerjakan';
            if (rec?.isAttempted) {
              if (rec.isCorrect) {
                statusClass = 'border-green-800 bg-green-900 text-white';
                statusWord = 'Benar';
              } else {
                statusClass = 'border-orange-600 bg-orange-50 text-orange-900';
                statusWord = 'Perlu ditinjau';
              }
            }
            if (isActive) {
              statusClass = 'border-orange-600 bg-orange-600 text-white ring-2 ring-orange-600/25';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                aria-label={`Soal ${q.id}, Level ${q.tier}, ${statusWord}`}
                aria-current={isActive ? 'step' : undefined}
                className={`h-11 rounded-lg border flex flex-col items-center justify-center transition-colors cursor-pointer ${statusClass}`}
              >
                <span className="font-mono-tabular text-xs font-bold leading-none">
                  {q.id}
                </span>
                <span className="text-[10px] opacity-80 leading-none mt-1">
                  L{q.tier}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Question Card */}
      <article className="rounded-xl border border-green-900/20 bg-white p-6 md:p-8 space-y-6">
        {/* Question Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-green-900/10 pb-4">
          <div>
            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-orange-700">
                Soal {question.id} dari {questions.length}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-green-950">{question.tierLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{question.competency}</span>
            </div>
            <h2 className="mt-1.5 text-xl md:text-2xl font-bold text-green-950 text-balance">
              {question.title}
            </h2>
          </div>

          <SpeakButton
            title={`Naskah Soal ${question.id}`}
            text={question.speechQuestion}
            voice={voice}
            label="Bacakan Soal"
          />
        </div>

        {/* Problem Statement + Stimulus Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-[15px] text-slate-800 leading-relaxed">
              <MathText text={question.prompt} />
            </div>

            <div className="rounded-lg border border-green-900/15 bg-green-950/[0.02] p-4">
              <div className="text-xs font-semibold text-green-950 mb-2">
                Ringkasan Data & Besaran Dicari
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-700">
                {question.givenSummary.map((item, i) => (
                  <span key={i}>
                    <MathText text={item} />
                  </span>
                ))}
                <span className="font-semibold text-orange-700">
                  Dicari: <InlineFormula latex={question.targetSymbol} /> ({question.unit})
                </span>
              </div>
            </div>

            {/* Numeric Answer Input Form */}
            <form onSubmit={handleCheckAnswer} className="rounded-xl border border-green-900/25 bg-white p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor={`answer-input-${question.id}`}
                  className="text-sm font-semibold text-green-950"
                >
                  Jawaban Numerik Anda
                </label>
                <span className="text-xs text-slate-500">
                  Format wajib: tepat 1 angka di belakang koma (contoh: 1,7 atau -13,4)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center flex-1 min-w-0 rounded-lg border border-green-900/30 bg-white focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-600/20 overflow-hidden">
                  <input
                    id={`answer-input-${question.id}`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Contoh: 2,0"
                    className="flex-1 min-w-0 px-3.5 py-2.5 text-base font-mono-tabular font-semibold text-green-950 bg-transparent focus:outline-none"
                  />
                  <span className="shrink-0 px-3.5 py-2.5 bg-green-950/[0.04] border-l border-green-900/15 text-xs font-semibold text-green-950 whitespace-nowrap">
                    Satuan: {question.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    PERIKSA JAWABAN
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3.5 py-2.5 rounded-lg border border-green-900/25 text-green-950 text-xs font-semibold hover:bg-green-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    KOSONGKAN
                  </button>
                </div>
              </div>

              {evaluation && (
                <div
                  role="status"
                  className={`rounded-lg border p-3.5 flex items-start gap-3 text-sm ${
                    evaluation.isCorrect
                      ? 'border-green-800/30 bg-green-50 text-green-950'
                      : 'border-orange-600/35 bg-orange-50/70 text-slate-800'
                  }`}
                >
                  {evaluation.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-800 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div className="space-y-1">
                    <div className="font-semibold text-xs">
                      {evaluation.isCorrect
                        ? 'Hasil Evaluasi: BENAR'
                        : evaluation.isValidFormat
                        ? 'Hasil Evaluasi: BELUM TEPAT'
                        : 'Validasi Format Jawaban'}
                    </div>
                    <p className="text-xs leading-relaxed">
                      <MathText text={evaluation.message} />
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Stimulus Column */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-green-950">
                Stimulus Visual Soal {question.id}
              </span>
              <SpeakButton
                title={`Stimulus Gambar Soal ${question.id}`}
                text={question.speechStimulus}
                voice={voice}
                label="Jelaskan Gambar"
                compact
              />
            </div>
            <StimulusVisual stimulus={question.stimulus} />
          </div>
        </div>

        {/* Previous / Next Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-green-900/10">
          <button
            type="button"
            disabled={activeQuestionIndex === 0}
            onClick={() => onSelectQuestion(activeQuestionIndex - 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-green-900/25 text-xs font-semibold text-green-950 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>SOAL SEBELUMNYA</span>
          </button>

          <button
            type="button"
            disabled={activeQuestionIndex === questions.length - 1}
            onClick={() => onSelectQuestion(activeQuestionIndex + 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-900 text-white text-xs font-semibold hover:bg-green-950 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>SOAL BERIKUTNYA</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </article>

      {/* Expandable Accordion Discussion System (Section F) */}
      <section aria-label="Pembahasan Bertahap Interaktif" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-green-950">
            Pembahasan Interaktif & Pembuktian Animasi (Buka-Tutup Mandiri)
          </h3>
          <span className="text-xs text-slate-500">
            Buka panel satu per satu untuk melatih penalaran sebelum melihat jawaban akhir
          </span>
        </div>

        {/* 1. LIHAT PETUNJUK */}
        <AccordionPanel
          title="LIHAT PETUNJUK"
          icon={<HelpCircle className="w-4 h-4 text-orange-600" aria-hidden="true" />}
          isOpen={openPanels.hint}
          onToggle={() => togglePanel('hint')}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-sm text-slate-800 leading-relaxed flex-1">
              <MathText text={question.hint} />
            </p>
            <SpeakButton
              title={`Petunjuk Soal ${question.id}`}
              text={question.hint}
              voice={voice}
              compact
            />
          </div>
        </AccordionPanel>

        {/* 2. LIHAT KONSEP FISIKA */}
        <AccordionPanel
          title="LIHAT KONSEP FISIKA"
          icon={<BookOpen className="w-4 h-4 text-green-800" aria-hidden="true" />}
          isOpen={openPanels.concept}
          onToggle={() => togglePanel('concept')}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-sm text-slate-800 leading-relaxed flex-1">
              <MathText text={question.physicsConcept} />
            </p>
            <SpeakButton
              title={`Konsep Fisika Soal ${question.id}`}
              text={question.physicsConcept}
              voice={voice}
              compact
            />
          </div>
        </AccordionPanel>

        {/* 3. LIHAT DIAGRAM / FBD */}
        <AccordionPanel
          title="LIHAT DIAGRAM / FBD"
          icon={<Compass className="w-4 h-4 text-green-800" aria-hidden="true" />}
          isOpen={openPanels.fbd}
          onToggle={() => togglePanel('fbd')}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-6">
              <StimulusVisual stimulus={question.stimulus} showFbdOverlay />
            </div>
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-green-950">
                  Analisis Free Body Diagram & Vektor Sistem
                </h4>
                <SpeakButton
                  title={`Penjelasan FBD Soal ${question.id}`}
                  text={question.speechFbd}
                  voice={voice}
                  compact
                />
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                <MathText text={question.fbdExplanation} />
              </p>
            </div>
          </div>
        </AccordionPanel>

        {/* 4. LIHAT RUMUS */}
        <AccordionPanel
          title="LIHAT RUMUS"
          icon={<Calculator className="w-4 h-4 text-orange-600" aria-hidden="true" />}
          isOpen={openPanels.formulas}
          onToggle={() => togglePanel('formulas')}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-green-950">
                Persamaan Utama yang Digunakan
              </span>
              <SpeakButton
                title={`Rumus Soal ${question.id}`}
                text={question.mainFormulas.join('. ')}
                voice={voice}
                compact
              />
            </div>
            {question.mainFormulas.map((latex, i) => (
              <div key={i} className="rounded-lg border border-orange-600/25 bg-orange-50/40 px-4 py-2.5">
                <DisplayFormula latex={latex} />
              </div>
            ))}
          </div>
        </AccordionPanel>

        {/* 5. LIHAT LANGKAH PENYELESAIAN (Tahap 1-6) */}
        <AccordionPanel
          title="LIHAT LANGKAH PENYELESAIAN"
          icon={<ListChecks className="w-4 h-4 text-green-800" aria-hidden="true" />}
          isOpen={openPanels.steps}
          onToggle={() => togglePanel('steps')}
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <SpeakButton
                title={`Langkah Penyelesaian Soal ${question.id}`}
                text={question.speechSolution}
                voice={voice}
                label="Dengarkan Langkah Penyelesaian"
                compact
              />
            </div>
            {question.solutionStages.slice(0, 6).map((st) => (
              <StageBlock key={st.stageNumber} stage={st} voice={voice} questionId={question.id} />
            ))}
          </div>
        </AccordionPanel>

        {/* 6. LIHAT PEMBAHASAN LENGKAP (Tahap 1-7 + Animasi Pembuktian) */}
        <AccordionPanel
          title="LIHAT PEMBAHASAN LENGKAP"
          icon={<Layers className="w-4 h-4 text-orange-600" aria-hidden="true" />}
          isOpen={openPanels.full}
          onToggle={() => togglePanel('full')}
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-green-900/10 pb-3">
              <span className="text-xs font-bold text-green-950">
                Pembahasan Buku Teks 7 Tahap + Animasi Pembuktian Fenomena Fisika
              </span>
              <SpeakButton
                title={`Pembahasan Lengkap Soal ${question.id}`}
                text={`${question.speechSolution} ${question.speechConclusion}`}
                voice={voice}
                label="Bacakan Pembahasan Lengkap"
                compact
              />
            </div>

            <PhysicsSimulation
              title={`Animasi Pembuktian Fenomena Fisika — Soal ${question.id}`}
              initialParams={question.simulationPreset}
              compact
            />

            <div className="space-y-4">
              {question.solutionStages.map((st) => (
                <StageBlock key={st.stageNumber} stage={st} voice={voice} questionId={question.id} />
              ))}
            </div>
          </div>
        </AccordionPanel>

        {/* 7. LIHAT JAWABAN AKHIR */}
        <AccordionPanel
          title="LIHAT JAWABAN AKHIR"
          icon={<Award className="w-4 h-4 text-orange-600" aria-hidden="true" />}
          isOpen={openPanels.finalAnswer}
          onToggle={() => togglePanel('finalAnswer')}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-orange-600/35 bg-orange-50/60 p-4">
            <div>
              <div className="text-xs font-semibold text-orange-800">
                Tahap 7 · Jawaban Akhir Numerik (Satu Angka di Belakang Koma)
              </div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl font-mono-tabular font-bold text-green-950">
                  {question.expectedAnswer}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {question.unit}
                </span>
              </div>
            </div>

            <SpeakButton
              title={`Kesimpulan Jawaban Soal ${question.id}`}
              text={question.speechConclusion}
              voice={voice}
              label="Bacakan Jawaban Akhir"
              compact
            />
          </div>
        </AccordionPanel>
      </section>
    </div>
  );
};

interface AccordionPanelProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="rounded-xl border border-green-900/20 bg-white overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-green-50/60 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2.5 text-xs font-bold tracking-wide text-green-950">
          {icon}
          <span>{title}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-green-900 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-green-900/10">
          {children}
        </div>
      )}
    </div>
  );
};

const StageBlock: React.FC<{
  stage: PhysicsQuestion['solutionStages'][number];
  voice: MisterJoVoiceState;
  questionId: number;
}> = ({ stage, voice, questionId }) => {
  return (
    <div className="rounded-lg border border-green-900/15 bg-white p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-xs font-bold text-green-950">
          Tahap {stage.stageNumber} – {stage.title}
        </h5>
        <SpeakButton
          title={`Soal ${questionId} Tahap ${stage.stageNumber}`}
          text={`${stage.title}. ${stage.body} ${stage.highlightLatex || ''}`}
          voice={voice}
          label="Bacakan Tahap"
          compact
        />
      </div>
      <p className="text-sm text-slate-800 leading-relaxed">
        <MathText text={stage.body} />
      </p>
      {stage.highlightLatex && (
        <div className="rounded-md border border-orange-600/25 bg-orange-50/40 px-3 py-2">
          <DisplayFormula latex={stage.highlightLatex} />
        </div>
      )}
    </div>
  );
};
