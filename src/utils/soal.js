const soal = [
  {
    question: 'Apa penyebab utama terjadinya tsunami di Indonesia?',
    answers: [
      'A. Letusan gunung berapi',
      'B. Gempa bumi',
      'C. Tabrakan meteor',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'D',
  },
  {
    question: 'Gunung berapi manakah di Indonesia yang memiliki sejarah letusan paling mematikan?',
    answers: ['A. Gunung Merapi', 'B. Gunung Tambora', 'C. Gunung Krakatau', 'D. Gunung Sinabung'],
    correctAnswer: 'B',
  },
  {
    question: 'Apa nama skala yang digunakan untuk mengukur kekuatan gempa bumi?',
    answers: [
      'A. Skala Richter',
      'B. Skala Mercalli',
      'C. Skala Saffir-Simpson',
      'D. Skala Beaufort',
    ],
    correctAnswer: 'A',
  },
  {
    question: 'Lembaga manakah yang bertanggung jawab untuk penanganan bencana di Indonesia?',
    answers: [
      'A. Badan Nasional Penanggulangan Bencana (BNPB)',
      'B. Kementerian Lingkungan Hidup dan Kehutanan',
      'C. Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)',
      'D. Kementerian Energi dan Sumber Daya Mineral',
    ],
    correctAnswer: 'A',
  },
  {
    question: 'Apa yang dimaksud dengan mitigasi bencana?',
    answers: [
      'A. Tindakan pencegahan sebelum bencana terjadi',
      'B. Tindakan tanggap darurat saat bencana terjadi',
      'C. Tindakan pemulihan setelah bencana terjadi',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'A',
  },
  {
    question: 'Manakah dari berikut ini yang merupakan contoh mitigasi bencana di Indonesia?',
    answers: [
      'A. Membangun tanggul untuk mencegah banjir',
      'B. Menyediakan tempat pengungsian sementara',
      'C. Mendistribusikan bantuan makanan dan air',
      'D. Melakukan evakuasi korban bencana',
    ],
    correctAnswer: 'A',
  },
  {
    question: "Apa yang dimaksud dengan 'ring of fire' yang melintasi wilayah Indonesia?",
    answers: [
      'A. Jalur gunung berapi aktif',
      'B. Jalur gempa bumi yang sering terjadi',
      'C. Jalur pantai yang rawan tsunami',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'D',
  },
  {
    question: 'Manakah dari berikut ini yang bukan merupakan dampak bencana alam?',
    answers: [
      'A. Kerusakan infrastruktur',
      'B. Korban jiwa',
      'C. Gangguan ekonomi',
      'D. Peningkatan produksi pangan',
    ],
    correctAnswer: 'D',
  },
  {
    question: 'Apa tujuan utama dari sistem peringatan dini bencana?',
    answers: [
      'A. Memberikan informasi terkini tentang bencana',
      'B. Mengevakuasi masyarakat dari daerah bahaya',
      'C. Membantu upaya pemulihan pasca bencana',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'B',
  },
  {
    question:
      'Lembaga manakah di Indonesia yang bertanggung jawab untuk memantau aktivitas gunung berapi?',
    answers: [
      'A. BNPB',
      'B. BMKG',
      'C. Kementerian Energi dan Sumber Daya Mineral',
      'D. Kementerian Lingkungan Hidup dan Kehutanan',
    ],
    correctAnswer: 'B',
  },
  {
    question: "Apa yang dimaksud dengan 'tsunami vertical evacuation' di daerah rawan tsunami?",
    answers: [
      'A. Evakuasi ke daerah yang lebih tinggi secara vertikal',
      'B. Evakuasi ke daerah yang lebih jauh dari pantai',
      'C. Evakuasi ke bangunan bertingkat yang kokoh',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'C',
  },
  {
    question: 'Manakah dari berikut ini yang bukan merupakan tindakan mitigasi bencana gempa bumi?',
    answers: [
      'A. Memperkuat bangunan dengan teknologi tahan gempa',
      'B. Melakukan simulasi dan latihan tanggap bencana',
      'C. Membangun rumah di daerah yang jauh dari patahan aktif',
      'D. Menanam pohon di daerah rawan longsor',
    ],
    correctAnswer: 'D',
  },
  {
    question: "Apa yang dimaksud dengan 'lahar dingin' pada letusan gunung berapi?",
    answers: [
      'A. Aliran lava yang telah mendingin',
      'B. Hujan abu vulkanik yang lebat',
      'C. Aliran material vulkanik bercampur air',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'C',
  },
  {
    question:
      'Lembaga manakah yang bertanggung jawab untuk memantau aktivitas gempa bumi di Indonesia?',
    answers: [
      'A. BNPB',
      'B. BMKG',
      'C. Kementerian Energi dan Sumber Daya Mineral',
      'D. Kementerian Lingkungan Hidup dan Kehutanan',
    ],
    correctAnswer: 'B',
  },
  {
    question: "Apa yang dimaksud dengan 'tsunami horisontal evacuation' di daerah rawan tsunami?",
    answers: [
      'A. Evakuasi ke daerah yang lebih tinggi secara vertikal',
      'B. Evakuasi ke daerah yang lebih jauh dari pantai',
      'C. Evakuasi ke bangunan bertingkat yang kokoh',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'B',
  },
  {
    question:
      'Manakah dari berikut ini yang bukan merupakan tindakan mitigasi bencana letusan gunung berapi?',
    answers: [
      'A. Membangun rumah di daerah yang jauh dari kawasan gunung berapi',
      'B. Menyediakan masker untuk melindungi dari abu vulkanik',
      'C. Melakukan penyiraman air untuk mencegah kebakaran hutan',
      'D. Menanam pohon di lereng gunung berapi',
    ],
    correctAnswer: 'D',
  },
  {
    question: "Apa yang dimaksud dengan 'banjir lahar' pada letusan gunung berapi?",
    answers: [
      'A. Banjir air hujan akibat letusan',
      'B. Aliran material vulkanik bercampur air',
      'C. Luapan air dari kawah gunung berapi',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'B',
  },
  {
    question: 'Manakah dari berikut ini yang bukan merupakan tindakan mitigasi bencana tsunami?',
    answers: [
      'A. Membangun tanggul pengaman di daerah pantai',
      'B. Menyediakan jalur evakuasi dan tempat pengungsian',
      'C. Melakukan penghijauan di daerah rawan longsor',
      'D. Memasang sistem peringatan dini tsunami',
    ],
    correctAnswer: 'C',
  },
  {
    question: "Apa yang dimaksud dengan 'liquefaction' pada gempa bumi?",
    answers: [
      'A. Longsor akibat getaran gempa',
      'B. Pencairan tanah akibat getaran gempa',
      'C. Retakan tanah akibat patahan gempa',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'B',
  },
  {
    question:
      'Lembaga manakah yang bertanggung jawab untuk memantau aktivitas tsunami di Indonesia?',
    answers: [
      'A. BNPB',
      'B. BMKG',
      'C. Kementerian Kelautan dan Perikanan',
      'D. Kementerian Lingkungan Hidup dan Kehutanan',
    ],
    correctAnswer: 'B',
  },
  {
    question: "Apa yang dimaksud dengan 'tanah longsor' dalam kaitannya dengan bencana alam?",
    answers: [
      'A. Pergerakan tanah secara vertikal',
      'B. Pergerakan tanah secara horizontal',
      'C. Pergerakan tanah secara diagonal',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'B',
  },
  {
    question:
      'Manakah dari berikut ini yang bukan merupakan tindakan mitigasi bencana tanah longsor?',
    answers: [
      'A. Membangun dinding penahan tanah',
      'B. Melakukan reboisasi di daerah rawan longsor',
      'C. Membuat saluran drainase yang memadai',
      'D. Menanam pohon di lereng yang curam',
    ],
    correctAnswer: 'D',
  },
  {
    question: "Apa yang dimaksud dengan 'siklus manajemen bencana'?",
    answers: [
      'A. Tahapan penanggulangan bencana dari pencegahan hingga pemulihan',
      'B. Periode terjadinya bencana alam',
      'C. Waktu yang diperlukan untuk evakuasi korban bencana',
      'D. Semua jawaban di atas benar',
    ],
    correctAnswer: 'A',
  },
];

module.exports = soal;
