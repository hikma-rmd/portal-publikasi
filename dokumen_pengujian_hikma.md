# Features and Use Cases Documentation: Portal Mading dan LPJ

Catatan: Dokumen ini berisi 15 Features dan 40 Use Cases yang menguji sistem terpadu Portal Mading dan LPJ dari sisi pengguna mahasiswa (Hikma).

## Feature 1: Registrasi Akun Mahasiswa
Aktor: Hikma
Tujuan: Memverifikasi alur pembuatan akun baru.

* Use Case 1: Registrasi Berhasil dengan mengisi Email dan Password, sistem mendaftarkan profil dengan role user.
* Use Case 2: Registrasi Ditolak karena Email Duplikat, sistem menampilkan peringatan email sudah terdaftar.
* Use Case 3: Registrasi Ditolak karena Format Kata Sandi kurang dari 6 karakter, sistem menahan pendaftaran.

## Feature 2: Autentikasi Masuk ke Sistem
Aktor: Hikma
Tujuan: Memverifikasi mekanisme login.

* Use Case 4: Autentikasi Berhasil dengan email dan kata sandi yang benar, sistem mengarahkan ke dashboard.
* Use Case 5: Autentikasi Gagal karena kata sandi keliru, sistem menampilkan peringatan kredensial salah.
* Use Case 6: Autentikasi Gagal karena email belum terdaftar, sistem menolak akses.

## Feature 3: Akses dan Keamanan Dashboard Pribadi
Aktor: Hikma
Tujuan: Memastikan dashboard aman dan menampilkan ringkasan data.

* Use Case 7: Tampilan Ringkasan Dashboard menampilkan statistik Total Dokumen, Draft, dan Disetujui.
* Use Case 8: Pemblokiran Akses Dashboard bekerja secara otomatis saat pengguna mencoba masuk tanpa sesi aktif.

## Feature 4: Pengelolaan Profil Pengguna
Aktor: Hikma
Tujuan: Memverifikasi pembaruan informasi identitas pengguna.

* Use Case 9: Pembaruan Nama Diri Berhasil setelah mengubah kolom Full Name dan menyimpannya.
* Use Case 10: Penolakan Pembaruan Nama Kosong di mana sistem menampilkan peringatan wajib isi.

## Feature 5: Pengajuan Draf Mading
Aktor: Hikma
Tujuan: Memverifikasi penyusunan konten publik (Mading).

* Use Case 11: Draf Mading Baru Tersimpan dengan mengisi Judul, Jenis Dokumen Pengumuman, Kategori, Link, dan konten teks.
* Use Case 12: Penolakan Pengajuan Tanpa Judul saat menekan Ajukan Validasi, memunculkan peringatan wajib isi.
* Use Case 13: Penyimpanan sebagai Draft berhasil dilakukan tanpa mengirimkan ke antrean validasi.

## Feature 6: Pengajuan Draf LPJ
Aktor: Hikma
Tujuan: Memverifikasi penyusunan laporan internal (LPJ).

* Use Case 14: Draf LPJ Baru Tersimpan dengan memilih Jenis Dokumen Laporan Pertanggungjawaban (LPJ) pada form yang sama.
* Use Case 15: Mengunggah Lampiran LPJ berhasil melalui tautan eksternal atau sisipan gambar di editor.
* Use Case 16: Verifikasi Form Dinamis bekerja merubah visibilitas di back-end sesuai pilihan jenis LPJ.

## Feature 7: Penyuntingan Konten yang Sudah Tersimpan
Aktor: Hikma
Tujuan: Memverifikasi fitur edit dan autosave.

* Use Case 17: Perubahan Isi Draf Tersimpan Permanen setelah memodifikasi teks dan menekan simpan.
* Use Case 18: Mekanisme Penyimpanan Otomatis bekerja setelah 15 detik tanpa aktivitas pengetikan.
* Use Case 19: Pembatalan Penyuntingan berhasil dengan menekan Cancel sebelum sistem melakukan penyimpanan.

