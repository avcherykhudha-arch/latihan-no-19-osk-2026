export function sanitizeForSpeech(rawText: string): string {
  let text = rawText;

  // Strip display/inline math delimiters
  text = text.replace(/\$\$/g, ' ').replace(/\$/g, ' ');

  // Common LaTeX constructs in physics problems
  const replacements: Array<[RegExp, string]> = [
    [/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, ' $1 dibagi $2 '],
    [/\\sqrt\{([^{}]+)\}/g, ' akar $1 '],
    [/\\left\(/g, ' '],
    [/\\right\)/g, ' '],
    [/\\left\[/g, ' '],
    [/\\right\]/g, ' '],
    [/\\times/g, ' kali '],
    [/\\cdot/g, ' kali '],
    [/\\approx/g, ' kira-kira sama dengan '],
    [/\\neq/g, ' tidak sama dengan '],
    [/\\le/g, ' kurang dari atau sama dengan '],
    [/\\ge/g, ' lebih dari atau sama dengan '],
    [/\\ll/g, ' jauh lebih kecil dari '],
    [/\\to/g, ' menuju '],
    [/\\implies/g, ' sehingga diperoleh '],
    [/\\Rightarrow/g, ' maka '],
    [/\\alpha_0/g, ' alfa nol '],
    [/\\alpha_1/g, ' alfa satu '],
    [/\\alpha_2/g, ' alfa dua '],
    [/\\alpha/g, ' alfa '],
    [/\\theta_0/g, ' teta nol '],
    [/\\theta_\{\\max\}|\\theta_max/g, ' teta maksimum '],
    [/\\theta/g, ' teta '],
    [/\\omega_0/g, ' omega nol '],
    [/\\omega/g, ' omega '],
    [/\\Delta/g, ' delta '],
    [/\\ell_\{\\text\{eff\}\}|\\ell_eff/g, ' panjang efektif l '],
    [/\\ell/g, ' panjang tali l '],
    [/\\pi/g, ' pi '],
    [/\\phi/g, ' fi '],
    [/\\tau/g, ' torsi '],
    [/\\sin/g, ' sinus '],
    [/\\cos/g, ' kosinus '],
    [/\\tan/g, ' tangen '],
    [/\\sec/g, ' sekan '],
    [/\\arctan/g, ' arkus tangen '],
    [/\\vec\{([^{}]+)\}/g, ' vektor $1 '],
    [/\\text\{([^{}]+)\}/g, ' $1 '],
    [/\\parallel/g, ' sejajar bidang '],
    [/\\perp/g, ' tegak lurus bidang '],
    [/\^2/g, ' kuadrat '],
    [/\^\{1\/2\}/g, ' pangkat setengah '],
    [/\^\{1\/4\}/g, ' pangkat seperempat '],
    [/\^\{([^{}]+)\}/g, ' pangkat $1 '],
    [/_\{([^{}]+)\}/g, ' $1 '],
    [/_([a-zA-Z0-9])/g, ' $1 '],
    [/\bm\/s\^2\b|m\/s kuadrat/gi, ' meter per sekon kuadrat '],
    [/\bm\/s\b/g, ' meter per sekon '],
    [/\brad\/s\b/g, ' radian per sekon '],
    [/\bkg\\cdot m\^2\b|\bkg m\^2\b/g, ' kilogram meter kuadrat '],
    [/\\,/g, ' '],
    [/\\;/g, ' '],
    [/\\quad/g, ' '],
    [/[{}]/g, ' '],
    [/\\/g, ' '],
  ];

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  // Handle decimal commas for natural Indonesian reading (e.g., "12,5" -> "12 koma 5")
  text = text.replace(/(-?\d+),(\d+)/g, '$1 koma $2');

  // Clean extra spaces
  return text.replace(/\s+/g, ' ').trim();
}
