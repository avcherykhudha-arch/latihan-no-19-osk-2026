export type AnswerFeedbackType =
  | 'empty'
  | 'dot_instead_of_comma'
  | 'missing_one_decimal'
  | 'invalid_number'
  | 'correct'
  | 'close'
  | 'incorrect';

export interface AnswerEvaluationResult {
  isValidFormat: boolean;
  parsedValue: number | null;
  isCorrect: boolean;
  feedbackType: AnswerFeedbackType;
  message: string;
}

const EXACT_ONE_DECIMAL_COMMA_REGEX = /^-?\d+,\d$/;

export function hasExactOneDecimalComma(raw: string): boolean {
  const trimmed = raw.trim();
  return EXACT_ONE_DECIMAL_COMMA_REGEX.test(trimmed);
}

export function parseIndonesianDecimal(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.includes('.')) {
    return null;
  }
  if (!/^-?\d+(,\d+)?$/.test(trimmed)) {
    return null;
  }
  const normalized = trimmed.replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

export function formatIndonesianOneDecimal(value: number): string {
  const rounded = Math.round((value + Number.EPSILON) * 10) / 10;
  const fixed = Object.is(rounded, -0) ? '0.0' : rounded.toFixed(1);
  return fixed.replace('.', ',');
}

export function evaluateNumericAnswer(
  rawInput: string,
  expectedValue: number,
  tolerance: number
): AnswerEvaluationResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isValidFormat: false,
      parsedValue: null,
      isCorrect: false,
      feedbackType: 'empty',
      message: 'Masukkan nilai numerik terlebih dahulu sebelum memeriksa jawaban.',
    };
  }

  if (trimmed.includes('.')) {
    return {
      isValidFormat: false,
      parsedValue: null,
      isCorrect: false,
      feedbackType: 'dot_instead_of_comma',
      message: 'Gunakan tanda koma (,) sebagai pemisah desimal, bukan tanda titik (.), misalnya 12,5.',
    };
  }

  if (!/^-?\d+(,\d+)?$/.test(trimmed)) {
    return {
      isValidFormat: false,
      parsedValue: null,
      isCorrect: false,
      feedbackType: 'invalid_number',
      message: 'Format input tidak valid. Masukkan angka dengan satu angka di belakang koma (contoh: 1,7 atau -13,4).',
    };
  }

  if (!hasExactOneDecimalComma(trimmed)) {
    return {
      isValidFormat: false,
      parsedValue: parseIndonesianDecimal(trimmed),
      isCorrect: false,
      feedbackType: 'missing_one_decimal',
      message: 'Aturan penulisan wajib tepat satu angka di belakang koma menggunakan koma (contoh: 2,0 atau 0,8).',
    };
  }

  const parsedValue = parseIndonesianDecimal(trimmed);
  if (parsedValue === null) {
    return {
      isValidFormat: false,
      parsedValue: null,
      isCorrect: false,
      feedbackType: 'invalid_number',
      message: 'Angka tidak dapat diproses. Pastikan hanya berisi digit dan satu tanda koma.',
    };
  }

  const diff = Math.abs(parsedValue - expectedValue);
  if (diff <= tolerance + 1e-9) {
    return {
      isValidFormat: true,
      parsedValue,
      isCorrect: true,
      feedbackType: 'correct',
      message: 'Tepat sekali! Jawaban numerik Anda sesuai dengan analisis Fisika sistem.',
    };
  }

  if (diff <= Math.max(tolerance * 3, 0.35)) {
    return {
      isValidFormat: true,
      parsedValue,
      isCorrect: false,
      feedbackType: 'close',
      message: 'Belum tepat, namun nilai Anda sudah mendekati. Periksa kembali pembulatan, sudut $\\alpha$, atau faktor akar.',
    };
  }

  return {
    isValidFormat: true,
    parsedValue,
    isCorrect: false,
    feedbackType: 'incorrect',
    message: 'Belum tepat. Buka Petunjuk atau Konsep Fisika secara bertahap untuk meninjau ulang langkah analisisnya.',
  };
}
