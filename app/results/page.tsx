'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type RiskLevel = 'Low' | 'Medium' | 'High';

const RISK_CONFIG = {
  Low: {
    color: '#2d6a4f',
    bg: '#f0faf4',
    bar: '#52b788',
    label: 'Low Risk',
    code: 'LR',
    description:
      'Current indicators suggest a low probability of diabetes development. Maintain regular health monitoring and a balanced lifestyle.',
    action: 'Routine check-up recommended annually.',
  },
  Medium: {
    color: '#92400e',
    bg: '#fefce8',
    bar: '#d97706',
    label: 'Moderate Risk',
    code: 'MR',
    description:
      'Moderate risk indicators are present. Lifestyle adjustments and a formal consultation with a healthcare provider are recommended.',
    action: 'Consult a physician within the next 3 months.',
  },
  High: {
    color: '#c0392b',
    bg: '#fef2f2',
    bar: '#c0392b',
    label: 'High Risk',
    code: 'HR',
    description:
      'Elevated diabetes risk detected. Immediate medical consultation is strongly advised for further diagnostic testing.',
    action: 'Seek medical attention promptly.',
  },
};

export default function ResultsPage() {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('High');
  const [probability, setProbability] = useState(72);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('predictionData');
    if (raw) {
      const data = JSON.parse(raw);
      const p = Math.round(data.probability ?? 0);
      setProbability(p);
      setRiskLevel(p < 35 ? 'Low' : p < 65 ? 'Medium' : 'High');
    }
    setTimeout(() => setMounted(true), 50);
  }, []);

  const cfg = RISK_CONFIG[riskLevel];

  const chartData = [
    { name: 'Low', value: 30, color: '#52b788' },
    { name: 'Medium', value: 35, color: '#d97706' },
    { name: 'High', value: 35, color: '#c0392b' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: '#faf8f5', border: '1px solid #ddd8d0',
          padding: '8px 12px', fontFamily: "'DM Mono', monospace", fontSize: '11px',
        }}>
          <span style={{ color: '#9a948d' }}>{payload[0].name} · </span>
          <span style={{ color: '#1a1714' }}>{payload[0].value}%</span>
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

        .rs-root {
          font-family: 'Instrument Sans', sans-serif;
          min-height: 100vh;
          background: var(--cream);
          color: var(--ink);
        }

        /* ── Header ── */
        .rs-header {
          border-bottom: 1px solid var(--rule);
          padding: 48px 0 40px;
          text-align: center;
          position: relative;
        }
        .rs-header::before {
          content: ''; position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 24px; background: var(--rule);
        }
        .rs-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ink-faint); margin-bottom: 16px;
        }
        .rs-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3.5vw, 42px); font-weight: 400;
          color: var(--ink); margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .rs-title em { font-style: italic; color: var(--accent); }
        .rs-subtitle { font-size: 13px; color: var(--ink-faint); }

        /* ── Body ── */
        .rs-body { max-width: 900px; margin: 0 auto; padding: 0 32px 80px; }

        .section-label {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ink-faint); margin: 52px 0 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: var(--rule); }

        /* ── Verdict banner ── */
        .verdict-banner {
          border: 1px solid var(--rule);
          display: grid;
          grid-template-columns: 1fr auto;
          background: var(--card-bg);
          overflow: hidden;
          position: relative;
        }
        .verdict-left { padding: 36px 36px; }
        .verdict-code {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          margin-bottom: 12px;
        }
        .verdict-level {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 400; line-height: 1; margin-bottom: 16px;
        }
        .verdict-desc {
          font-size: 13px; color: var(--ink-soft);
          line-height: 1.7; max-width: 480px; margin-bottom: 16px;
        }
        .verdict-action {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.08em; display: flex; align-items: center; gap: 8px;
        }
        .verdict-action::before {
          content: '→'; font-size: 12px;
        }

        .verdict-right {
          padding: 36px 36px;
          border-left: 1px solid var(--rule);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-width: 160px; gap: 8px;
          background: var(--card-bg);
        }
        .verdict-prob-label {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint);
        }
        .verdict-prob {
          font-family: 'DM Serif Display', serif;
          font-size: 72px; font-weight: 400; line-height: 1;
        }
        .verdict-prob-unit {
          font-family: 'DM Serif Display', serif; font-size: 36px;
        }
        .verdict-bar-track {
          width: 100%; height: 3px; background: var(--rule); margin-top: 8px;
        }
        .verdict-bar-fill {
          height: 100%; transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
        }

        /* Accent stripe */
        .verdict-stripe {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px;
        }

        @media (max-width: 580px) {
          .verdict-banner { grid-template-columns: 1fr; }
          .verdict-right { border-left: none; border-top: 1px solid var(--rule); flex-direction: row; justify-content: flex-start; }
          .verdict-prob { font-size: 48px; }
        }

        /* ── Two-col layout ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--rule);
        }
        @media (max-width: 580px) { .two-col { grid-template-columns: 1fr; } }

        .col-card {
          padding: 28px 28px;
          background: var(--card-bg);
          border-right: 1px solid var(--rule);
        }
        .col-card:last-child { border-right: none; }
        .col-card-label {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--ink-faint); margin-bottom: 20px;
        }

        /* ── Risk bands ── */
        .bands { display: flex; flex-direction: column; gap: 14px; }
        .band { display: flex; align-items: center; gap: 12px; }
        .band-bar-track { flex: 1; height: 4px; background: var(--rule); }
        .band-bar-fill { height: 100%; }
        .band-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-soft); width: 60px; }
        .band-val { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-faint); width: 36px; text-align: right; }

        /* ── Notice ── */
        .notice {
          border: 1px solid var(--rule);
          border-left: 3px solid var(--ink-faint);
          background: var(--card-bg);
          padding: 20px 24px;
          display: flex; gap: 16px; align-items: flex-start;
        }
        .notice-icon {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--ink-faint); padding-top: 2px; flex-shrink: 0;
          letter-spacing: 0.06em;
        }
        .notice-text { font-size: 12px; color: var(--ink-soft); line-height: 1.7; }

        /* ── Actions ── */
        .actions-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0;
          border: 1px solid var(--rule); margin-top: 32px;
        }
        .action-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 24px;
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none; transition: background 0.2s, color 0.2s;
          cursor: pointer;
        }
        .action-btn-outline {
          background: var(--card-bg); color: var(--ink-soft);
          border-right: 1px solid var(--rule);
        }
        .action-btn-outline:hover { background: #fff; color: var(--ink); }
        .action-btn-solid {
          background: var(--ink); color: var(--cream);
        }
        .action-btn-solid:hover { background: var(--accent); }

        /* ── Footer ── */
        .rs-footer {
          margin-top: 64px; padding-top: 24px;
          border-top: 1px solid var(--rule);
          display: flex; justify-content: space-between;
        }
        .rs-footer span {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: var(--ink-faint); letter-spacing: 0.08em;
        }

        /* ── Fade in ── */
        .fade-in {
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .fade-in:nth-child(2) { transition-delay: 0.1s; }
        .fade-in:nth-child(3) { transition-delay: 0.2s; }
        .fade-in:nth-child(4) { transition-delay: 0.3s; }
      `}</style>

      <Navigation />

      <main className="rs-root">
        <header className="rs-header">
          <p className="rs-eyebrow">Prediction Result · Random Forest Classifier</p>
          <h1 className="rs-title">Risk <em>Assessment</em></h1>
          <p className="rs-subtitle">Based on 8 clinical indicators provided</p>
        </header>

        <div className="rs-body">

          {/* Verdict */}
          <p className="section-label">Diagnosis</p>
          <div className={`verdict-banner fade-in${mounted ? ' visible' : ''}`}>
            <div className="verdict-stripe" style={{ background: cfg.bar }} />
            <div className="verdict-left" style={{ paddingLeft: '40px' }}>
              <p className="verdict-code" style={{ color: cfg.color }}>{cfg.code} · {cfg.label}</p>
              <div className="verdict-level" style={{ color: cfg.color }}>{cfg.label}</div>
              <p className="verdict-desc">{cfg.description}</p>
              <p className="verdict-action" style={{ color: cfg.color }}>{cfg.action}</p>
            </div>
            <div className="verdict-right">
              <p className="verdict-prob-label">Probability</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span className="verdict-prob" style={{ color: cfg.color }}>{probability}</span>
                <span className="verdict-prob-unit" style={{ color: cfg.color }}>%</span>
              </div>
              <div className="verdict-bar-track" style={{ width: '80px' }}>
                <div
                  className="verdict-bar-fill"
                  style={{
                    width: mounted ? `${probability}%` : '0%',
                    background: cfg.bar,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Chart + Bands */}
          <p className="section-label">Risk Distribution</p>
          <div className={`two-col fade-in${mounted ? ' visible' : ''}`}>
            <div className="col-card">
              <p className="col-card-label">Population Risk Breakdown</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={2} dataKey="value"
                    startAngle={90} endAngle={-270}
                  >
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        opacity={entry.name === riskLevel ? 1 : 0.35}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '4px' }}>
                {chartData.map((d) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: d.color, opacity: d.name === riskLevel ? 1 : 0.35 }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: '#9a948d' }}>{d.name.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-card" style={{ borderRight: 'none' }}>
              <p className="col-card-label">Risk Thresholds</p>
              <div className="bands">
                {[
                  { label: 'Low', range: '0–34%', width: 34, color: '#52b788' },
                  { label: 'Medium', range: '35–64%', width: 65, color: '#d97706' },
                  { label: 'High', range: '65–100%', width: 100, color: '#c0392b' },
                ].map((b) => (
                  <div key={b.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: b.label === riskLevel ? b.color : '#9a948d', fontWeight: b.label === riskLevel ? 500 : 400 }}>
                        {b.label === riskLevel ? '→ ' : ''}{b.label}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#9a948d' }}>{b.range}</span>
                    </div>
                    <div className="band-bar-track">
                      <div className="band-bar-fill" style={{ width: `${b.width}%`, background: b.color, opacity: b.label === riskLevel ? 1 : 0.3 }} />
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--rule)' }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a948d', marginBottom: '8px' }}>Your Result</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '36px', color: cfg.color }}>{probability}</span>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: cfg.color }}>%</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#9a948d', marginLeft: '6px' }}>{cfg.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notice */}
          <p className="section-label">Important Notice</p>
          <div className={`notice fade-in${mounted ? ' visible' : ''}`}>
            <span className="notice-icon">NOTE</span>
            <p className="notice-text">
              This prediction indicates the probability that the patient may develop diabetes based on the provided clinical indicators.
              This assessment is a <strong>research tool</strong> and must not replace professional medical diagnosis.
              Always consult a qualified healthcare provider for clinical advice and formal evaluation.
            </p>
          </div>

          {/* Actions */}
          <div className={`actions-row fade-in${mounted ? ' visible' : ''}`}>
            <Link href="/predict" className="action-btn action-btn-outline">
              ← Run Another Prediction
            </Link>
            <Link href="/" className="action-btn action-btn-solid">
              Back to Dashboard →
            </Link>
          </div>

          <div className="rs-footer">
            <span>Random Forest · PIMA Indians Diabetes Dataset</span>
            <span>For research purposes only</span>
          </div>
        </div>
      </main>
    </>
  );
}