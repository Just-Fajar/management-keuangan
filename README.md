# Management Keuangan

Management Keuangan adalah aplikasi pencatatan keuangan pribadi modern berbasis Progressive Web App (PWA) yang mengutamakan kecepatan, kemudahan penggunaan (low friction), dan privasi penuh. Seluruh data keuangan disimpan langsung di perangkat pengguna secara lokal menggunakan IndexedDB, sehingga aplikasi dapat beroperasi penuh tanpa koneksi internet dan tanpa mengirimkan data ke server eksternal.

Aplikasi ini dikembangkan menggunakan metodologi Issue-Driven Development (IDD), standar Clean Code, Strict Repository Pattern, dan arsitektur pengujian berlapis (Multi-Tier Testing).

---

## Filosofi Desain dan Nilai Inti

- Low Friction Entry: Mengurangi hambatan mencatat pengeluaran harian melalui fitur 1-Tap Preset dan kalkulator Numpad terintegrasi.
- Offline-First Architecture: Dirancang untuk selalu siap digunakan kapan pun dan di mana pun tanpa bergantung pada ketersediaan koneksi internet.
- Data Privacy and Local Ownership: Data transaksi, saldo, dan anggaran sepenuhnya milik pengguna dan tersimpan di penyimpanan browser lokal (IndexedDB).
- Financial Calculation Integrity: Menjamin akurasi kalkulasi saldo dan transaksi dengan standar integer murni untuk menghindari galat pembulatan floating-point.
- Minimalist and Focused UI: Antarmuka yang bersih, intuitif, ramah mata, mendukung tema terang dan gelap, serta bebas dari distraksi elemen dekoratif berlebih.

---

## Fitur Utama

### 1. Pencatatan Cepat dan Presets (1-Tap Entry)
- Tombol Preset Cepat: Mencatat transaksi rutin (seperti kopi harian, makan siang, atau bensin) hanya dengan satu kali ketukan.
- Manajemen Preset Kustom: Pengguna dapat menambah, mengubah, dan menghapus preset sesuai kebiasaan pengeluaran masing-masing.

### 2. Input Transaksi Fleksibel
- Kalkulator Numpad Layar Sentuh: Memudahkan pengisian nominal angka pada perangkat ponsel pintar tanpa memicu keyboard bawaan sistem yang memakan ruang layar.
- Form Transaksi Lengkap: Mendukung pemilihan dompet sumber, kategori pengeluaran/pemasukan, catatan opsional, dan tanggal transaksi.

### 3. Manajemen Multi-Dompet dan E-Wallet
- Ragam Tipe Akun: Mendukung pengelolaan berbagai jenis dompet seperti Tunai (Cash), Rekening Bank (BCA, Mandiri, dan lainnya), serta Dompet Digital / E-Wallet (GoPay, DANA, OVO, ShopeePay).
- Indikator Saldo Interaktif: Menampilkan saldo per akun dan total saldo gabungan secara real-time.
- Mouse Drag-to-Scroll dan Touch Gesture: Navigasi horizontal barisan dompet yang mulus di laptop/desktop menggunakan klik dan geser kursor (Global Pointer Capture API) maupun geser jari (touch swipe) di perangkat mobile.

### 4. Transfer Antar Dompet dan Rekonsiliasi Saldo
- Transfer Saldo: Memindahkan dana dari satu akun ke akun lain tanpa mempengaruhi statistik arus kas pemasukan maupun pengeluaran.
- Rekonsiliasi Saldo (1-Tap Reconcile): Menyelaraskan saldo yang tercatat di aplikasi dengan saldo fisik riil di rekening atau dompet, dengan pencatatan otomatis transaksi penyesuaian (adjustment).

### 5. Anggaran Bulanan Berbasis Soft-Limit
- Soft-Limit Budgeting: Pengguna dapat menetapkan batas anggaran bulanan per kategori pengeluaran.
- Indikator Status Tiga Warna:
  - Aman (Safe / Hijau): Pengeluaran di bawah ambang batas peringatan.
  - Waspada (Warning / Kuning): Pengeluaran mendekati batas anggaran (80% hingga 100%).
  - Terlampaui (Exceeded / Merah): Pengeluaran melampaui alokasi yang direncanakan.
