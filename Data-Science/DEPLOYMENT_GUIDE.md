# 📘 PANDUAN LENGKAP DEPLOYMENT BURNOUTLENS KE STREAMLIT CLOUD

## ═══════════════════════════════════════════════════════
## LANGKAH 1 — PERSIAPAN FILE PROYEK
## ═══════════════════════════════════════════════════════

Pastikan folder proyek Anda memiliki struktur berikut:

```
burnoutlens_dashboard/
├── app.py               ← File utama dashboard Streamlit
├── requirements.txt     ← Daftar library yang dibutuhkan
└── README.md            ← Dokumentasi proyek (opsional, tapi direkomendasikan)
```

### Cek isi requirements.txt:
```
streamlit==1.35.0
pandas==2.2.2
numpy==1.26.4
plotly==5.22.0
scipy==1.13.0
scikit-learn==1.5.0
```

---

## ═══════════════════════════════════════════════════════
## LANGKAH 2 — BUAT AKUN GITHUB (JIKA BELUM ADA)
## ═══════════════════════════════════════════════════════

1. Buka https://github.com
2. Klik **"Sign up"** → isi username, email, password
3. Verifikasi email yang dikirim ke inbox Anda
4. Login ke GitHub

---

## ═══════════════════════════════════════════════════════
## LANGKAH 3 — BUAT REPOSITORY BARU DI GITHUB
## ═══════════════════════════════════════════════════════

### Cara via Website GitHub (direkomendasikan untuk pemula):

1. Klik tombol **"+"** di pojok kanan atas → pilih **"New repository"**
2. Isi kolom:
   - **Repository name:** `burnoutlens-dashboard`
   - **Description:** `BurnoutLens Dashboard - Capstone CC26-PSU352`
   - **Visibility:** ✅ Public (wajib Public untuk Streamlit Cloud gratis)
3. Centang **"Add a README file"**
4. Klik **"Create repository"**

### Cara via Git Command Line:

```bash
# Di terminal/command prompt, masuk ke folder proyek Anda
cd burnoutlens_dashboard

# Inisialisasi Git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "feat: initial BurnoutLens dashboard"

# Hubungkan ke GitHub (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/burnoutlens-dashboard.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

---

## ═══════════════════════════════════════════════════════
## LANGKAH 4 — UPLOAD FILE KE GITHUB REPOSITORY
## ═══════════════════════════════════════════════════════

### Cara Upload via Website (drag & drop):

1. Buka repository Anda di GitHub
2. Klik **"Add file"** → **"Upload files"**
3. Drag & drop ketiga file berikut:
   - `app.py`
   - `requirements.txt`
   - `README.md`
4. Scroll ke bawah, isi commit message: `"Add BurnoutLens dashboard files"`
5. Klik **"Commit changes"**

### Verifikasi:
Pastikan di halaman repository Anda terlihat 3 file tersebut ✅

---

## ═══════════════════════════════════════════════════════
## LANGKAH 5 — BUAT AKUN STREAMLIT CLOUD
## ═══════════════════════════════════════════════════════

1. Buka https://streamlit.io/cloud
2. Klik **"Sign up"** atau **"Get started"**
3. Pilih **"Continue with GitHub"** (sangat disarankan — terhubung otomatis)
4. Authorize Streamlit untuk mengakses akun GitHub Anda
5. Anda akan diarahkan ke dashboard Streamlit Cloud

---

## ═══════════════════════════════════════════════════════
## LANGKAH 6 — DEPLOY APLIKASI
## ═══════════════════════════════════════════════════════

1. Di dashboard Streamlit Cloud, klik **"New app"**
2. Pilih **"From existing repo"**
3. Isi formulir deployment:

   | Field | Nilai |
   |-------|-------|
   | **Repository** | `USERNAME/burnoutlens-dashboard` |
   | **Branch** | `main` |
   | **Main file path** | `app.py` |

4. (Opsional) Kustomisasi URL:
   - Di bagian **"App URL"**, ubah menjadi: `burnoutlens-cc26psu352`
   - URL final: `https://burnoutlens-cc26psu352.streamlit.app`

5. Klik **"Deploy!"**

