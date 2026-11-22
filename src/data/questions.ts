import { SimulationParams } from '../utils/physicsModel';

export type StimulusType =
  | 'geometry'
  | 'equivalent-length'
  | 'omega-setup'
  | 'graph-ratio'
  | 'energy-swing'
  | 'fbd-equilibrium'
  | 'experiment-table-graph'
  | 'modes-3d'
  | 'thermal-rod'
  | 'asymmetric-triangle'
  | 'massive-rod'
  | 'accelerated-train'
  | 'spring-triangle'
  | 'midpoint-mass'
  | 'inelastic-collision';

export interface StimulusConfig {
  type: StimulusType;
  caption: string;
  labels: Record<string, string>;
  tableData?: Array<{ secAlpha: string; tSquared: string }>;
}

export interface SolutionStage {
  stageNumber: number;
  title: string;
  body: string;
  highlightLatex?: string;
}

export interface PhysicsQuestion {
  id: number;
  tier: 1 | 2 | 3 | 4 | 5;
  tierLabel: string;
  title: string;
  competency: string;
  prompt: string;
  givenSummary: string[];
  targetSymbol: string;
  unit: string;
  expectedAnswer: string;
  numericValue: number;
  tolerance: number;
  stimulus: StimulusConfig;
  simulationPreset: SimulationParams;
  hint: string;
  physicsConcept: string;
  fbdExplanation: string;
  mainFormulas: string[];
  solutionStages: SolutionStage[];
  speechQuestion: string;
  speechStimulus: string;
  speechFbd: string;
  speechSolution: string;
  speechConclusion: string;
}