- Non-Blocking: Sistem tetap mengizinkan pencatatan transaksi meskipun anggaran terlampaui, menjaga kejujuran riwayat keuangan pengguna.

### 6. Daily Allowance Engine
- Perhitungan Alokasi Harian Dinamis: Menghitung sisa batas belanja harian yang aman berdasarkan sisa anggaran bulanan dibagi dengan sisa hari dalam bulan berjalan.

### 7. Analisis Arus Kas dan Riwayat Transaksi
- Dashboard Ringkasan Arus Kas: Menampilkan total pemasukan, total pengeluaran, dan saldo bersih dalam periode berjalan.
- Kategori Pengeluaran Terbesar: Menyorot pos-pos pengeluaran utama untuk mempermudah evaluasi gaya hidup finansial.
- Filter dan Pencarian: Memfilter riwayat berdasarkan dompet, kategori, tipe transaksi, serta kata kunci pada catatan transaksi.

### 8. Modal Dialog Kustom
- Dialog Konfirmasi Terintegrasi: Pengganti native browser confirmation dialog (window.confirm) dengan modal dialog kustom bertema untuk tindakan sensitif seperti penghapusan data transaksi.

### 9. Portabilitas dan Cadangan Data (Data Portability)
- Backup JSON: Ekspor seluruh database lokal (akun, kategori, transaksi, dan preset) ke berkas JSON terstruktur.
- Restore JSON: Memulihkan kembali data cadangan ke dalam aplikasi kapan saja.
- Ekspor CSV: Mengunduh data riwayat transaksi dalam format CSV yang kompatibel dengan Microsoft Excel dan Google Sheets.

### 10. Pengalih Tema (Dark Mode dan Light Mode)
- Dukungan Tema Adaptif: Pilihan tampilan mode terang (clean slate) dan mode gelap (deep zinc) yang dirancang untuk kenyamanan visual dalam berbagai kondisi pencahayaan.

---

## Arsitektur Teknis dan Standar Rekayasa

### 1. Standar Presisi Finansial (Financial Precision Standard)
Aplikasi ini melarang penggunaan tipe data floating-point (seperti Float atau Double) untuk kalkulasi saldo dan transaksi uang. Seluruh nominal disimpan dan dihitung dalam representasi INTEGER Rupiah utuh. Hal ini mencegah bug ketidaktepatan desimal yang umum terjadi pada aritmatika floating-point di JavaScript.

### 2. Standardisasi Format Mata Uang
Seluruh visualisasi angka ke representasi mata uang di antarmuka pengguna diwajibkan melewati fungsi helper terpusat:
- Lokasi: `src/utils/currency.ts`
- Fungsi: `formatIDR(amount: number): string`
- Karakteristik: Menghasilkan format mata uang standar Indonesia (contoh: `Rp 50.000`) secara konsisten.

### 3. Strict Repository Pattern
Seluruh komunikasi antara komponen antarmuka atau Custom Hooks dengan basis data IndexedDB diisolasi melalui Repository Pattern:
- Antarmuka: `IDatabaseRepository` (`src/db/repositories/types.ts`)
- Implementasi Konkret: `DexieRepository` (`src/db/repositories/dexieRepository.ts`)
Pola ini memastikan pemisahan tanggung jawab (separation of concerns) yang bersih, memudahkan mocking pada pengujian unit, serta memungkinkan penggantian mesin basis data di masa mendatang tanpa mengubah kode UI.

### 4. Progressive Web App (PWA)
Aplikasi dikonfigurasi sebagai PWA mandiri melalui plugin Vite PWA dan Workbox:
- Service Worker terdaftar secara otomatis untuk caching aset statis dan antarmuka.
- Dapat diinstal langsung ke layar utama (Home Screen) perangkat ponsel cerdas (Android/iOS) maupun desktop (Windows/macOS/Linux) layaknya aplikasi native.

---

## Strategi Pengujian Berlapis (Multi-Tier Testing)

Untuk menjaga stabilitas logika finansial dan keandalan antarmuka, repositori ini menerapkan pendekatan pengujian tiga lapis:

