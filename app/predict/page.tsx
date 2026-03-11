'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Slider } from '@/components/ui/slider';

const fields = [
  {
    key: 'pregnancies',
    label: 'Pregnancies',
    abbr: 'PREG',
    unit: '',
    type: 'number',
    min: 0, max: 20, step: 1,
    hint: 'Number of pregnancies',
    default: 0,
  },
  {
    key: 'glucose',
    label: 'Plasma Glucose',
    abbr: 'GLUC',
    unit: 'mg/dL',
    type: 'slider',
    min: 70, max: 200, step: 1,
    hint: 'Oral glucose tolerance test · 70–200 mg/dL',
    default: 120,
  },
  {
    key: 'bloodPressure',
    label: 'Blood Pressure',
    abbr: 'BP',
    unit: 'mmHg',
    type: 'slider',
    min: 40, max: 140, step: 1,
    hint: 'Diastolic blood pressure · 40–140 mmHg',
    default: 80,
  },
  {
    key: 'skinThickness',
    label: 'Skin Thickness',
    abbr: 'SKIN',
    unit: 'mm',
    type: 'number',
    min: 0, max: 100, step: 1,
    hint: 'Triceps skinfold thickness in mm',
    default: 20,
  },
  {
    key: 'insulin',
    label: 'Serum Insulin',
    abbr: 'INS',
    unit: 'μU/mL',
    type: 'number',
    min: 0, max: 900, step: 1,
    hint: '2-hour serum insulin · 0–900 μU/mL',
    default: 80,
  },
  {
    key: 'bmi',
    label: 'BMI',
    abbr: 'BMI',
    unit: 'kg/m²',
    type: 'slider',
    min: 15, max: 50, step: 0.1,
    hint: 'Body mass index · 15–50 kg/m²',
    default: 25,
  },
  {
    key: 'diabetesPedigree',
    label: 'Diabetes Pedigree',
    abbr: 'DPF',
    unit: '',
    type: 'number',
    min: 0, max: 2.5, step: 0.01,
    hint: 'Genetic predisposition score · 0–2.5',
    default: 0.5,
  },
  {
    key: 'age',
    label: 'Age',
    abbr: 'AGE',
    unit: 'yrs',
    type: 'slider',
    min: 18, max: 90, step: 1,
    hint: 'Patient age in years · 18–90',
    default: 35,
  },
];