export const QUESTIONS: PhysicsQuestion[] = [
  {
    id: 1,
    tier: 1,
    tierLabel: 'Level 1 · Fondasi Konsep',
    title: 'Geometri Kesetimbangan dan Kedalaman Pusat Massa',
    competency: 'Menentukan posisi pusat massa sistem dua pendulum terhubung tongkat',
    prompt:
      'Dua buah pendulum identik dengan panjang tali $\\ell = 2{,}5\\text{ m}$ dan massa masing-masing $m = 1{,}2\\text{ kg}$ digantung pada satu poros yang sama, lalu dihubungkan oleh tongkat kaku tak bermassa sepanjang $s = 3{,}0\\text{ m}$. Hitung jarak vertikal pusat massa sistem terhadap poros gantung saat sistem diam di posisi setimbang!',
    givenSummary: ['$\\ell = 2{,}5\\text{ m}$', '$m = 1{,}2\\text{ kg}$', '$s = 3{,}0\\text{ m}$'],
    targetSymbol: 'd_{\\text{cm}}',
    unit: 'm',
    expectedAnswer: '2,0',
    numericValue: 2.0,
    tolerance: 0.05,
    stimulus: {
      type: 'geometry',
      caption: 'Segitiga samakaki simetris dengan sisi miring l = 2,5 m dan alas tongkat s = 3,0 m.',
      labels: { ell: 'l = 2,5 m', s: 's = 3,0 m', m: 'm = 1,2 kg', alpha: 'α' },
    },
    simulationPreset: {
      mode: 'triangle-inplane',
      m: 1.2,
      m2: 1.2,
      mb: 0,
      ell: 2.5,
      s: 3.0,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Bagi dua segitiga samakaki sepanjang garis vertikal tengah dari poros ke titik tengah tongkat $s$. Gunakan teorema Pythagoras atau trigonometri $\\sin\\alpha = s/(2\\ell)$.',
    physicsConcept:
      'Karena kedua massa identik dan tali sama panjang, sistem simetris terhadap garis vertikal melalui poros. Pusat massa terletak tepat di titik tengah tongkat penghubung $s$.',
    fbdExplanation:
      'Pada posisi setimbang, sumbu simetri segitiga berimpit dengan sumbu-$y$ vertikal. Garis hubung dari poros $O$ ke pusat massa $CM$ membagi tongkat $s$ menjadi dua segmen sama panjang $s/2 = 1{,}5\\text{ m}$ secara tegak lurus.',
    mainFormulas: [
      '\\sin\\alpha = \\frac{s}{2\\ell}',
      'd_{\\text{cm}} = \\ell\\cos\\alpha = \\sqrt{\\ell^2 - \\left(\\frac{s}{2}\\right)^2}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Dua massa identik $m = 1{,}2\\text{ kg}$ digantung pada satu poros dengan tali $\\ell = 2{,}5\\text{ m}$ dan dipisahkan tongkat $s = 3{,}0\\text{ m}$. Yang ditanyakan adalah jarak vertikal pusat massa sistem dari poros ($d_{\\text{cm}}$).',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Titik pusat massa dua partikel bermassa sama terletak tepat di tengah ruas garis penghubungnya. Karena segitiga $O\\text{-}m_1\\text{-}m_2$ samakaki, garis dari poros $O$ ke titik tengah alas $s$ tegak lurus alas.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Segitiga siku-siku terbentuk dengan sisi miring $\\ell = 2{,}5\\text{ m}$, sisi alas datar $s/2 = 1{,}5\\text{ m}$, dan tinggi vertikal $d_{\\text{cm}}$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Berdasarkan teorema Pythagoras pada setengah segitiga simetris:',
        highlightLatex: 'd_{\\text{cm}} = \\sqrt{\\ell^2 - \\left(\\frac{s}{2}\\right)^2}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Substitusikan nilai $\\ell = 2{,}5\\text{ m}$ dan $s/2 = 1{,}5\\text{ m}$:',
        highlightLatex: 'd_{\\text{cm}} = \\sqrt{(2{,}5)^2 - (1{,}5)^2} = \\sqrt{6{,}25 - 2{,}25} = \\sqrt{4{,}00} = 2{,}0\\text{ m}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Dimensi $[L]$ bersatuan meter konsisten. Secara fisis $d_{\\text{cm}} = 2{,}0\\text{ m} < \\ell = 2{,}5\\text{ m}$ (tripel Pythagoras $3\\text{-}4\\text{-}5$ berskala $0{,}5$), sangat masuk akal.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Jarak vertikal pusat massa terhadap poros gantung adalah:',
        highlightLatex: 'd_{\\text{cm}} = 2{,}0\\text{ m}',
      },
    ],
    speechQuestion:
      'Soal nomor 1. Dua pendulum identik dengan panjang tali l sama dengan 2 koma 5 meter dan massa masing-masing 1 koma 2 kilogram digantung pada satu poros, lalu dihubungkan tongkat tak bermassa sepanjang s sama dengan 3 koma 0 meter. Hitung jarak vertikal pusat massa sistem terhadap poros gantung saat setimbang.',
    speechStimulus:
      'Diagram menunjukkan segitiga sama kaki dengan sisi miring l 2 koma 5 meter dan alas s 3 koma 0 meter, sehingga setengah alasnya adalah 1 koma 5 meter.',
    speechFbd:
      'Pada posisi setimbang, titik pusat massa berada tepat di tengah tongkat s pada sumbu simetri vertikal.',
    speechSolution:
      'Dengan teorema Pythagoras pada setengah segitiga, d cm sama dengan akar l kuadrat minus setengah s kuadrat, yakni akar 6 koma 25 dikurangi 2 koma 25 sama dengan akar 4, yaitu 2 koma 0 meter.',
    speechConclusion: 'Jawaban akhir soal nomor 1 adalah 2 koma 0 meter.',
  },
  {
    id: 2,
    tier: 1,
    tierLabel: 'Level 1 · Fondasi Konsep',
    title: 'Momen Inersia dan Panjang Efektif Bandul Segitiga',
    competency: 'Menghubungkan momen inersia dan jarak pusat massa menjadi panjang efektif bandul',
    prompt:
      'Dua partikel bermassa masing-masing $m = 0{,}5\\text{ kg}$ digantung pada satu poros yang sama dengan tali ringan panjang $\\ell = 2{,}0\\text{ m}$ dan dihubungkan oleh tongkat tak bermassa sepanjang $s = 2{,}4\\text{ m}$. Jika sistem berosilasi kecil di dalam bidang segitiga, tentukan panjang efektif bandul sederhana ekivalen ($\\ell_{\\text{eff}} = \\frac{I}{M_{\\text{tot}} d_{\\text{cm}}}$) sistem tersebut!',
    givenSummary: ['$\\ell = 2{,}0\\text{ m}$', '$m = 0{,}5\\text{ kg}$', '$s = 2{,}4\\text{ m}$'],
    targetSymbol: '\\ell_{\\text{eff}}',
    unit: 'm',
    expectedAnswer: '2,5',
    numericValue: 2.5,
    tolerance: 0.05,
    stimulus: {
      type: 'equivalent-length',
      caption: 'Perbandingan bandul fisis segitiga (l = 2,0 m, s = 2,4 m) dengan bandul sederhana ekivalen berpanjang l_eff.',
      labels: { ell: 'l = 2,0 m', s: 's = 2,4 m', m: 'm = 0,5 kg' },
    },
    simulationPreset: {
      mode: 'triangle-inplane',
      m: 0.5,
      m2: 0.5,
      mb: 0,
      ell: 2.0,
      s: 2.4,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Hitung momen inersia tiap massa terhadap poros atas (jarak tetap $\\ell$), lalu hitung $d_{\\text{cm}} = \\ell\\cos\\alpha$ dan substitusi ke definisi panjang efektif bandul fisis.',
    physicsConcept:
      'Bandul fisis apa pun yang berosilasi kecil memiliki periode sama dengan bandul sederhana sepanjang $\\ell_{\\text{eff}} = \\frac{I}{M_{\\text{tot}} d_{\\text{cm}}}$.',
    fbdExplanation:
      'Setiap massa berada tepat pada jari-jari $\\ell$ dari poros atas, sehingga $I = 2m\\ell^2$, sedangkan gaya berat total $2mg$ bekerja efektif di pusat massa berjarak $d_{\\text{cm}} = \\ell\\cos\\alpha$.',
    mainFormulas: [
      'I = 2m\\ell^2, \\qquad M_{\\text{tot}} = 2m, \\qquad d_{\\text{cm}} = \\ell\\cos\\alpha',
      '\\ell_{\\text{eff}} = \\frac{I}{M_{\\text{tot}} d_{\\text{cm}}} = \\frac{\\ell}{\\cos\\alpha}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Diketahui $m = 0{,}5\\text{ kg}$, $\\ell = 2{,}0\\text{ m}$, dan $s = 2{,}4\\text{ m}$. Dicari panjang efektif bandul sederhana ekivalen $\\ell_{\\text{eff}}$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Sistem segitiga kaku merupakan bandul fisis dengan poros di puncak. Panjang efektifnya adalah rasio momen inersia terhadap hasil kali massa total dan jarak pusat massa dari poros.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Kedua massa berjarak radial $\\ell = 2{,}0\\text{ m}$ dari poros, sedangkan titik tengah tongkat berada di kedalaman $d_{\\text{cm}} = \\ell\\cos\\alpha$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Momen inersia $I = 2m\\ell^2$ dan $M_{\\text{tot}}d_{\\text{cm}} = 2m\\ell\\cos\\alpha$, sehingga:',
        highlightLatex: '\\ell_{\\text{eff}} = \\frac{2m\\ell^2}{2m\\ell\\cos\\alpha} = \\frac{\\ell}{\\cos\\alpha}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Hitung $\\sin\\alpha = \\frac{2{,}4}{2 \\times 2{,}0} = 0{,}6$, maka $\\cos\\alpha = \\sqrt{1 - 0{,}6^2} = 0{,}8$. Jadi:',
        highlightLatex: '\\ell_{\\text{eff}} = \\frac{2{,}0}{0{,}8} = 2{,}5\\text{ m}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Satuan meter konsisten. Karena $\\cos\\alpha < 1$, panjang efektif $\\ell_{\\text{eff}} = 2{,}5\\text{ m} > \\ell = 2{,}0\\text{ m}$, sesuai sifat bandul yang melambat saat tongkat dipasang.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Panjang efektif bandul ekivalen adalah:',
        highlightLatex: '\\ell_{\\text{eff}} = 2{,}5\\text{ m}',
      },
    ],
    speechQuestion:
      'Soal nomor 2. Dua partikel bermassa 0 koma 5 kilogram digantung pada poros sama dengan tali l 2 koma 0 meter dan tongkat s 2 koma 4 meter. Tentukan panjang efektif bandul ekivalen sistem.',
    speechStimulus:
      'Visual membandingkan sistem segitiga dengan bandul sederhana ekivalen yang memiliki periode osilasi sama.',
    speechFbd:
      'Kedua massa tetap berjarak l dari poros putar, sedangkan gaya berat total bekerja di pusat massa pada kedalaman l kosinus alfa.',
    speechSolution:
      'Dengan sinus alfa sama dengan 2 koma 4 per 4 koma 0 sama dengan 0 koma 6, didapat kosinus alfa 0 koma 8. Panjang efektif adalah l dibagi kosinus alfa yaitu 2 koma 0 dibagi 0 koma 8 sama dengan 2 koma 5 meter.',
    speechConclusion: 'Jawaban akhir soal nomor 2 adalah 2 koma 5 meter.',
  },
  {
    id: 3,
    tier: 1,
    tierLabel: 'Level 1 · Fondasi Konsep',
    title: 'Frekuensi Sudut Osilasi Kecil Bandul Dua Massa',
    competency: 'Menghitung frekuensi sudut dasar sistem dua pendulum terhubung tongkat',
    prompt:
      'Dua buah pendulum identik dengan panjang tali $\\ell = 0{,}50\\text{ m}$ dan massa $m = 1{,}0\\text{ kg}$ digantung pada poros yang sama serta dihubungkan oleh tongkat tak bermassa sepanjang $s = 0{,}60\\text{ m}$. Jika percepatan gravitasi $g = 10{,}0\\text{ m/s}^2$, hitung frekuensi sudut osilasi kecil sistem $\\omega(s)$ di dalam bidang segitiga!',
    givenSummary: ['$\\ell = 0{,}50\\text{ m}$', '$s = 0{,}60\\text{ m}$', '$g = 10{,}0\\text{ m/s}^2$'],
    targetSymbol: '\\omega(s)',
    unit: 'rad/s',
    expectedAnswer: '4,0',
    numericValue: 4.0,
    tolerance: 0.05,
    stimulus: {
      type: 'omega-setup',
      caption: 'Konfigurasi osilasi kecil sistem dua pendulum dengan sudut simpangan awal kecil θ_0.',
      labels: { ell: 'l = 0,50 m', s: 's = 0,60 m', g: 'g = 10,0 m/s²' },
    },
    simulationPreset: {
      mode: 'triangle-inplane',
      m: 1.0,
      m2: 1.0,
      mb: 0,
      ell: 0.5,
      s: 0.6,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 10,
      v0Impact: 0,
    },
    hint: 'Cari terlebih dahulu $\\cos\\alpha$ dari $\\sin\\alpha = s/(2\\ell)$, lalu masukkan ke rumus $\\omega(s) = \\sqrt{\\frac{g\\cos\\alpha}{\\ell}}$.',
    physicsConcept:
      'Untuk ayunan kecil di bidang segitiga, persamaan rotasi $(2m\\ell^2)\\ddot{\\theta} = -2mg\\ell\\cos\\alpha\\,\\theta$ memberikan $\\omega(s) = \\sqrt{\\frac{g\\cos\\alpha}{\\ell}}$.',
    fbdExplanation:
      'Saat menyimpang sudut $\\theta$ kecil, gaya berat kedua massa memberikan torsi pemulih sebesar $-2mg\\ell\\cos\\alpha\\sin\\theta \\approx -2mg\\ell\\cos\\alpha\\,\\theta$ terhadap poros puncak.',
    mainFormulas: [
      '\\sin\\alpha = \\frac{s}{2\\ell}',
      '\\omega(s) = \\sqrt{\\frac{g\\cos\\alpha}{\\ell}}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Diketahui $\\ell = 0{,}50\\text{ m}$, $s = 0{,}60\\text{ m}$, dan $g = 10{,}0\\text{ m/s}^2$. Kita diminta menentukan frekuensi sudut $\\omega(s)$ dalam $\\text{rad/s}$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Sistem berosilasi harmonik sebagai benda tegar segitiga dengan momen inersia $I = 2m\\ell^2$ dan torsi pemulih gravitasi pada pusat massa $d_{\\text{cm}} = \\ell\\cos\\alpha$.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Setengah sudut puncak memenuhi $\\sin\\alpha = \\frac{0{,}60}{2 \\times 0{,}50} = 0{,}60$, sehingga $\\cos\\alpha = 0{,}80$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Frekuensi sudut osilasi harmonik kecil adalah:',
        highlightLatex: '\\omega(s) = \\sqrt{\\frac{g\\cos\\alpha}{\\ell}}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Masukkan nilai $g = 10{,}0\\text{ m/s}^2$, $\\cos\\alpha = 0{,}80$, dan $\\ell = 0{,}50\\text{ m}$:',
        highlightLatex: '\\omega(s) = \\sqrt{\\frac{10{,}0 \\times 0{,}80}{0{,}50}} = \\sqrt{\\frac{8{,}0}{0{,}50}} = \\sqrt{16{,}0} = 4{,}0\\text{ rad/s}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Dimensi $\\sqrt{[L][T]^{-2}/[L]} = [T]^{-1}$ cocok dengan $\\text{rad/s}$. Nilai $4{,}0\\text{ rad/s}$ lebih kecil daripada $\\omega(0) = \\sqrt{10/0{,}5} \\approx 4{,}47\\text{ rad/s}$, konsisten dengan perlambatan oleh tongkat.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Frekuensi sudut osilasi sistem adalah:',
        highlightLatex: '\\omega(s) = 4{,}0\\text{ rad/s}',
      },
    ],
    speechQuestion:
      'Soal nomor 3. Dua pendulum identik dengan panjang tali l 0 koma 50 meter dan tongkat s 0 koma 60 meter berosilasi kecil di bidang segitiga dengan g 10 koma 0 meter per sekon kuadrat. Hitung frekuensi sudut omega s.',
    speechStimulus: 'Skema menunjukkan kedua tali panjang 0 koma 50 meter dan tongkat penghubung 0 koma 60 meter.',
    speechFbd: 'Torsi pemulih gravitasi berbanding lurus dengan simpangan sudut teta dan kosinus alfa.',
    speechSolution:
      'Didapat kosinus alfa 0 koma 80. Omega sama dengan akar 10 koma 0 dikali 0 koma 80 dibagi 0 koma 50, yaitu akar 16 sama dengan 4 koma 0 radian per sekon.',
    speechConclusion: 'Jawaban akhir soal nomor 3 adalah 4 koma 0 radian per sekon.',
  },
  {
    id: 4,
    tier: 2,
    tierLabel: 'Level 2 · Penerapan Prinsip',
    title: 'Rasio Panjang Batang Target (Soal Asli Nomor 19 OSK 2026)',
    competency: 'Menentukan rasio s0/l dari fungsi frekuensi f(s)/f(0)',
    prompt:
      'Dua buah pendulum identik dengan panjang $\\ell$ dan massa masing-masing $m$ dihubungkan oleh tongkat tak bermassa dengan panjang $s$. Sistem diberi gangguan kecil di bidang segitiga sehingga mengalami osilasi dengan frekuensi $f(s)$. Berdasarkan grafik ketergantungan $f(s)/f(0)$ terhadap $s/\\ell$, tentukan nilai perbandingan panjang $s_0/\\ell$ sehingga $\\frac{f(s_0)}{f(0)} = \\frac{1}{\\sqrt{2}}$!',
    givenSummary: ['$\\frac{f(s_0)}{f(0)} = \\frac{1}{\\sqrt{2}} \\approx 0{,}707$', '$0 \\le s < 2\\ell$'],
    targetSymbol: 's_0/\\ell',
    unit: 'tanpa satuan',
    expectedAnswer: '1,7',
    numericValue: 1.7,
    tolerance: 0.05,
    stimulus: {
      type: 'graph-ratio',
      caption: 'Kurva perbandingan frekuensi f(s)/f(0) sebagai fungsi rasio panjang tongkat s/l, dengan garis horizontal target 1/akar(2).',
      labels: { target: 'f(s0)/f(0) = 1/√2' },
    },
    simulationPreset: {
      mode: 'triangle-inplane',
      m: 1.0,
      m2: 1.0,
      mb: 0,
      ell: 1.5,
      s: 2.598,
      g: 9.8,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Ingat bahwa $f(s)/f(0) = \\sqrt{\\cos\\alpha} = \\left(1 - \\frac{s^2}{4\\ell^2}\\right)^{1/4}$. Kuadratkan dua kali (pangkatkan empat) untuk mengeliminasi akar!',
    physicsConcept:
      'Saat $s = 0$, $f(0) = \\frac{1}{2\\pi}\\sqrt{g/\\ell}$. Saat $s = s_0$, $f(s_0) = \\frac{1}{2\\pi}\\sqrt{g\\cos\\alpha_0/\\ell}$. Oleh karena itu rasio frekuensi sama dengan $\\sqrt{\\cos\\alpha_0}$.',
    fbdExplanation:
      'Untuk menurunkan frekuensi menjadi $1/\\sqrt{2}$ kali semula, panjang efektif harus menjadi dua kali lipat ($\\ell_{\\text{eff}} = 2\\ell$), yang tercapai tepat ketika $\\cos\\alpha_0 = 1/2$ atau $\\alpha_0 = 60^\\circ$.',
    mainFormulas: [
      '\\frac{f(s)}{f(0)} = \\left(1 - \\frac{s^2}{4\\ell^2}\\right)^{1/4}',
      '\\left(1 - \\frac{s_0^2}{4\\ell^2}\\right)^{1/4} = 2^{-1/2} \\implies \\frac{s_0}{\\ell} = \\sqrt{3}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Inilah inti Soal Nomor 19 OSK 2026: dicari rasio panjang tongkat terhadap panjang tali $s_0/\\ell$ agar frekuensi sistem turun menjadi $\\frac{1}{\\sqrt{2}}$ kali frekuensi saat $s=0$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Frekuensi osilasi kecil bandul segitiga adalah $f(s) = \\frac{1}{2\\pi}\\sqrt{\\frac{g\\cos\\alpha}{\\ell}}$ dengan $\\cos\\alpha = \\sqrt{1 - \\frac{s^2}{4\\ell^2}}$.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Pada grafik $f(s)/f(0)$ terhadap $s/\\ell$, kurva turun landai di awal dan menukik tajam menuju $0$ di $s/\\ell = 2$. Garis target $1/\\sqrt{2} \\approx 0{,}707$ memotong kurva di antara $1{,}5$ dan $2{,}0$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Tuliskan rasio frekuensi terhadap $f(0)$:',
        highlightLatex: '\\frac{f(s_0)}{f(0)} = \\sqrt{\\cos\\alpha_0} = \\left(1 - \\frac{s_0^2}{4\\ell^2}\\right)^{1/4} = \\frac{1}{\\sqrt{2}}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Pangkat empatkan kedua ruas persamaan:',
        highlightLatex: '1 - \\frac{s_0^2}{4\\ell^2} = \\left(\\frac{1}{\\sqrt{2}}\\right)^4 = \\frac{1}{4} \\implies \\frac{s_0^2}{4\\ell^2} = \\frac{3}{4} \\implies \\frac{s_0}{\\ell} = \\sqrt{3} \\approx 1{,}732',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Nilai $s_0/\\ell = \\sqrt{3} \\approx 1{,}7 < 2$, sehingga segitiga masih dapat terbentuk ($2\\alpha_0 = 120^\\circ$). Dibulatkan satu angka desimal menjadi $1{,}7$.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Perbandingan panjang $s_0/\\ell$ adalah:',
        highlightLatex: '\\frac{s_0}{\\ell} = 1{,}7',
      },
    ],
    speechQuestion:
      'Soal nomor 4, adaptasi langsung Soal Nomor 19 OSK 2026. Dua pendulum identik panjang l dihubungkan tongkat s. Tentukan perbandingan s nol dibagi l agar rasio frekuensi f s nol per f nol bernilai satu per akar dua.',
    speechStimulus:
      'Grafik memperlihatkan kurva f s per f nol yang menurun dari satu menuju nol saat s per l mendekati dua.',
    speechFbd:
      'Agar frekuensi menjadi satu per akar dua kali semula, panjang efektif harus menjadi dua kali panjang tali, yaitu saat sudut puncak segitiga mencapai 120 derajat.',
    speechSolution:
      'Dari persamaan pangkat seperempat sama dengan satu per akar dua, pangkat empatkan kedua ruas untuk memperoleh satu minus s nol kuadrat per empat l kuadrat sama dengan seperempat, sehingga s nol per l sama dengan akar tiga atau 1 koma 7.',
    speechConclusion: 'Jawaban akhir soal nomor 4 adalah 1 koma 7.',
  },
  {
    id: 5,
    tier: 2,
    tierLabel: 'Level 2 · Penerapan Prinsip',
    title: 'Kelajuan Linear Maksimum pada Osilasi Bandul Segitiga',
    competency: 'Menggabungkan frekuensi sudut sistem dan amplitudo osilasi untuk menghitung v_maks',
    prompt:
      'Dua massa identik masing-masing $m = 1{,}5\\text{ kg}$ digantung pada satu poros dengan tali panjang $\\ell = 1{,}25\\text{ m}$ dan dihubungkan tongkat tak bermassa sehingga sudut puncak antara kedua tali adalah $2\\alpha = 120^\\circ$ ($\\alpha = 60^\\circ$). Sistem disimpangkan kecil dengan amplitudo $\\theta_0 = 0{,}12\\text{ rad}$ lalu dilepaskan dari keadaan diam (gunakan $g = 10{,}0\\text{ m/s}^2$). Hitung kelajuan linear maksimum masing-masing massa saat melewati posisi setimbang!',
    givenSummary: ['$\\ell = 1{,}25\\text{ m}$', '$2\\alpha = 120^\\circ$', '$\\theta_0 = 0{,}12\\text{ rad}$', '$g = 10{,}0\\text{ m/s}^2$'],
    targetSymbol: 'v_{\\max}',
    unit: 'm/s',
    expectedAnswer: '0,3',
    numericValue: 0.3,
    tolerance: 0.05,
    stimulus: {
      type: 'energy-swing',
      caption: 'Segitiga kaku dengan sudut puncak 2α = 120° berayun dari simpangan maksimum θ_0 = 0,12 rad menuju posisi setimbang.',
      labels: { ell: 'l = 1,25 m', twoAlpha: '2α = 120°', theta0: 'θ₀ = 0,12 rad' },
    },
    simulationPreset: {
      mode: 'triangle-inplane',
      m: 1.5,
      m2: 1.5,
      mb: 0,
      ell: 1.25,
      s: 2.165,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 6.9,
      v0Impact: 0,
    },
    hint: 'Hitung frekuensi sudut osilasi $\\omega$ terlebih dahulu, lalu cari kelajuan sudut maksimum $\\dot{\\theta}_{\\max} = \\theta_0 \\omega$. Ingat bahwa setiap massa menempuh busur berjari-jari $\\ell$ terhadap poros!',
    physicsConcept:
      'Karena seluruh segitiga berotasi sebagai benda tegar dengan laju sudut $\\dot{\\theta}$, kelajuan linear tiap massa yang berjarak $\\ell$ dari poros adalah $v = \\ell\\dot{\\theta}$.',
    fbdExplanation:
      'Di titik terendah (posisi setimbang $\\theta = 0$), seluruh energi potensial osilasi berubah menjadi energi kinetik rotasi $K = \\frac{1}{2}(2m\\ell^2)\\dot{\\theta}_{\\max}^2 = m v_{\\max}^2$.',
    mainFormulas: [
      '\\omega = \\sqrt{\\frac{g\\cos\\alpha}{\\ell}}, \\qquad \\dot{\\theta}_{\\max} = \\theta_0 \\omega',
      'v_{\\max} = \\ell \\dot{\\theta}_{\\max} = \\theta_0 \\sqrt{g\\ell\\cos\\alpha}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Diketahui $\\ell = 1{,}25\\text{ m}$, $2\\alpha = 120^\\circ$ sehingga $\\alpha = 60^\\circ$, amplitudo $\\theta_0 = 0{,}12\\text{ rad}$, dan $g = 10{,}0\\text{ m/s}^2$. Dicari $v_{\\max}$ tiap massa.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Pada GHS sudut $\\theta(t) = \\theta_0\\cos(\\omega t)$, laju sudut maksimum adalah $\\theta_0\\omega$ dan laju linear titik pada jarak $\\ell$ dari poros adalah $v_{\\max} = \\ell\\theta_0\\omega$.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Saat $\\alpha = 60^\\circ$, $\\cos 60^\\circ = 0{,}5$. Kedua massa bergerak menyusuri lingkaran jari-jari $\\ell = 1{,}25\\text{ m}$ dengan kecepatan tangensial sama besar.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Substitusi $\\omega = \\sqrt{\\frac{g\\cos\\alpha}{\\ell}}$:',
        highlightLatex: '\\omega = \\sqrt{\\frac{10{,}0 \\times 0{,}5}{1{,}25}} = \\sqrt{4{,}0} = 2{,}0\\text{ rad/s}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Hitung $\\dot{\\theta}_{\\max}$ dan $v_{\\max}$:',
        highlightLatex: '\\dot{\\theta}_{\\max} = 0{,}12 \\times 2{,}0 = 0{,}24\\text{ rad/s} \\implies v_{\\max} = 1{,}25 \\times 0{,}24 = 0{,}30\\text{ m/s}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Cek via kekekalan energi: $m v_{\\max}^2 = m g \\ell \\cos\\alpha \\, \\theta_0^2 \\implies v_{\\max} = 0{,}12\\sqrt{10 \\times 1{,}25 \\times 0{,}5} = 0{,}12 \\times 2{,}5 = 0{,}30\\text{ m/s}$. Cocok 100%!',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Kelajuan linear maksimum masing-masing massa adalah:',
        highlightLatex: 'v_{\\max} = 0{,}3\\text{ m/s}',
      },
    ],
    speechQuestion:
      'Soal nomor 5. Dua massa identik 1 koma 5 kilogram digantung dengan tali 1 koma 25 meter dan sudut puncak 120 derajat. Jika berosilasi kecil dengan amplitudo 0 koma 12 radian dan g 10 koma 0 meter per sekon kuadrat, hitung kelajuan linear maksimum tiap massa.',
    speechStimulus: 'Diagram menunjukkan ayunan segitiga dengan amplitudo sudut teta nol dan lintasan busur berjari-jari l.',
    speechFbd: 'Energi potensial maksimum pada simpangan teta nol berubah menjadi energi kinetik rotasi di posisi setimbang.',
    speechSolution:
      'Frekuensi sudut omega sama dengan akar 10 dikali 0 koma 5 per 1 koma 25 yaitu 2 koma 0 radian per sekon. Laju sudut maksimum 0 koma 24 radian per sekon, dikalikan l 1 koma 25 meter menghasilkan 0 koma 3 meter per sekon.',
    speechConclusion: 'Jawaban akhir soal nomor 5 adalah 0 koma 3 meter per sekon.',
  },
  {
    id: 6,
    tier: 2,
    tierLabel: 'Level 2 · Penerapan Prinsip',
    title: 'Gaya Tekan Internal pada Tongkat Penghubung Saat Setimbang',
    competency: 'Menganalisis Free Body Diagram (FBD) statis untuk gaya tegangan tali dan kompresi tongkat',
    prompt:
      'Pada sistem dua pendulum identik ($m = 2{,}0\\text{ kg}$, $\\ell = 2{,}5\\text{ m}$, $g = 10{,}0\\text{ m/s}^2$) yang dihubungkan tongkat kaku horizontal sepanjang $s = 3{,}0\\text{ m}$, sistem diam di keadaan setimbang. Hitung besar gaya tekan (kompresi) yang dialami oleh tongkat penghubung tersebut!',
    givenSummary: ['$m = 2{,}0\\text{ kg}$', '$\\ell = 2{,}5\\text{ m}$', '$s = 3{,}0\\text{ m}$', '$g = 10{,}0\\text{ m/s}^2$'],
    targetSymbol: 'F_{\\text{tongkat}}',
    unit: 'N',
    expectedAnswer: '15,0',
    numericValue: 15.0,
    tolerance: 0.1,
    stimulus: {
      type: 'fbd-equilibrium',
      caption: 'Free Body Diagram salah satu massa m pada keadaan setimbang: gaya berat mg, tegangan tali T, dan gaya dorong tongkat N_tongkat.',
      labels: { ell: 'l = 2,5 m', s: 's = 3,0 m', m: 'm = 2,0 kg' },
    },
    simulationPreset: {
      mode: 'triangle-inplane',
      m: 2.0,
      m2: 2.0,
      mb: 0,
      ell: 2.5,
      s: 3.0,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 0,
      v0Impact: 0,
    },
    hint: 'Tinjau satu massa saja (misalnya massa kanan). Uraikan tegangan tali $T$ ke arah vertikal ($T\\cos\\alpha = mg$) dan horizontal ($T\\sin\\alpha = F_{\\text{tongkat}}$).',
    physicsConcept:
      'Dalam keseimbangan statis, resultan gaya pada masing-masing massa nol: $\\sum F_x = 0$ dan $\\sum F_y = 0$. Komponen horizontal tegangan tali menarik massa ke dalam, sehingga tongkat harus mendorong massa keluar.',
    fbdExplanation:
      'Untuk massa kanan pada koordinat Kartesius standar ($+x$ kanan, $+y$ atas): gaya berat $mg$ ke bawah ($-y$), gaya tekan tongkat $F_{\\text{tongkat}}$ ke kanan ($+x$), dan tegangan tali $T$ berarah ke kiri atas membentuk sudut $\\alpha$ terhadap vertikal.',
    mainFormulas: [
      'T\\cos\\alpha = mg',
      'F_{\\text{tongkat}} = T\\sin\\alpha = mg\\tan\\alpha',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Diketahui $m = 2{,}0\\text{ kg}$, $\\ell = 2{,}5\\text{ m}$, $s = 3{,}0\\text{ m}$, dan $g = 10{,}0\\text{ m/s}^2$. Dicari gaya tekan $F_{\\text{tongkat}}$ saat diam setimbang.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Gunakan hukum I Newton ($\\sum \\vec{F} = 0$) pada satu bola bermassa $m$ karena kedua bola simetris.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem (FBD)',
        body: 'Pada massa kanan, komponen vertikal tegangan tali $T\\cos\\alpha$ menahan berat $mg$, sedangkan komponen horizontalnya $T\\sin\\alpha$ berarah ke kiri sehingga diimbangi gaya tekan tongkat ke kanan.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Dari $\\sum F_y = 0$ dan $\\sum F_x = 0$ diperoleh:',
        highlightLatex: 'T = \\frac{mg}{\\cos\\alpha} \\implies F_{\\text{tongkat}} = T\\sin\\alpha = mg\\tan\\alpha',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Dari $\\sin\\alpha = \\frac{3{,}0}{2 \\times 2{,}5} = 0{,}6$, didapat $\\cos\\alpha = 0{,}8$ dan $\\tan\\alpha = \\frac{0{,}6}{0{,}8} = 0{,}75$. Maka:',
        highlightLatex: 'F_{\\text{tongkat}} = (2{,}0)(10{,}0)(0{,}75) = 15{,}0\\text{ N}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Tegangan tali $T = 20{,}0/0{,}8 = 25{,}0\\text{ N}$. Cek Pythagoras vektor: $\\sqrt{(mg)^2 + F_{\\text{tongkat}}^2} = \\sqrt{20^2 + 15^2} = 25{,}0\\text{ N} = T$. Satuan Newton konsisten!',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Besar gaya tekan pada tongkat penghubung adalah:',
        highlightLatex: 'F_{\\text{tongkat}} = 15{,}0\\text{ N}',
      },
    ],
    speechQuestion:
      'Soal nomor 6. Pada sistem dua pendulum identik bermassa 2 koma 0 kilogram, panjang tali 2 koma 5 meter, dan panjang tongkat 3 koma 0 meter dalam keadaan diam setimbang, hitung besar gaya tekan pada tongkat penghubung dengan g 10 koma 0 meter per sekon kuadrat.',
    speechStimulus:
      'Diagram benda bebas memperlihatkan tiga gaya pada satu massa: gaya berat ke bawah, tegangan tali miring ke poros, dan gaya dorong horizontal dari tongkat.',
    speechFbd:
      'Pada sumbu vertikal T kosinus alfa sama dengan m g, sedangkan pada sumbu horizontal gaya tongkat sama dengan T sinus alfa.',
    speechSolution:
      'Dengan sinus alfa 0 koma 6 dan kosinus alfa 0 koma 8, tangen alfa bernilai 0 koma 75. Gaya tekan tongkat sama dengan m g tangen alfa yaitu 2 koma 0 kali 10 koma 0 kali 0 koma 75 sama dengan 15 koma 0 newton.',
    speechConclusion: 'Jawaban akhir soal nomor 6 adalah 15 koma 0 newton.',
  },
  {
    id: 7,
    tier: 3,
    tierLabel: 'Level 3 · Analisis Hubungan',
    title: 'Analisis Grafik Eksperimen Kuadrat Periode terhadap Sec(α)',
    competency: 'Menafsirkan grafik linearisasi T^2 terhadap 1/cos(α) dari data percobaan',
    prompt:
      'Seorang siswa melakukan eksperimen sistem dua pendulum identik dengan panjang tali tetap $\\ell = 0{,}80\\text{ m}$ sambil mengganti-ganti panjang tongkat penghubung $s$. Hasil pengukuran kuadrat periode osilasi kecil $T^2$ terhadap $\\sec\\alpha = \\frac{1}{\\cos\\alpha}$ ditunjukkan pada grafik dan tabel data berikut. Jika pada pengukuran kelima dipasang tongkat sepanjang $s = 0{,}96\\text{ m}$, tentukan periode osilasi $T$ yang terbaca sesuai grafik eksperimen tersebut!',
    givenSummary: ['$\\ell = 0{,}80\\text{ m}$', '$s_5 = 0{,}96\\text{ m}$', 'Grafik linear $T^2$ vs $\\sec\\alpha$'],
    targetSymbol: 'T',
    unit: 's',
    expectedAnswer: '2,0',
    numericValue: 2.0,
    tolerance: 0.05,
    stimulus: {
      type: 'experiment-table-graph',
      caption: 'Grafik dan tabel hubungan linear T² terhadap sec(α) = 1/cos(α) dari eksperimen siswa.',
      labels: { xLabel: 'sec(α) = 1/cos(α)', yLabel: 'T² (s²)' },
      tableData: [
        { secAlpha: '1,00', tSquared: '3,20' },
        { secAlpha: '1,50', tSquared: '4,80' },
        { secAlpha: '2,00', tSquared: '6,40' },
        { secAlpha: '2,50', tSquared: '8,00' },
      ],
    },
    simulationPreset: {
      mode: 'triangle-inplane',
      m: 1.0,
      m2: 1.0,
      mb: 0,
      ell: 0.8,
      s: 0.96,
      g: 9.87,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Tentukan gradien garis lurus $T^2 = k_{\\text{gradien}} \\sec\\alpha$ dari tabel data, kemudian hitung nilai $\\sec\\alpha = 1/\\cos\\alpha$ untuk $s = 0{,}96\\text{ m}$ dan $\\ell = 0{,}80\\text{ m}$.',
    physicsConcept:
      'Dari $T = 2\\pi\\sqrt{\\frac{\\ell}{g\\cos\\alpha}}$, mengkuadratkan kedua ruas memberikan hubungan linear $T^2 = \\left(\\frac{4\\pi^2\\ell}{g}\\right)\\sec\\alpha$ dengan titik potong nol.',
    fbdExplanation:
      'Setiap peningkatan $s$ memperbesar $\\sec\\alpha = 1/\\cos\\alpha$, yang berarti panjang efektif $\\ell_{\\text{eff}} = \\ell\\sec\\alpha$ membesar secara linear sehingga $T^2$ naik secara linear terhadap $\\sec\\alpha$.',
    mainFormulas: [
      'T^2 = \\left(\\frac{4\\pi^2\\ell}{g}\\right)\\sec\\alpha',
      '\\sin\\alpha = \\frac{s}{2\\ell}, \\qquad \\sec\\alpha = \\frac{1}{\\cos\\alpha}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Diberikan grafik serta tabel $T^2$ vs $\\sec\\alpha$ untuk tali $\\ell = 0{,}80\\text{ m}$. Diminta memprediksi periode $T$ saat $s = 0{,}96\\text{ m}$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Persamaan periode bandul segitiga $T = 2\\pi\\sqrt{\\frac{\\ell}{g\\cos\\alpha}}$ menghasilkan garis lurus $T^2 = m_{\\text{grafik}}\\sec\\alpha$.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Dari tabel dan grafik: pada $\\sec\\alpha = 1{,}00$ diperoleh $T^2 = 3{,}20\\text{ s}^2$, dan pada $\\sec\\alpha = 2{,}00$ diperoleh $T^2 = 6{,}40\\text{ s}^2$. Gradien garis tepat $3{,}20\\text{ s}^2$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Cari nilai $\\sec\\alpha$ untuk $s = 0{,}96\\text{ m}$ dan $\\ell = 0{,}80\\text{ m}$:',
        highlightLatex: '\\sin\\alpha = \\frac{0{,}96}{2 \\times 0{,}80} = 0{,}60 \\implies \\cos\\alpha = 0{,}80 \\implies \\sec\\alpha = \\frac{1}{0{,}80} = 1{,}25',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Substitusi $\\sec\\alpha = 1{,}25$ ke persamaan garis grafik $T^2 = 3{,}20\\sec\\alpha$:',
        highlightLatex: 'T^2 = 3{,}20 \\times 1{,}25 = 4{,}00\\text{ s}^2 \\implies T = \\sqrt{4{,}00} = 2{,}0\\text{ s}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Pada tabel, titik $\\sec\\alpha = 1{,}25$ terletak di tengah antara $1{,}00$ ($T^2=3{,}20$) dan $1{,}50$ ($T^2=4{,}80$), tepat bernilai $4{,}00\\text{ s}^2$. Satuan sekon konsisten.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Periode osilasi pada pengukuran kelima adalah:',
        highlightLatex: 'T = 2{,}0\\text{ s}',
      },
    ],
    speechQuestion:
      'Soal nomor 7. Dengan panjang tali tetap l 0 koma 80 meter, data eksperimen hubungan kuadrat periode T kuadrat terhadap sekan alfa membentuk garis lurus dengan gradien 3 koma 20 sekon kuadrat. Jika panjang tongkat s dipasang 0 koma 96 meter, hitung periode osilasi T.',
    speechStimulus:
      'Grafik dan tabel menampilkan empat titik percobaan yang membentuk garis lurus dari sekan alfa 1 koma 00 hingga 2 koma 50.',
    speechFbd:
      'Karena panjang efektif berbanding lurus dengan sekan alfa, kuadrat periode berbanding lurus dengan sekan alfa.',
    speechSolution:
      'Untuk s 0 koma 96 meter dan l 0 koma 80 meter, sinus alfa adalah 0 koma 60 sehingga kosinus alfa 0 koma 80 dan sekan alfa 1 koma 25. Dari grafik, T kuadrat sama dengan 3 koma 20 dikali 1 koma 25 sama dengan 4 koma 00, sehingga periode T sama dengan 2 koma 0 sekon.',
    speechConclusion: 'Jawaban akhir soal nomor 7 adalah 2 koma 0 sekon.',
  },
  {
    id: 8,
    tier: 3,
    tierLabel: 'Level 3 · Analisis Hubungan',
    title: 'Osilasi di Dalam Bidang Segitiga vs Tegak Lurus Bidang',
    competency: 'Membedakan momen inersia terhadap dua sumbu putar ortogonal melalui poros yang sama',
    prompt:
      'Tinjau sistem dua pendulum identik ($\\ell, m$) yang dihubungkan tongkat tak bermassa panjang $s$. Misalkan $f_{\\parallel}(s)$ adalah frekuensi osilasi kecil **di dalam bidang segitiga** (seperti Soal 19), sedangkan $f_{\\perp}(s)$ adalah frekuensi osilasi kecil saat seluruh segitiga berayun **keluar atau tegak lurus bidang segitiga** terhadap sumbu mendatar di titik gantung. Jika panjang tongkat dipilih $s = 1{,}6\\ell$, tentukan perbandingan frekuensi $\\frac{f_{\\parallel}(s)}{f_{\\perp}(s)}$!',
    givenSummary: ['$s = 1{,}6\\ell$', 'Mode $\\parallel$: ayunan di dalam bidang', 'Mode $\\perp$: ayunan keluar bidang'],
    targetSymbol: 'f_{\\parallel}/f_{\\perp}',
    unit: 'tanpa satuan',
    expectedAnswer: '0,6',
    numericValue: 0.6,
    tolerance: 0.03,
    stimulus: {
      type: 'modes-3d',
      caption: 'Dua mode osilasi ortogonal pada segitiga kaku: Mode A (di dalam bidang segitiga) dan Mode B (tegak lurus bidang segitiga).',
      labels: { s: 's = 1,6 l' },
    },
    simulationPreset: {
      mode: 'compare-outplane',
      m: 1.0,
      m2: 1.0,
      mb: 0,
      ell: 1.2,
      s: 1.92,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 10,
      v0Impact: 0,
    },
    hint: 'Hitung jarak tegak lurus masing-masing massa ke poros putar pada kedua mode! Pada mode keluar bidang, poros adalah garis horizontal sejajar tongkat $s$ yang melewati titik gantung atas.',
    physicsConcept:
      'Momen inersia bergantung pada jarak tegak lurus massa ke **sumbu putar**, bukan selalu jarak ke titik gantung. Pada ayunan di dalam bidang jaraknya $\\ell$, sedangkan pada ayunan tegak lurus bidang jaraknya $h = \\ell\\cos\\alpha$.',
    fbdExplanation:
      'Pada kedua mode, jarak pusat massa ke sumbu putar sama-sama $h = \\ell\\cos\\alpha$ sehingga torsi pemulihnya sama ($\\kappa = 2mg\\ell\\cos\\alpha$). Perbedaan frekuensi murni berasal dari momen inersia $I_{\\parallel} = 2m\\ell^2$ dan $I_{\\perp} = 2m(\\ell\\cos\\alpha)^2$.',
    mainFormulas: [
      'f_{\\parallel} = \\frac{1}{2\\pi}\\sqrt{\\frac{g\\cos\\alpha}{\\ell}}, \\qquad f_{\\perp} = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{\\ell\\cos\\alpha}}',
      '\\frac{f_{\\parallel}}{f_{\\perp}} = \\cos\\alpha',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Untuk $s = 1{,}6\\ell$, dibandingkan frekuensi osilasi dalam bidang segitiga $f_{\\parallel}$ dengan frekuensi osilasi keluar bidang $f_{\\perp}$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Sumbu putar mode $\\parallel$ tegak lurus bidang segitiga, sedangkan sumbu putar mode $\\perp$ adalah sumbu mendatar sebidang segitiga melalui puncak.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Pada mode $\\perp$, kedua massa berayun menyusuri lingkaran vertikal berjari-jari $h = \\ell\\cos\\alpha$ (lebih pendek daripada $\\ell$).',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Hitung masing-masing frekuensi:',
        highlightLatex: 'I_{\\parallel} = 2m\\ell^2 \\implies \\omega_{\\parallel} = \\sqrt{\\frac{g\\cos\\alpha}{\\ell}}; \\qquad I_{\\perp} = 2m(\\ell\\cos\\alpha)^2 \\implies \\omega_{\\perp} = \\sqrt{\\frac{g}{\\ell\\cos\\alpha}}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Bagi kedua frekuensi dan hitung untuk $s = 1{,}6\\ell$:',
        highlightLatex: '\\frac{f_{\\parallel}}{f_{\\perp}} = \\sqrt{\\cos^2\\alpha} = \\cos\\alpha = \\sqrt{1 - \\left(\\frac{1{,}6\\ell}{2\\ell}\\right)^2} = \\sqrt{1 - 0{,}64} = 0{,}6',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Karena $I_{\\perp} < I_{\\parallel}$ dengan torsi sama, ayunan keluar bidang selalu lebih cepat ($f_{\\perp} > f_{\\parallel}$), sehingga rasio $f_{\\parallel}/f_{\\perp} = 0{,}6 < 1$ sangat masuk akal.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Perbandingan frekuensi $f_{\\parallel}(s)/f_{\\perp}(s)$ adalah:',
        highlightLatex: '\\frac{f_{\\parallel}(s)}{f_{\\perp}(s)} = 0{,}6',
      },
    ],
    speechQuestion:
      'Soal nomor 8. Bandingkan frekuensi osilasi kecil di dalam bidang segitiga f sejajar dengan frekuensi osilasi tegak lurus bidang segitiga f tegak lurus. Jika panjang tongkat s sama dengan 1 koma 6 kali panjang tali l, tentukan rasio f sejajar dibagi f tegak lurus.',
    speechStimulus:
      'Diagram tiga dimensi memperlihatkan dua sumbu putar yang saling tegak lurus pada poros gantung atas.',
    speechFbd:
      'Kedua mode memiliki torsi pemulih yang sama, namun momen inersia pada mode tegak lurus lebih kecil karena jarak massa ke sumbu mendatar hanya l kosinus alfa.',
    speechSolution:
      'Rasio f sejajar dibagi f tegak lurus tepat sama dengan kosinus alfa. Untuk s sama dengan 1 koma 6 l, sinus alfa bernilai 0 koma 8 sehingga kosinus alfa adalah 0 koma 6.',
    speechConclusion: 'Jawaban akhir soal nomor 8 adalah 0 koma 6.',
  },
  {
    id: 9,
    tier: 3,
    tierLabel: 'Level 3 · Analisis Hubungan',
    title: 'Perubahan Persentase Frekuensi Akibat Pemuaian Tongkat Logam',
    competency: 'Menganalisis perubahan relatif frekuensi terhadap perubahan panjang tongkat s',
    prompt:
      'Sebuah sistem dua pendulum identik dengan tali tak memuai sepanjang $\\ell = 1{,}00\\text{ m}$ dihubungkan oleh batang logam ringan (massa diabaikan) yang panjang awalnya $s_1 = 1{,}20\\text{ m}$. Ketika dipanaskan, batang logam memuai sebesar $\\Delta s = +0{,}40\\text{ m}$ menjadi $s_2 = 1{,}60\\text{ m}$ (panjang tali $\\ell$ tetap). Hitung persentase perubahan frekuensi osilasi kecil sistem, $\\frac{f(s_2) - f(s_1)}{f(s_1)} \\times 100\\%$! (Gunakan tanda negatif jika frekuensi berkurang).',
    givenSummary: ['$\\ell = 1{,}00\\text{ m}$', '$s_1 = 1{,}20\\text{ m}$', '$s_2 = 1{,}60\\text{ m}$'],
    targetSymbol: '\\Delta f / f_1',
    unit: '%',
    expectedAnswer: '-13,4',
    numericValue: -13.4,
    tolerance: 0.2,
    stimulus: {
      type: 'thermal-rod',
      caption: 'Perbandingan geometri awal (s₁ = 1,20 m) dan setelah batang memuai (s₂ = 1,60 m) pada panjang tali tetap l = 1,00 m.',
      labels: { ell: 'l = 1,00 m', s1: 's₁ = 1,20 m', s2: 's₂ = 1,60 m' },
    },
    simulationPreset: {
      mode: 'triangle-inplane',
      m: 1.0,
      m2: 1.0,
      mb: 0,
      ell: 1.0,
      s: 1.6,
      g: 9.8,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Gunakan hubungan $\\frac{f(s_2)}{f(s_1)} = \\sqrt{\\frac{\\cos\\alpha_2}{\\cos\\alpha_1}}$, lalu kurangi $1$ dan kalikan $100\\%$.',
    physicsConcept:
      'Perubahan panjang tongkat akibat pemuaian termal mengubah $\\cos\\alpha$ tanpa mengubah $\\ell$ atau $g$, sehingga rasio frekuensi hanya bergantung pada $\\sqrt{\\cos\\alpha_2 / \\cos\\alpha_1}$.',
    fbdExplanation:
      'Ketika $s$ membesar dari $1{,}20\\text{ m}$ ke $1{,}60\\text{ m}$, pusat massa naik lebih dekat ke poros dari $0{,}80\\text{ m}$ ke $0{,}60\\text{ m}$, sehingga frekuensi pasti menurun ($\\Delta f < 0$).',
    mainFormulas: [
      '\\frac{f(s_2)}{f(s_1)} = \\sqrt{\\frac{\\cos\\alpha_2}{\\cos\\alpha_1}}',
      '\\%\\Delta f = \\left(\\frac{f(s_2)}{f(s_1)} - 1\\right) \\times 100\\%',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Panjang tali tetap $\\ell = 1{,}00\\text{ m}$, sementara panjang tongkat memuai dari $s_1 = 1{,}20\\text{ m}$ menjadi $s_2 = 1{,}60\\text{ m}$. Dicari persentase perubahan frekuensi.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Frekuensi sebanding dengan $\\sqrt{\\cos\\alpha}$, sehingga perbandingan $f(s_2)/f(s_1)$ tidak bergantung pada nilai $g$, $\\ell$, maupun $m$ secara eksplisit setelah $\\cos\\alpha$ diketahui.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Kondisi 1 membentuk segitiga $3\\text{-}4\\text{-}5$ dengan $\\sin\\alpha_1 = 0{,}60, \\cos\\alpha_1 = 0{,}80$. Kondisi 2 menukar sisi menjadi $\\sin\\alpha_2 = 0{,}80, \\cos\\alpha_2 = 0{,}60$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Hitung rasio frekuensi:',
        highlightLatex: '\\frac{f(s_2)}{f(s_1)} = \\sqrt{\\frac{\\cos\\alpha_2}{\\cos\\alpha_1}} = \\sqrt{\\frac{0{,}60}{0{,}80}} = \\sqrt{\\frac{3}{4}} = \\frac{\\sqrt{3}}{2} \\approx 0{,}8660',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Hitung persentase perubahan:',
        highlightLatex: '\\frac{f(s_2) - f(s_1)}{f(s_1)} \\times 100\\% = (0{,}8660 - 1) \\times 100\\% = -13{,}40\\%',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Tanda negatif konsisten karena pemuaian memperbesar $s$ dan menurunkan frekuensi. Pembulatan satu angka desimal menghasilkan $-13{,}4$.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Persentase perubahan frekuensi osilasi adalah:',
        highlightLatex: '\\frac{\\Delta f}{f_1} = -13{,}4\\%',
      },
    ],
    speechQuestion:
      'Soal nomor 9. Sistem dua pendulum panjang tali 1 koma 00 meter dihubungkan batang panjang awal 1 koma 20 meter. Setelah dipanaskan, batang memuai menjadi 1 koma 60 meter. Hitung persentase perubahan frekuensi osilasi sistem, gunakan tanda negatif jika berkurang.',
    speechStimulus:
      'Visual membandingkan dua kondisi: sudut awal dengan kosinus alfa 0 koma 80, dan kondisi memuai dengan kosinus alfa 0 koma 60.',
    speechFbd:
      'Saat batang memuai, posisi kedua massa naik lebih tinggi sehingga jarak pusat massa menyusut dan osilasi melambat.',
    speechSolution:
      'Rasio frekuensi baru terhadap lama adalah akar dari 0 koma 60 dibagi 0 koma 80, yaitu akar tiga per dua atau 0 koma 8660. Selisihnya terhadap 1 dikali 100 persen adalah minus 13 koma 4 persen.',
    speechConclusion: 'Jawaban akhir soal nomor 9 adalah minus 13 koma 4 persen.',
  },
  {
    id: 10,
    tier: 4,
    tierLabel: 'Level 4 · Penalaran Multi-Langkah',
    title: 'Sistem Dua Pendulum Tak Simetris (m₁ ≠ m₂) Terhubung Tongkat Kaku',
    competency: 'Menentukan pusat massa vektor dan frekuensi osilasi segitiga asimetris',
    prompt:
      'Kini tinjau variasi asimetris dari Soal 19: dua buah massa titik berbeda yaitu $m_1 = 3{,}0\\text{ kg}$ dan $m_2 = 5{,}0\\text{ kg}$ digantung pada satu poros yang sama dengan tali ringan sepanjang $\\ell = 1{,}40\\text{ m}$, lalu dihubungkan oleh tongkat kaku tak bermassa sepanjang $s = 1{,}40\\text{ m}$ (membentuk segitiga sama sisi dengan sudut puncak $2\\alpha = 60^\\circ$). Sistem dibiarkan mencapai keseimbangan baru di bawah $g = 10{,}0\\text{ m/s}^2$, kemudian diberi gangguan kecil di bidang segitiga. Hitung frekuensi sudut osilasi kecil $\\omega$ sistem!',
    givenSummary: ['$m_1 = 3{,}0\\text{ kg}$', '$m_2 = 5{,}0\\text{ kg}$', '$\\ell = s = 1{,}40\\text{ m}$ ($2\\alpha = 60^\\circ$)', '$g = 10{,}0\\text{ m/s}^2$'],
    targetSymbol: '\\omega',
    unit: 'rad/s',
    expectedAnswer: '2,5',
    numericValue: 2.5,
    tolerance: 0.05,
    stimulus: {
      type: 'asymmetric-triangle',
      caption: 'Segitiga sama sisi kaku (l = s = 1,40 m) dengan massa tak sama m₁ = 3,0 kg dan m₂ = 5,0 kg condong pada posisi setimbang barunya.',
      labels: { m1: 'm₁ = 3,0 kg', m2: 'm₂ = 5,0 kg', ell: 'l = 1,40 m', twoAlpha: '2α = 60°' },
    },
    simulationPreset: {
      mode: 'asymmetric',
      m: 3.0,
      m2: 5.0,
      mb: 0,
      ell: 1.4,
      s: 1.4,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Di posisi setimbang baru, vektor pusat massa $\\vec{r}_{\\text{cm}} = \\frac{m_1\\vec{r}_1 + m_2\\vec{r}_2}{m_1 + m_2}$ mengarah lurus ke bawah. Hitung panjang $|m_1\\vec{r}_1 + m_2\\vec{r}_2|$ dengan aturan kosinus vektor untuk sudut apit $2\\alpha = 60^\\circ$!',
    physicsConcept:
      'Meskipun massa tak sama memiringkan posisi setimbang segitiga, sistem tetap berupa benda tegar berporos di puncak! Frekuensi sudut selalu memenuhi $\\omega = \\sqrt{\\frac{M_{\\text{tot}} g d_{\\text{cm}}}{I}}$ dengan $I = (m_1+m_2)\\ell^2$.',
    fbdExplanation:
      'Pada keadaan setimbang, torsi $m_1$ terhadap garis vertikal sama dengan torsi $m_2$, sehingga pusat massa tepat di bawah poros ($d_{\\text{cm}} = |\\vec{r}_{\\text{cm}}|$). Massa yang lebih berat ($m_2 = 5{,}0\\text{ kg}$) berada lebih dekat ke garis vertikal.',
    mainFormulas: [
      'M_{\\text{tot}} d_{\\text{cm}} = |m_1\\vec{r}_1 + m_2\\vec{r}_2| = \\ell\\sqrt{m_1^2 + m_2^2 + 2m_1 m_2\\cos(2\\alpha)}',
      'I = (m_1 + m_2)\\ell^2, \\qquad \\omega = \\sqrt{\\frac{M_{\\text{tot}} g d_{\\text{cm}}}{I}}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Kedua massa berbeda ($m_1 = 3{,}0\\text{ kg}, m_2 = 5{,}0\\text{ kg}$) terhubung pada segitiga sama sisi kaku ($\\ell = s = 1{,}40\\text{ m}, 2\\alpha = 60^\\circ$). Dicari frekuensi sudut osilasi kecil $\\omega$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Di sekitar posisi setimbang mana pun, bandul fisis memiliki $\\omega = \\sqrt{\\frac{M_{\\text{tot}} g d_{\\text{cm}}}{I}}$. Besaran $M_{\\text{tot}} d_{\\text{cm}}$ adalah magnitudo dari $m_1\\vec{r}_1 + m_2\\vec{r}_2$.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Vektor $\\vec{r}_1$ dan $\\vec{r}_2$ dari poros memiliki panjang sama $\\ell$ dan mengapit sudut $2\\alpha = 60^\\circ$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Dengan aturan kosinus untuk penjumlahan dua vektor:',
        highlightLatex: 'M_{\\text{tot}} d_{\\text{cm}} = \\ell\\sqrt{m_1^2 + m_2^2 + 2m_1 m_2\\cos 60^\\circ} = \\ell\\sqrt{m_1^2 + m_2^2 + m_1 m_2}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Hitung nilai numerik $R = \\sqrt{3^2 + 5^2 + 3 \\times 5} = \\sqrt{9 + 25 + 15} = \\sqrt{49} = 7{,}0\\text{ kg}$. Lalu $M_{\\text{tot}} = 8{,}0\\text{ kg}$, sehingga:',
        highlightLatex: '\\omega = \\sqrt{\\frac{g R}{M_{\\text{tot}} \\ell}} = \\sqrt{\\frac{10{,}0 \\times 7{,}0}{8{,}0 \\times 1{,}40}} = \\sqrt{\\frac{70{,}0}{11{,}2}} = \\sqrt{6{,}25} = 2{,}5\\text{ rad/s}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Uji batas: jika $m_1 = m_2 = m$, maka $R = m\\sqrt{3}$ dan $\\omega = \\sqrt{\\frac{g\\sqrt{3}}{2\\ell}} = \\sqrt{\\frac{g\\cos 30^\\circ}{\\ell}}$, tepat kembali ke rumus Soal 19! Dimensi $[T]^{-1}$ konsisten.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Frekuensi sudut osilasi sistem asimetris ini adalah:',
        highlightLatex: '\\omega = 2{,}5\\text{ rad/s}',
      },
    ],
    speechQuestion:
      'Soal nomor 10. Variasi tak simetris: massa m1 3 koma 0 kilogram dan m2 5 koma 0 kilogram digantung pada satu poros dengan tali l 1 koma 40 meter dan tongkat s 1 koma 40 meter membentuk segitiga sama sisi. Hitung frekuensi sudut osilasi kecilnya dengan g 10 koma 0 meter per sekon kuadrat.',
    speechStimulus:
      'Segitiga sama sisi miring pada sudut setimbang baru karena massa kanan lebih berat sehingga pusat massa bergeser mendekati massa dua.',
    speechFbd:
      'Pada keadaan setimbang, vektor pusat massa selalu lurus ke bawah sehingga jarak pusat massa ke poros dapat dihitung langsung dengan aturan kosinus vektor.',
    speechSolution:
      'Magnitudo massa efektif R sama dengan akar 3 kuadrat tambah 5 kuadrat tambah 3 kali 5 sama dengan akar 49 yaitu 7 koma 0 kilogram. Dengan massa total 8 koma 0 kilogram dan l 1 koma 40 meter, omega sama dengan akar 70 dibagi 11 koma 2 sama dengan akar 6 koma 25 yaitu 2 koma 5 radian per sekon.',
    speechConclusion: 'Jawaban akhir soal nomor 10 adalah 2 koma 5 radian per sekon.',
  },
  {
    id: 11,
    tier: 4,
    tierLabel: 'Level 4 · Penalaran Multi-Langkah',
    title: 'Sistem Dua Pendulum dengan Tongkat Penghubung Bermassa Homogen',
    competency: 'Menerapkan Teorema Sumbu Sejajar pada batang penghubung bermassa m_b',
    prompt:
      'Kembali ke konfigurasi simetris dengan dua massa titik identik $m = 1{,}0\\text{ kg}$ dan dua tali ringan $\\ell = 1{,}25\\text{ m}$, namun kini tongkat penghubung sepanjang $s = 1{,}50\\text{ m}$ merupakan **batang homogen bermassa** $m_b = 2{,}0\\text{ kg}$ (momen inersia batang terhadap pusat massanya $I_{\\text{batang,cm}} = \\frac{1}{12}m_b s^2$). Sistem berosilasi kecil di bidang segitiga di bawah $g = 10{,}0\\text{ m/s}^2$. Hitung frekuensi sudut osilasi kecil $\\omega$ sistem!',
    givenSummary: ['$m = 1{,}0\\text{ kg}$', '$m_b = 2{,}0\\text{ kg}$', '$\\ell = 1{,}25\\text{ m}$', '$s = 1{,}50\\text{ m}$', '$g = 10{,}0\\text{ m/s}^2$'],
    targetSymbol: '\\omega',
    unit: 'rad/s',
    expectedAnswer: '2,7',
    numericValue: 2.7,
    tolerance: 0.05,
    stimulus: {
      type: 'massive-rod',
      caption: 'Sistem segitiga simetris dengan batang homogen bermassa m_b = 2,0 kg menghubungkan dua massa m = 1,0 kg.',
      labels: { ell: 'l = 1,25 m', s: 's = 1,50 m', m: 'm = 1,0 kg', mb: 'm_b = 2,0 kg' },
    },
    simulationPreset: {
      mode: 'massive-rod',
      m: 1.0,
      m2: 1.0,
      mb: 2.0,
      ell: 1.25,
      s: 1.5,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 9,
      v0Impact: 0,
    },
    hint: 'Hitung momen inersia batang terhadap poros atas menggunakan **Teorema Sumbu Sejajar** ($I_b = \\frac{1}{12}m_b s^2 + m_b h^2$ dengan $h = \\ell\\cos\\alpha$), lalu jumlahkan dengan momen inersia dua massa titik $2m\\ell^2$.',
    physicsConcept:
      'Massa batang $m_b$ terletak pada ketinggian yang sama dengan kedua bola ($h = \\ell\\cos\\alpha$), sehingga pusat massa total tetap berada pada kedalaman $h$ dari poros, namun momen inersia total bertambah oleh inersia rotasi dan translasi batang.',
    fbdExplanation:
      'Gaya berat total $(2m + m_b)g$ bekerja pada titik tengah batang berjarak $h = \\ell\\cos\\alpha$ dari poros, menghasilkan torsi pemulih $\\tau = -(2m + m_b)g h \\theta$.',
    mainFormulas: [
      'I_{\\text{tot}} = 2m\\ell^2 + \\frac{1}{12}m_b s^2 + m_b (\\ell\\cos\\alpha)^2',
      '\\omega = \\sqrt{\\frac{(2m + m_b)g\\ell\\cos\\alpha}{I_{\\text{tot}}}}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Diketahui $m = 1{,}0\\text{ kg}$, $m_b = 2{,}0\\text{ kg}$, $\\ell = 1{,}25\\text{ m}$, $s = 1{,}50\\text{ m}$, $g = 10{,}0\\text{ m/s}^2$. Dicari $\\omega$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Gunakan rumus bandul fisis $\\omega = \\sqrt{\\kappa / I_{\\text{tot}}}$ dengan Teorema Sumbu Sejajar untuk batang homogen.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Geometri: $\\sin\\alpha = \\frac{1{,}50}{2 \\times 1{,}25} = 0{,}60 \\implies \\cos\\alpha = 0{,}80$. Kedalaman batang dan pusat massa dari poros adalah $h = 1{,}25 \\times 0{,}80 = 1{,}00\\text{ m}$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Hitung momen inersia total dan kekakuan pemulih gravitasi:',
        highlightLatex: 'I_{\\text{tot}} = 2(1{,}0)(1{,}25)^2 + \\frac{1}{12}(2{,}0)(1{,}50)^2 + 2{,}0(1{,}00)^2 = 3{,}125 + 0{,}375 + 2{,}000 = 5{,}50\\text{ kg}\\cdot\\text{m}^2',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Torsi pemulih $\\kappa = (2{,}0 + 2{,}0)(10{,}0)(1{,}00) = 40{,}0\\text{ N}\\cdot\\text{m}$. Maka:',
        highlightLatex: '\\omega = \\sqrt{\\frac{40{,}0}{5{,}50}} = \\sqrt{7{,}2727} \\approx 2{,}6968\\text{ rad/s}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Jika batang tak bermassa ($m_b = 0$), $\\omega = \\sqrt{10 \\times 0{,}8 / 1{,}25} = \\sqrt{6{,}4} \\approx 2{,}53\\text{ rad/s}$. Penambahan massa $m_b$ di bagian tengah (lebih dekat ke poros daripada $\\ell$) sedikit mempercepat osilasi menjadi $2{,}7\\text{ rad/s}$!',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Frekuensi sudut osilasi sistem dengan batang bermassa adalah:',
        highlightLatex: '\\omega = 2{,}7\\text{ rad/s}',
      },
    ],
    speechQuestion:
      'Soal nomor 11. Dua massa titik 1 koma 0 kilogram dihubungkan tali 1 koma 25 meter dan batang homogen bermassa 2 koma 0 kilogram sepanjang 1 koma 50 meter. Hitung frekuensi sudut osilasi kecil sistem dengan g 10 koma 0 meter per sekon kuadrat.',
    speechStimulus:
      'Batang penghubung kini memiliki massa terdistribusi merata sehingga berkontribusi pada momen inersia dan berat total sistem.',
    speechFbd:
      'Pusat massa batang berimpit dengan pusat massa kedua bola pada kedalaman h sama dengan 1 koma 00 meter di bawah poros.',
    speechSolution:
      'Momen inersia total adalah 3 koma 125 ditambah 0 koma 375 ditambah 2 koma 00 yaitu 5 koma 50 kilogram meter kuadrat. Kekakuan gravitasi 40 koma 0 newton meter. Maka omega sama dengan akar 40 dibagi 5 koma 50 yaitu 2 koma 7 radian per sekon.',
    speechConclusion: 'Jawaban akhir soal nomor 11 adalah 2 koma 7 radian per sekon.',
  },
  {
    id: 12,
    tier: 4,
    tierLabel: 'Level 4 · Penalaran Multi-Langkah',
    title: 'Osilasi Bandul Segitiga di Dalam Kereta yang Dipercepat Horizontal',
    competency: 'Menerapkan konsep kerangka non-inersia dan gravitasi efektif g_eff pada sistem Soal 19',
    prompt:
      'Sistem dua pendulum identik ($m = 1{,}0\\text{ kg}$, $\\ell = 1{,}00\\text{ m}$) yang dihubungkan tongkat tak bermassa sepanjang $s = 1{,}20\\text{ m}$ dipasang pada atap gerbong kereta yang bergerak lurus mendatar ke kanan dengan percepatan konstan $a = 7{,}5\\text{ m/s}^2$ (gunakan $g = 10{,}0\\text{ m/s}^2$). Setelah mencapai sudut setimbang baru relatif terhadap kereta, sistem diberi gangguan kecil sehingga berosilasi di bidang vertikal gerak kereta. Hitung frekuensi sudut osilasi kecil $\\omega$ relatif terhadap kereta!',
    givenSummary: ['$\\ell = 1{,}00\\text{ m}$', '$s = 1{,}20\\text{ m}$', '$a = 7{,}5\\text{ m/s}^2$', '$g = 10{,}0\\text{ m/s}^2$'],
    targetSymbol: '\\omega',
    unit: 'rad/s',
    expectedAnswer: '3,2',
    numericValue: 3.2,
    tolerance: 0.05,
    stimulus: {
      type: 'accelerated-train',
      caption: 'Kereta dipercepat ke kanan (a = 7,5 m/s²) menyebabkan medan gravitasi efektif g_eff miring ke belakang bawah.',
      labels: { ell: 'l = 1,00 m', s: 's = 1,20 m', a: 'a = 7,5 m/s²', g: 'g = 10,0 m/s²' },
    },
    simulationPreset: {
      mode: 'accelerated-train',
      m: 1.0,
      m2: 1.0,
      mb: 0,
      ell: 1.0,
      s: 1.2,
      g: 10.0,
      aTrain: 7.5,
      kSpring: 20,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Dalam kerangka acuan kereta yang dipercepat ke kanan sebesar $a$, bekerja gaya fiktif $-m\\vec{a}$ ke kiri sehingga medan gravitasi efektif berbesar $g_{\\text{eff}} = \\sqrt{g^2 + a^2}$.',
    physicsConcept:
      'Prinsip ekuivalensi menyatakan gaya fiktif $-m\\vec{a}$ dan gravitasi $m\\vec{g}$ bergabung menjadi medan gravitasi efektif seragam $\\vec{g}_{\\text{eff}} = \\vec{g} - \\vec{a}$. Segitiga kaku menyejajarkan sumbu simetrinya dengan $\\vec{g}_{\\text{eff}}$.',
    fbdExplanation:
      'Di kerangka kereta, pada setiap massa bekerja berat $mg$ ke bawah dan gaya fiktif $ma$ ke kiri. Resultannya $mg_{\\text{eff}}$ berarah $36{,}87^\\circ$ ke kiri dari garis vertikal.',
    mainFormulas: [
      'g_{\\text{eff}} = \\sqrt{g^2 + a^2}',
      '\\omega = \\sqrt{\\frac{g_{\\text{eff}}\\cos\\alpha}{\\ell}}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Sistem segitiga kaku berada dalam kereta dengan percepatan horizontal $a = 7{,}5\\text{ m/s}^2$, $g = 10{,}0\\text{ m/s}^2$, $\\ell = 1{,}00\\text{ m}$, dan $s = 1{,}20\\text{ m}$. Dicari $\\omega$ relatif terhadap kereta.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Gunakan kerangka acuan non-inersia kereta: gravitasi efektif $g_{\\text{eff}} = \\sqrt{g^2 + a^2}$ menggantikan $g$ pada persamaan osilasi Soal 19.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Segitiga condong ke belakang sebesar $\\theta_{\\text{eq}} = \\arctan(7{,}5/10{,}0) = 36{,}87^\\circ$, sementara sudut internal segitiga tetap $\\sin\\alpha = 1{,}20 / 2{,}00 = 0{,}60 \\implies \\cos\\alpha = 0{,}80$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Hitung percepatan gravitasi efektif:',
        highlightLatex: 'g_{\\text{eff}} = \\sqrt{10{,}0^2 + 7{,}5^2} = \\sqrt{100 + 56{,}25} = \\sqrt{156{,}25} = 12{,}5\\text{ m/s}^2',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Masukkan $g_{\\text{eff}} = 12{,}5\\text{ m/s}^2$, $\\cos\\alpha = 0{,}80$, dan $\\ell = 1{,}00\\text{ m}$ ke rumus frekuensi sudut:',
        highlightLatex: '\\omega = \\sqrt{\\frac{12{,}5 \\times 0{,}80}{1{,}00}} = \\sqrt{10{,}0} \\approx 3{,}162\\text{ rad/s}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Karena $g_{\\text{eff}} > g$, sistem berosilasi lebih cepat daripada saat kereta diam ($\\sqrt{8{,}0} \\approx 2{,}83\\text{ rad/s}$). Pembulatan satu desimal menghasilkan $3{,}2\\text{ rad/s}$.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Frekuensi sudut osilasi kecil relatif terhadap kereta adalah:',
        highlightLatex: '\\omega = 3{,}2\\text{ rad/s}',
      },
    ],
    speechQuestion:
      'Soal nomor 12. Sistem dua pendulum l 1 koma 00 meter dan tongkat s 1 koma 20 meter dipasang di atap kereta yang dipercepat mendatar ke kanan 7 koma 5 meter per sekon kuadrat. Hitung frekuensi sudut osilasi kecil relatif terhadap kereta dengan g 10 koma 0 meter per sekon kuadrat.',
    speechStimulus:
      'Kereta yang dipercepat ke kanan memiringkan posisi setimbang segitiga ke kiri sesuai arah gravitasi efektif.',
    speechFbd:
      'Gaya fiktif m a ke kiri dan gaya berat m g ke bawah membentuk gravitasi efektif g efektif sama dengan akar g kuadrat tambah a kuadrat.',
    speechSolution:
      'Gravitasi efektif bernilai akar 10 kuadrat tambah 7 koma 5 kuadrat yaitu 12 koma 5 meter per sekon kuadrat. Dengan kosinus alfa 0 koma 80 dan l 1 koma 00 meter, omega sama dengan akar 10 koma 0 atau sekitar 3 koma 2 radian per sekon.',
    speechConclusion: 'Jawaban akhir soal nomor 12 adalah 3 koma 2 radian per sekon.',
  },
  {
    id: 13,
    tier: 5,
    tierLabel: 'Level 5 · Tantangan HOTS OSK',
    title: 'Mode Napas Simetris Saat Tongkat Kaku Diganti Pegas Elastis',
    competency: 'Menurunkan frekuensi normal mode osilasi relatif (mode napas) sistem pegas-pendulum',
    prompt:
      'Tinjau sistem dua pendulum identik ($m = 1{,}0\\text{ kg}$, $\\ell = 1{,}00\\text{ m}$, $g = 10{,}0\\text{ m/s}^2$) yang digantung pada satu poros yang sama. Tongkat kaku kini diganti dengan **pegas tak bermassa** berkonstanta $k = 32{,}0\\text{ N/m}$ yang panjang alaminya diatur sedemikian rupa sehingga pada keadaan setimbang pegas tertekan hingga panjangnya $s_{\\text{eq}} = \\sqrt{3}\\,\\ell$ (membentuk sudut puncak $2\\alpha_0 = 120^\\circ$). Jika kedua massa digerakkan secara **simetris berlawanan arah** (mode napas: $\\theta_1 = -\\alpha_0 - \\delta\\alpha$, $\\theta_2 = +\\alpha_0 + \\delta\\alpha$) dengan $\\delta\\alpha$ kecil, hitung frekuensi sudut mode napas $\\omega_{\\text{napas}}$!',
    givenSummary: ['$m = 1{,}0\\text{ kg}$', '$\\ell = 1{,}00\\text{ m}$', '$k = 32{,}0\\text{ N/m}$', '$2\\alpha_0 = 120^\\circ$', '$g = 10{,}0\\text{ m/s}^2$'],
    targetSymbol: '\\omega_{\\text{napas}}',
    unit: 'rad/s',
    expectedAnswer: '6,0',
    numericValue: 6.0,
    tolerance: 0.05,
    stimulus: {
      type: 'spring-triangle',
      caption: 'Mode napas simetris (berlawanan fase): kedua massa berayun membuka-menutup terhadap sumbu vertikal dengan pegas k = 32,0 N/m di antaranya.',
      labels: { ell: 'l = 1,00 m', k: 'k = 32,0 N/m', twoAlpha: '2α₀ = 120°' },
    },
    simulationPreset: {
      mode: 'spring-breathing',
      m: 1.0,
      m2: 1.0,
      mb: 0,
      ell: 1.0,
      s: 1.732,
      g: 10.0,
      aTrain: 0,
      kSpring: 32.0,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Gunakan ekspansi energi potensial total $U(\\alpha) = -2mg\\ell\\cos\\alpha + \\frac{1}{2}k(s_{\\text{alami}} - 2\\ell\\sin\\alpha)^2$ hingga orde kedua $\\delta\\alpha^2$, manfaatkan syarat setimbang $U\'(\\alpha_0) = 0$ untuk mengeliminasi $s_{\\text{alami}}$!',
    physicsConcept:
      'Mengganti tongkat kaku dengan pegas memunculkan derajat kebebasan kedua: mode sefase (kaku, seperti Soal 19 dengan $\\omega_1 = \\sqrt{g\\cos\\alpha_0/\\ell}$) dan mode berlawanan fase (mode napas) yang memampatkan-meregangkan pegas.',
    fbdExplanation:
      'Saat $\\alpha$ bertambah sebesar $\\delta\\alpha$, jarak kedua massa berubah sebesar $\\delta s \\approx (2\\ell\\cos\\alpha_0)\\delta\\alpha$. Gaya pegas memulihkan $\\delta s$, dan gravitasi juga menyumbang kekakuan efektif.',
    mainFormulas: [
      'U(\\alpha) = -2mg\\ell\\cos\\alpha + \\frac{1}{2}k(s_{\\text{alami}} - 2\\ell\\sin\\alpha)^2',
      '\\omega_{\\text{napas}} = \\sqrt{\\frac{g}{\\ell\\cos\\alpha_0} + \\frac{2k\\cos^2\\alpha_0}{m}}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Tongkat kaku diganti pegas $k = 32{,}0\\text{ N/m}$ dengan sudut setimbang $\\alpha_0 = 60^\\circ$. Kita mencari frekuensi sudut mode napas simetris $\\delta\\alpha$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Untuk sistem 1 derajat kebebasan simetris $\\alpha(t) = \\alpha_0 + \\delta\\alpha(t)$, energi kinetik adalah $K = 2 \\cdot \\frac{1}{2}m\\ell^2\\dot{\\alpha}^2 = \\frac{1}{2}(2m\\ell^2)\\dot{\\alpha}^2$, sehingga $\\omega_{\\text{napas}} = \\sqrt{\\frac{U\'\'(\\alpha_0)}{2m\\ell^2}}$.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Kedua massa bergerak simetris berlawanan arah terhadap sumbu vertikal, menekan dan meregangkan pegas di antaranya.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Turunkan $U(\\alpha)$ dua kali dan substitusikan syarat kesetimbangan $k(s_{\\text{alami}} - 2\\ell\\sin\\alpha_0) = mg\\tan\\alpha_0$:',
        highlightLatex: 'U\'\'(\\alpha_0) = 2mg\\ell\\cos\\alpha_0 + 2mg\\ell\\frac{\\sin^2\\alpha_0}{\\cos\\alpha_0} + 4k\\ell^2\\cos^2\\alpha_0 = \\frac{2mg\\ell}{\\cos\\alpha_0} + 4k\\ell^2\\cos^2\\alpha_0',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Bagi dengan $2m\\ell^2$, lalu substitusi $\\cos 60^\\circ = 0{,}5$, $\\ell = 1{,}00$, $m = 1{,}0$, $k = 32{,}0$, $g = 10{,}0$:',
        highlightLatex: '\\omega_{\\text{napas}} = \\sqrt{\\frac{10{,}0}{1{,}00 \\times 0{,}5} + \\frac{2(32{,}0)(0{,}5)^2}{1{,}0}} = \\sqrt{20{,}0 + 16{,}0} = \\sqrt{36{,}0} = 6{,}0\\text{ rad/s}',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Uji batas $\\alpha_0 = 0$: $\\omega_{\\text{napas}} = \\sqrt{\\frac{g}{\\ell} + \\frac{2k}{m}}$, tepat sesuai rumus klasik dua pendulum terkopel pegas! Satuan $\\text{rad/s}$ konsisten.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Frekuensi sudut mode napas sistem adalah:',
        highlightLatex: '\\omega_{\\text{napas}} = 6{,}0\\text{ rad/s}',
      },
    ],
    speechQuestion:
      'Soal nomor 13, tantangan HOTS. Tongkat kaku diganti pegas berkonstanta k 32 koma 0 newton per meter sehingga pada keadaan setimbang sudut puncak 120 derajat. Jika kedua massa berosilasi berlawanan arah secara simetris dalam mode napas, hitung frekuensi sudutnya dengan m 1 koma 0 kilogram, l 1 koma 00 meter, dan g 10 koma 0 meter per sekon kuadrat.',
    speechStimulus:
      'Animasi memperlihatkan kedua massa bergerak berlawanan arah menekan dan meregangkan pegas secara simetris.',
    speechFbd:
      'Pada keadaan setimbang gaya pegas mengimbangi komponen tangensial gravitasi, sehingga turunan kedua energi potensial tidak lagi bergantung pada panjang alami pegas.',
    speechSolution:
      'Frekuensi sudut mode napas sama dengan akar g dibagi l kosinus alfa nol ditambah 2 k kosinus kuadrat alfa nol dibagi m. Dengan kosinus 60 derajat sama dengan 0 koma 5, diperoleh akar 20 tambah 16 sama dengan akar 36 yaitu 6 koma 0 radian per sekon.',
    speechConclusion: 'Jawaban akhir soal nomor 13 adalah 6 koma 0 radian per sekon.',
  },
  {
    id: 14,
    tier: 5,
    tierLabel: 'Level 5 · Tantangan HOTS OSK',
    title: 'Penambahan Massa Titik pada Titik Tengah Tongkat Penghubung',
    competency: 'Menganalisis perubahan rasio kekakuan gravitasi dan momen inersia akibat beban di titik tengah tongkat',
    prompt:
      'Tinjau kembali sistem dua pendulum identik pada Soal 19 dengan masing-masing massa $m = 4{,}0\\text{ kg}$ dan panjang tali $\\ell = 2{,}0\\text{ m}$ yang dihubungkan oleh tongkat kaku tak bermassa sepanjang $s = 2\\sqrt{3}\\text{ m}$ (sehingga $\\cos\\alpha = 0{,}50$). Sekarang, tepat di **titik tengah tongkat** dipasang sebuah massa titik tambahan $M = 5{,}5\\text{ kg}$. Tentukan perbandingan frekuensi osilasi kecil sistem yang baru terhadap frekuensi sistem sebelum massa $M$ dipasang, $\\frac{f_{\\text{baru}}}{f_{\\text{lama}}}$!',
    givenSummary: ['$m = 4{,}0\\text{ kg}$', '$M = 5{,}5\\text{ kg}$', '$\\ell = 2{,}0\\text{ m}$', '$s = 2\\sqrt{3}\\text{ m}$ ($\\cos\\alpha = 0{,}50$)'],
    targetSymbol: 'f_{\\text{baru}}/f_{\\text{lama}}',
    unit: 'tanpa satuan',
    expectedAnswer: '1,2',
    numericValue: 1.2,
    tolerance: 0.03,
    stimulus: {
      type: 'midpoint-mass',
      caption: 'Massa tambahan M = 5,5 kg dipasang tepat di titik tengah tongkat (berjarak h = l cos α dari poros atas).',
      labels: { m: 'm = 4,0 kg', M: 'M = 5,5 kg', ell: 'l = 2,0 m', cosAlpha: 'cos α = 0,50' },
    },
    simulationPreset: {
      mode: 'midpoint-mass',
      m: 4.0,
      m2: 4.0,
      mb: 5.5,
      ell: 2.0,
      s: 3.464,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 8,
      v0Impact: 0,
    },
    hint: 'Jarak massa $M$ dari poros hanyalah $h = \\ell\\cos\\alpha$ (lebih dekat ke poros daripada $\\ell$), padahal seluruh massa berada pada kedalaman vertikal yang sama $h$!',
    physicsConcept:
      'Penambahan massa di titik tengah tongkat meningkatkan massa total (torsi pemulih naik proporsional terhadap $2m + M$), sedangkan kontribusinya terhadap momen inersia hanya $M(\\ell\\cos\\alpha)^2$, lebih kecil daripada $M\\ell^2$. Akibatnya frekuensi justru **meningkat**!',
    fbdExplanation:
      'Titik pusat massa gabungan $2m$ dan $M$ tetap berada tepat di titik tengah tongkat ($d_{\\text{cm}} = h = \\ell\\cos\\alpha$), sehingga torsi pemulih naik dari $2mg\\ell\\cos\\alpha$ menjadi $(2m+M)g\\ell\\cos\\alpha$.',
    mainFormulas: [
      'I_{\\text{baru}} = 2m\\ell^2 + M(\\ell\\cos\\alpha)^2',
      '\\frac{f_{\\text{baru}}}{f_{\\text{lama}}} = \\sqrt{\\frac{2m + M}{2m + M\\cos^2\\alpha}}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Dua massa $m = 4{,}0\\text{ kg}$ dihubungkan tongkat dengan $\\cos\\alpha = 0{,}50$. Massa $M = 5{,}5\\text{ kg}$ dipasang di titik tengah tongkat. Dicari rasio $f_{\\text{baru}}/f_{\\text{lama}}$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Hitung perbandingan $\\omega_{\\text{baru}} / \\omega_{\\text{lama}}$ menggunakan rumus bandul fisis $\\omega = \\sqrt{\\kappa / I}$.',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Kedua massa $m$ berjarak $\\ell = 2{,}0\\text{ m}$ dari poros, sedangkan massa titik $M$ berjarak $h = \\ell\\cos\\alpha = 1{,}0\\text{ m}$ dari poros.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Substitusi $I$ dan $\\kappa$ sebelum dan sesudah $M$ dipasang:',
        highlightLatex: '\\frac{f_{\\text{baru}}}{f_{\\text{lama}}} = \\sqrt{\\frac{(2m+M)g\\ell\\cos\\alpha}{2m\\ell^2 + M\\ell^2\\cos^2\\alpha} \\cdot \\frac{\\ell}{g\\cos\\alpha}} = \\sqrt{\\frac{2m + M}{2m + M\\cos^2\\alpha}}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Masukkan $2m = 8{,}0\\text{ kg}$, $M = 5{,}5\\text{ kg}$, dan $\\cos^2\\alpha = (0{,}50)^2 = 0{,}25$:',
        highlightLatex: '\\frac{f_{\\text{baru}}}{f_{\\text{lama}}} = \\sqrt{\\frac{8{,}0 + 5{,}5}{8{,}0 + 5{,}5(0{,}25)}} = \\sqrt{\\frac{13{,}5}{9{,}375}} = \\sqrt{1{,}44} = 1{,}2',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Secara fisis, meletakkan massa di titik tengah tongkat mendekatkan rata-rata massa ke poros sehingga $\\ell_{\\text{eff}}$ mengecil dan frekuensi naik ($1{,}2 > 1$). Rasio bebas satuan.',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Perbandingan frekuensi baru terhadap frekuensi lama adalah:',
        highlightLatex: '\\frac{f_{\\text{baru}}}{f_{\\text{lama}}} = 1{,}2',
      },
    ],
    speechQuestion:
      'Soal nomor 14, tantangan HOTS. Pada sistem dua pendulum m 4 koma 0 kilogram dan kosinus alfa 0 koma 50, sebuah massa tambahan M 5 koma 5 kilogram dipasang tepat di titik tengah tongkat. Tentukan rasio frekuensi baru terhadap frekuensi lama.',
    speechStimulus:
      'Massa M berada pada jarak h sama dengan l kosinus alfa dari poros atas, lebih dekat ke poros dibanding kedua massa ujung.',
    speechFbd:
      'Pusat massa sistem gabungan tetap berada di titik tengah tongkat, sehingga torsi pemulih bertambah sebanding dengan total massa.',
    speechSolution:
      'Rasio frekuensi adalah akar dari dua m tambah M dibagi dua m tambah M kosinus kuadrat alfa, yaitu akar 13 koma 5 dibagi 9 koma 375 sama dengan akar 1 koma 44 yaitu 1 koma 2.',
    speechConclusion: 'Jawaban akhir soal nomor 14 adalah 1 koma 2.',
  },
  {
    id: 15,
    tier: 5,
    tierLabel: 'Level 5 · Tantangan HOTS OSK',
    title: 'Tumbukan Tak Lenting pada Titik Tengah Tongkat Bandul Segitiga',
    competency: 'Menggabungkan kekekalan momentum sudut tumbukan, kekekalan energi mekanik, dan persamaan kuadrat geometri',
    prompt:
      'Dua pendulum identik ($m = 1{,}0\\text{ kg}$, $\\ell = 2{,}0\\text{ m}$) digantung pada satu poros yang sama dan dihubungkan oleh tongkat tak bermassa dengan panjang $s$ yang belum diketahui. Mulanya sistem diam di posisi setimbang. Sebuah gumpalan plastisin bermassa $m_0 = 2{,}0\\text{ kg}$ bergerak mendatar di dalam bidang segitiga dengan kelajuan $v_0 = 2{,}0\\text{ m/s}$, lalu menumbuk secara **tidak lenting sama sekali** tepat pada titik tengah tongkat penghubung dan menempel di sana. Akibatnya, sistem berayun harmonik kecil dengan simpangan sudut maksimum $\\theta_{\\max} = 0{,}20\\text{ rad}$ (gunakan pendekatan sudut kecil $1 - \\cos\\theta_{\\max} \\approx \\frac{1}{2}\\theta_{\\max}^2$ dan $g = 10{,}0\\text{ m/s}^2$). Tentukan panjang tongkat $s$!',
    givenSummary: ['$m = 1{,}0\\text{ kg}$', '$\\ell = 2{,}0\\text{ m}$', '$m_0 = 2{,}0\\text{ kg}$', '$v_0 = 2{,}0\\text{ m/s}$', '$\\theta_{\\max} = 0{,}20\\text{ rad}$', '$g = 10{,}0\\text{ m/s}^2$'],
    targetSymbol: 's',
    unit: 'm',
    expectedAnswer: '3,5',
    numericValue: 3.5,
    tolerance: 0.08,
    stimulus: {
      type: 'inelastic-collision',
      caption: 'Plastisin m₀ = 2,0 kg menumbuk mendatar titik tengah tongkat panjang s hingga sistem berayun mencapai sudut maksimum θ_max = 0,20 rad.',
      labels: { m: 'm = 1,0 kg', m0: 'm₀ = 2,0 kg', v0: 'v₀ = 2,0 m/s', ell: 'l = 2,0 m', thetaMax: 'θ_max = 0,20 rad' },
    },
    simulationPreset: {
      mode: 'collision-impact',
      m: 1.0,
      m2: 1.0,
      mb: 2.0,
      ell: 2.0,
      s: 3.464,
      g: 10.0,
      aTrain: 0,
      kSpring: 20,
      theta0Deg: 11.5,
      v0Impact: 2.0,
    },
    hint: 'Gunakan **kekekalan momentum sudut terhadap poros** selama tumbukan ($L = m_0 v_0 h = I\\Omega_0$ dengan $h = \\ell\\cos\\alpha$), lalu gunakan **kekekalan energi mekanik** setelah tumbukan ($\\frac{1}{2}I\\Omega_0^2 = \\Delta U$) untuk membentuk persamaan kuadrat dalam $\\cos\\alpha$!',
    physicsConcept:
      'Selama tumbukan sangat singkat, gaya impulsif tali berarah radial menuju poros sehingga tidak menghasilkan impuls sudut terhadap poros. Momentum sudut terhadap poros kekal, kemudian setelah menempel energi mekanik kekal.',
    fbdExplanation:
      'Saat tumbukan di titik tengah tongkat, lengan momen kecepatan mendatar $v_0$ terhadap poros atas adalah $h = \\ell\\cos\\alpha$. Momen inersia setelah menempel adalah $I = 2m\\ell^2 + m_0(\\ell\\cos\\alpha)^2$.',
    mainFormulas: [
      'L = m_0 v_0 (\\ell\\cos\\alpha), \\qquad I = \\ell^2(2m + m_0\\cos^2\\alpha)',
      '\\frac{L^2}{2I} = (2m + m_0)g(\\ell\\cos\\alpha)\\frac{\\theta_{\\max}^2}{2}',
      's = 2\\ell\\sqrt{1 - \\cos^2\\alpha}',
    ],
    solutionStages: [
      {
        stageNumber: 1,
        title: 'Memahami Permasalahan',
        body: 'Plastisin $m_0 = 2{,}0\\text{ kg}$ berkelajuan $v_0 = 2{,}0\\text{ m/s}$ menumbuk dan menempel pada titik tengah tongkat bandul segitiga ($m = 1{,}0\\text{ kg}, \\ell = 2{,}0\\text{ m}$), menghasilkan amplitudo ayunan $\\theta_{\\max} = 0{,}20\\text{ rad}$. Dicari panjang tongkat $s$.',
      },
      {
        stageNumber: 2,
        title: 'Identifikasi Konsep',
        body: 'Dua tahap fisis: (1) Tumbukan tak lenting: momentum sudut terhadap poros kekal ($L_i = L_f$), energi kinetik hilang. (2) Pasca-tumbukan: energi mekanik kekal ($K_{\\text{awal}} = \\Delta U_{\\max}$).',
      },
      {
        stageNumber: 3,
        title: 'Visualisasi Sistem',
        body: 'Misalkan $h = \\ell\\cos\\alpha$. Sebelum menempel, $m_0$ bergerak mendatar pada jarak tegak lurus $h$ dari poros $O$. Setelah menempel, sistem segitiga simetris bermassa total $4{,}0\\text{ kg}$ berayun naik hingga $\\theta_{\\max}$.',
      },
      {
        stageNumber: 4,
        title: 'Analisis Matematis',
        body: 'Tuliskan $L = m_0 v_0 \\ell\\cos\\alpha = 8{,}0\\cos\\alpha$ dan $I = 2m\\ell^2 + m_0\\ell^2\\cos^2\\alpha = 8{,}0(1 + \\cos^2\\alpha)$. Energi kinetik sesaat setelah tumbukan sama dengan energi potensial puncak:',
        highlightLatex: '\\frac{L^2}{2I} = \\frac{64{,}0\\cos^2\\alpha}{16{,}0(1 + \\cos^2\\alpha)} = (4{,}0)(10{,}0)(2{,}0\\cos\\alpha)\\frac{(0{,}20)^2}{2}',
      },
      {
        stageNumber: 5,
        title: 'Penyelesaian Bertahap',
        body: 'Sederhanakan persamaan untuk $\\cos\\alpha > 0$:',
        highlightLatex: '\\frac{4{,}0\\cos\\alpha}{1 + \\cos^2\\alpha} = 1{,}60 \\implies 2\\cos^2\\alpha - 5\\cos\\alpha + 2 = 0 \\implies (2\\cos\\alpha - 1)(\\cos\\alpha - 2) = 0',
      },
      {
        stageNumber: 6,
        title: 'Pemeriksaan Hasil',
        body: 'Karena $\\cos\\alpha \\le 1$, akar fisis satu-satunya adalah $\\cos\\alpha = 0{,}50$. Maka $\\sin\\alpha = \\frac{\\sqrt{3}}{2}$, sehingga $s = 2\\ell\\sin\\alpha = 2(2{,}0)\\frac{\\sqrt{3}}{2} = 2\\sqrt{3} \\approx 3{,}464\\text{ m} < 2\\ell = 4{,}0\\text{ m}$. Konsisten secara geometri dan satuan!',
      },
      {
        stageNumber: 7,
        title: 'Jawaban Akhir',
        body: 'Panjang tongkat penghubung adalah:',
        highlightLatex: 's = 3{,}5\\text{ m}',
      },
    ],
    speechQuestion:
      'Soal nomor 15, tantangan puncak HOTS. Dua pendulum m 1 koma 0 kilogram dan tali l 2 koma 0 meter terhubung tongkat sepanjang s. Plastisin 2 koma 0 kilogram berkecepatan mendatar 2 koma 0 meter per sekon menumbuk tidak lenting tepat di titik tengah tongkat hingga sistem berayun mencapai sudut maksimum 0 koma 20 radian. Tentukan panjang tongkat s.',
    speechStimulus:
      'Visual memperlihatkan plastisin datang mendatar dari kiri menempel di titik tengah tongkat lalu seluruh segitiga berayun naik.',
    speechFbd:
      'Selama tumbukan momentum sudut terhadap poros kekal, sedangkan setelah menempel energi mekanik kekal.',
    speechSolution:
      'Dengan menyamakan energi kinetik pasca tumbukan L kuadrat per dua I terhadap energi potensial puncak, diperoleh persamaan kuadrat dua kosinus kuadrat alfa minus lima kosinus alfa tambah dua sama dengan nol. Akar fisisnya adalah kosinus alfa sama dengan 0 koma 5, sehingga s sama dengan dua akar tiga atau sekitar 3 koma 5 meter.',
    speechConclusion: 'Jawaban akhir soal nomor 15 adalah 3 koma 5 meter.',
  },
];