### 1. White-box Testing
Pengujian unit pada fungsi-fungsi internal, utilitas konversi, kalkulasi matematika finansial, dan pembulatan angka integer:
- `src/utils/__tests__/currency.test.ts`: Memvalidasi presisi helper `formatIDR`, parsing string nominal, dan penanganan nilai negatif/nol.
- `src/utils/__tests__/exportImport.test.ts`: Memvalidasi parsing dan sanitasi berkas backup JSON serta konversi baris CSV.

### 2. Black-box Testing
Pengujian fungsional komponen antarmuka dari sudut pandang interaksi pengguna akhir (end-user) menggunakan React Testing Library:
- `src/components/__tests__/QuickEntryForm.test.tsx`: Pengujian form pencatatan cepat dan validasi input.
- `src/components/__tests__/Numpad.test.tsx`: Simulasi ketukan angka, hapus (backspace), dan penyerahan nominal.
- `src/components/__tests__/PresetBar.test.tsx`: Verifikasi pemanggilan preset satu-sentuh.
- `src/components/__tests__/SoftLimitProgressBar.test.tsx`: Verifikasi perubahan warna indikator bar (Safe, Warning, Exceeded).
- `src/components/__tests__/AccountBreakdown.test.tsx`: Pengujian tampilan saldo akun dan interaksi pemilihan dompet.
- `src/components/__tests__/DailyAllowanceCard.test.tsx`: Verifikasi perhitungan alokasi harian pada kartu anggaran.
- `src/components/__tests__/AnalyticsDashboard.test.tsx`: Pengujian visualisasi metrik arus kas dan daftar kategori terbesar.
- `src/components/__tests__/DeleteConfirmModal.test.tsx`: Verifikasi pembatalan dan persetujuan aksi penghapusan.

### 3. Grey-box Testing
Pengujian integrasi antara lapisan antarmuka repositori data dengan database lokal IndexedDB menggunakan emulasi in-memory (`fake-indexeddb`):
- `src/db/repositories/__tests__/dexieRepository.test.ts`: Memastikan transaksi database atomik, penambahan, pembaruan, penghapusan, kalkulasi saldo per akun, dan integritas data tersimpan dengan benar.

---

## Struktur Direktori Proyek

```
management-keuangan/
├── .github/                  # Konfigurasi repositori dan template issue/PR
├── public/                   # Aset publik statis (favicon, ikon manifest)
├── src/
│   ├── components/           # Komponen antarmuka pengguna modular
│   │   ├── AccountModal.tsx          # Modal pengelolaan dompet dan saldo awal
│   │   ├── AnalyticsDashboard.tsx    # Panel visualisasi analitik arus kas
│   │   ├── CategoryBudgetModal.tsx   # Modal pengaturan batas anggaran kategori
│   │   ├── DailyAllowanceCard.tsx    # Kartu indikator alokasi harian
│   │   ├── DataBackupModal.tsx       # Modal cadangan data JSON dan ekspor CSV
│   │   ├── DeleteConfirmModal.tsx    # Dialog konfirmasi kustom penghapusan
│   │   ├── Numpad.tsx                # Komponen kalkulator layar sentuh
│   │   ├── PresetBar.tsx             # Bilah tombol preset transaksi 1-tap
│   │   ├── PresetModal.tsx           # Modal pembuatan dan pengaturan preset
│   │   ├── QuickEntryForm.tsx        # Form pencatatan transaksi cepat
│   │   ├── ReconcileModal.tsx        # Modal penyesuaian saldo riil
│   │   ├── SoftLimitProgressBar.tsx  # Indikator progres anggaran soft-limit
│   │   ├── ThemeToggle.tsx           # Tombol pengalih mode terang/gelap
│   │   ├── TransactionSearchFilter.tsx # Bilah pencarian dan filter riwayat
│   │   ├── TransferModal.tsx         # Modal transfer dana antar dompet
│   │   └── __tests__/                # Pengujian komponen antarmuka (Black-box)
│   ├── db/                   # Lapisan basis data lokal
│   │   ├── dexie.ts                  # Inisialisasi skema Dexie IndexedDB
│   │   └── repositories/             # Implementasi Repository Pattern
│   │       ├── types.ts              # Kontrak antarmuka IDatabaseRepository
│   │       ├── dexieRepository.ts    # Implementasi konkret repositori Dexie
│   │       └── __tests__/            # Pengujian integrasi database (Grey-box)
│   ├── hooks/                # Custom React Hooks untuk manajemen state lokal
│   │   ├── useAccounts.ts            # Hook manajemen data akun dan saldo
│   │   ├── useCategories.ts          # Hook manajemen kategori dan anggaran
│   │   ├── usePresets.ts             # Hook manajemen daftar preset cepat
│   │   ├── useTheme.ts               # Hook manajemen tema terang/gelap
│   │   └── useTransactions.ts        # Hook riwayat transaksi dan filter
│   ├── types/                # Definisi tipe data TypeScript terpusat
│   │   └── database.ts               # Tipe entitas Akun, Kategori, Transaksi, Preset
│   ├── utils/                # Fungsi utilitas pembantu
│   │   ├── currency.ts               # Helper presisi format mata uang Rupiah
│   │   ├── date.ts                   # Helper manipulasi tanggal dan periode
│   │   ├── exportImport.ts           # Utilitas format JSON dan CSV
│   │   └── __tests__/                # Pengujian unit utilitas (White-box)
│   ├── App.tsx               # Komponen utama penyusun tampilan aplikasi
│   ├── index.css             # Penataan gaya Tailwind CSS dan animasi scrollbar
│   └── main.tsx              # Entry point aplikasi React
├── package.json              # Konfigurasi dependensi dan skrip proyek
├── tsconfig.json             # Konfigurasi kompiler TypeScript
├── vite.config.ts            # Konfigurasi bundler Vite dan plugin PWA
└── vitest.config.ts          # Konfigurasi lingkungan pengujian Vitest
```