### Proses Deployment:
- Streamlit Cloud akan membaca `requirements.txt` dan menginstall semua library
- Proses biasanya memakan waktu **2–5 menit**
- Anda bisa memantau log di layar
- Setelah selesai, aplikasi langsung live dan dapat diakses publik ✅

---

## ═══════════════════════════════════════════════════════
## LANGKAH 7 — VERIFIKASI & AKSES PUBLIK
## ═══════════════════════════════════════════════════════

1. Setelah deployment berhasil, Anda akan mendapat URL seperti:
   ```
   https://burnoutlens-cc26psu352.streamlit.app
   ```

2. Buka URL tersebut di browser → pastikan dashboard tampil dengan benar

3. Bagikan URL ke siapapun — aplikasi dapat diakses tanpa login 🎉

### Cek Semua Halaman:
- ✅ 🏠 Overview — KPI dan business questions tampil
- ✅ 📊 EDA Burnout — Chart distribusi, korelasi, heatmap
- ✅ 💬 EDA NLP — Chart emosi per sumber
- ✅ 🧬 Data Sintetis — Grafik tren 30 hari
- ✅ ⚔️ A/B Testing — Perbandingan metrik
- ✅ 🔮 Simulasi Prediksi — Input slider berfungsi
- ✅ 📋 Kesimpulan — Ringkasan dan rekomendasi

---

## ═══════════════════════════════════════════════════════
## LANGKAH 8 — UPDATE APLIKASI (JIKA ADA PERUBAHAN)
## ═══════════════════════════════════════════════════════

Setiap kali Anda push perubahan ke GitHub, Streamlit Cloud otomatis
**re-deploy** aplikasi dalam beberapa menit.

```bash
# Edit file app.py, lalu:
git add app.py
git commit -m "fix: update chart colors"
git push origin main
# Streamlit Cloud auto-deploy ✅
```

Atau via website GitHub:
1. Buka file `app.py` di repository
2. Klik ikon pensil (Edit)
3. Lakukan perubahan
4. Klik "Commit changes"
5. Streamlit Cloud otomatis update ✅

---

## ═══════════════════════════════════════════════════════
## TROUBLESHOOTING
## ═══════════════════════════════════════════════════════

### ❌ Error: ModuleNotFoundError
**Solusi:** Pastikan semua library yang diimport di `app.py` ada di `requirements.txt`

### ❌ Error: FileNotFoundError
**Solusi:** Dashboard ini menggunakan data yang di-generate secara langsung (no file CSV external), jadi error ini tidak seharusnya terjadi. Cek apakah ada perubahan pada fungsi generate_*_data().

### ❌ Deployment gagal / timeout
**Solusi:**
1. Cek log error di Streamlit Cloud
2. Pastikan `requirements.txt` tidak mengandung package yang incompatible
3. Coba pin versi yang lebih lama: `streamlit>=1.28.0`

### ❌ Tampilan chart tidak muncul
**Solusi:** Pastikan `plotly` ada di requirements.txt dan versi kompatibel dengan Python yang digunakan Streamlit Cloud (Python 3.9–3.11)

### ❌ Repository tidak terdeteksi di Streamlit Cloud
**Solusi:** Pastikan repository bersifat **Public** (bukan Private)

---

## ═══════════════════════════════════════════════════════
## TIPS TAMBAHAN
## ═══════════════════════════════════════════════════════

### Menambahkan Custom Domain (opsional):
Di settings Streamlit Cloud app Anda, bisa menambahkan custom domain
jika memiliki domain pribadi.

### Monitoring Usage:
Streamlit Cloud free tier mendukung:
- 1 app aktif
- Unlimited viewers
- 1GB memory

### Secrets Management:
Jika perlu menyimpan API key, gunakan Streamlit Secrets:
1. Di Streamlit Cloud dashboard → Settings app → Secrets
2. Tambahkan dalam format TOML:
   ```toml
   [api_keys]
   GOOGLE_MAPS = "your-key-here"
   ```
3. Akses di kode: `st.secrets["api_keys"]["GOOGLE_MAPS"]`

---

*Dibuat untuk Capstone Project CC26-PSU352 — BurnoutLens*  
*Coding Camp 2026 powered by DBS Foundation*
