/* Data contoh Monev OPD. Backend belum menyediakan endpoint Monev, sehingga data ini
   disimpan di MonevContext (hanya bertahan selama sesi). Nama OPD, judul kajian, dan
   kode riset diselaraskan dengan data seeder backend (backend/database/seeders) agar
   konsisten dengan akun OPD dan direktori riset di VPS. */

export const MONEV_SEED = [
  {
    id: 'MNV-2025-001',
    risetKode: 'BRD-2025-001',
    createdAt: '2025-08-21T09:00:00.000Z',
    nama: 'I Gede Wirawan, S.T., M.T.',
    nip: '198812342024021001',
    opd: 'Dinas Pertanian Kabupaten Buleleng',
    judul: 'Sistem Irigasi Presisi Berbasis IoT untuk Subak Sawah Sukasada Menghadapi Anomali Iklim',
    rekomendasi: [
      {
        judul: 'Pemasangan 12 node sensor kelembapan di tiga tempek Subak Padanggalak',
        monitoring: 'Sudah',
        uraian: 'Dua belas node sensor telah dipasang dan mengirim data kelembapan serta debit air secara berkala.',
        kendala: 'Kalibrasi ulang diperlukan setelah hujan dengan intensitas tinggi.',
        manfaat: 'Data lapangan membantu penyusunan jadwal pengairan yang lebih terukur.',
        fileName: 'Laporan-Kemajuan-Termin-II-BRD001.pdf',
        fileSize: '4,2 MB'
      },
      {
        judul: 'Integrasi data sensor dengan dashboard pemantauan Dinas Pertanian',
        monitoring: 'Sudah',
        uraian: 'Dashboard telah menerima data debit harian dari tiga tempek uji.',
        kendala: 'Format laporan rutin masih perlu diselaraskan dengan sistem dinas.',
        manfaat: 'Petugas dapat memantau kondisi irigasi tanpa menunggu laporan manual.',
        fileName: 'Dokumentasi-Integrasi-Dashboard.jpg',
        fileSize: '2,1 MB'
      },
      {
        judul: 'Penyusunan prosedur perawatan sensor dan katup otomatis',
        monitoring: 'Belum',
        uraian: 'Draf prosedur perawatan sedang disiapkan bersama pekaseh dan tim teknis.',
        kendala: 'Jadwal pelatihan belum disepakati oleh seluruh kelompok subak.',
        manfaat: 'Prosedur perawatan diharapkan menjaga perangkat tetap berfungsi lintas musim tanam.',
        fileName: '',
        fileSize: ''
      },
      {
        judul: 'Penyusunan policy brief pola tanam adaptif berbasis data debit harian',
        monitoring: 'Belum',
        uraian: 'Pengukuran pembanding untuk musim tanam berikutnya belum selesai sehingga policy brief belum difinalkan.',
        kendala: 'Data satu musim tanam belum cukup untuk menyimpulkan efisiensi tahunan.',
        manfaat: 'Policy brief akan menjadi dasar keputusan replikasi sistem ke subak lain.',
        fileName: '',
        fileSize: ''
      }
    ]
  },
  {
    id: 'MNV-2025-002',
    risetKode: 'BRD-2025-002',
    createdAt: '2025-08-12T09:00:00.000Z',
    nama: 'I Nyoman Sutrisna, S.Sos., M.AP.',
    nip: '197906152005011008',
    opd: 'Dinas Pariwisata Kabupaten Buleleng',
    judul: 'Model Pengelolaan Wisata Bahari Berkelanjutan Berbasis Masyarakat di Kawasan Lovina',
    rekomendasi: [
      {
        judul: 'Penerapan zonasi jarak aman untuk atraksi dolphin watching',
        monitoring: 'Sudah',
        uraian: 'Uji coba zonasi telah dilakukan bersama operator perahu Kalibukbuk.',
        kendala: 'Kepatuhan antaroperator perlu dipantau pada masa kunjungan ramai.',
        manfaat: 'Zonasi mengurangi gangguan terhadap pergerakan mamalia laut.',
        fileName: 'Peta-Zonasi-Lovina.pdf',
        fileSize: '1,8 MB'
      },
      {
        judul: 'Pelaksanaan sertifikasi operator wisata bahari',
        monitoring: 'Belum',
        uraian: 'Modul sertifikasi sudah disiapkan dan menunggu jadwal pelatihan.',
        kendala: 'Jadwal pelatihan perlu menyesuaikan jam operasional operator.',
        manfaat: 'Sertifikasi menstandarkan keselamatan dan kualitas layanan wisata.',
        fileName: '',
        fileSize: ''
      },
      {
        judul: 'Penyusunan draf Perbup standar wisata bahari Lovina',
        monitoring: 'Sudah',
        uraian: 'Draf Perbup telah dibahas bersama Bagian Hukum Setda dan disepakati untuk ditetapkan.',
        kendala: 'Sosialisasi kepada desa adat di luar Kalibukbuk masih bertahap.',
        manfaat: 'Pengelolaan wisata bahari memiliki dasar hukum yang jelas.',
        fileName: 'Draf-Perbup-Wisata-Bahari.pdf',
        fileSize: '0,9 MB'
      }
    ]
  },
  {
    id: 'MNV-2025-003',
    risetKode: 'BRD-2025-004',
    createdAt: '2025-09-02T02:30:00.000Z',
    nama: 'Made Arya Wiguna, S.T.',
    nip: '198503212010011014',
    opd: 'BPBD Kabupaten Buleleng',
    judul: 'Sistem Peringatan Dini Banjir Bandang Sungai Buleleng Berbasis Sensor dan Notifikasi Desa',
    rekomendasi: [
      {
        judul: 'Pemasangan stasiun sensor ketinggian muka air pada enam titik hulu–hilir Sungai Buleleng',
        monitoring: 'Belum',
        uraian: 'Lokasi enam titik sudah disurvei; pengadaan perangkat masih dalam proses.',
        kendala: 'Izin pemasangan di dua titik lahan milik desa adat belum terbit.',
        manfaat: 'Data muka air waktu nyata menjadi dasar status siaga banjir.',
        fileName: 'Hasil-Survei-Titik-Sensor.pdf',
        fileSize: '3,4 MB'
      },
      {
        judul: 'Integrasi notifikasi peringatan dini ke pengeras suara desa dan WhatsApp kelian banjar',
        monitoring: 'Belum',
        uraian: 'Skema integrasi sedang dikoordinasikan dengan Diskominfosanti.',
        kendala: 'Nomor kontak kelian banjar belum seluruhnya terverifikasi.',
        manfaat: 'Warga di bantaran sungai menerima peringatan lebih cepat.',
        fileName: '',
        fileSize: ''
      },
      {
        judul: 'Penyusunan SOP diseminasi peringatan dini tingkat desa',
        monitoring: 'Belum',
        uraian: 'Draf SOP menunggu hasil uji coba sistem sensor.',
        kendala: 'Uji coba belum dapat dilaksanakan sebelum perangkat terpasang.',
        manfaat: 'Alur evakuasi warga menjadi seragam dan terukur.',
        fileName: '',
        fileSize: ''
      }
    ]
  },
  {
    id: 'MNV-2025-004',
    risetKode: 'BRD-2025-005',
    createdAt: '2025-09-10T03:15:00.000Z',
    nama: 'Ni Luh Putu Ariani, S.Pi., M.Si.',
    nip: '198707142011012009',
    opd: 'Dinas Kelautan dan Perikanan Kabupaten Buleleng',
    judul: 'Restorasi Terumbu Karang Partisipatif dengan Struktur Biorock di Perairan Pemuteran',
    rekomendasi: [
      {
        judul: 'Pemasangan delapan modul biorock bertenaga surya di zona inti Pemuteran',
        monitoring: 'Sudah',
        uraian: 'Delapan modul telah terpasang dan dipantau pertumbuhan karangnya setiap bulan.',
        kendala: 'Panel surya perlu dibersihkan rutin akibat endapan garam.',
        manfaat: 'Laju pertumbuhan karang pada modul lebih tinggi dibanding transplantasi biasa.',
        fileName: 'Foto-Pemasangan-Biorock.jpg',
        fileSize: '5,6 MB'
      },
      {
        judul: 'Penguatan awig-awig pecalang segara untuk perlindungan area restorasi',
        monitoring: 'Sudah',
        uraian: 'Pararem perlindungan area restorasi telah disahkan dalam paruman desa adat.',
        kendala: 'Pengawasan malam hari masih terbatas.',
        manfaat: 'Aktivitas tangkap merusak di zona restorasi menurun.',
        fileName: 'Pararem-Pecalang-Segara.pdf',
        fileSize: '1,2 MB'
      },
      {
        judul: 'Penyusunan panduan restorasi partisipatif untuk pokdarwis',
        monitoring: 'Sudah',
        uraian: 'Panduan telah dicetak dan digunakan dalam pelatihan Pokdarwis Pemuteran.',
        kendala: 'Panduan perlu diterjemahkan ke bahasa Inggris untuk relawan asing.',
        manfaat: 'Pokdarwis dapat melibatkan wisatawan dalam kegiatan restorasi secara aman.',
        fileName: 'Panduan-Restorasi-Partisipatif.pdf',
        fileSize: '2,7 MB'
      }
    ]
  }
];

