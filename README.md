# Management Keuangan

Management Keuangan adalah aplikasi pencatatan keuangan pribadi yang cepat, sederhana, dan berjalan offline (Progressive Web App). Aplikasi ini dirancang agar siapapun dapat mencatat pengeluaran dan pemasukan harian tanpa proses yang rumit.

---

## Fitur Utama

- **Pencatatan 1-Tap Instan:** Catat pengeluaran rutin hanya dengan satu sentuhan menggunakan tombol preset.
- **Form Entry & Numpad Touch:** Pengisian nominal transaksi dengan kalkulator numpad yang intuitif.
- **Kelola Dompet & E-Wallet:** Mendukung pengelolaan banyak akun dompet seperti Tunai, Bank (BCA), GoPay, DANA, OVO, dan ShopeePay.
- **Transfer Antar Dompet:** Fitur pindah buku saldo antar dompet tanpa mengubah riwayat pendapatan atau pengeluaran.
- **Penyesuaian Saldo (Reconcile):** Menyesuaikan saldo sistem dengan saldo fisik sebenarnya secara otomatis.
- **Anggaran Soft-Limit:** Memantau batas anggaran bulanan per kategori dengan indikator warna (Hijau, Kuning, Merah).
- **Analisis Cash Flow:** Laporan visual arus kas masuk dan keluar beserta kategori pengeluaran terbesar.
- **Mode Terang & Gelap:** Pengalih tema Light Mode dan Dark Mode untuk kenyamanan mata.
- **Portabilitas & Keamanan Data:** Backup dan restore data dalam format JSON serta ekspor transaksi ke CSV Excel. Data tersimpan aman secara lokal di perangkat pengguna (IndexedDB).

---

## Cara Menjalankan Aplikasi secara Lokal

### Prasyarat
- Node.js versi 18 atau lebih baru.
- npm atau package manager sejenis.

### Langkah Instalasi
1. Clone repositori ini atau unduh kode sumbernya:
   ```bash
   git clone https://github.com/Just-Fajar/management-keuangan.git
   cd management-keuangan
   ```

2. Install seluruh dependensi proyek:
   ```bash
   npm install
   ```

3. Jalankan server pengembang lokal:
   ```bash
   npm run dev
   ```
   Buka alamat `http://localhost:5173/` pada browser Anda.

4. Jalankan pengujian unit (Vitest):
   ```bash
   npm run test
   ```

5. Buat bundle produksi:
   ```bash
   npm run build
   ```

---

## Teknologi yang Digunakan

- **Core:** React, TypeScript, Vite.
- **Database Lokal:** Dexie.js (IndexedDB).
- **Styling:** Tailwind CSS, Lucide React Icons.
- **PWA:** Vite PWA Plugin (Workbox).
- **Testing:** Vitest, Testing Library React.

---

## Lisensi

Proyek ini dibuat untuk penggunaan pribadi dan dikembangkan dengan standar Issue-Driven Development (IDD).
