# Chapter 3: Research Methodology

## 3.1 Introduction

This chapter presents the research methodology employed in the development and evaluation of a machine learning-based system for the early detection of diabetes. The study adopted a quantitative, experimental research design centred on the application of supervised machine learning algorithms to a clinically validated dataset. The objective was to develop a predictive model capable of classifying individuals as diabetic or non-diabetic based on a set of clinical and demographic features, and to deploy the trained model within a functional web-based healthcare application.

The methodology encompasses the full machine learning pipeline: data acquisition and description, data preprocessing and feature engineering, model selection and training, hyperparameter optimisation, model evaluation, and system deployment. Each stage was designed to ensure scientific rigour, reproducibility, and clinical relevance. The chapter concludes with a description of the system architecture and the tools and technologies utilised throughout the project.

---

## 3.2 Dataset Description

### 3.2.1 Data Source

The dataset employed in this study is the Pima Indians Diabetes Database, originally collected by the National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK) and made publicly available through the UCI Machine Learning Repository and Kaggle. The dataset has been widely used in the literature for benchmarking diabetes classification models, enabling meaningful comparison with existing studies.

### 3.2.2 Dataset Characteristics

The dataset comprises 768 patient records, each described by eight clinical and demographic input features and one binary target variable. All patients in the dataset are females of Pima Indian heritage, aged 21 years or older. The target variable, `Outcome`, indicates whether a patient was diagnosed with diabetes (1) or not (0).

### 3.2.3 Feature Description

Table 3.1 presents a summary of the eight input features and the target variable contained in the dataset.

**Table 3.1: Summary of Dataset Features**

| Feature | Description | Unit | Data Type |
|---------|------------|------|-----------|
| Pregnancies | Number of times the patient has been pregnant | — | Integer |
| Glucose | Plasma glucose concentration at 2 hours in an oral glucose tolerance test | mg/dL | Integer |
| BloodPressure | Diastolic blood pressure measurement | mmHg | Integer |
| SkinThickness | Triceps skin fold thickness | mm | Integer |
| Insulin | 2-hour serum insulin level | μU/mL | Integer |
| BMI | Body mass index (weight in kg / height in m²) | kg/m² | Float |
| DiabetesPedigreeFunction | A function scoring the likelihood of diabetes based on family history | — | Float |
| Age | Age of the patient | years | Integer |
| Outcome (Target) | Diabetes diagnosis (1 = positive, 0 = negative) | — | Binary |

### 3.2.4 Class Distribution

The dataset exhibits a class imbalance, with approximately 65% of records belonging to the non-diabetic class (Outcome = 0) and 35% to the diabetic class (Outcome = 1). This imbalance was taken into consideration during model selection and training, as discussed in Sections 3.4 and 3.5.

---

## 3.3 Data Preprocessing

Data preprocessing is a critical stage in the machine learning pipeline, as the quality of input data directly influences model performance. Several preprocessing steps were applied to address data quality issues and prepare the dataset for model training.

### 3.3.1 Handling Invalid Zero Values

An initial exploratory analysis of the dataset revealed that five features — Glucose, BloodPressure, SkinThickness, Insulin, and BMI — contained zero values that are physiologically impossible. For instance, a blood glucose level or blood pressure of zero is incompatible with life, indicating that these zeros represent missing or unrecorded data rather than true measurements.

To address this issue, a custom transformer class, `ZeroToNaNTransformer`, was implemented within the scikit-learn framework. This transformer converts all zero values in the specified columns to `NaN` (Not a Number), thereby marking them as missing data for subsequent imputation. The affected columns and the rationale for their treatment are summarised in Table 3.2.

**Table 3.2: Features Containing Invalid Zero Values**

| Feature | Reason Zero is Invalid |
|---------|----------------------|
| Glucose | A plasma glucose level of 0 mg/dL is incompatible with life |
| BloodPressure | A diastolic blood pressure of 0 mmHg is physiologically impossible |
| SkinThickness | A skin fold thickness of 0 mm indicates a missing measurement |
| Insulin | A serum insulin level of 0 μU/mL is clinically implausible |
| BMI | A body mass index of 0 kg/m² is physically impossible |

### 3.3.2 Missing Value Imputation

Following the conversion of invalid zeros to `NaN`, a `SimpleImputer` with the median strategy was applied to each of the five affected columns. The median was selected as the imputation strategy rather than the mean because the median is more robust to outliers — a common characteristic of clinical data distributions. This ensures that extreme values do not disproportionately influence the imputed values.

