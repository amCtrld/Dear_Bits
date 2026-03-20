# Chapter 4: Results

## 4.1 Introduction

This chapter presents the results obtained from the machine learning experiments and system implementation described in Chapter 3. The results are organised into sections covering cross-validated model training performance, hyperparameter tuning outcomes, test set evaluation, bootstrap validation, model calibration, feature importance analysis, threshold optimisation, and the deployed web application. All results are presented descriptively; their interpretation and discussion are deferred to Chapter 5.

---

## 4.2 Model Training and Cross-Validation Results

Four machine learning models were trained and evaluated using five-fold stratified cross-validation on the training set of 614 samples. Table 4.1 summarises the mean cross-validated performance of each model across the five scoring metrics recorded during grid search.

**Table 4.1: Cross-Validated Performance of Candidate Models**

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|-------|----------|-----------|--------|----------|---------|
| Logistic Regression | [Insert value] | [Insert value] | [Insert value] | [Insert value] | [Insert value] |
| Random Forest | [Insert value] | [Insert value] | [Insert value] | [Insert value] | [Insert value] |
| Gradient Boosting | [Insert value] | [Insert value] | [Insert value] | [Insert value] | [Insert value] |
| Logistic Regression + SMOTE | [Insert value] | [Insert value] | [Insert value] | [Insert value] | [Insert value] |

*Note: All values represent the mean across five cross-validation folds. The best value in each column is highlighted in bold once values are inserted.*

The Random Forest Classifier achieved the highest mean ROC-AUC score among all four models and was therefore selected as the best-performing model based on the primary refit criterion.

[Figure 4.1: Bar Chart Comparing Cross-Validated ROC-AUC Scores Across All Four Models]

---

## 4.3 Hyperparameter Tuning Results

A total of 292 unique hyperparameter configurations were evaluated across the four models, resulting in 1,460 individual model fits when accounting for the five-fold cross-validation. Table 4.2 presents the best hyperparameters identified for each model through grid search.

**Table 4.2: Best Hyperparameters Identified by GridSearchCV**

**Logistic Regression:**

| Hyperparameter | Best Value |
|---------------|-----------|
| C | [Insert value] |
| solver | [Insert value] |
| class_weight | [Insert value] |

**Random Forest Classifier (Selected as Best Model):**

| Hyperparameter | Best Value |
|---------------|-----------|
| n_estimators | 200 |
| max_depth | 3 |
| min_samples_split | 10 |
| min_samples_leaf | 4 |
| class_weight | balanced |

**Gradient Boosting Classifier:**

| Hyperparameter | Best Value |
|---------------|-----------|
| n_estimators | [Insert value] |
| learning_rate | [Insert value] |
| max_depth | [Insert value] |
| subsample | [Insert value] |

The best hyperparameters for the Random Forest Classifier — the selected model — are consistent with those stored in the `best_model_hyperparameters.json` file. The selection of `class_weight=balanced` and a shallow `max_depth` of 3 is notable, as these parameters address the class imbalance and constrain model complexity, respectively.

---

## 4.4 Test Set Performance

The best Random Forest model, trained with the optimal hyperparameters on the full training set (614 samples), was evaluated on the held-out test set of 154 samples. Table 4.3 presents the classification report.

**Table 4.3: Classification Report on Test Set (Random Forest)**

| Class | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| Non-Diabetic (0) | [Insert value] | [Insert value] | [Insert value] | [Insert value] |
| Diabetic (1) | [Insert value] | [Insert value] | [Insert value] | [Insert value] |
| **Overall Accuracy** | | | **[Insert value]** | **154** |
| Macro Average | [Insert value] | [Insert value] | [Insert value] | 154 |
| Weighted Average | [Insert value] | [Insert value] | [Insert value] | 154 |

### 4.4.1 Confusion Matrix

The confusion matrix for the best Random Forest model on the test set is presented in Figure 4.2.

[Figure 4.2: Confusion Matrix for the Random Forest Classifier on the Test Set]

The confusion matrix displays the distribution of true positives, true negatives, false positives, and false negatives. The values observed were:

- **True Negatives (TN):** [Insert value] — non-diabetic patients correctly classified as non-diabetic
- **False Positives (FP):** [Insert value] — non-diabetic patients incorrectly classified as diabetic
- **False Negatives (FN):** [Insert value] — diabetic patients incorrectly classified as non-diabetic
- **True Positives (TP):** [Insert value] — diabetic patients correctly classified as diabetic

### 4.4.2 ROC Curves

Figure 4.3 presents the Receiver Operating Characteristic (ROC) curves for all four candidate models evaluated on the test set. The ROC curve plots the true positive rate (sensitivity) against the false positive rate (1 − specificity) across all classification thresholds.

[Figure 4.3: ROC Curves for All Candidate Models on the Test Set]

The Random Forest model achieved an ROC-AUC score of [Insert value] on the test set, indicating [describe discriminative performance descriptively, e.g., "strong discriminative ability between diabetic and non-diabetic patients"].

---

## 4.5 Bootstrap Validation Results

Bootstrap validation was conducted with 2,000 resamples of the test set to estimate 95% confidence intervals for each evaluation metric. Table 4.4 presents the bootstrap results for the best Random Forest model.

**Table 4.4: Bootstrap Validation Results (n = 2,000 Resamples)**

| Metric | Mean | 95% CI Lower | 95% CI Upper |
|--------|------|-------------|-------------|
| ROC-AUC | [Insert value] | [Insert value] | [Insert value] |
| Accuracy | [Insert value] | [Insert value] | [Insert value] |
| Precision | [Insert value] | [Insert value] | [Insert value] |
| Recall | [Insert value] | [Insert value] | [Insert value] |
| F1-Score | [Insert value] | [Insert value] | [Insert value] |

[Figure 4.4: Distribution of Bootstrap ROC-AUC Scores with 95% Confidence Interval]

The confidence intervals provide a measure of the uncertainty associated with each metric estimate, accounting for the variability inherent in the test set composition.

---

## 4.6 Model Calibration Results

Calibration analysis was performed to assess the agreement between predicted probabilities and observed outcomes. Figure 4.5 presents the calibration curves for the uncalibrated and calibrated Random Forest models.

[Figure 4.5: Calibration Curves — Uncalibrated vs. Calibrated Random Forest Classifier]

The calibration curve plots the predicted probability (x-axis) against the observed frequency of the positive class (y-axis). A perfectly calibrated model follows the diagonal line. The calibrated model, obtained using `CalibratedClassifierCV` with the sigmoid method, exhibited [describe improvement or alignment descriptively, e.g., "improved alignment with the diagonal compared to the uncalibrated model, particularly in the mid-range probability bins"].

---

## 4.7 Feature Importance Analysis

### 4.7.1 Random Forest Feature Importance

The feature importance rankings derived from the trained Random Forest model are presented in Figure 4.6. Feature importance was calculated based on the mean decrease in Gini impurity across all trees in the ensemble.

[Figure 4.6: Feature Importance Rankings from the Random Forest Classifier]

Table 4.5 lists the features ranked by their importance scores.

**Table 4.5: Feature Importance Rankings**

| Rank | Feature | Importance Score |
|------|---------|-----------------|
| 1 | [Insert feature] | [Insert value] |
| 2 | [Insert feature] | [Insert value] |
| 3 | [Insert feature] | [Insert value] |
| 4 | [Insert feature] | [Insert value] |
| 5 | [Insert feature] | [Insert value] |
| 6 | [Insert feature] | [Insert value] |
| 7 | [Insert feature] | [Insert value] |
| 8 | [Insert feature] | [Insert value] |

### 4.7.2 Feature Importance Stability

Feature importance stability was assessed by computing importance scores across each of the five cross-validation folds. Figure 4.7 presents the mean importance with standard deviation error bars for each feature.

[Figure 4.7: Feature Importance Stability Across Cross-Validation Folds]

Features with low standard deviation across folds indicate stable importance, whereas features with high variability may be less reliable as predictors.

### 4.7.3 SHAP Analysis

