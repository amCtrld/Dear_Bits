# Chapter 7: Appendices

---

## Appendix A: Best Model Hyperparameters

The following JSON file (`best_model_hyperparameters.json`) contains the optimal hyperparameters identified for the Random Forest Classifier through GridSearchCV with five-fold stratified cross-validation, using ROC-AUC as the primary refit metric.

```json
{
    "classifier__class_weight": "balanced",
    "classifier__max_depth": 3,
    "classifier__min_samples_leaf": 4,
    "classifier__min_samples_split": 10,
    "classifier__n_estimators": 200
}
```

**Parameter Descriptions:**

| Parameter | Value | Description |
|-----------|-------|-------------|
| class_weight | balanced | Adjusts class weights inversely proportional to class frequency, compensating for the 65:35 class imbalance in the dataset |
| max_depth | 3 | Maximum depth of each decision tree in the ensemble; constrains model complexity to prevent overfitting |
| min_samples_leaf | 4 | Minimum number of samples required at a leaf node; ensures each terminal node is supported by sufficient observations |
| min_samples_split | 10 | Minimum number of samples required to split an internal node; prevents creation of splits based on small subsets |
| n_estimators | 200 | Number of decision trees in the Random Forest ensemble |

---

## Appendix B: Dataset Feature Descriptions

The Pima Indians Diabetes Database contains 768 patient records with 8 input features and 1 binary target variable. All patients are females of Pima Indian heritage aged 21 years or older.

**Table B.1: Detailed Feature Descriptions**

| Feature | Description | Unit | Data Type | Valid Range | Clinical Significance |
|---------|------------|------|-----------|-------------|----------------------|
| Pregnancies | Number of times the patient has been pregnant | — | Integer | 0–17 | Higher parity is associated with increased gestational diabetes risk and subsequent Type 2 diabetes |
| Glucose | Plasma glucose concentration at 2 hours in an oral glucose tolerance test (OGTT) | mg/dL | Integer | 0–199 | Primary diagnostic marker for diabetes; values ≥ 140 mg/dL indicate impaired glucose tolerance |
| BloodPressure | Diastolic blood pressure | mmHg | Integer | 0–122 | Hypertension is a common comorbidity of diabetes; elevated diastolic BP is a cardiovascular risk factor |
| SkinThickness | Triceps skin fold thickness | mm | Integer | 0–99 | Proxy measure for subcutaneous body fat; correlates with insulin resistance |
| Insulin | 2-hour serum insulin level | μU/mL | Integer | 0–846 | Elevated insulin levels (hyperinsulinaemia) indicate insulin resistance, a precursor to Type 2 diabetes |
| BMI | Body mass index (weight in kg / height in m²) | kg/m² | Float | 0–67.1 | Obesity (BMI ≥ 30) is one of the strongest modifiable risk factors for Type 2 diabetes |
| DiabetesPedigreeFunction | Function scoring the likelihood of diabetes based on family history | — | Float | 0.078–2.42 | Captures genetic predisposition; higher values indicate stronger family history of diabetes |
| Age | Age of the patient | years | Integer | 21–81 | Diabetes risk increases with age; particularly relevant for Type 2 diabetes |
| Outcome (Target) | Diabetes diagnosis | — | Binary | 0 or 1 | 0 = no diabetes, 1 = diabetes diagnosed |

**Class Distribution:**
- Non-diabetic (Outcome = 0): 500 records (65.1%)
- Diabetic (Outcome = 1): 268 records (34.9%)

---

## Appendix C: Sample Prediction Input and Output

### C.1 Sample API Request

The following JSON payload represents a sample input to the `/predict` endpoint:

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

**Input Field Descriptions:**

| Field | Value | Interpretation |
|-------|-------|---------------|
| pregnancies | 6 | Six prior pregnancies |
| glucose | 148 mg/dL | Elevated plasma glucose (≥ 140 indicates impaired glucose tolerance) |
| bloodPressure | 72 mmHg | Normal diastolic blood pressure |
| skinThickness | 35 mm | Triceps skin fold measurement |
| insulin | 0 μU/mL | Missing value (processed as NaN by the preprocessing pipeline) |
| bmi | 33.6 kg/m² | Obese classification (BMI ≥ 30) |
| diabetesPedigree | 0.627 | Moderate-to-high family history score |
| age | 50 years | Patient age |

### C.2 Sample API Response

```json
{
    "probability": 72.3,
    "prediction": 1
}
```

**Output Interpretation:**

| Field | Value | Interpretation |
|-------|-------|---------------|
| probability | 72.3 | 72.3% predicted probability of diabetes |
| prediction | 1 | Positive classification (diabetic) |
| Risk Level (UI) | High | Probability > 65% is classified as High Risk |