### 3.3.3 Feature Scaling

All eight input features were scaled using `StandardScaler`, which applies z-score normalisation by subtracting the mean and dividing by the standard deviation for each feature. This transformation ensures that all features are on a comparable scale, which is particularly important for algorithms such as Logistic Regression that are sensitive to feature magnitudes. Although tree-based models (Random Forest, Gradient Boosting) are generally invariant to feature scaling, the scaler was applied uniformly across all models to maintain a consistent preprocessing pipeline.

### 3.3.4 Preprocessing Pipeline

The preprocessing steps were encapsulated within a scikit-learn `Pipeline` and `ColumnTransformer` to ensure that all transformations are applied consistently and that no data leakage occurs between the training and test sets. The pipeline architecture is as follows:

1. **ZeroToNaNTransformer** — converts invalid zeros to `NaN` in the five specified columns
2. **SimpleImputer** (strategy = median) — imputes missing values with the column median
3. **StandardScaler** — applies z-score normalisation to all features
4. **Classifier** — the machine learning model (interchangeable)

This pipeline was fitted exclusively on the training data, and the learned parameters (medians, means, standard deviations) were then applied to transform the test data, thereby preventing data leakage.

### 3.3.5 Train-Test Split

The dataset was divided into training and test sets using an 80:20 stratified split, resulting in 614 training samples and 154 test samples. Stratification was applied to the target variable (`Outcome`) to ensure that the class distribution was preserved in both subsets. A fixed random state of 42 was used to ensure reproducibility of the split across experiments.

---

## 3.4 Model Selection

Four machine learning models were selected for evaluation in this study. The selection was guided by the need to compare models of varying complexity and to assess both linear and non-linear approaches to diabetes classification. Each model was chosen based on its established effectiveness in binary classification tasks and its relevance to healthcare prediction problems.

### 3.4.1 Logistic Regression

Logistic Regression was selected as a baseline model due to its simplicity, interpretability, and well-established theoretical foundation. As a linear classifier, it provides a benchmark against which the performance of more complex models can be measured. Logistic Regression is widely used in clinical research for binary outcome prediction, and its coefficients offer direct insight into the relationship between individual features and the predicted outcome.

### 3.4.2 Random Forest Classifier

The Random Forest Classifier is an ensemble learning method that constructs multiple decision trees during training and outputs the mode of the individual trees' predictions. It was selected for its robustness to overfitting, ability to handle non-linear relationships, and capacity to provide feature importance rankings. Random Forest has demonstrated strong performance on tabular clinical datasets in the literature and is well-suited to datasets with relatively small sample sizes.

### 3.4.3 Gradient Boosting Classifier

Gradient Boosting is a sequential ensemble method that builds decision trees iteratively, with each subsequent tree correcting the errors of the previous one. It was selected for its ability to achieve high predictive accuracy through the boosting mechanism, which is particularly effective when combined with careful hyperparameter tuning. Gradient Boosting has been shown to outperform other algorithms on a range of classification benchmarks.

### 3.4.4 Logistic Regression with SMOTE

To investigate the impact of class imbalance on model performance, a variant of Logistic Regression was trained with the Synthetic Minority Over-sampling Technique (SMOTE). SMOTE generates synthetic samples for the minority class (diabetic patients) by interpolating between existing minority class instances. This approach was included to assess whether explicitly addressing the class imbalance through oversampling yields improved performance, particularly in terms of recall for the minority class.

---

## 3.5 Hyperparameter Tuning

### 3.5.1 Tuning Strategy

Hyperparameter tuning was conducted using `GridSearchCV` from the scikit-learn library. Grid search performs an exhaustive evaluation of all possible combinations within a predefined hyperparameter grid, training and evaluating a model for each combination using cross-validation. This approach ensures that the optimal configuration is identified within the search space.

### 3.5.2 Cross-Validation Configuration

A `StratifiedKFold` cross-validation strategy with five folds was employed. Stratification ensures that each fold maintains the same proportion of diabetic and non-diabetic samples as the full training set, which is critical given the class imbalance in the dataset. Shuffling was enabled with a fixed random state of 42 to ensure reproducibility.

