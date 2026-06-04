# **Model NLP Emotion Classification**

### **Gambaran Umum**

Model ini digunakan untuk melakukan klasifikasi emosi dari input jurnal/diary dari user, kemudian model akan memprediksi emosi yang paling dominan berdasarkan pola kata dalam teks. Namun, juga menunjukkan emosi lain dengan mengambil 2 emosi teratas agar dapat menangani kalimat ambigu.

Model dikembangkan menggunakan TensorFlow/Keras dengan pendekatan Deep Learning. Arsitektur model menggabungkan pretrained FastText embedding, Conv1D, Bidirectional GRU, Attention Layer, serta pooling layer untuk menangkap pola emosi dalam teks.

Output model berupa probabilitas untuk setiap kelas emosi, seperti `anger`, `fear`, `happy`, `love`, dan `sadness`.

---

### **Download Model**
Best Model NLP dapat diakses pada google drive file `best_model_nlp.keras`

Link Drive:
https://drive.google.com/drive/folders/1gKXW6iX2OflXCUjn9y9Tgi4qhYJhlNnK?usp=sharing

---
### **Alur Kerja Model**

Secara umum, alur kerja model adalah sebagai berikut:

1. Dataset teks dimuat dari file CSV.
2. Label emosi diubah menjadi bentuk numerik menggunakan `LabelEncoder`.
3. Teks diubah menjadi sequence angka menggunakan `Tokenizer`.
4. Sequence disamakan panjangnya menggunakan `pad_sequences`.
5. Model dilatih menggunakan data train dan divalidasi menggunakan data validation.
6. Model terbaik disimpan dalam format `.keras`.
7. Model digunakan kembali untuk memprediksi teks baru dari user.
8. Untuk teks panjang, teks akan dipotong menjadi beberapa chunk agar sesuai dengan panjang input model.
9. Hasil prediksi setiap chunk digabungkan untuk menentukan emosi akhir.
10. Sistem juga dapat menampilkan top-2 emosi dengan probabilitas tertinggi.

---

### **Preprocessing Teks**

Preprocessing pada model ini dilakukan dengan mengubah teks menjadi bentuk numerik agar dapat diproses oleh neural network.

Tahapan preprocessing meliputi:

- Mengubah teks menjadi sequence angka menggunakan tokenizer.
- Menyamakan panjang sequence menjadi `max_len = 150`.
- Menambahkan padding jika teks lebih pendek dari 150 token.
- Memotong teks jika panjangnya melebihi 150 token.

Bagian ini penting untuk deployment karena input dari user harus diproses dengan cara yang sama seperti saat training. Jika preprocessing saat deployment berbeda, hasil prediksi model bisa menjadi tidak stabil.

---

### Arsitektur Model

Model menggunakan kombinasi:

- Pretrained FastText Embedding (Bahasa Indonesia)
- Conv1D
- Bidirectional GRU
- Custom Attention Layer
- Global Max Pooling
- Global Average Pooling

---

### File Penjelasan

| File | Fungsi |
|---|---|
| `best_model_nlp.keras` | Model hasil training |
| `tokenizer.pkl` | Mengubah teks menjadi sequence numerik |
| `label_encoder.pkl` | Mengubah output numerik menjadi label emosi |
| `attention_layer.py` | Custom Attention Layer |
| `model_service.py` | Service inference model |
| `requirements.txt` | Dependency Python |

---