### C.3 Sample AI-Generated Insight

Based on the above input and prediction, the system generates a personalised health insight similar to the following:

> "Based on the clinical data provided, the elevated plasma glucose level of 148 mg/dL and a BMI of 33.6 kg/m² are the most significant contributing factors to the high-risk assessment. It is recommended that the patient consult with a healthcare professional for a comprehensive diagnostic evaluation, including an HbA1c test. Maintaining a balanced diet and regular physical activity may help manage these risk factors."

*Note: The actual AI insight is generated dynamically by GPT-4o-mini and may vary with each request.*

---

## Appendix D: System Screenshots

This appendix contains screenshots of the deployed web application.

[Figure D.1: System Dashboard — Displays model accuracy, dataset information, and recent prediction summary]

[Figure D.2: Prediction Form — Eight clinical input fields with sliders and numeric inputs for data entry]

[Figure D.3: Prediction Results — Probability score, risk classification (Low/Medium/High), pie chart, and AI-generated insight]

[Figure D.4: Model Information Page — Model type, accuracy metrics, ROC-AUC score, and feature importance bar chart]

[Figure D.5: AI Assistant — Conversational interface for diabetes-related queries and model explanations]

*Note: Screenshots should be captured from the running application and inserted as images in the final document.*

---

## Appendix E: Python Dependencies

The following `requirements.txt` file lists the Python packages required to run the FastAPI backend service:

```
fastapi==0.135.1
uvicorn[standard]==0.41.0
scikit-learn==1.6.1
joblib==1.5.3
pandas==3.0.1
numpy==2.4.3
```

**Additional Python libraries used during model development (Jupyter Notebook environment):**

| Library | Purpose |
|---------|---------|
| matplotlib | Data visualisation and plotting (ROC curves, calibration curves, feature importance charts) |
| shap | SHapley Additive exPlanations for model interpretability |
| imbalanced-learn | SMOTE (Synthetic Minority Over-sampling Technique) for class imbalance handling |
| google.colab | Google Colab integration for file upload and notebook execution |
| kaggle | Kaggle API for dataset download |

---

## Appendix F: API Endpoint Specifications

### F.1 POST /predict

**URL:** `http://localhost:8000/predict`

**Method:** POST

**Content-Type:** application/json

**Request Body Schema:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| pregnancies | float | Yes | 0 ≤ x ≤ 20 | Number of pregnancies |
| glucose | float | Yes | 0 ≤ x ≤ 300 | Plasma glucose concentration (mg/dL) |
| bloodPressure | float | Yes | 0 ≤ x ≤ 200 | Diastolic blood pressure (mmHg) |
| skinThickness | float | Yes | 0 ≤ x ≤ 100 | Triceps skin fold thickness (mm) |
| insulin | float | Yes | 0 ≤ x ≤ 900 | 2-hour serum insulin (μU/mL) |
| bmi | float | Yes | 0 ≤ x ≤ 80 | Body mass index (kg/m²) |
| diabetesPedigree | float | Yes | 0 ≤ x ≤ 2.5 | Diabetes pedigree function score |
| age | float | Yes | 1 ≤ x ≤ 120 | Patient age (years) |

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| probability | float | Predicted probability of diabetes (0–100%), rounded to 1 decimal place |
| prediction | integer | Binary classification (0 = non-diabetic, 1 = diabetic) |

**Example:**

```
Request:
POST /predict
Content-Type: application/json

{
    "pregnancies": 2,
    "glucose": 120,
    "bloodPressure": 80,
    "skinThickness": 20,
    "insulin": 80,
    "bmi": 25.0,
    "diabetesPedigree": 0.5,
    "age": 35
}

Response:
HTTP 200 OK

{
    "probability": 28.5,
    "prediction": 0
}
```

### F.2 GET /model-info

**URL:** `http://localhost:8000/model-info`

**Method:** GET

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| model_type | string | Name of the classifier (e.g., "RandomForestClassifier") |
| train_accuracy | integer | Training set accuracy (percentage) |
| test_accuracy | integer | Test set accuracy (percentage) |
| roc_auc | float | ROC-AUC score (4 decimal places) |
| best_params | object | Dictionary of optimal hyperparameters |
| features | array | List of 8 feature names |
| feature_importance | array | Array of objects with "name" and "importance" fields, ranked by importance |
| dataset_size | integer | Total number of records in the dataset (768) |

---

## Appendix G: Hyperparameter Search Grids

This appendix presents the complete hyperparameter search grids evaluated for each candidate model during the GridSearchCV tuning process.

### G.1 Logistic Regression