The primary scoring metric for model selection was the Area Under the Receiver Operating Characteristic Curve (ROC-AUC), chosen because it provides a threshold-independent measure of a classifier's ability to discriminate between positive and negative classes. In addition to ROC-AUC, accuracy, precision, recall, and F1-score were recorded as secondary metrics during cross-validation. The `refit` parameter was set to `roc_auc`, meaning the final model was retrained on the full training set using the hyperparameters that maximised the mean cross-validated ROC-AUC score.

### 3.5.3 Hyperparameter Search Spaces

Table 3.3 summarises the hyperparameter grids evaluated for each model.

**Table 3.3: Hyperparameter Search Grids**

**Logistic Regression:**

| Hyperparameter | Values Tested |
|---------------|--------------|
| C (regularisation strength) | 0.01, 0.1, 1, 10, 100 |
| solver | liblinear, lbfgs |
| class_weight | None, balanced |
| **Total combinations** | **20** |

**Random Forest Classifier:**

| Hyperparameter | Values Tested |
|---------------|--------------|
| n_estimators | 100, 200, 300 |
| max_depth | None, 3, 5, 10 |
| min_samples_split | 2, 5, 10 |
| min_samples_leaf | 1, 2, 4 |
| class_weight | None, balanced |
| **Total combinations** | **216** |

**Gradient Boosting Classifier:**

| Hyperparameter | Values Tested |
|---------------|--------------|
| n_estimators | 100, 200 |
| learning_rate | 0.01, 0.05, 0.1 |
| max_depth | 2, 3, 4 |
| subsample | 0.8, 1.0 |
| **Total combinations** | **36** |

**Logistic Regression with SMOTE:**

The SMOTE variant used the same hyperparameter grid as the standard Logistic Regression model (20 combinations), with the addition of SMOTE oversampling applied within the pipeline prior to classification.

In total, 292 unique hyperparameter configurations were evaluated across the four models, each assessed through five-fold cross-validation, resulting in 1,460 individual model fits. All computations utilised parallel processing (`n_jobs=-1`) to maximise computational efficiency.

### 3.5.4 Best Hyperparameters

The optimal hyperparameters identified through grid search are stored in the `best_model_hyperparameters.json` file. The best-performing model was the Random Forest Classifier with the following configuration:

- **class_weight**: balanced
- **max_depth**: 3
- **min_samples_leaf**: 4
- **min_samples_split**: 10
- **n_estimators**: 200

The selection of `class_weight=balanced` indicates that the model assigns higher weights to the minority class (diabetic patients) during training, thereby compensating for the class imbalance. A shallow maximum depth of 3 was optimal, suggesting that a constrained tree depth prevents overfitting on this relatively small dataset.

---

## 3.6 Model Evaluation Metrics

A comprehensive suite of evaluation metrics was employed to assess model performance from multiple perspectives. This is particularly important in a healthcare context, where the consequences of false negatives (missed diabetes cases) and false positives (unnecessary referrals) carry different clinical implications.

### 3.6.1 Primary Metrics

**Accuracy** measures the proportion of correct predictions out of all predictions made:

$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

**Precision** measures the proportion of predicted positive cases that are truly positive:

$$\text{Precision} = \frac{TP}{TP + FP}$$

**Recall (Sensitivity)** measures the proportion of actual positive cases that are correctly identified:

$$\text{Recall} = \frac{TP}{TP + FN}$$

**F1-Score** is the harmonic mean of precision and recall, providing a balanced measure:

$$F_1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

**ROC-AUC** (Area Under the Receiver Operating Characteristic Curve) quantifies the model's ability to discriminate between positive and negative classes across all classification thresholds. A value of 1.0 represents perfect discrimination, while 0.5 represents random guessing.

Where TP = True Positives, TN = True Negatives, FP = False Positives, and FN = False Negatives.

### 3.6.2 Confusion Matrix

The confusion matrix provides a detailed breakdown of model predictions by class, enabling the calculation of all classification metrics. It displays the counts of true positives, true negatives, false positives, and false negatives.

### 3.6.3 Bootstrap Validation

To quantify the uncertainty associated with model performance estimates, bootstrap validation was performed with 2,000 resamples of the test set. For each resample, performance metrics were recalculated, yielding a distribution of metric values. The 2.5th and 97.5th percentiles of these distributions were used to construct 95% confidence intervals for each metric. This approach provides a statistically robust assessment of model performance that accounts for sampling variability.

### 3.6.4 Model Calibration

Model calibration was assessed using `CalibratedClassifierCV` with the sigmoid method and five-fold cross-validation. A well-calibrated model produces predicted probabilities that closely match the observed frequencies of the positive class. Calibration curves were generated comparing the uncalibrated and calibrated Random Forest models, as calibration is critical in healthcare applications where predicted probabilities directly inform clinical decision-making.