/* Kajian yang sudah terdaftar tetapi belum diisi Monev oleh OPD-nya. */
const KAJIAN_TAMBAHAN = [
  {
    id: 'KJN-BRD-2025-008',
    risetKode: 'BRD-2025-008',
    opd: 'Dinas PUTR Kabupaten Buleleng',
    judul: 'Rancang Bangun PLTS Atap Terintegrasi untuk Fasilitas Publik Desa di Kubutambahan',
    rekomendasi: [
      { id: 'KJN-BRD-2025-008-P1', judul: 'Penyusunan Detail Engineering Design PLTS atap untuk kantor desa dan pustu' },
      { id: 'KJN-BRD-2025-008-P2', judul: 'Penyusunan model pembiayaan dan pemeliharaan PLTS melalui BUMDes' },
      { id: 'KJN-BRD-2025-008-P3', judul: 'Pelatihan kader desa untuk perawatan rutin panel surya' }
    ]
  },
  {
    id: 'KJN-PERTANIAN-2025-002',
    risetKode: '',
    opd: 'Dinas Pertanian Kabupaten Buleleng',
    judul: 'Kajian Diversifikasi Pangan Lokal Berbasis Umbi-umbian untuk Ketahanan Pangan Desa di Buleleng',
    rekomendasi: [
      { id: 'KJN-PERTANIAN-2025-002-P1', judul: 'Pemetaan sentra produksi umbi-umbian lokal per kecamatan' },
      { id: 'KJN-PERTANIAN-2025-002-P2', judul: 'Pendampingan KWT dalam pengolahan tepung umbi lokal' }
    ]
  }
];

export const MONEV_KAJIAN_SEED = [
  ...MONEV_SEED.map((record) => ({
    id: `KJN-${record.id}`,
    risetKode: record.risetKode,
    opd: record.opd,
    judul: record.judul,
    rekomendasi: record.rekomendasi.map((item, index) => ({
      id: `${record.id}-P${index + 1}`,
      judul: item.judul
    }))
  })),
  ...KAJIAN_TAMBAHAN
];
