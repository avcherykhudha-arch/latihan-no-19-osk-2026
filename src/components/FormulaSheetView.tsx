import React from 'react';
import { FORMULA_SHEET } from '../data/theoryContent';
import { MisterJoVoiceState } from '../hooks/useMisterJoTTS';
import { SpeakButton } from './MisterJoVoiceBar';
import { DisplayFormula, InlineFormula } from './MathText';

interface FormulaSheetViewProps {
  voice: MisterJoVoiceState;
}

export const FormulaSheetView: React.FC<FormulaSheetViewProps> = ({ voice }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-green-900/15 pb-5">
        <div>
          <p className="text-xs font-semibold text-orange-700">
            Referensi Matematis · Bandul Fisis Segitiga
          </p>
          <h2 className="mt-1 text-2xl font-bold text-green-950">
            Kumpulan Rumus Penting & Analisis Dimensi
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            Setiap persamaan dilengkapi kondisi berlakunya, makna fisis simbol, satuan SI, dan dimensi agar siap diterapkan pada seluruh 15 soal latihan.
          </p>
        </div>

        <SpeakButton
          title="Ringkasan Rumus Penting Soal 19"
          text="Menu Rumus Penting merangkum seluruh persamaan kunci untuk sistem bandul segitiga terhubung batang, mulai dari geometri kosinus alfa, frekuensi f s, tegangan tali dan gaya tekan tongkat, mode tegak lurus bidang, hingga variasi lanjutan."
          voice={voice}
          label="Bacakan Ringkasan"
        />
      </div>

      <div className="space-y-5">
        {FORMULA_SHEET.map((item) => (
          <section
            key={item.id}
            className="rounded-xl border border-green-900/20 bg-white p-6 space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-green-950">{item.name}</h3>
                <p className="mt-0.5 text-xs text-slate-600">
                  Syarat berlaku: {item.condition}
                </p>
              </div>
              <SpeakButton
                title={item.name}
                text={item.speechScript}
                voice={voice}
                label="Dengarkan Penjelasan"
                compact
              />
            </div>

            <div className="rounded-lg border border-orange-600/25 bg-orange-50/40 px-4 py-3">
              <DisplayFormula latex={item.latex} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-green-900/15 text-green-950">
                    <th className="py-2 pr-4 text-left font-semibold">Simbol</th>
                    <th className="py-2 pr-4 text-left font-semibold">Makna Besaran</th>
                    <th className="py-2 pr-4 text-left font-semibold">Satuan SI</th>
                    <th className="py-2 text-left font-semibold">Dimensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-900/10">
                  {item.symbols.map((sym, idx) => (
                    <tr key={idx}>
                      <td className="py-2 pr-4 font-medium text-green-950">
                        <InlineFormula latex={sym.symbol} />
                      </td>
                      <td className="py-2 pr-4 text-slate-700">{sym.meaning}</td>
                      <td className="py-2 pr-4 font-mono-tabular text-slate-800">{sym.unit}</td>
                      <td className="py-2 font-mono-tabular text-orange-700">
                        <InlineFormula latex={sym.dimension} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