### 3.6.5 Threshold Optimisation

The default classification threshold of 0.5 may not be optimal for all clinical contexts. Therefore, a systematic threshold analysis was conducted by evaluating decision thresholds from 0.10 to 0.90 in increments of 0.05. At each threshold, precision, recall, F1-score, F2-score, and specificity were computed. The optimal threshold was selected based on the F2-score, which places greater emphasis on recall than precision. This choice reflects the clinical priority of minimising false negatives (missed diabetes cases) in an early detection context.

### 3.6.6 Decision Curve Analysis

Decision Curve Analysis (DCA) was performed to evaluate the clinical utility of the model by comparing its net benefit against two reference strategies: "treat all" (assume all patients are diabetic) and "treat none" (assume no patients are diabetic). This analysis determines the range of probability thresholds over which the model provides a net benefit, thereby informing its practical value in clinical decision-making.

### 3.6.7 SHAP Analysis

SHapley Additive exPlanations (SHAP) analysis was conducted using the `TreeExplainer` to quantify the contribution of each feature to individual predictions. SHAP values provide a theoretically grounded measure of feature importance that accounts for feature interactions. Summary plots were generated to visualise the global and local feature importance patterns, enhancing the interpretability of the Random Forest model.

---

## 3.7 System Architecture

### 3.7.1 Overview

The prediction system was designed as a three-tier web application comprising a frontend user interface, a backend API service, and a machine learning inference engine. This architecture separates concerns, enabling independent development, testing, and deployment of each component. Additionally, an artificial intelligence module powered by a large language model was integrated to provide contextual health insights.

### 3.7.2 Frontend (Presentation Layer)

The frontend was developed using Next.js (version 16.1.6), a React-based framework for building server-rendered and statically generated web applications, with TypeScript for type safety. The user interface was constructed using shadcn/ui, a component library built upon Radix UI primitives, styled with Tailwind CSS. The application comprises five primary pages:

1. **Dashboard** (`/`) — displays model accuracy, dataset information, and the most recent prediction result.
2. **Prediction Form** (`/predict`) — provides an interactive form with eight input fields corresponding to the clinical features, utilising sliders and numeric inputs with appropriate ranges and units.
3. **Results** (`/results`) — presents the prediction outcome, including the probability score, risk classification (Low, Medium, or High), a probability distribution chart, and an AI-generated personalised health insight.
4. **Model Information** (`/model-info`) — displays the model type, training and testing accuracy, ROC-AUC score, and a feature importance ranking chart.
5. **AI Assistant** (`/assistant`) — offers a conversational interface for users to ask questions about diabetes, clinical indicators, and the prediction model.

Form validation was implemented using Zod schema validation in conjunction with React Hook Form to ensure that all user inputs fall within clinically valid ranges before submission. Data visualisation was achieved using the Recharts library for rendering interactive charts, including pie charts for risk distribution and bar charts for feature importance.

### 3.7.3 Backend (Application Layer)

The backend API was developed using FastAPI, a modern Python web framework designed for building high-performance RESTful APIs. The backend exposes two primary endpoints:

- **POST `/predict`** — accepts the eight clinical feature values as a JSON payload, passes the input through the trained preprocessing pipeline and Random Forest model, and returns the predicted probability (0–100%) and binary classification (0 or 1).
- **GET `/model-info`** — returns model metadata, including the model type, training and testing accuracy, ROC-AUC score, best hyperparameters, feature list, feature importance rankings, and dataset size.

Input validation was enforced at the API level using Pydantic models with field constraints, ensuring that all input values fall within physiologically plausible ranges (e.g., glucose between 0 and 300 mg/dL, age between 1 and 120 years). Cross-Origin Resource Sharing (CORS) was configured to permit requests from the frontend application.

### 3.7.4 Machine Learning Service

The trained Random Forest model, along with the complete preprocessing pipeline, was serialised using joblib and stored as a `.joblib` file. Upon server startup, the backend loads the serialised pipeline into memory, enabling low-latency inference without the need to retrain the model. The preprocessing pipeline (ZeroToNaNTransformer, SimpleImputer, StandardScaler) and classifier are encapsulated within a single scikit-learn pipeline object, ensuring that all transformations are applied consistently during inference.

### 3.7.5 AI Integration Module

