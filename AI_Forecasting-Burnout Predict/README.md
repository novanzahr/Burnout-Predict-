# Burnout Prediction Model

Model prediksi burnout berbasis Deep Learning menggunakan pendekatan Time Series Forecasting dengan kombinasi GRU (Gated Recurrent Unit) dan Attention Mechanism. Model dirancang untuk memprediksi tingkat burnout pengguna berdasarkan pola aktivitas harian seperti jam kerja, jam tidur, dan kuisoner. 

---

# Project Overview

Burnout merupakan kondisi kelelahan fisik, mental, dan emosional yang dapat memengaruhi produktivitas serta kesehatan seseorang. Pada project ini, model AI dikembangkan untuk membantu memonitor kondisi burnout pengguna secara berkala melalui analisis pola aktivitas harian.

Model memanfaatkan data time series selama 7 hari terakhir untuk memprediksi burnout score pada hari berikutnya. Selain menggunakan behavioral data, sistem juga menggabungkan questionnaire score agar hasil prediksi lebih realistis dan adaptif terhadap kondisi psikologis pengguna.

---

# Features Used

Model menggunakan beberapa fitur utama:

| Feature                   | Description                             |
| ------------------------- | --------------------------------------- |
| `work_hours_per_day`      | Jumlah jam kerja harian                 |
| `sleep_hours`             | Jumlah jam tidur                        |
| `consecutive_overwork`    | Jumlah hari overwork berturut-turut     |
| `sleep_work_ratio`        | Rasio antara jam tidur dan jam kerja    |
| `burnout_rolling_mean_7`  | Rata-rata burnout 7 hari terakhir       |
| `burnout_rolling_mean_14` | Rata-rata burnout 14 hari terakhir      |
| `burnout_rolling_std_7`   | Standar deviasi burnout 7 hari terakhir |
| `work_rolling_mean_7`     | Rata-rata jam kerja 7 hari              |
| `sleep_rolling_mean_7`    | Rata-rata jam tidur 7 hari              |

---

# Model Architecture

Arsitektur model menggunakan:

```text
Input Layer
    ↓
GRU Layer
    ↓
Temporal Attention Layer
    ↓
Layer Normalization
    ↓
Dense Layer
    ↓
Output Layer
```

Komponen utama model:

* **GRU (Gated Recurrent Unit)**
  Digunakan untuk mempelajari pola sequential/time-series dari aktivitas pengguna.

* **Temporal Attention**
  Membantu model fokus pada hari-hari tertentu yang memiliki pengaruh besar terhadap burnout.

* **Dense Layer**
  Digunakan untuk mempelajari representasi fitur yang lebih kompleks sebelum menghasilkan prediksi akhir.

---

# Feature Engineering

Beberapa feature engineering dilakukan untuk membantu model memahami pola burnout pengguna:

* Sleep Work Ratio
* Rolling Mean
* Rolling Standard Deviation
* Work & Sleep Trend Analysis

Pendekatan rolling window digunakan untuk menangkap tren dan kestabilan burnout dalam beberapa hari terakhir.

---

# Sequence Modeling

Model menggunakan pendekatan sliding window sequence dengan:

```python
WINDOW_SIZE = 7
```

Artinya model membaca data aktivitas selama 7 hari terakhir untuk memprediksi burnout score pada hari berikutnya.

---

# Training Strategy

Model dilatih menggunakan:

* Optimizer: Adam
* Loss Function: Mean Absolute Error (MAE)
* Early Stopping
* Learning Rate Reduction
* Custom Training Loop TensorFlow

Beberapa regularization juga digunakan untuk mengurangi overfitting:

* Dropout
* Recurrent Dropout
* L2 Regularization

---

# Evaluation Metrics

Model dievaluasi menggunakan beberapa regression metrics:

| Metric   | Description                    |
| -------- | ------------------------------ |
| MAE      | Mean Absolute Error            |
| MSE      | Mean Squared Error             |
| RMSE     | Root Mean Squared Error        |
| R² Score | Koefisien determinasi          |
| MAPE     | Mean Absolute Percentage Error |

---

# Visualization

Project menyediakan beberapa visualisasi evaluasi model:

## 1. Regression Visualization

Visualisasi hubungan antara nilai aktual dan hasil prediksi model.

```text
Actual Burnout Score vs Predicted Burnout Score
```

Digunakan untuk melihat kualitas regresi model.

---

## 2. Actual vs Predicted Visualization

Visualisasi time series antara data aktual dan hasil prediksi model.

```text
Burnout Score Aktual vs Prediksi
```

Digunakan untuk melihat kemampuan model mengikuti pola perubahan burnout dari waktu ke waktu.

---

## 3. Train vs Validation MAE Visualization

Visualisasi perubahan MAE selama training.

```text
Train MAE vs Validation MAE
```

Digunakan untuk mendeteksi:

* overfitting
* underfitting
* stabilitas training

---

# Burnout Classification

Final burnout score dikategorikan menjadi:

| Score Range | Burnout Level |
| ----------- | ------------- |
| < 40        | Low           |
| 40 - 69     | Moderate      |
| ≥ 70        | High          |

---

# Hybrid Combination with Questionnaire

Selain behavioral prediction, model juga menggabungkan questionnaire score untuk meningkatkan reliabilitas hasil prediksi.

Metode weighting digunakan secara dinamis berdasarkan selisih antara:

* behavioral prediction
* questionnaire score

Semakin besar perbedaan keduanya, semakin besar prioritas questionnaire score.

---

# Inference Input Format

Model membutuhkan input aktivitas selama 7 hari:

```python
work_hours_7days
sleep_hours_7days
consecutive_overwork_7days
burnout_score_7days
questionnaire_score
```

---

# Example Output

```python
{
    "behavior_prediction_score": 61.27,
    "questionnaire_score": 58.0,
    "final_burnout_score": 59.64,
    "final_burnout_level": "Moderate",
    "difference": 3.27,
    "weighting_type": "balanced weighting"
}
```

---

# Technologies Used

* Python
* TensorFlow / Keras
* NumPy
* Pandas
* Scikit-Learn
* Matplotlib

---

# Model Files

Drive Best Model Forecasting Time Series `best_burnout_model.keras`:

Link Drive: https://drive.google.com/drive/folders/1gKXW6iX2OflXCUjn9y9Tgi4qhYJhlNnK?usp=sharing

| File                       | Description         |
| -------------------------- | ------------------- |
| `best_burnout_model.keras` | Saved trained model |
| `feature_scaler.pkl`       | Feature scaler      |
| `target_scaler.pkl`        | Target scaler       |

---

# Notes

* Model menggunakan pendekatan regression, bukan classification.
* Output model berupa burnout score dengan range 0–100.
* Attention mechanism digunakan untuk meningkatkan pemahaman temporal pattern pada aktivitas pengguna.
* Model dirancang untuk kebutuhan monitoring burnout secara berkala.
