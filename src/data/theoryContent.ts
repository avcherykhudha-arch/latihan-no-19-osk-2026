export interface TheorySection {
  id: number;
  title: string;
  subtitle: string;
  content: string[];
  keyEquations?: Array<{ label: string; latex: string; meaning: string }>;
  visualType?: 'osk19-geometry' | 'fbd-equilibrium' | 'graph-ratio' | 'modes-comparison' | 'none';
  calloutTitle?: string;
  calloutBody?: string;
  speechScript: string;
}

export interface FormulaCardItem {
  id: string;
  name: string;
  latex: string;
  condition: string;
  symbols: Array<{ symbol: string; meaning: string; unit: string; dimension: string }>;
  speechScript: string;
}

export const THEORY_SECTIONS: TheorySection[] = [
  {
    id: 1,
    title: 'Pengetahuan Awal yang Wajib Dikuasai',
    subtitle: 'Fondasi vektor, trigonometri segitiga samakaki, dan gerak harmonik sederhana',
    content: [
      'Sebelum menganalisis sistem dua pendulum terhubung batang pada Soal Nomor 19 OSK 2026, siswa wajib menguasai empat konsep prasyarat: (1) trigonometri segitiga samakaki, khususnya hubungan $\\sin\\alpha = \\frac{s}{2\\ell}$ dan $\\cos\\alpha = \\sqrt{1 - \\sin^2\\alpha}$; (2) penentuan pusat massa (CM) sistem partikel diskret; (3) momen inersia partikel titik $I = \\sum m_i r_i^2$ terhadap sumbu putar tetap; serta (4) persamaan diferensial Gerak Harmonik Sederhana (GHS) sudut $\\ddot{\\theta} + \\omega^2 \\theta = 0$.',
      'Selain itu, pemahaman tentang pendekatan sudut kecil ($\\sin\\theta \\approx \\theta$ dan $1 - \\cos\\theta \\approx \\frac{1}{2}\\theta^2$ untuk $\\theta$ dalam radian) sangat penting karena soal OSK menekankan frasa "diberi gangguan kecil di dekat keadaan setimbangnya".',
    ],
    keyEquations: [
      {
        label: 'Identitas Geometri Segitiga',
        latex: '\\sin\\alpha = \\frac{s}{2\\ell}, \\qquad \\cos\\alpha = \\sqrt{1 - \\frac{s^2}{4\\ell^2}}',
        meaning: 'Menghubungkan panjang tongkat s dengan setengah sudut puncak alpha terhadap vertikal.',
      },
      {
        label: 'Persamaan GHS Rotasi',
        latex: '\\frac{d^2\\theta}{dt^2} + \\omega^2 \\theta = 0 \\implies f = \\frac{\\omega}{2\\pi}',
        meaning: 'Bentuk baku osilasi harmonik kecil dengan frekuensi sudut omega.',
      },
    ],
    visualType: 'none',
    speechScript:
      'Bagian pertama, pengetahuan awal yang wajib dikuasai. Untuk menaklukkan soal nomor 19 OSK Fisika 2026, kuasai empat fondasi utama: trigonometri segitiga sama kaki, titik pusat massa, momen inersia partikel titik I sama dengan sigma m kali r kuadrat, serta persamaan gerak harmonik sederhana dengan pendekatan sudut kecil.',
  },
  {
    id: 2,
    title: 'Pengertian dan Definisi Konsep',
    subtitle: 'Apa itu bandul fisis majemuk dan sistem benda tegar segitiga?',
    content: [
      'Bandul sederhana (matematis) memodelkan satu massa titik yang digantung pada tali ringan panjang $\\ell$. Sebaliknya, **bandul fisis (compound pendulum)** adalah sembarang benda tegar atau sistem partikel kaku yang dapat berayun bebas di bawah gravitasi terhadap suatu poros tetap yang tidak melewati pusat massanya.',
      'Pada Soal Nomor 19 OSK 2026, dua massa titik identik $m$ dihubungkan oleh dua tali tak mulur panjang $\\ell$ ke **satu poros yang sama**, dan dipisahkan oleh **tongkat kaku tak bermassa sepanjang $s$**. Karena jarak antar ketiga titik (poros dan dua massa) seluruhnya tetap ($\\ell$, $\\ell$, dan $s$), ketiga titik tersebut membentuk **segitiga kaku** yang bergerak sebagai satu kesatuan benda tegar berotasi terhadap poros atas.',
    ],
    visualType: 'osk19-geometry',
    speechScript:
      'Bagian kedua, pengertian dan definisi konsep. Pada soal nomor 19, dua massa titik m dihubungkan ke satu poros yang sama dengan tali l, lalu dipisahkan oleh tongkat kaku tak bermassa sepanjang s. Karena panjang ketiga sisinya tetap, seluruh sistem bekerja sebagai satu benda tegar berbentuk segitiga yang berosilasi terhadap poros puncak.',
  },
  {
    id: 3,
    title: 'Fenomena Fisika yang Mendasari',
    subtitle: 'Mengapa kehadiran tongkat s memperlambat osilasi sistem?',
    content: [
      'Bayangkan awalnya $s = 0$: kedua massa berimpit tepat di bawah poros pada jarak $\\ell$, sehingga sistem identik dengan bandul sederhana berpanjang $\\ell$ dan berfrekuensi $f(0) = \\frac{1}{2\\pi}\\sqrt{g/\\ell}$.',
      'Saat tongkat sepanjang $s > 0$ dipasang di antara kedua massa, kedua massa terdorong saling menjauh ke samping sehingga posisinya menjadi **lebih tinggi** terhadap titik terendah lingkaran jari-jari $\\ell$. Kedalaman vertikal pusat massa sistem dari poros berkurang dari $\\ell$ menjadi $d_{\\text{cm}} = \\ell\\cos\\alpha < \\ell$. Akibatnya, lengan torsi pemulih gravitasi mengecil, **sementara momen inersia terhadap poros tetap bernilai $I = 2m\\ell^2$** karena jarak tiap massa ke poros tetap $\\ell$! Torsi pemulih melemah dengan inersia tetap menyebabkan frekuensi osilasi $f(s)$ selalu lebih kecil daripada $f(0)$.',
    ],
    calloutTitle: 'Inti Fenomena Soal 19',
    calloutBody:
      'Memperbesar panjang tongkat $s$ TIDAK mengubah momen inersia $I = 2m\\ell^2$ di bidang segitiga, tetapi memperpendek jarak pusat massa $d_{\\text{cm}} = \\ell\\cos\\alpha$ dari poros sehingga torsi pemulih berkurang dan osilasi melambat.',
    speechScript:
      'Bagian ketiga, fenomena fisika yang mendasari. Ketika tongkat s diperpanjang, posisi kedua massa naik mendekati ketinggian poros sehingga jarak pusat massa ke poros mengecil menjadi l kosinus alfa. Padahal jarak tiap massa ke poros tetap l, sehingga momen inersia I tetap dua m l kuadrat. Akibatnya torsi pemulih berkurang dan frekuensi osilasi melambat.',
  },
  {
    id: 4,
    title: 'Prinsip dan Hukum Fisika',
    subtitle: 'Hukum II Newton untuk rotasi dan kekekalan energi mekanik',
    content: [
      'Analisis dinamika sistem dapat dilakukan melalui dua jalur yang saling menguatkan:',
      '1. **Hukum II Newton untuk Rotasi**: $\\sum \\tau_{\\text{poros}} = I \\ddot{\\theta}$. Gaya tegangan tali bekerja radial menuju poros sehingga tidak menghasilkan torsi terhadap poros. Gaya tekan internal di sepanjang tongkat $s$ merupakan pasangan aksi-reaksi internal antara $m_1$ dan $m_2$, sehingga total torsi internalnya tepat **nol**. Satu-satunya torsi eksternal terhadap poros berasal dari gaya berat kedua massa.',
      '2. **Pendekatan Energi Mekanik (Lagrangian)**: Energi kinetik total $K = \\frac{1}{2} I \\dot{\\theta}^2$ dan energi potensial gravitasi total $U(\\theta) = -M_{\\text{tot}} g d_{\\text{cm}} \\cos\\theta$. Dengan mengekspansi $\\cos\\theta \\approx 1 - \\frac{1}{2}\\theta^2$ dan menurunkan $E = K + U$ terhadap waktu, diperoleh persamaan frekuensi yang identik.',
    ],
    speechScript:
      'Bagian keempat, prinsip dan hukum fisika. Gaya tegangan tali berarah menuju poros sehingga torsinya nol, dan gaya tekan di dalam tongkat adalah gaya internal yang saling meniadakan. Dengan hukum dua Newton untuk rotasi maupun kekekalan energi mekanik, hanya gravitasi pada pusat massa yang menyumbang torsi pemulih.',
  },
  {
    id: 5,
    title: 'Penurunan Persamaan Matematis Lengkap',
    subtitle: 'Derivasi langkah demi langkah hingga solusi Soal Nomor 19 OSK 2026',
    content: [
      'Misalkan sistem segitiga kaku menyimpang sebesar sudut kecil $\\theta$ terhadap garis vertikal setimbang. Karena segitiga samakaki memiliki sisi miring $\\ell$ dan alas $s$, setengah sudut puncaknya memenuhi $\\sin\\alpha = \\frac{s}{2\\ell}$ dan $\\cos\\alpha = \\sqrt{1 - \\frac{s^2}{4\\ell^2}}$.',
      'Jarak pusat massa (titik tengah tongkat $s$) ke poros atas adalah $d_{\\text{cm}} = \\ell\\cos\\alpha$. Momen inersia sistem dua massa titik terhadap poros adalah $I = m\\ell^2 + m\\ell^2 = 2m\\ell^2$.',
      'Torsi pemulih total gravitasi terhadap poros saat menyimpang $\\theta$ adalah $\\tau = -(2m) g d_{\\text{cm}} \\sin\\theta \\approx -2mg\\ell\\cos\\alpha\\,\\theta$. Substitusi ke $I\\ddot{\\theta} = \\tau$ menghasilkan persamaan osilasi, dan dari situlah rumus $f(s)$ diturunkan.',
    ],
    keyEquations: [
      {
        label: 'Persamaan Gerak Bandul Segitiga',
        latex: '(2m\\ell^2)\\ddot{\\theta} = -2mg\\ell\\cos\\alpha\\,\\theta \\implies \\ddot{\\theta} + \\left(\\frac{g\\cos\\alpha}{\\ell}\\right)\\theta = 0',
        meaning: 'Massa m saling menghilangkan sehingga frekuensi tidak bergantung pada nilai m (selama kedua massa identik).',
      },
      {
        label: 'Frekuensi Sistem f(s)',
        latex: 'f(s) = \\frac{1}{2\\pi}\\sqrt{\\frac{g\\cos\\alpha}{\\ell}} = f(0)\\left(1 - \\frac{s^2}{4\\ell^2}\\right)^{1/4}',
        meaning: 'Persamaan utama Soal Nomor 19 OSK 2026 dengan f(0) = (1/2pi) akar(g/l).',
      },
      {
        label: 'Solusi Rasio Soal 19 (f(s0)/f(0) = 1/akar(2))',
        latex: '\\left(1 - \\frac{s_0^2}{4\\ell^2}\\right)^{1/4} = \\frac{1}{\\sqrt{2}} \\implies 1 - \\frac{s_0^2}{4\\ell^2} = \\frac{1}{4} \\implies \\frac{s_0}{\\ell} = \\sqrt{3} \\approx 1,7',
        meaning: 'Pangkat empat kedua ruas segera memberikan s0/l = akar(3).',
      },
    ],
    visualType: 'graph-ratio',
    speechScript:
      'Bagian kelima, penurunan persamaan matematis lengkap. Dengan memasukkan momen inersia dua m l kuadrat dan torsi pemulih minus dua m g l kosinus alfa kali teta, diperoleh frekuensi sudut omega sama dengan akar g kosinus alfa dibagi l. Maka f s dibagi f nol sama dengan pangkat seperempat dari satu minus s kuadrat dibagi empat l kuadrat. Untuk rasio satu per akar dua, diperoleh s nol dibagi l sama dengan akar tiga atau sekitar satu koma tujuh.',
  },
  {
    id: 6,
    title: 'Makna Setiap Simbol dalam Persamaan',
    subtitle: 'Membedakan sudut bukaan statis alpha dan sudut osilasi dinamis theta',
    content: [
      'Salah satu kunci agar tidak tersesat saat mengerjakan soal lanjutan adalah membedakan dengan tegas dua sudut yang muncul pada sistem ini:',
      '• $\\alpha$: setengah sudut puncak segitiga tetap antara masing-masing tali dan sumbu simetri segitiga. Nilainya **konstan** selama tongkat kaku terpasang, ditentukan oleh $\\sin\\alpha = s/(2\\ell)$.',
      '• $\\theta(t)$: sudut simpangan sesaat sumbu simetri segitiga terhadap garis vertikal setimbang. Nilainya **berosilasi** harmonik antara $-\\theta_0$ dan $+\\theta_0$.',
      '• $d_{\\text{cm}} = \\ell\\cos\\alpha$: jarak titik pusat massa sistem dari poros gantung.',
      '• $\\ell_{\\text{eff}} = \\frac{I}{M_{\\text{tot}} d_{\\text{cm}}} = \\frac{\\ell}{\\cos\\alpha}$: panjang efektif bandul sederhana ekivalen yang memiliki periode yang sama.',
    ],
    speechScript:
      'Bagian keenam, makna setiap simbol. Bedakan dua sudut penting: alfa adalah setengah sudut puncak segitiga yang bernilai tetap karena panjang tongkat s tetap, sedangkan teta adalah sudut simpangan osilasi terhadap garis vertikal yang berubah terhadap waktu.',
  },
  {
    id: 7,
    title: 'Dimensi dan Satuan Setiap Besaran',
    subtitle: 'Konsistensi SI untuk pengecekan cepat rumus Olimpiade',
    content: [
      'Dalam setiap penurunan atau substitusi angka Olimpiade, pemeriksaan dimensi memastikan persamaan bebas dari kesalahan aljabar. Perhatikan bahwa fungsi trigonometri $\\cos\\alpha$ dan rasio $s/\\ell$ bersifat **tak berdimensi**.',
      '• Panjang tali $\\ell$, panjang tongkat $s$, dan $d_{\\text{cm}}$: satuan meter ($\\text{m}$), dimensi $[L]$.',
      '• Massa $m$ dan massa batang $m_b$: satuan kilogram ($\\text{kg}$), dimensi $[M]$.',
      '• Percepatan gravitasi $g$: satuan $\\text{m/s}^2$, dimensi $[L][T]^{-2}$.',
      '• Momen inersia $I$: satuan $\\text{kg}\\cdot\\text{m}^2$, dimensi $[M][L]^2$.',
      '• Frekuensi sudut $\\omega$: satuan $\\text{rad/s}$, dimensi $[T]^{-1}$; frekuensi $f$: satuan $\\text{Hz}$ ($\\text{s}^{-1}$); periode $T$: satuan $\\text{s}$.',
    ],
    speechScript:
      'Bagian ketujuh, dimensi dan satuan setiap besaran. Pastikan seluruh besaran berada dalam satuan SI: panjang dalam meter, massa dalam kilogram, momen inersia dalam kilogram meter kuadrat, frekuensi sudut dalam radian per sekon, dan frekuensi dalam hertz.',
  },
  {
    id: 8,
    title: 'Hubungan Antarvariabel',
    subtitle: 'Analisis ketergantungan f(s), T(s), dan gaya internal terhadap rasio s/l',
    content: [
      'Jika panjang tongkat $s$ dinaikkan dari $0$ menuju batas geometris $2\\ell$: (1) sudut $\\alpha$ membesar dari $0^\\circ$ ke $90^\\circ$; (2) $\\cos\\alpha$ mengecil dari $1$ ke $0$; (3) panjang efektif $\\ell_{\\text{eff}} = \\ell/\\cos\\alpha$ membesar menuju tak hingga; (4) frekuensi $f(s)$ menurun secara non-linear menuju nol; dan (5) periode $T(s)$ membesar menuju tak hingga.',
      'Sementara itu, besar tegangan masing-masing tali di posisi setimbang adalah $T_{\\text{tali}} = \\frac{mg}{\\cos\\alpha}$ dan gaya tekan (kompresi) pada tongkat adalah $F_{\\text{tongkat}} = mg\\tan\\alpha$. Semakin panjang tongkat mendekati $2\\ell$, gaya tekan pada tongkat dan tegangan tali membesar drastis!',
    ],
    visualType: 'fbd-equilibrium',
    speechScript:
      'Bagian kedelapan, hubungan antar variabel. Ketika panjang tongkat s mendekati dua kali panjang tali l, kosinus alfa mendekati nol sehingga frekuensi turun menuju nol dan periode membesar menuju tak hingga. Di saat yang sama, tegangan tali dan gaya tekan pada tongkat meningkat tajam.',
  },
  {
    id: 9,
    title: 'Kondisi Berlakunya Suatu Persamaan',
    subtitle: 'Batas geometris, kestabilan tali, dan syarat sudut kecil',
    content: [
      'Persamaan $f(s) = f(0)(1 - s^2/4\\ell^2)^{1/4}$ hanya berlaku jika memenuhi empat kondisi fisis berikut:',
      '1. **Syarat Geometri Segitiga**: $0 \\le s < 2\\ell$. Jika $s > 2\\ell$, segitiga tidak dapat terbentuk; jika $s = 2\\ell$, kedua tali mendatar sejajar dan tidak ada komponen gaya pemulih orde linear ($f \\to 0$).',
      '2. **Osilasi di Dalam Bidang Segitiga**: Poros putar tegak lurus bidang segitiga. Jika ayunan terjadi **keluar bidang** (tegak lurus bidang segitiga), persamaan berubah menjadi $f_\\perp(s) = f(0)/\\sqrt{\\cos\\alpha}$.',
      '3. **Tali Selalu Tegang**: Sudut amplitudo cukup kecil sehingga gaya sentripetal dan komponen berat menjaga tegangan tali $T > 0$ sepanjang ayunan.',
      '4. **Aproksimasi Sudut Kecil**: $\\theta_0 \\ll 1\\text{ rad}$ (umumnya $\\theta_0 \\lesssim 0{,}2\\text{ rad}$), agar $\\sin\\theta \\approx \\theta$.',
    ],
    visualType: 'modes-comparison',
    speechScript:
      'Bagian kesembilan, kondisi berlakunya persamaan. Rumus utama berlaku bila panjang tongkat lebih kecil dari dua l, osilasi berlangsung di dalam bidang segitiga, tali tetap tegang, dan simpangan sudut memenuhi pendekatan sudut kecil.',
  },
  {
    id: 10,
    title: 'Kesalahan Konsep yang Sering Terjadi',
    subtitle: 'Miskonsepsi klasik peserta OSK yang harus dihindari',
    content: [
      'Berikut empat jebakan konsep paling sering muncul saat mengerjakan variasi Soal 19:',
      '• **Miskonsepsi 1 — Menganggap panjang tali efektif menjadi $h = \\ell\\cos\\alpha$**: Banyak siswa keliru menganggap setiap massa hanya berjarak $h = \\ell\\cos\\alpha$ dari poros sehingga menulis $I = 2m(\\ell\\cos\\alpha)^2$ dan mendapat $f = f(0)/\\sqrt{\\cos\\alpha}$. Itu keliru untuk ayunan **di bidang segitiga**, karena kedua massa tetap berjarak $\\ell$ dari titik gantung puncak!',
      '• **Miskonsepsi 2 — Lupa pangkat $1/4$ pada $f(s)/f(0)$**: Karena $f \\propto \\sqrt{\\cos\\alpha}$ dan $\\cos\\alpha = \\sqrt{1 - s^2/(4\\ell^2)}$, maka $f(s)/f(0) = (1 - s^2/4\\ell^2)^{1/4}$, bukan pangkat $1/2$. Siswa yang keliru memakai pangkat $1/2$ sering menjawab $s_0/\\ell = \\sqrt{2}$ alih-alih $\\sqrt{3}$.',
      '• **Miskonsepsi 3 — Mengira tongkat dalam keadaan tarik (tension)**: Untuk dua massa tergantung di bawah poros yang sama, komponen horizontal tegangan tali menarik massa ke dalam sehingga tongkat sebenarnya mengalami **tekanan (kompresi)** untuk menahan kedua massa tetap terpisah.',
      '• **Miskonsepsi 4 — Menjumlahkan gaya internal tongkat ke dalam torsi total**: Gaya dorong tongkat pada $m_1$ dan $m_2$ berpasangan aksi-reaksi sejajar garis hubung kedua massa, sehingga torsi totalnya terhadap poros selalu nol.',
    ],
    speechScript:
      'Bagian kesepuluh, kesalahan konsep yang sering terjadi. Hindari tiga jebakan utama: pertama, mengira momen inersia memakai tinggi segitiga l kosinus alfa padahal jarak massa ke poros tetap l. Kedua, keliru memakai pangkat setengah alih-alih pangkat seperempat pada rumus frekuensi. Ketiga, mengira tongkat mengalami tarikan padahal sebenarnya mengalami gaya tekan kompresi.',
  },
  {
    id: 11,
    title: 'Contoh Penerapan dalam Kehidupan Nyata',
    subtitle: 'Dari metronom kaku hingga penstabil derek gantung dan instrumen ukur',
    content: [
      'Prinsip bandul fisis segitiga terhubung batang diterapkan dalam rekayasa mekanika, seperti: (1) **pengaturan periode ayunan pada jam bandul presisi atau metronom**, di mana penggeseran jarak bentang dua beban simetris mengubah $d_{\\text{cm}}$ tanpa mengubah jarak radial $\\ell$ dari poros; (2) **sistem suspensi beban ganda pada derek (crane) dengan spreader bar kaku**, yang menentukan frekuensi alami ayunan muatan agar terhindar dari resonansi angin atau gerak troli; serta (3) **seismometer dan sensor kemiringan** yang memanfaatkan penurunan frekuensi efektif $\\sqrt{g\\cos\\alpha/\\ell}$ agar sensitif terhadap getaran frekuensi rendah.',
    ],
    speechScript:
      'Bagian kesebelas, contoh penerapan nyata. Prinsip bandul segitiga kaku dijumpai pada pengatur frekuensi metronom beban ganda, spreader bar kaku pada derek pelabuhan untuk mengatur periode ayunan muatan, serta sensor getaran frekuensi rendah.',
  },
  {
    id: 12,
    title: 'Hubungan dengan Konsep Fisika Pendukung',
    subtitle: 'Jembatan menuju dinamika benda tegar, tumbukan, dan kerangka non-inersia',
    content: [
      'Dalam soal Olimpiade tingkat lanjut (seperti Soal 10–15 dalam latihan ini), sistem Soal 19 terhubung erat dengan konsep fisika lain:',
      '• **Teorema Sumbu Sejajar**: Jika tongkat penghubung bermassa $m_b$, momen inersia batang terhadap poros adalah $I_{\\text{batang}} = \\frac{1}{12}m_b s^2 + m_b(\\ell\\cos\\alpha)^2$.',
      '• **Sistem Asimetris ($m_1 \\neq m_2$)**: Posisi setimbang miring sehingga $\\vec{r}_{\\text{cm}}$ sejajar vertikal; besar $|m_1\\vec{r}_1 + m_2\\vec{r}_2|$ dihitung dengan aturan kosinus vektor.',
      '• **Kerangka Non-Inersia**: Di dalam kereta atau roket yang dipercepat dengan $\\vec{a}$, cukup ganti $g$ dengan $g_{\\text{eff}} = |\\vec{g} - \\vec{a}|$.',
      '• **Kekekalan Momentum Sudut pada Tumbukan**: Saat peluru menumbuk sistem di titik setimbang, momentum sudut terhadap poros kekal ($L_i = L_f$) walau energi kinetik tidak kekal.',
    ],
    speechScript:
      'Bagian kedua belas, hubungan dengan konsep pendukung. Sistem bandul segitiga ini terhubung langsung dengan teorema sumbu sejajar saat tongkat bermassa, aturan vektor pusat massa saat kedua beban tidak sama, gravitasi efektif pada kerangka dipercepat, serta kekekalan momentum sudut pada peristiwa tumbukan.',
  },
  {
    id: 13,
    title: 'Strategi Penyelesaian Soal Tingkat Olimpiade',
    subtitle: 'Protokol 5-langkah cepat dan bebas kesalahan aljabar',
    content: [
      'Gunakan urutan kerja berikut setiap kali menghadapi variasi Soal 19 OSK:',
      '1. **Tetapkan Poros dan Derajat Kebebasan**: Pastikan sistem bergerak dalam 1 derajat kebebasan (segitiga kaku) atau 2 derajat kebebasan (jika tongkat diganti pegas).',
      '2. **Hitung Geometri Statis ($\\sin\\alpha$, $\\cos\\alpha$, $d_{\\text{cm}}$)**: Gambar segitiga siku-siku setengah bagian dengan sisi miring $\\ell$ dan sisi depan $s/2$.',
      '3. **Hitung Momen Inersia Total terhadap Poros ($I_{\\text{poros}}$)**: Jumlahkan $m_i r_i^2$ tiap partikel dan $\\frac{1}{12}m_b s^2 + m_b d^2$ bila batang bermassa.',
      '4. **Tuliskan Torsi Pemulih atau Energi Potensial**: Gunakan $\\omega = \\sqrt{\\kappa / I_{\\text{poros}}}$ dengan $\\kappa = M_{\\text{tot}} g_{\\text{eff}} d_{\\text{cm}}$.',
      '5. **Verifikasi Dimensi dan Kasus Batas ($s \\to 0$)**: Pastikan saat $s \\to 0$ rumus kembali ke $\\omega = \\sqrt{g/\\ell}$, lalu lakukan pembulatan tepat **satu angka di belakang koma** menggunakan tanda koma.',
    ],
    speechScript:
      'Bagian ketiga belas, strategi penyelesaian soal Olimpiade. Selalu mulai dari penentuan poros putar, hitung geometri kosinus alfa, tentukan momen inersia total terhadap poros, cari kekakuan pemulih gravitasi, lalu uji kasus batas s menuju nol sebelum melakukan perhitungan akhir dengan satu angka desimal.',
  },
];