Two additional API routes were implemented within the Next.js frontend to integrate OpenAI's GPT-4o-mini large language model:

- **POST `/api/ai-chat`** — powers the AI Assistant page, enabling users to ask natural language questions about diabetes, clinical indicators, and the prediction model. The system prompt constrains responses to health-related topics and advises users to consult healthcare professionals for medical decisions.
- **POST `/api/ai-insight`** — generates a personalised health insight based on the patient's clinical data and prediction result. The insight identifies significant risk factors and provides one actionable recommendation, using controlled generation parameters (temperature = 0.4, maximum 250 tokens) to ensure consistent, concise output.

### 3.7.6 Risk Classification Logic

The system classifies prediction outcomes into three risk categories based on the predicted probability:

- **Low Risk**: probability less than 35%
- **Medium Risk**: probability between 35% and 65%
- **High Risk**: probability greater than 65%

This stratification provides an intuitive interpretation of the model's output for non-specialist users and supports clinical decision-making by indicating the urgency of further investigation.

### 3.7.7 Data Flow

The end-to-end data flow of the prediction system operates as follows:

1. The user enters clinical measurements through the prediction form on the frontend.
2. Form inputs are validated against the Zod schema to ensure completeness and validity.
3. The validated data is transmitted as a JSON payload to the FastAPI backend via an HTTP POST request.
4. The backend passes the input through the serialised preprocessing pipeline and Random Forest model.
5. The model returns a predicted probability and binary classification.
6. The prediction result is stored in the browser's session storage and the user is redirected to the results page.
7. The results page displays the probability, risk classification, and a visual probability distribution chart.
8. A separate request is made to the AI insight endpoint, which generates a personalised health analysis based on the clinical data and prediction outcome.

---

## 3.8 Tools and Technologies

Table 3.4 provides a comprehensive summary of the tools, technologies, and libraries used throughout the project.

**Table 3.4: Tools and Technologies**

| Category | Tool / Technology | Version | Purpose |
|----------|------------------|---------|---------|
| **Programming Languages** | Python | 3.10+ | Machine learning model development, backend API |
| | TypeScript | 5.7.3 | Frontend application development |
| **ML & Data Science** | scikit-learn | 1.6.1 | Model training, preprocessing, evaluation |
| | pandas | 3.0.1 | Data manipulation and analysis |
| | NumPy | 2.4.3 | Numerical computation |
| | joblib | 1.5.3 | Model serialisation and persistence |
| | imbalanced-learn (SMOTE) | — | Synthetic minority oversampling |
| | SHAP | — | Model explainability and feature analysis |
| | Matplotlib | — | Data visualisation and plotting |
| **Backend Framework** | FastAPI | 0.135.1 | RESTful API for model serving |
| | Uvicorn | 0.41.0 | ASGI server for running the FastAPI application |
| | Pydantic | — | Input validation and data modelling |
| **Frontend Framework** | Next.js | 16.1.6 | React-based web application framework |
| | React | 19.2.4 | Component-based UI library |
| | Tailwind CSS | 4.2.0 | Utility-first CSS framework for styling |
| | shadcn/ui (Radix UI) | — | Accessible UI component library |
| | Recharts | 2.15.0 | Data visualisation (charts and graphs) |
| | Zod | 3.24.1 | Schema-based form validation |
| | React Hook Form | 7.54.1 | Form state management |
| | Lucide React | 0.564.0 | Icon library |
| **AI Integration** | OpenAI API (GPT-4o-mini) | — | Conversational AI and personalised health insights |
| **Development Tools** | Google Colab | — | Notebook environment for model development |
| | Kaggle | — | Dataset sourcing |
| | Git / GitHub | — | Version control and code repository |
| | npm | 9+ | JavaScript package management |
| | PostCSS | — | CSS processing |

---

## 3.9 Summary

This chapter has detailed the research methodology adopted for the development of a machine learning-based diabetes prediction system. The methodology encompasses a systematic pipeline from data acquisition and preprocessing through to model training, hyperparameter optimisation, comprehensive evaluation, and full-stack system deployment. The use of rigorous evaluation techniques — including bootstrap validation, calibration analysis, threshold optimisation, decision curve analysis, and SHAP explainability — ensures that the model's performance is assessed from multiple clinically relevant perspectives. The three-tier system architecture, augmented with AI-powered health insights, provides a practical and accessible tool for early diabetes risk assessment. The results obtained from this methodology are presented in Chapter 4.
