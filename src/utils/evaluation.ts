export interface QuestionAttemptRecord {
  questionId: number;
  userInput: string;
  isAttempted: boolean;
  isCorrect: boolean;
  attemptsCount: number;
  timeSpentSec: number;
}

export interface TierSummary {
  tier: number;
  label: string;
  total: number;
  attempted: number;
  correct: number;
  accuracyPercent: number;
}

export interface EvaluationSummary {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  successPercentage: number;
  finalScore: number;
  totalTimeSec: number;
  tierSummaries: TierSummary[];
  masteryLevel: string;
  conceptAnalysis: string;
  recommendations: string[];
}

export const TIER_LABELS: Record<number, string> = {
  1: 'Fondasi Konsep & Pemahaman Dasar',
  2: 'Penerapan Prinsip & Persamaan Fisika',
  3: 'Analisis Hubungan Antarbesaran & Fenomena',
  4: 'Penalaran Tingkat Lanjut & Multi-Langkah',
  5: 'Tantangan HOTS Tingkat Olimpiade Kota',
};

export function computeEvaluationSummary(
  records: Record<number, QuestionAttemptRecord>,
  questionTiers: Array<{ id: number; tier: number; competency: string }>
): EvaluationSummary {
  const totalQuestions = questionTiers.length;
  let attemptedCount = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let totalTimeSec = 0;

  const tierMap: Record<number, { total: number; attempted: number; correct: number }> = {
    1: { total: 0, attempted: 0, correct: 0 },
    2: { total: 0, attempted: 0, correct: 0 },
    3: { total: 0, attempted: 0, correct: 0 },
    4: { total: 0, attempted: 0, correct: 0 },
    5: { total: 0, attempted: 0, correct: 0 },
  };

  for (const q of questionTiers) {
    tierMap[q.tier].total += 1;
    const rec = records[q.id];
    if (rec) {
      totalTimeSec += rec.timeSpentSec || 0;
      if (rec.isAttempted) {
        attemptedCount += 1;
        tierMap[q.tier].attempted += 1;
        if (rec.isCorrect) {
          correctCount += 1;
          tierMap[q.tier].correct += 1;
        } else {
          wrongCount += 1;
        }
      }
    }
  }

  const unansweredCount = totalQuestions - attemptedCount;
  const successPercentage =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const finalScore = Math.round((correctCount / totalQuestions) * 100);

  const tierSummaries: TierSummary[] = [1, 2, 3, 4, 5].map((tier) => {
    const stats = tierMap[tier];
    return {
      tier,
      label: TIER_LABELS[tier],
      total: stats.total,
      attempted: stats.attempted,
      correct: stats.correct,
      accuracyPercent:
        stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
    };
  });

  let masteryLevel = 'Tahap Awal';
  if (finalScore >= 85) {
    masteryLevel = 'Siap Juara OSK';
  } else if (finalScore >= 65) {
    masteryLevel = 'Kompeten Olimpiade';
  } else if (finalScore >= 40) {
    masteryLevel = 'Berkembang Stabil';
  }

  let conceptAnalysis =
    'Mulailah mengerjakan soal secara bertahap dari Level 1 hingga Level 5 sambil membandingkan hasil hitungan dengan Simulasi Animasi.';
  if (attemptedCount > 0) {
    const weakTiers = tierSummaries.filter((t) => t.attempted > 0 && t.accuracyPercent < 67);
    if (weakTiers.length === 0 && attemptedCount === totalQuestions) {
      conceptAnalysis =
        'Penguasaan konsep bandul fisis segitiga Anda sangat solid, mulai dari identifikasi pusat massa, momen inersia sistem, hingga variasi HOTS seperti tumbukan tak lenting dan kerangka dipercepat.';
    } else if (weakTiers.length > 0) {
      const names = weakTiers.map((t) => `Level ${t.tier} (${t.label})`).join(', ');
      conceptAnalysis = `Anda menunjukkan pemahaman baik pada sebagian topik, namun masih perlu penguatan khusus pada ${names}. Periksa kembali apakah jarak pusat massa dan sumbu putar sudah ditentukan dengan tepat sebelum menulis persamaan osilasi.`;
    } else {
      conceptAnalysis = `Progres Anda sangat menjanjikan (${correctCount} benar dari ${attemptedCount} soal dicoba). Lanjutkan menyelesaikan soal-soal tersisa pada level yang lebih tinggi untuk menguji ketangguhan penalaran multi-langkah.`;
    }
  }

  const recommendations: string[] = [];
  if (tierSummaries[0].correct < tierSummaries[0].total) {
    recommendations.push(
      'Tinjau ulang Materi Teori Bagian 5 & 6 mengenai penurunan jarak pusat massa $d_{\\text{cm}} = \\ell\\cos\\alpha$ dan momen inersia $I = 2m\\ell^2$.'
    );
  }
  if (tierSummaries[1].correct < tierSummaries[1].total) {
    recommendations.push(
      'Latih kembali Diagram Benda Bebas (FBD) keseimbangan statis pada Soal 6 dan rasio $f(s)/f(0) = \\sqrt{\\cos\\alpha}$ pada Soal 4.'
    );
  }
  if (tierSummaries[2].correct < tierSummaries[2].total) {
    recommendations.push(
      'Bandingkan mode osilasi di dalam bidang segitiga (Soal 19) dengan mode tegak lurus bidang pada menu Simulasi Animasi untuk memantapkan konsep momen inersia terhadap sumbu berbeda.'
    );
  }
  if (tierSummaries[3].correct < tierSummaries[3].total) {
    recommendations.push(
      'Pada kasus asimetris dan batang bermassa (Soal 10–12), selalu hitung momen inersia total dengan Teorema Sumbu Sejajar dan resultan gravitasi efektif $g_{\\text{eff}}$.'
    );
  }
  if (tierSummaries[4].correct < tierSummaries[4].total) {
    recommendations.push(
      'Untuk soal HOTS (Soal 13–15), gabungkan kekekalan momentum sudut sesaat saat tumbukan atau ekspansi energi potensial orde kedua sebelum mencari frekuensi sudut osilasi.'
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      'Pertahankan ketelitian numerik satu angka desimal dan coba uji variasi parameter ekstrem pada Lab Simulasi Animasi.'
    );
  }

  return {
    totalQuestions,
    attemptedCount,
    correctCount,
    wrongCount,
    unansweredCount,
    successPercentage,
    finalScore,
    totalTimeSec,
    tierSummaries,
    masteryLevel,
    conceptAnalysis,
    recommendations,
  };
}
