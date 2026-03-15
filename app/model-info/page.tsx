'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const ABBR_MAP: Record<string, string> = {
  Pregnancies: 'PREG',
  Glucose: 'GLUC',
  BloodPressure: 'BP',
  SkinThickness: 'SKIN',
  Insulin: 'INS',
  BMI: 'BMI',
  DiabetesPedigreeFunction: 'DPF',
  Age: 'AGE',
};

const DISPLAY_NAME: Record<string, string> = {
  Pregnancies: 'Pregnancies',
  Glucose: 'Glucose',
  BloodPressure: 'Blood Pressure',
  SkinThickness: 'Skin Thickness',
  Insulin: 'Insulin',
  BMI: 'BMI',
  DiabetesPedigreeFunction: 'Diabetes Pedigree Function',
  Age: 'Age',
};

interface ModelData {
  model_type: string;
  train_accuracy: number;
  test_accuracy: number;
  roc_auc: number;
  features: string[];
  feature_importance: { name: string; importance: number }[];
  dataset_size: number;
}

export default function ModelInfoPage() {
  const [data, setData] = useState<ModelData | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/model-info')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const modelMetrics = data
    ? [
        { label: 'Model Type', value: data.model_type, mono: true, unit: '' },
        { label: 'Training Accuracy', value: String(data.train_accuracy), unit: '%', mono: false },
        { label: 'Testing Accuracy', value: String(data.test_accuracy), unit: '%', mono: false },
      ]
    : [
        { label: 'Model Type', value: '\u2014', mono: true, unit: '' },
        { label: 'Training Accuracy', value: '\u2014', unit: '', mono: false },
        { label: 'Testing Accuracy', value: '\u2014', unit: '', mono: false },
      ];

  const features = (data?.features ?? []).map((f) => ({
    name: DISPLAY_NAME[f] ?? f,
    abbr: ABBR_MAP[f] ?? f.slice(0, 4).toUpperCase(),
  }));

  const featureImportance = (data?.feature_importance ?? []).map((f) => ({
    name: DISPLAY_NAME[f.name] ?? f.name,
    importance: f.importance,
  }));

  const methodology = [
    {
      step: '01',
      title: 'Data Preprocessing',
      body: 'Missing values imputed, features normalised, and class imbalance addressed prior to training.',
    },
    {
      step: '02',
      title: 'Ensemble Training',
      body: 'Multiple decision trees combined via bagging to reduce overfitting and improve generalisation.',
    },
    {
      step: '03',
      title: 'Validation',
      body: 'Stratified train/test split (80/20) evaluated on accuracy, precision, recall, and F1-score.',
    },
    {
      step: '04',
      title: 'Feature Importance',
      body: 'Ranked by mean decrease in impurity — glucose and BMI emerge as dominant predictors.',
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#faf8f5',
          border: '1px solid #ddd8d0',
          padding: '10px 14px',
          fontFamily: "'DM Mono', monospace",
          fontSize: '11px',
          color: '#1a1714',
        }}>
          <p style={{ color: '#9a948d', marginBottom: 4, letterSpacing: '0.08em' }}>{label}</p>
          <p style={{ color: '#c0392b' }}>{payload[0].value}% importance</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

        :root {
          --cream: #f7f4ef;
          --ink: #1a1714;
          --ink-soft: #4a4540;
          --ink-faint: #9a948d;
          --rule: #ddd8d0;
          --accent: #c0392b;
          --card-bg: #faf8f5;
        }

        body { background: var(--cream); }

        .mi-root {
          font-family: 'Instrument Sans', sans-serif;
          min-height: 100vh;
          background: var(--cream);
          color: var(--ink);
        }

        /* ── Header ── */
        .mi-header {
          border-bottom: 1px solid var(--rule);
          padding: 48px 0 40px;
          text-align: center;
          position: relative;
        }
        .mi-header::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 24px;
          background: var(--rule);
        }
        .mi-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 16px;
        }
        .mi-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3.5vw, 42px);
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }
        .mi-title em { font-style: italic; color: var(--accent); }
        .mi-subtitle {
          font-size: 13px;
          color: var(--ink-faint);
        }

        /* ── Body ── */
        .mi-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 32px 80px;
        }

        /* ── Section label ── */
        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin: 52px 0 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--rule);
        }

        /* ── Metrics row ── */
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--rule);
        }
        @media (max-width: 600px) {
          .metrics-row { grid-template-columns: 1fr; }
          .metric-cell { border-right: none !important; border-bottom: 1px solid var(--rule); }
        }
        .metric-cell {
          padding: 28px 24px;
          background: var(--card-bg);
          border-right: 1px solid var(--rule);
          position: relative;
          transition: background 0.2s;
        }
        .metric-cell:last-child { border-right: none; }
        .metric-cell:hover { background: #fff; }
        .metric-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 16px;
        }
        .metric-value {
          font-family: 'DM Serif Display', serif;
          font-size: 48px;
          line-height: 1;
          color: var(--ink);
          display: flex;
          align-items: baseline;
          gap: 3px;
        }
        .metric-value.is-text {
          font-size: 22px;
          line-height: 1.2;
        }
        .metric-unit {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: var(--accent);
        }
        .metric-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          background: var(--accent);
          opacity: 0.4;
          transition: opacity 0.2s;
        }
        .metric-cell:hover .metric-bar { opacity: 1; }

        /* ── Dataset strip ── */
        .dataset-strip {
          border: 1px solid var(--rule);
          background: var(--card-bg);
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 0;
        }
        @media (max-width: 600px) {
          .dataset-strip { grid-template-columns: 1fr; }
          .ds-stat { border-left: none !important; border-top: 1px solid var(--rule); }
        }
        .ds-main {
          padding: 24px 28px;
        }
        .ds-name {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .ds-source {
          font-size: 12px;
          color: var(--ink-faint);
        }
        .ds-stat {
          padding: 24px 28px;
          border-left: 1px solid var(--rule);
          text-align: center;
        }
        .ds-stat-val {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: var(--ink);
        }
        .ds-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-top: 4px;
        }

        /* ── Features grid ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--rule);
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .feature-cell {
          padding: 20px 16px;
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          background: var(--card-bg);
          transition: background 0.15s;
          position: relative;
        }
        .feature-cell:hover { background: #fff; }
        .feature-cell:nth-child(4n) { border-right: none; }
        @media (max-width: 640px) {
          .feature-cell:nth-child(4n) { border-right: 1px solid var(--rule); }
          .feature-cell:nth-child(2n) { border-right: none; }
        }
        .feature-abbr {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--accent);
          margin-bottom: 6px;
        }
        .feature-index {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: var(--ink-faint);
          position: absolute;
          top: 12px;
          right: 12px;
        }
        .feature-name {
          font-size: 12px;
          color: var(--ink-soft);
          line-height: 1.4;
        }

        /* ── Chart ── */
        .chart-card {
          border: 1px solid var(--rule);
          background: var(--card-bg);
        }
        .chart-header {
          padding: 24px 28px 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .chart-title {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          font-weight: 400;
          color: var(--ink);
        }
        .chart-note {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: var(--ink-faint);
          text-align: right;
          line-height: 1.6;
        }
        .chart-body {
          padding: 24px 28px 28px;
        }

        /* ── Methodology ── */
        .methodology-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--rule);
        }
        @media (max-width: 600px) {
          .methodology-grid { grid-template-columns: 1fr; }
          .meth-cell:nth-child(odd) { border-right: none !important; }
          .meth-cell { border-bottom: 1px solid var(--rule); }
        }
        .meth-cell {
          padding: 28px 28px;
          background: var(--card-bg);
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          transition: background 0.2s;
        }
        .meth-cell:nth-child(even) { border-right: none; }
        .meth-cell:nth-child(n+3) { border-bottom: none; }
        .meth-cell:hover { background: #fff; }
        .meth-step {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--accent);
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }
        .meth-title {
          font-family: 'DM Serif Display', serif;
          font-size: 16px;
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 10px;
        }
        .meth-body {
          font-size: 12px;
          color: var(--ink-soft);
          line-height: 1.7;
        }

        /* ── Footer ── */
        .mi-footer {
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mi-footer span {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--ink-faint);
          letter-spacing: 0.08em;
        }
      `}</style>

      <Navigation />

      <main className="mi-root">
        <header className="mi-header">
          <p className="mi-eyebrow">Technical Reference · {data?.model_type ?? 'Classifier'}</p>
          <h1 className="mi-title">Model <em>Information</em></h1>
          <p className="mi-subtitle">Architecture, dataset, and feature analysis</p>
        </header>

        <div className="mi-body">

          {/* Metrics */}
          <p className="section-label">Performance Metrics</p>
          <div className="metrics-row">
            {modelMetrics.map((m, i) => (
              <div className="metric-cell" key={i}>
                <p className="metric-label">{m.label}</p>
                <div className={`metric-value${m.mono ? ' is-text' : ''}`}>
                  {m.value}
                  {m.unit && <span className="metric-unit">{m.unit}</span>}
                </div>
                {m.unit && (
                  <div className="metric-bar" style={{ width: `${m.value}%` }} />
                )}
              </div>
            ))}
          </div>

          {/* Dataset */}
          <p className="section-label">Dataset</p>
          <div className="dataset-strip">
            <div className="ds-main">
              <p className="ds-name">PIMA Indians Diabetes Dataset</p>
              <p className="ds-source">UCI Machine Learning Repository · Binary classification benchmark</p>
            </div>
            <div className="ds-stat">
              <div className="ds-stat-val">768</div>
              <div className="ds-stat-label">Records</div>
            </div>
            <div className="ds-stat">
              <div className="ds-stat-val">8</div>
              <div className="ds-stat-label">Features</div>
            </div>
          </div>

          {/* Features */}
          <p className="section-label">Predictive Features</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-cell" key={i}>
                <p className="feature-abbr">{f.abbr}</p>
                <span className="feature-index">0{i + 1}</span>
                <p className="feature-name">{f.name}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <p className="section-label">Feature Importance</p>
          <div className="chart-card">
            <div className="chart-header">
              <p className="chart-title">Relative Importance by Mean Decrease in Impurity</p>
              <p className="chart-note">
                Glucose &amp; BMI<br />dominant predictors
              </p>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={featureImportance}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 120, bottom: 0 }}
                  barSize={14}
                >
                  <CartesianGrid strokeDasharray="2 4" stroke="#ddd8d0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: '#9a948d' }}
                    axisLine={{ stroke: '#ddd8d0' }}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={110}
                    tick={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: '#4a4540' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0ece6' }} />
                  <Bar dataKey="importance" radius={0}>
                    {featureImportance.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={index < 2 ? '#c0392b' : index < 4 ? '#d4685f' : '#e8a9a5'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Methodology */}
          <p className="section-label">Methodology</p>
          <div className="methodology-grid">
            {methodology.map((m, i) => (
              <div className="meth-cell" key={i}>
                <p className="meth-step">{m.step}</p>
                <p className="meth-title">{m.title}</p>
                <p className="meth-body">{m.body}</p>
              </div>
            ))}
          </div>

          <div className="mi-footer">
            <span>{data?.model_type ?? 'Model'} · PIMA Indians Diabetes Dataset</span>
            <span>For research purposes only</span>
          </div>
        </div>
      </main>
    </>
  );
}