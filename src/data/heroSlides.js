/* ==========================================================================
   Slide hero beranda — berganti otomatis setiap 7 detik.

   CARA MENGGANTI GAMBAR:
   Taruh berkas di  public/images/hero/  dengan nama sesuai kolom `gambar`
   di bawah (mis. hero-1.jpg). Tidak perlu menulis import apa pun.
   Selama berkas belum ada, slide tetap tampil dengan latar bermotif.

   Menambah slide? Salin satu blok, ganti isinya. Slider menyesuaikan sendiri.
   ========================================================================== */

export const HERO_SLIDES = [
  {
    gambar: '/images/hero/1.jpeg',
    alt: 'Peneliti dan petani subak meninjau instalasi irigasi presisi di sawah Sukasada',
    judul: 'Satu Pintu Riset Daerah untuk',
    sorot: 'Kebijakan Berbasis Bukti',
    ekor: 'di Bali Utara',
    teks: 'Menghubungkan peneliti perguruan tinggi, organisasi perangkat daerah, subak, kelompok sadar wisata, dan pelaku UMKM dalam satu ekosistem riset terapan yang terukur, transparan, dan berdampak bagi 9 kecamatan serta 148 desa/kelurahan Kabupaten Buleleng.'
  },
  {
    gambar: '/images/hero/2.jpg',
    alt: 'Kawasan pesisir Lovina dengan perahu nelayan tradisional Buleleng',
    judul: 'Riset Terapan yang',
    sorot: 'Menjaga Laut dan Pesisir',
    ekor: 'Buleleng',
    teks: 'Dari restorasi terumbu karang Pemuteran hingga tata kelola wisata bahari Lovina, hasil riset daerah dirumuskan bersama nelayan, pecalang segara, dan kelompok sadar wisata.'
  },
  {
    gambar: '/images/hero/3.jpg',
    alt: 'Petani kopi robusta memetik buah kopi di perkebunan Wanagiri',
    judul: 'Hilirisasi Komoditas Unggulan',
    sorot: 'dari Kebun ke Pasar',
    ekor: '',
    teks: 'Kopi robusta Wanagiri, mangga Busungbiu, rumput laut Tejakula, dan tenun endek Sawan, riset daerah mengawal mutu, kemasan, dan akses pasar bagi UMKM Buleleng.'
  },
  {
    gambar: '/images/hero/4.jpg',
    alt: 'Suasana kota Singaraja dengan aktivitas pelayanan publik digital',
    judul: 'Menuju',
    sorot: 'Smart Island Buleleng',
    ekor: '2029',
    teks: 'Satu Data Buleleng, sistem peringatan dini bencana, dan layanan desa terpadu adalah inovasi digital yang lahir dari kolaborasi riset lintas kampus dan perangkat daerah.'
  }
];

/** Jeda pergantian slide (milidetik). */
export const HERO_INTERVAL = 7000;