---

## Panduan Instalasi dan Menjalankan Proyek

### Prasyarat Sistem
- Node.js versi 18.0.0 atau yang lebih baru.
- npm versi 9.0.0 atau yang lebih baru (atau yarn / pnpm).
- Peramban web modern yang mendukung IndexedDB dan Service Worker.

### 1. Kloning Repositori
```bash
git clone https://github.com/Just-Fajar/management-keuangan.git
cd management-keuangan
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan Lokal
```bash
npm run dev
```
Setelah server berjalan, buka peramban web dan arahkan ke alamat yang tertera di terminal (biasanya `http://localhost:5173/`).

### 4. Menjalankan Seluruh Pengujian Unit
```bash
npm run test
```
Perintah ini akan menjalankan Vitest untuk seluruh rangkaian pengujian White-box, Black-box, dan Grey-box secara simultan.

### 5. Membangun Bundel Produksi
```bash
npm run build
```
Perintah ini akan melakukan validasi tipe TypeScript (`tsc`) dan membangun berkas produksi teroptimasi di dalam direktori `dist/`.

### 6. Menjalankan Pratinjau Bundel Produksi
```bash
npm run preview
```

---

## Teknologi dan Pustaka yang Digunakan

- Core Framework: React 19, TypeScript 5, Vite 6
- State and Database Persistence: Dexie.js 4 (IndexedDB)
- Styling and Theme: Tailwind CSS v4, Lucide React Icons
- Progressive Web App: Vite Plugin PWA, Workbox
- Unit and Component Testing: Vitest 4, React Testing Library, JSDOM, fake-indexeddb
- Code Management and Standards: Issue-Driven Development (IDD), Conventional Commits

---

## Metodologi Pengembangan

Proyek ini dikembangkan secara konsisten menggunakan alur kerja Issue-Driven Development (IDD):
1. Diskusi dan Analisis Teknis: Penentuan cakupan perubahan dan verifikasi dampak sebelum penulisan kode.
2. Pembuatan GitHub Issue: Setiap tugas, fitur, atau perbaikan memiliki nomor Issue resmi dengan rincian spesifikasi dan kriteria penerimaan.
3. Feature Branching: Pekerjaan dilakukan pada cabang (branch) terisolasi yang mengacu pada nomor Issue (contoh: `feat/issue-X` atau `docs/issue-X`).
4. Pengujian Otomatis: Memastikan seluruh pengujian lulus dan build produksi berhasil sebelum integrasi.
5. Pull Request dan Merge: Penggabungan perubahan ke cabang utama `main` melalui peninjauan Pull Request terstruktur.

---

## Lisensi

Proyek ini dikembangkan untuk penggunaan pribadi dan didistribusikan di bawah lisensi terbuka sebagai referensi implementasi aplikasi pencatatan keuangan PWA modern.
