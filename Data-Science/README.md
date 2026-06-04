# Data Science — BurnoutLens

Folder ini berisi notebook pemrosesan data capstone project untuk deteksi dini risiko burnout 
pada pekerja berbasis analisis data harian pengguna.

## Isi Folder
- `burnout_prediction_capstone.ipynb` — Notebook utama pemrosesan data capstone project BurnoutLens

## Deskripsi Project
BurnoutLens adalah platform berbasis AI yang mendeteksi risiko burnout secara 
preventif melalui dua pendekatan:
- **Analisis Teks Jurnal Harian** menggunakan model NLP untuk klasifikasi emosi dan mood score
- **Prediksi Skor Burnout** menggunakan model LSTM berbasis data jam tidur dan jam kerja (time-series)

## Latar Belakang
Burnout pada pekerja di Indonesia merupakan isu serius — 83% tenaga kesehatan 
mengalami gejala burnout selama pandemi. BurnoutLens hadir sebagai solusi 
peringatan dini yang mandiri, privat, dan berbasis data riil.

---

## Isi Repository

```
Data-Science/
├── Capstone_Projek_Akhir.ipynb  # Notebook utama pemrosesan data
├── Laporan Teknis Komprehensif_BurnoutLens.pdf   # Laporan teknis komprehensif
├── dashboard.py                             # File utama dashboard Streamlit
├── requirements.txt                   # Dependensi Python
├── README.md                          # Dokumentasi ini
└── DEPLOYMENT_GUIDE.md                # Panduan deployment
```

---
## Fitur Dashboard

- **Overview** — Latar belakang, KPI, dan business questions
- **Business Question** — Analisis pertanyaan bisnis berbasis data dan visualisasi insight utama
- **A/B Testing** — Perbandingan threshold konservatif vs agresif
- **Simulasi Prediksi** — Input data harian dan estimasi risiko burnout
- **Kesimpulan** — Ringkasan insight dan rekomendasi pengembangan

---

## Cara Menjalankan Lokal

```bash
# 1. Clone repository
git clone https://github.com/USERNAME/burnoutlens.git
cd burnoutlens

# 2. Install dependencies
pip install -r requirements.txt

# 3. Jalankan Streamlit
streamlit run app.py
```

Buka browser di: http://localhost:8501

---

## Deploy ke Streamlit Cloud

1. Push seluruh file ke repository GitHub (wajib **Public**)
2. Buka https://streamlit.io/cloud lalu login dengan akun GitHub
3. Klik **New app** dan pilih repository, branch `main`, main file `dashboard.py`
4. Klik **Deploy** dan tunggu 2-5 menit hingga aplikasi live

Untuk panduan lengkap beserta troubleshooting, lihat `DEPLOYMENT_GUIDE.md`.

---

## Tim
- CC26-PSU352 | Coding Camp 2026 powered by DBS Foundation
- Tema: Healthy Lives & Well-Being
