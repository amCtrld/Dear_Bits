'use client';

import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const metrics = [
    {
      label: 'Model Accuracy',
      value: '87',
      unit: '%',
      sub: 'Random Forest · PIMA dataset',
    },
    {
      label: 'Dataset Size',
      value: '768',
      unit: '',
      sub: 'Clinical records analyzed',
    },
    {
      label: 'Last Prediction',
      value: '78',
      unit: '%',
      sub: 'High risk · diabetes probability',
    },
  ];

  const features = [
    'Plasma glucose concentration',
    'Body mass index (BMI)',
    'Diastolic blood pressure',
    'Insulin serum levels',
    'Diabetes pedigree function',
    'Triceps skinfold thickness',
    'Number of pregnancies',
    'Patient age',
  ];

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
          --accent-light: #f9eded;
          --card-bg: #faf8f5;
        }

        body {
          background-color: var(--cream);
          color: var(--ink);
        }

        .dash-root {
          font-family: 'Instrument Sans', sans-serif;
          min-height: 100vh;
          background: var(--cream);
        }

        /* ── Header ── */
        .dash-header {
          border-bottom: 1px solid var(--rule);
          padding: 48px 0 40px;
          text-align: center;
          position: relative;
        }

        .dash-header::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 24px;
          background: var(--rule);
        }

        .dash-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 16px;
        }

        .dash-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 400;
          line-height: 1.1;
          color: var(--ink);
          max-width: 560px;
          margin: 0 auto 12px;
          letter-spacing: -0.01em;
        }

        .dash-title em {
          font-style: italic;
          color: var(--accent);
        }

        .dash-subtitle {
          font-size: 13px;
          color: var(--ink-faint);
          letter-spacing: 0.01em;
        }

        /* ── Layout ── */
        .dash-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 32px 80px;
        }

        /* ── Metrics ── */
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-left: 1px solid var(--rule);
          margin: 52px 0;
        }

        @media (max-width: 640px) {
          .metrics-row { grid-template-columns: 1fr; border-left: none; }
          .metric-cell { border-left: none !important; border-top: 1px solid var(--rule); }
          .metric-cell:first-child { border-top: 1px solid var(--rule); }
        }

        .metric-cell {
          padding: 32px 28px;
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          border-top: 1px solid var(--rule);
          position: relative;
          background: var(--card-bg);
          transition: background 0.2s;
        }

        .metric-cell:hover {
          background: #fff;
        }

        .metric-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 20px;
        }

        .metric-value {
          font-family: 'DM Serif Display', serif;
          font-size: 56px;
          line-height: 1;
          color: var(--ink);
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .metric-unit {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: var(--accent);
        }

        .metric-sub {
          margin-top: 12px;
          font-size: 11px;
          color: var(--ink-faint);
          line-height: 1.5;
        }

        .metric-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          background: var(--accent);
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .metric-cell:hover .metric-bar {
          opacity: 1;
        }

        /* ── CTA ── */
        .cta-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin: 8px 0 56px;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--ink);
          color: var(--cream);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 36px;
          text-decoration: none;
          border: 1px solid var(--ink);
          transition: background 0.2s, color 0.2s;
        }

        .cta-btn:hover {
          background: var(--accent);
          border-color: var(--accent);
        }

        .cta-btn svg {
          transition: transform 0.2s;
        }

        .cta-btn:hover svg {
          transform: translateX(3px);
        }

        .cta-note {
          font-size: 11px;
          color: var(--ink-faint);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
        }

        /* ── Info grid ── */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid var(--rule);
        }

        @media (max-width: 640px) {
          .info-grid { grid-template-columns: 1fr; }
        }

        .info-card {
          padding: 28px 32px;
          background: var(--card-bg);
        }

        .info-card:first-child {
          border-right: 1px solid var(--rule);
        }

        @media (max-width: 640px) {
          .info-card:first-child {
            border-right: none;
            border-bottom: 1px solid var(--rule);
          }
        }

        .info-card-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 20px;
        }

        .info-card p {
          font-size: 13px;
          color: var(--ink-soft);
          line-height: 1.7;
          margin-bottom: 12px;
        }

        .info-card p:last-child { margin-bottom: 0; }

        /* ── Features list ── */
        .features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 0;
          font-size: 12px;
          color: var(--ink-soft);
          border-bottom: 1px solid var(--rule);
        }

        .feature-item:nth-child(odd) { padding-right: 16px; }

        .feature-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }

        /* ── Footer rule ── */
        .dash-footer {
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dash-footer span {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--ink-faint);
          letter-spacing: 0.08em;
        }
      `}</style>

      <Navigation />

      <main className="dash-root">
        {/* Header */}
        <header className="dash-header px-6">
          <p className="dash-eyebrow">MSc Research · Machine Learning in Clinical Diagnosis</p>
          <h1 className="dash-title">
            Early Detection of <em>Diabetes</em> Using ML
          </h1>
          <p className="dash-subtitle">Random Forest model · PIMA Indians Diabetes Dataset</p>
        </header>

        <div className="dash-body">

          {/* Metrics */}
          <div className="metrics-row">
            {metrics.map((m, i) => (
              <div className="metric-cell" key={i}>
                <p className="metric-label">{m.label}</p>
                <div className="metric-value">
                  {m.value}
                  {m.unit && <span className="metric-unit">{m.unit}</span>}
                </div>
                <p className="metric-sub">{m.sub}</p>
                <div
                  className="metric-bar"
                  style={{ width: m.unit === '%' ? `${m.value}%` : '40%' }}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="cta-section">
            <Link href="/predict" className="cta-btn">
              Begin Risk Assessment
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <span className="cta-note">Enter 8 clinical indicators · Instant prediction</span>
          </div>

          {/* Info cards */}
          <div className="info-grid">
            <div className="info-card">
              <p className="info-card-label">About This System</p>
              <p>
                A Random Forest classifier trained on the PIMA Indians Diabetes Dataset,
                validated for early-stage diabetes risk stratification using routine
                clinical measurements.
              </p>
              <p>
                Designed to support, not replace, clinical decision-making.
                Results should be interpreted in conjunction with a physician.
              </p>
            </div>

            <div className="info-card">
              <p className="info-card-label">Clinical Features Analysed</p>
              <div className="features-list">
                {features.map((f, i) => (
                  <div className="feature-item" key={i}>
                    <div className="feature-dot" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="dash-footer">
            <span>AI-Based Diabetes Early Detection System</span>
            <span>For research purposes only</span>
          </div>
        </div>
      </main>
    </>
  );
}