## Feature 8: Pengajuan Draf untuk Diproses Editor
Aktor: Hikma
Tujuan: Memverifikasi transisi dokumen ke antrean editor.

* Use Case 20: Pengiriman Mading untuk Validasi mengubah status dokumen menjadi Menunggu.
* Use Case 21: Pengiriman LPJ untuk Validasi juga mengubah status laporan menjadi Menunggu.
* Use Case 22: Pencegahan Status Draft memastikan dokumen ditarik dari status draft saat masuk antrean editor.

## Feature 9: Pemantauan Status Pengajuan dan Umpan Balik
Aktor: Hikma
Tujuan: Memverifikasi umpan balik visual terhadap dokumen.

* Use Case 23: Sinkronisasi Badge Status menampilkan indikator Draft, Menunggu, Disetujui, atau Ditolak di halaman riwayat.
* Use Case 24: Membaca Catatan Evaluasi Editor memungkinkan pengguna melihat komentar perbaikan pada dokumen yang ditolak.

## Feature 10: Revisi Pengajuan Pasca Penolakan
Aktor: Hikma
Tujuan: Memverifikasi perbaikan dokumen yang ditolak.

* Use Case 25: Perbaikan Draf Berdasarkan Catatan berhasil disimpan ulang dan dikirim ke antrean.
* Use Case 26: Penanda Tindak Lanjut Revisi otomatis mengembalikan status dokumen ke Menunggu setelah diperbaiki.

## Feature 11: Pengelolaan Draf Milik Sendiri
Aktor: Hikma
Tujuan: Memverifikasi kontrol data pribadi.

* Use Case 27: Penghapusan Dokumen berhasil dilakukan dari daftar riwayat milik pengguna.
* Use Case 28: Akses Buka dan Edit memungkinkan pengguna melihat rincian penuh suatu pengajuan dengan mudah.

## Feature 12: Perbedaan Visibilitas Konten Mading dan LPJ
Aktor: Hikma
Tujuan: Memverifikasi pemisahan data publik dan privat.

* Use Case 29: Mading Disetujui Tampil Publik di halaman utama portal secara otomatis.
* Use Case 30: LPJ Disetujui Tetap Privat dan dijamin tidak muncul di halaman utama portal.
* Use Case 31: Akses Pribadi LPJ memastikan laporan tetap bisa dilihat khusus oleh pembuatnya di dashboard.

## Feature 13: Pencarian dan Penyaringan Riwayat Pengajuan
Aktor: Hikma
Tujuan: Memverifikasi efisiensi penelusuran riwayat.

* Use Case 32: Penemuan Berdasarkan Judul berfungsi menampilkan hasil relevan di kotak pencarian.
* Use Case 33: Penyaringan Riwayat Kategori dan Status berhasil menyaring tabel sesuai kombinasi opsi.
* Use Case 34: Identifikasi Visual Jenis Dokumen terlihat jelas dari badge khusus MADING atau LPJ.

## Feature 14: Pengelolaan Sesi Aktif dan Proses Keluar
Aktor: Hikma
Tujuan: Memverifikasi fungsi keamanan sesi.

* Use Case 35: Pengakhiran Sesi secara Manual berhasil mengarahkan pengguna kembali ke halaman utama login.
* Use Case 36: Keamanan Rute Pasca Logout menolak pengguna yang mencoba menavigasi ke halaman aman lewat riwayat browser.

## Feature 15: Ketahanan Sistem terhadap Kondisi Anomali
Aktor: Hikma
Tujuan: Memverifikasi stabilitas terhadap kondisi tak terduga.

* Use Case 37: Penanganan Navigasi Tersesat secara aman menampilkan halaman 404 Not Found standar.
* Use Case 38: Ketahanan Autosave menampilkan indikasi kegagalan penyimpanan secara visual saat internet terputus.
* Use Case 39: Penolakan Lampiran Gambar Melampaui Batas menampilkan notifikasi peringatan jika file lebih dari 2MB.
* Use Case 40: Form Submit Kosong menahan sistem dari menyimpan data ke database apabila informasi wajib terabaikan.