export const FORMULA_SHEET: FormulaCardItem[] = [
  {
    id: 'f-geo',
    name: 'Geometri Segitiga & Pusat Massa',
    latex: '\\sin\\alpha = \\frac{s}{2\\ell}, \\qquad \\cos\\alpha = \\sqrt{1 - \\frac{s^2}{4\\ell^2}}, \\qquad d_{\\text{cm}} = \\ell\\cos\\alpha',
    condition: 'Dua pendulum identik panjang l terhubung tongkat s dengan 0 <= s < 2l.',
    symbols: [
      { symbol: 's', meaning: 'Panjang tongkat penghubung', unit: 'm', dimension: '[L]' },
      { symbol: '\\ell', meaning: 'Panjang tali masing-masing pendulum', unit: 'm', dimension: '[L]' },
      { symbol: '\\alpha', meaning: 'Setengah sudut puncak segitiga', unit: 'rad / deg', dimension: '1' },
      { symbol: 'd_{\\text{cm}}', meaning: 'Jarak pusat massa ke poros', unit: 'm', dimension: '[L]' },
    ],
    speechScript: 'Rumus geometri segitiga: sinus alfa sama dengan s dibagi dua l, kosinus alfa sama dengan akar satu minus s kuadrat per empat l kuadrat, dan jarak pusat massa d cm sama dengan l kosinus alfa.',
  },
  {
    id: 'f-freq',
    name: 'Frekuensi & Periode Osilasi di Bidang Segitiga (Soal 19)',
    latex: '\\omega(s) = \\sqrt{\\frac{g\\cos\\alpha}{\\ell}}, \\qquad f(s) = f(0)\\left(1 - \\frac{s^2}{4\\ell^2}\\right)^{1/4}, \\qquad \\ell_{\\text{eff}} = \\frac{\\ell}{\\cos\\alpha}',
    condition: 'Osilasi sudut kecil di dalam bidang segitiga, tongkat tak bermassa.',
    symbols: [
      { symbol: '\\omega(s)', meaning: 'Frekuensi sudut osilasi', unit: 'rad/s', dimension: '[T]^{-1}' },
      { symbol: 'f(s)', meaning: 'Frekuensi osilasi linear', unit: 'Hz', dimension: '[T]^{-1}' },
      { symbol: 'f(0)', meaning: 'Frekuensi bandul sederhana saat s = 0', unit: 'Hz', dimension: '[T]^{-1}' },
      { symbol: '\\ell_{\\text{eff}}', meaning: 'Panjang efektif bandul ekivalen', unit: 'm', dimension: '[L]' },
    ],
    speechScript: 'Rumus utama Soal 19: frekuensi sudut omega sama dengan akar g kosinus alfa per l, sehingga f s dibagi f nol sama dengan pangkat seperempat dari satu minus s kuadrat per empat l kuadrat.',
  },
  {
    id: 'f-static',
    name: 'Gaya Tegangan Tali & Gaya Tekan Tongkat',
    latex: 'T_{\\text{tali}} = \\frac{mg}{\\cos\\alpha}, \\qquad F_{\\text{tongkat}} = mg\\tan\\alpha',
    condition: 'Keseimbangan statis pada sistem dua massa identik m.',
    symbols: [
      { symbol: 'T_{\\text{tali}}', meaning: 'Gaya tegangan masing-masing tali', unit: 'N', dimension: '[M][L][T]^{-2}' },
      { symbol: 'F_{\\text{tongkat}}', meaning: 'Gaya tekan (kompresi) pada tongkat', unit: 'N', dimension: '[M][L][T]^{-2}' },
      { symbol: 'g', meaning: 'Percepatan gravitasi', unit: 'm/s^2', dimension: '[L][T]^{-2}' },
    ],
    speechScript: 'Gaya keseimbangan statis: tegangan tali sama dengan m g dibagi kosinus alfa, dan gaya tekan tongkat sama dengan m g tangen alfa.',
  },
  {
    id: 'f-outplane',
    name: 'Perbandingan Mode Tegak Lurus Bidang',
    latex: '\\omega_{\\perp}(s) = \\sqrt{\\frac{g}{\\ell\\cos\\alpha}}, \\qquad \\frac{f_{\\parallel}(s)}{f_{\\perp}(s)} = \\cos\\alpha',
    condition: 'Poros putar mendatar sebidang segitiga (ayunan keluar bidang).',
    symbols: [
      { symbol: '\\omega_{\\perp}', meaning: 'Frekuensi sudut ayunan keluar bidang', unit: 'rad/s', dimension: '[T]^{-1}' },
      { symbol: 'f_{\\parallel}', meaning: 'Frekuensi ayunan di dalam bidang', unit: 'Hz', dimension: '[T]^{-1}' },
    ],
    speechScript: 'Untuk ayunan tegak lurus bidang segitiga, omega tegak lurus sama dengan akar g dibagi l kosinus alfa, sehingga rasio f sejajar dibagi f tegak lurus tepat sama dengan kosinus alfa.',
  },
  {
    id: 'f-advanced',
    name: 'Variasi Lanjut: Massa Asimetris, Tongkat Bermassa, & Kerangka Dipercepat',
    latex: '\\omega_{\\text{asim}} = \\sqrt{\\frac{g\\sqrt{m_1^2 + m_2^2 + 2m_1 m_2\\cos(2\\alpha)}}{(m_1+m_2)\\ell}}, \\quad I_{\\text{batang}} = \\frac{1}{12}m_b s^2 + m_b(\\ell\\cos\\alpha)^2, \\quad g_{\\text{eff}} = \\sqrt{g^2 + a^2}',
    condition: 'Perluasan konsep benda tegar segitiga untuk soal level 4 dan 5.',
    symbols: [
      { symbol: 'm_1, m_2', meaning: 'Dua massa titik tak sama', unit: 'kg', dimension: '[M]' },
      { symbol: 'm_b', meaning: 'Massa batang penghubung homogen', unit: 'kg', dimension: '[M]' },
      { symbol: 'a', meaning: 'Percepatan horizontal kerangka', unit: 'm/s^2', dimension: '[L][T]^{-2}' },
    ],
    speechScript: 'Rumus perluasan meliputi massa tak sama memakai aturan kosinus vektor pusat massa, teorema sumbu sejajar untuk batang bermassa, dan gravitasi efektif akar g kuadrat tambah a kuadrat pada kereta dipercepat.',
  },
];
