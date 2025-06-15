# CapestoneIBMxHacktiv8

# Dompet Digital - Aplikasi Pencatat Keuangan Pribadi

Aplikasi web full-stack yang dirancang untuk membantu pengguna mengelola keuangan pribadi dengan mudah dan efisien. Pengguna dapat melacak setiap pemasukan dan pengeluaran, mengkategorikannya, dan menganalisis alokasi dana mereka melalui dashboard interaktif. Proyek ini dibangun sebagai Capstone Project Hacktiv8 dengan dukungan ekstensif dari AI (IBM Granite) di setiap fase pengembangan.

**Link Aplikasi Live:** [https://dompet-digital-skyda.up.railway.app) ---

## Demo Aplikasi

![Demo Dompet Digital](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGo3ZXpzOHc0bGJ0YXVtNTVsc2oydWptN2Iyd291cXEybWd3andlcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/W5ZfCqTVnP6Vgc33Gt/giphy.gif) ---

## Fitur Utama

-   **Autentikasi Pengguna Lengkap:** Sistem registrasi dan login yang aman menggunakan Passport.js dengan password yang di-hash (bcrypt). Setiap data pengguna terisolasi dan aman.
-   **Manajemen Transaksi (CRUD):** Pengguna memiliki kontrol penuh untuk menambah, melihat, mengedit, dan menghapus riwayat transaksinya.
-   **Manajemen Kategori Dinamis:** Pengguna dapat membuat dan menghapus kategori transaksi mereka sendiri (misal: Makanan, Transportasi, Gaji) untuk pencatatan yang lebih akurat.
-   **Dashboard Interaktif:** Ringkasan real-time untuk total pemasukan, pengeluaran, dan saldo akhir.
-   **Visualisasi Data:** Grafik Doughnut yang informatif untuk menampilkan alokasi dana (pemasukan vs sisa saldo).
-   **Laporan Dinamis & Filter:** Kemampuan untuk memfilter riwayat transaksi berdasarkan periode waktu (Bulan Ini, Bulan Lalu, Tahun Ini).
-   **Ekspor Data Profesional:** Fitur untuk mengunduh laporan transaksi yang telah difilter ke dalam format **CSV** (untuk diolah kembali di Excel/Sheets) dan **PDF** (untuk laporan final).
-   **Notifikasi Interaktif:** Sistem *Flash Messages* untuk memberikan feedback langsung kepada pengguna setelah setiap aksi (login berhasil, data ditambahkan, dll).

---

## Tumpukan Teknologi (Tech Stack)

-   **Backend:** Node.js, Express.js
-   **Frontend:** EJS (Embedded JavaScript)
-   **Database:** MongoDB dengan Mongoose (via MongoDB Atlas)
-   **Autentikasi:** Passport.js, express-session, bcryptjs
-   **Lainnya:** connect-flash, json2csv, puppeteer, dotenv

---

## Panduan Instalasi Lokal

1.  Clone repository ini: `git clone https://github.com/username/repo-anda.git`
2.  Masuk ke direktori: `cd repo-anda`
3.  Install semua dependensi: `npm install`
4.  Buat file `.env` di root direktori dan isi variabel berikut:
    ```
    MONGO_URI=mongodb+srv://...
    PORT=3000
    ```
5.  Jalankan aplikasi: `npm start`
6.  Buka `http://localhost:3000` di browser Anda.

---

## Penjelasan Dukungan AI (IBM Granite)

Dalam pengembangan proyek "Dompet Digital" ini, model AI dari IBM, yaitu **Granite**, dimanfaatkan secara ekstensif sebagai asisten developer serbaguna. Peran utamanya adalah untuk mempercepat proses pengembangan, memberikan solusi untuk masalah teknis yang kompleks, dan bertindak sebagai rekan brainstorming untuk implementasi fitur.

Berikut adalah rincian kontribusi dan dampak nyata penggunaan AI IBM Granite dalam setiap fase pengembangan:

#### 1. Fase Ide & Desain Awal
* **Masalah:** Mengalami kesulitan dalam menentukan ide proyek yang komprehensif namun tetap realistis untuk dikerjakan sesuai tenggat waktu dan memenuhi semua kriteria penilaian.
* **Bantuan AI IBM Granite:** Dengan memberikan prompt sesuai dengan ide proyek, saya meminta AI untuk menganalisis dan memberikan rekomendasi. Granite menyarankan ide "Aplikasi Pencatat Keuangan" karena secara alami mencakup fungsionalitas CRUD dan potensi visualisasi data. AI juga membantu merancang skema data awal untuk koleksi `Transaction` dan `User` di MongoDB.
* **Dampak:** Proses brainstorming menjadi sangat efisien dan proyek langsung berada di jalur yang benar sejak awal.

#### 2. Fase Pembangunan Backend & Fitur Kompleks
* **Masalah:** Tantangan teknis terbesar adalah membangun sistem autentikasi multi-user yang aman dari nol, terutama dalam mengkonfigurasi Passport.js.
* **Bantuan AI IBM Granite:** Saya memanfaatkan Granite untuk meng-generate kerangka kode (*boilerplate*) dan panduan langkah-demi-langkah. AI menghasilkan kode untuk Model `User` lengkap dengan password hashing `bcrypt`, struktur file `config/passport.js` yang modular, serta logika dasar di controller untuk menangani registrasi dan login.
* **Dampak:** Berhasil mengimplementasikan fitur paling kompleks di aplikasi ini dengan jauh lebih cepat, sekaligus memperdalam pemahaman tentang konsep keamanan web seperti hashing, session, dan middleware.

#### 3. Fase Debugging & Troubleshooting
* **Masalah:** Sering menghadapi error yang menghentikan progres, seperti `Cannot find module`, dan yang paling sulit, error `ReferenceError: ReadableStream is not defined` saat implementasi fitur ekspor PDF.
* **Bantuan AI IBM Granite:** Saya menggunakan AI sebagai *debugger assistant*. Dengan memberikan pesan error dari terminal, AI mampu mendiagnosis penyebabnya (misalnya, versi Node.js yang tidak kompatibel dengan library Puppeteer) dan memberikan solusi yang presisi, termasuk perintah terminal yang harus dijalankan untuk memperbaikinya.
* **Dampak:** Mengubah hambatan teknis yang bisa memakan waktu berjam-jam menjadi kesempatan belajar yang cepat. Proses debugging menjadi lebih sistematis dan efisien.

#### 4. Fase Peningkatan Fitur & UI/UX
* **Masalah:** Setelah fitur inti selesai, saya butuh ide untuk meningkatkan kualitas aplikasi. Saya juga mengalami kesulitan menerjemahkan ide desain menjadi kode CSS yang rapi.
* **Bantuan AI IBM Granite:** Saya menggunakan Granite sebagai rekan brainstorming. Untuk fitur, AI menyarankan implementasi **Flash Messages** dan **Ekspor ke PDF**, lengkap dengan rekomendasi library (`connect-flash`, `puppeteer`) dan contoh kodenya. Untuk UI/UX, saat saya memberikan feedback visual ("tampilannya tidak rapi"), AI membantu menghasilkan beberapa alternatif solusi layout CSS untuk mencapai header yang seimbang dan modern.
* **Dampak:** Aplikasi berkembang dari sekadar "berfungsi" menjadi produk yang berkualitas tinggi dengan pengalaman pengguna yang lebih baik dan fitur profesional yang mengesankan.
