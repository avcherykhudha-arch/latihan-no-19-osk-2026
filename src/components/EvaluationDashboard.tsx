import React from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { PhysicsQuestion } from '../data/questions';
import {
  computeEvaluationSummary,
  QuestionAttemptRecord,
} from '../utils/evaluation';
import { MisterJoVoiceState } from '../hooks/useMisterJoTTS';
import { SpeakButton } from './MisterJoVoiceBar';
import { MathText } from './MathText';

interface EvaluationDashboardProps {
  questions: PhysicsQuestion[];
  records: Record<number, QuestionAttemptRecord>;
  onJumpToQuestion: (index: number) => void;
  onResetProgress: () => void;
  voice: MisterJoVoiceState;
}

function formatDuration(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  if (mins === 0) return `${secs} detik`;
  return `${mins} menit ${secs} detik`;
}

export const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({
  questions,
  records,
  onJumpToQuestion,
  onResetProgress,
  voice,
}) => {
  const summary = computeEvaluationSummary(
    records,
    questions.map((q) => ({ id: q.id, tier: q.tier, competency: q.competency }))
  );

  const speechSummary = `Evaluasi hasil latihan OSK Physics Challenge 2026. Anda telah mengerjakan ${summary.attemptedCount} dari ${summary.totalQuestions} soal, dengan ${summary.correctCount} jawaban benar dan ${summary.wrongCount} jawaban belum tepat. Nilai akhir Anda adalah ${summary.finalScore}. ${summary.conceptAnalysis}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-green-900/15 pb-5">
        <div>
          <p className="text-xs font-semibold text-orange-700">
            Dashboard Hasil Latihan · Kompetensi Soal 19 OSK 2026
          </p>
          <h2 className="mt-1 text-2xl font-bold text-green-950">
            Evaluasi Penguasaan Konsep & Analitik Belajar
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <SpeakButton
            title="Ringkasan Evaluasi Hasil Belajar"
            text={speechSummary}
            voice={voice}
            label="Bacakan Evaluasi"
          />
          <button
            type="button"
            onClick={onResetProgress}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-green-900/25 text-xs font-semibold text-green-950 hover:bg-green-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Progres</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <section aria-label="Ringkasan Skor Latihan" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Dikerjakan" value={`${summary.attemptedCount}/${summary.totalQuestions}`} />
        <KpiCard label="Jawaban Benar" value={String(summary.correctCount)} accent="green" />
        <KpiCard label="Jawaban Salah" value={String(summary.wrongCount)} accent="orange" />
        <KpiCard label="Persentase Sukses" value={`${summary.successPercentage}%`} />
        <KpiCard label="Nilai Akhir" value={`${summary.finalScore}/100`} accent="orange" />
        <KpiCard label="Waktu Pengerjaan" value={formatDuration(summary.totalTimeSec)} />
      </section>

      {/* Competency Breakdown by Tier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 rounded-xl border border-green-900/20 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-green-950">
              Peta Penguasaan Per Level Kesulitan
            </h3>
            <span className="text-xs font-semibold text-orange-700">
              Status: {summary.masteryLevel}
            </span>
          </div>

          <div className="space-y-4">
            {summary.tierSummaries.map((t) => {
              const barPct = Math.round((t.correct / t.total) * 100);
              return (
                <div key={t.tier} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-green-950">
                      Level {t.tier} · {t.label}
                    </span>
                    <span className="font-mono-tabular text-slate-600">
                      {t.correct}/{t.total} benar ({t.attempted} dicoba)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-green-900/10 overflow-hidden">
                    <div
                      className="h-full bg-orange-600 transition-all duration-300"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Conceptual Analysis & Recommendations */}
        <section className="lg:col-span-5 rounded-xl border border-green-900/20 bg-white p-6 space-y-4">
          <h3 className="text-base font-bold text-green-950">
            Analisis Konsep & Rekomendasi MISTER JO
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {summary.conceptAnalysis}
          </p>
          <div className="border-t border-green-900/10 pt-3">
            <div className="text-xs font-bold text-green-950 mb-2">
              Rekomendasi Materi Pendalaman
            </div>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc pl-4">
              {summary.recommendations.map((rec, i) => (
                <li key={i}>
                  <MathText text={rec} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Per-Question Status Table */}
      <section className="rounded-xl border border-green-900/20 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-green-900/15">
          <h3 className="text-base font-bold text-green-950">
            Rincian Status 15 Soal Latihan
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-green-950/[0.03] text-green-950 border-b border-green-900/15">
              <tr>
                <th className="py-2.5 px-4 text-left font-semibold">No</th>
                <th className="py-2.5 px-4 text-left font-semibold">Topik & Kompetensi</th>
                <th className="py-2.5 px-4 text-left font-semibold">Jawaban Anda</th>
                <th className="py-2.5 px-4 text-left font-semibold">Status</th>
                <th className="py-2.5 px-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-900/10">
              {questions.map((q, idx) => {
                const rec = records[q.id];
                return (
                  <tr key={q.id} className="hover:bg-green-50/40">
                    <td className="py-2.5 px-4 font-mono-tabular font-bold text-green-950">
                      {q.id}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-green-950">{q.title}</div>
                      <div className="text-slate-500">{q.tierLabel}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono-tabular text-slate-800">
                      {rec?.isAttempted ? `${rec.userInput} ${q.unit}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 font-semibold">
                      {!rec?.isAttempted ? (
                        <span className="text-slate-500">Belum dikerjakan</span>
                      ) : rec.isCorrect ? (
                        <span className="text-green-800">Benar</span>
                      ) : (
                        <span className="text-orange-700">Perlu diperbaiki</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onJumpToQuestion(idx)}
                        className="inline-flex items-center gap-1 text-orange-700 hover:text-orange-800 font-semibold cursor-pointer"
                      >
                        <span>Buka Soal</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const KpiCard: React.FC<{
  label: string;
  value: string;
  accent?: 'green' | 'orange';
}> = ({ label, value, accent }) => {
  const valueClass =
    accent === 'orange'
      ? 'text-orange-700'
      : accent === 'green'
      ? 'text-green-800'
      : 'text-green-950';

  return (
    <div className="rounded-xl border border-green-900/20 bg-white p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 text-xl font-mono-tabular font-bold ${valueClass}`}>
        {value}
      </div>
    </div>
  );
};
