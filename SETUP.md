# Dear_Bits — Setup Guide

AI-based diabetes early-detection system.  
Next.js frontend + FastAPI Python backend serving a trained Random Forest model.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | ≥ 18 | `node -v` |
| **npm** | ≥ 9 | `npm -v` |
| **Python** | ≥ 3.10 | `python3 --version` |
| **pip** | latest | `python3 -m pip --version` |

---

## 1 — Clone the repository

```bash
git clone https://github.com/amCtrld/Dear_Bits.git
cd Dear_Bits
```

---

## 2 — Frontend setup

```bash
# Install Node dependencies
npm install

# Start the dev server (runs on http://localhost:3000)
npm run dev
```

---

## 3 — Backend setup

```bash
cd backend

# Create a Python virtual environment
python3 -m venv venv
source venv/bin/activate        # Linux / macOS
# venv\Scripts\activate          # Windows

# Install Python dependencies
pip install -r requirements.txt

# Start the API server (runs on http://localhost:8000)
uvicorn main:app --port 8000
```

> **Note:** The model was trained with scikit-learn **1.6.1**.
> `requirements.txt` pins that version — do not upgrade without re-exporting the model.

---

## 4 — Running both together

Open **two terminals**:

| Terminal | Command | URL |
|----------|---------|-----|
| 1 — Frontend | `npm run dev` (from project root) | http://localhost:3000 |
| 2 — Backend | `cd backend && source venv/bin/activate && uvicorn main:app --port 8000` | http://localhost:8000 |

Navigate to http://localhost:3000/predict, fill in patient data, and submit.

---

## Project structure

```
Dear_Bits/
├── app/                      # Next.js pages
│   ├── page.tsx              # Dashboard
│   ├── predict/page.tsx      # Patient data form → calls API
│   ├── results/page.tsx      # Displays prediction result
│   └── model-info/page.tsx   # Model details & feature importance
├── components/               # Shared React components (shadcn/ui)
├── backend/
│   ├── main.py               # FastAPI server (POST /predict)
│   ├── requirements.txt      # Python dependencies
│   ├── best_diabetes_model.joblib   # Trained pipeline (preprocessing + Random Forest)
│   ├── best_gridsearch_object.joblib
│   ├── diabetes.csv          # PIMA Indians Diabetes Dataset
│   └── Dearbits.ipynb        # Training notebook
├── package.json
└── SETUP.md                  # ← this file
```

---

## API reference

### `POST /predict`

**Request body** (JSON):

```json
{
  "pregnancies": 6,
  "glucose": 148,
  "bloodPressure": 72,
  "skinThickness": 35,
  "insulin": 0,
  "bmi": 33.6,
  "diabetesPedigree": 0.627,
  "age": 50
}
```

**Response** (JSON):

```json
{
  "probability": 72.8,
  "prediction": 1
}
```

- `probability` — diabetes likelihood as a percentage (0–100)
- `prediction` — binary classification (0 = no diabetes, 1 = diabetes)

---

## Troubleshooting

| Issue                         | Fix                                                                  |
|-------------------------------|----------------------------------------------------------------------|
| Port 8000 already in use      | `fuser -k 8000/tcp` (Linux) or `lsof -ti:8000 \| xargs kill` (macOS) |
| `ModuleNotFoundError: joblib` | Activate the venv: `source backend/venv/bin/activate`                |
| sklearn version warning       | Ensure `scikit-learn==1.6.1` is installed (`pip show scikit-learn`)  |
| CORS error in browser         | Backend must be running on port 8000; frontend on port 3000          |