export default function PredictPage() {
  const router = useRouter();

  const initial: Record<string, number> = {};
  fields.forEach((f) => { initial[f.key] = f.default; });

  const [formData, setFormData] = useState<Record<string, number>>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const set = (key: string, val: number) =>
    setFormData((prev) => ({ ...prev, [key]: isNaN(val) ? 0 : val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    sessionStorage.setItem('predictionData', JSON.stringify(formData));
    router.push('/results');
  };

  const pct = (f: typeof fields[0]) =>
    Math.round(((formData[f.key] - f.min) / (f.max - f.min)) * 100);

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

        .pr-root {
          font-family: 'Instrument Sans', sans-serif;
          min-height: 100vh;
          background: var(--cream);
          color: var(--ink);
        }

        /* ── Header ── */
        .pr-header {
          border-bottom: 1px solid var(--rule);
          padding: 48px 0 40px;
          text-align: center;
          position: relative;
        }
        .pr-header::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 24px;
          background: var(--rule);
        }
        .pr-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 16px;
        }
        .pr-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3.5vw, 42px);
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }
        .pr-title em { font-style: italic; color: var(--accent); }
        .pr-subtitle { font-size: 13px; color: var(--ink-faint); }

        /* ── Body ── */
        .pr-body {
          max-width: 720px;
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
          margin: 52px 0 0;
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

        /* ── Form ── */
        .pr-form {
          border: 1px solid var(--rule);
          margin-top: 16px;
        }

        .field-row {
          display: grid;
          grid-template-columns: 100px 1fr 120px;
          align-items: center;
          border-bottom: 1px solid var(--rule);
          background: var(--card-bg);
          transition: background 0.15s;
          min-height: 72px;
        }
        .field-row:last-child { border-bottom: none; }
        .field-row:hover, .field-row.is-active { background: #fff; }

        @media (max-width: 580px) {
          .field-row {
            grid-template-columns: 1fr;
            padding: 16px;
            gap: 10px;
          }
          .field-id { border-right: none !important; padding: 0 !important; }
          .field-control { padding: 0 !important; }
          .field-value { border-left: none !important; padding: 0 !important; text-align: left !important; }
        }

        /* ── Field ID column ── */
        .field-id {
          padding: 16px 20px;
          border-right: 1px solid var(--rule);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .field-abbr {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .field-label {
          font-size: 12px;
          color: var(--ink-soft);
          line-height: 1.3;
        }

        /* ── Control column ── */
        .field-control {
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .field-hint {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: var(--ink-faint);
        }

        /* ── Slider track overrides ── */
        .field-slider [data-orientation="horizontal"] {
          height: 2px;
          background: var(--rule);
        }
        .field-slider [data-orientation="horizontal"] > span:first-child {
          background: var(--accent);
        }
        .field-slider [role="slider"] {
          width: 14px;
          height: 14px;
          background: var(--ink);
          border: none;
          border-radius: 0;
          box-shadow: none;
          transition: background 0.15s;
        }
        .field-slider [role="slider"]:hover {
          background: var(--accent);
        }

        /* ── Number input ── */
        .field-number {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          color: var(--ink);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--rule);
          padding: 4px 0;
          width: 100%;
          outline: none;
          transition: border-color 0.15s;
          -moz-appearance: textfield;
        }
        .field-number::-webkit-outer-spin-button,
        .field-number::-webkit-inner-spin-button { -webkit-appearance: none; }
        .field-number:focus { border-color: var(--accent); }

        /* ── Value column ── */
        .field-value {
          padding: 16px 20px;
          border-left: 1px solid var(--rule);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
        }
        .field-val-num {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: var(--ink);
          line-height: 1;
        }
        .field-val-unit {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: var(--ink-faint);
          margin-top: 4px;
        }

        /* ── Progress micro bar ── */
        .field-progress {
          height: 1px;
          background: var(--rule);
          margin-top: 6px;
          position: relative;
          overflow: hidden;
        }
        .field-progress-fill {
          position: absolute;
          top: 0; left: 0; height: 100%;
          background: var(--accent);
          opacity: 0.5;
          transition: width 0.2s;
        }

        /* ── Submit ── */
        .submit-row {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--ink);
          color: var(--cream);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 48px;
          border: 1px solid var(--ink);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          width: 100%;
          justify-content: center;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--accent);
          border-color: var(--accent);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .submit-btn svg {
          transition: transform 0.2s;
        }
        .submit-btn:hover:not(:disabled) svg {
          transform: translateX(3px);
        }
        .submit-note {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--ink-faint);
          letter-spacing: 0.06em;
          text-align: center;
        }

        /* ── Loading dots ── */
        @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
        .dot { animation: blink 1.2s infinite; display: inline-block; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        /* ── Footer ── */
        .pr-footer {
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
          display: flex;
          justify-content: space-between;
        }
        .pr-footer span {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--ink-faint);
          letter-spacing: 0.08em;
        }
      `}</style>

      <Navigation />

      <main className="pr-root">
        <header className="pr-header">
          <p className="pr-eyebrow">Risk Assessment · 8 Clinical Indicators</p>
          <h1 className="pr-title">Enter <em>Patient</em> Data</h1>
          <p className="pr-subtitle">All values are used by the Random Forest classifier</p>
        </header>

        <div className="pr-body">
          <p className="section-label">Clinical Indicators</p>

          <form onSubmit={handleSubmit}>
            <div className="pr-form">
              {fields.map((f) => (
                <div
                  key={f.key}
                  className={`field-row${activeField === f.key ? ' is-active' : ''}`}
                  onFocus={() => setActiveField(f.key)}
                  onBlur={() => setActiveField(null)}
                >
                  {/* ID */}
                  <div className="field-id">
                    <p className="field-abbr">{f.abbr}</p>
                    <p className="field-label">{f.label}</p>
                  </div>

                  {/* Control */}
                  <div className="field-control">
                    {f.type === 'slider' ? (
                      <div className="field-slider">
                        <Slider
                          value={[formData[f.key]]}
                          onValueChange={(v) => set(f.key, v[0])}
                          min={f.min}
                          max={f.max}
                          step={f.step}
                        />
                      </div>
                    ) : (
                      <input
                        className="field-number"
                        type="number"
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        value={formData[f.key]}
                        onChange={(e) =>
                          set(f.key, f.step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))
                        }
                      />
                    )}
                    <p className="field-hint">{f.hint}</p>
                  </div>

                  {/* Value */}
                  <div className="field-value">
                    <div className="field-val-num">
                      {f.step < 1 ? formData[f.key].toFixed(f.step === 0.01 ? 2 : 1) : formData[f.key]}
                    </div>
                    {f.unit && <div className="field-val-unit">{f.unit}</div>}
                    <div className="field-progress" style={{ width: '60px', marginTop: '8px' }}>
                      <div className="field-progress-fill" style={{ width: `${pct(f)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="submit-row">
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Analysing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                  </>
                ) : (
                  <>
                    Run Prediction
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
              <p className="submit-note">Results are probabilistic · Not a clinical diagnosis</p>
            </div>
          </form>

          <div className="pr-footer">
            <span>PIMA Indians Diabetes Dataset · 8 features</span>
            <span>For research purposes only</span>
          </div>
        </div>
      </main>
    </>
  );
}