| Hyperparameter | Values | Count |
|---------------|--------|-------|
| C | 0.01, 0.1, 1, 10, 100 | 5 |
| solver | liblinear, lbfgs | 2 |
| class_weight | None, balanced | 2 |
| **Total configurations** | | **20** |
| **Total fits (20 × 5 folds)** | | **100** |

### G.2 Random Forest Classifier

| Hyperparameter | Values | Count |
|---------------|--------|-------|
| n_estimators | 100, 200, 300 | 3 |
| max_depth | None, 3, 5, 10 | 4 |
| min_samples_split | 2, 5, 10 | 3 |
| min_samples_leaf | 1, 2, 4 | 3 |
| class_weight | None, balanced | 2 |
| **Total configurations** | | **216** |
| **Total fits (216 × 5 folds)** | | **1,080** |

### G.3 Gradient Boosting Classifier

| Hyperparameter | Values | Count |
|---------------|--------|-------|
| n_estimators | 100, 200 | 2 |
| learning_rate | 0.01, 0.05, 0.1 | 3 |
| max_depth | 2, 3, 4 | 3 |
| subsample | 0.8, 1.0 | 2 |
| **Total configurations** | | **36** |
| **Total fits (36 × 5 folds)** | | **180** |

### G.4 Logistic Regression with SMOTE

The SMOTE variant utilised the same hyperparameter grid as the standard Logistic Regression model, with the addition of SMOTE oversampling applied within the preprocessing pipeline prior to classification.

| Hyperparameter | Values | Count |
|---------------|--------|-------|
| C | 0.01, 0.1, 1, 10, 100 | 5 |
| solver | liblinear, lbfgs | 2 |
| class_weight | None, balanced | 2 |
| **Total configurations** | | **20** |
| **Total fits (20 × 5 folds)** | | **100** |

### G.5 Aggregate Summary

| Model | Configurations | Folds | Total Fits |
|-------|---------------|-------|------------|
| Logistic Regression | 20 | 5 | 100 |
| Random Forest | 216 | 5 | 1,080 |
| Gradient Boosting | 36 | 5 | 180 |
| Logistic Regression + SMOTE | 20 | 5 | 100 |
| **Grand Total** | **292** | | **1,460** |

---

## Appendix H: Cross-Validation Configuration

The following configuration was used for cross-validation throughout the model training and hyperparameter tuning process:

| Parameter | Value | Description |
|-----------|-------|-------------|
| Strategy | StratifiedKFold | Preserves class distribution in each fold |
| n_splits | 5 | Number of cross-validation folds |
| shuffle | True | Shuffles data before splitting into folds |
| random_state | 42 | Ensures reproducibility of fold assignments |
| Primary refit metric | ROC-AUC | Model selection based on highest mean ROC-AUC |
| Secondary metrics | Accuracy, Precision, Recall, F1-Score | Tracked but not used for model selection |
| n_jobs | -1 | Parallel execution across all available CPU cores |
| return_train_score | True | Records training set scores for overfitting analysis |

---

## Appendix I: Frontend Input Field Specifications

The prediction form on the web application presents eight input fields corresponding to the clinical features used by the model. Table I.1 details the input specifications.

**Table I.1: Prediction Form Input Field Specifications**

| Field | Label (UI) | Input Type | Minimum | Maximum | Default | Step | Unit |
|-------|-----------|------------|---------|---------|---------|------|------|
| pregnancies | Pregnancies | Number input | 0 | 20 | 0 | 1 | — |
| glucose | Plasma Glucose | Slider | 70 | 200 | 120 | 1 | mg/dL |
| bloodPressure | Blood Pressure (Diastolic) | Slider | 40 | 140 | 80 | 1 | mmHg |
| skinThickness | Triceps Skin Thickness | Number input | 0 | 100 | 20 | 1 | mm |
| insulin | Serum Insulin (2-hour) | Number input | 0 | 900 | 1 | 1 | μU/mL |
| bmi | Body Mass Index | Slider | 15 | 50 | 25 | 0.1 | kg/m² |
| diabetesPedigree | Diabetes Pedigree Function | Number input | 0 | 2.5 | 0.5 | 0.001 | — |
| age | Age | Slider | 18 | 90 | 35 | 1 | years |

---

## Appendix J: Risk Classification Thresholds

The system classifies prediction outcomes into three risk categories based on the predicted probability:

| Risk Level | Probability Range | Colour Indicator | Recommended Action |
|-----------|------------------|------------------|-------------------|
| Low | < 35% | Green | Routine monitoring; maintain healthy lifestyle |
| Medium | 35% – 65% | Yellow/Amber | Further diagnostic testing recommended; lifestyle modifications advised |
| High | > 65% | Red | Urgent referral for comprehensive diagnostic evaluation (HbA1c, fasting glucose) |

*Note: These thresholds are intended for screening purposes only and do not constitute a clinical diagnosis.*