SHAP (SHapley Additive exPlanations) values were computed using the `TreeExplainer` for the test set. Figure 4.8 presents the SHAP summary plot, which illustrates the direction and magnitude of each feature's contribution to individual predictions.

[Figure 4.8: SHAP Summary Plot for the Random Forest Classifier]

The SHAP analysis provides insight into how each feature influences predictions at the individual patient level, complementing the aggregate feature importance scores from the Random Forest model.

---

## 4.8 Threshold Optimisation Results

The impact of varying the classification threshold on model performance was evaluated across thresholds ranging from 0.10 to 0.90. Figure 4.9 presents the trade-off curves for precision, recall, F1-score, F2-score, and specificity.

[Figure 4.9: Performance Metrics Across Classification Thresholds]

The optimal threshold was identified based on the highest F2-score, which prioritises recall over precision. Table 4.6 presents the performance metrics at the optimal threshold.

**Table 4.6: Performance Metrics at the Optimal Classification Threshold**

| Metric | Value at Default Threshold (0.5) | Value at Optimal Threshold ([Insert value]) |
|--------|--------------------------------|-------------------------------------------|
| Precision | [Insert value] | [Insert value] |
| Recall | [Insert value] | [Insert value] |
| F1-Score | [Insert value] | [Insert value] |
| F2-Score | [Insert value] | [Insert value] |
| Specificity | [Insert value] | [Insert value] |

### 4.8.1 Decision Curve Analysis

Figure 4.10 presents the Decision Curve Analysis (DCA) comparing the Random Forest model against "treat all" and "treat none" strategies.

[Figure 4.10: Decision Curve Analysis for the Random Forest Classifier]

The DCA curve illustrates the range of probability thresholds over which the model provides a positive net benefit compared to the two reference strategies.

---

## 4.9 System Implementation Results

The machine learning model was successfully deployed within a full-stack web application. This section presents the implemented user interface components.

### 4.9.1 Dashboard

The dashboard serves as the home page of the application, displaying the model accuracy, dataset size (768 clinical records), and the most recent prediction result. It provides an overview of the system's capabilities and the clinical features used by the model.

[Figure 4.11: System Dashboard Showing Model Overview and Key Metrics]

### 4.9.2 Prediction Form

The prediction form presents eight input fields corresponding to the clinical features used by the model. Input fields utilise a combination of sliders (for Glucose, Blood Pressure, BMI, and Age) and numeric inputs (for Pregnancies, Skin Thickness, Insulin, and Diabetes Pedigree Function), each constrained to clinically valid ranges.

[Figure 4.12: Prediction Form with Eight Clinical Input Fields]

### 4.9.3 Prediction Results

The results page displays the predicted probability of diabetes, the risk classification (Low, Medium, or High), a visual probability distribution chart, and an AI-generated personalised health insight based on the patient's clinical data.

[Figure 4.13: Prediction Results Page Showing Probability, Risk Level, and AI Insight]

### 4.9.4 Model Information

The model information page displays the model type (Random Forest Classifier), training accuracy, testing accuracy, ROC-AUC score, and a feature importance bar chart. It also presents the four-step methodology (Data Preprocessing, Ensemble Training, Validation, and Feature Importance Analysis).

[Figure 4.14: Model Information Page with Performance Metrics and Feature Importance Chart]

### 4.9.5 AI Assistant

The AI Assistant page provides a conversational interface through which users can ask questions about diabetes, clinical indicators, and the prediction model. The assistant is powered by OpenAI's GPT-4o-mini model and provides contextually relevant, non-diagnostic health information.

[Figure 4.15: AI Assistant Conversational Interface]

---

## 4.10 Summary

This chapter has presented the results of the machine learning experiments and system implementation. The Random Forest Classifier was identified as the best-performing model based on cross-validated ROC-AUC scores. Comprehensive evaluation on the test set, validated through bootstrap resampling and calibration analysis, demonstrated the model's predictive capability. Feature importance and SHAP analyses identified the most influential clinical features, while threshold optimisation determined the decision boundary that best balances sensitivity and specificity for clinical application. The deployed web application successfully integrates the trained model with an accessible user interface and AI-powered health insights. A detailed discussion of these results is provided in Chapter 5.
