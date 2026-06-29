import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryButton } from '../components/DesignSystem.jsx';

const WAIST_FIT_LABELS = { snug: 'Snug', 'slightly-relaxed': 'Slightly Relaxed', relaxed: 'Relaxed' };
const RISE_LABELS = { high: 'High Rise', mid: 'Mid Rise', low: 'Low Rise' };
const THIGH_FIT_LABELS = { fitted: 'Fitted', relaxed: 'Relaxed', loose: 'Loose' };
const FRUSTRATION_LABELS = {
  'waist-gap': 'Waist gap',
  'hip-tightness': 'Hip tightness',
  'wrong-length': 'Wrong length',
  'thigh-fit': 'Thigh fit',
  rise: 'Rise',
  other: 'Other',
};

function formatHeight(value) {
  if (value == null) return 'Not provided';
  if (typeof value === 'string') return value;
  const feet = Math.floor(value / 12);
  const inches = value % 12;
  return `${feet}'${inches}"`;
}

function normalize(value) {
  return (value || '').toString().toLowerCase();
}

function getPersonalizedSummary(answers) {
  const rise = normalize(answers.rise);
  const waistFit = normalize(answers.waistFit);
  const thighFit = normalize(answers.thighFit);
  const frustration = normalize(answers.frustration);

  if (rise.includes('high') && waistFit.includes('snug')) {
    return 'You prefer a structured, high-waisted fit with no room to spare.';
  }
  if (thighFit.includes('loose') && rise.includes('low')) {
    return 'You lean toward a relaxed, casual low-rise style.';
  }
  if (frustration.includes('hip')) {
    return "We'll prioritize styles with extra room through the hips.";
  }
  if (frustration.includes('waist') && frustration.includes('gap')) {
    return "We'll focus on high-waisted styles that eliminate back gap.";
  }
  return "We've built your profile. Let's find your perfect pair.";
}

const redirectToJackieJeans = (answers) => {
  const params = new URLSearchParams({
    height: answers.height || '',
    weight: answers.weight || 'skipped',
    waist: answers.waist || '',
    hip: answers.hip || '',
    waistFit: answers.waistFit || '',
    rise: answers.rise || '',
    thighFit: answers.thighFit || '',
    brands: (answers.brands || []).join(','),
    brandSizes: JSON.stringify(answers.brandSizes || {}),
    frustration: answers.frustration || '',
    email: answers.email || '',
    source: 'fit-quiz',
    version: '1.0',
  });

  window.location.href = `https://jackie-jeans.vercel.app/?${params.toString()}`;
};

const ResultsStyles = () => (
  <style>{`
    .jj-results-screen {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 24px 24px 24px;
    }

    .jj-results-eyebrow {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--jj-gold);
      margin: 0 0 8px;
    }

    .jj-results-heading {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: var(--jj-indigo);
      margin: 0 0 6px;
    }

    .jj-results-subtext {
      font-size: 15px;
      font-weight: 400;
      color: var(--jj-text-muted);
      margin: 0 0 10px;
      line-height: 1.6;
    }

    .jj-fp-card {
      position: relative;
      background: var(--jj-white);
      border-radius: 24px;
      border: 1px solid var(--jj-border);
      border-top: 3px solid var(--jj-gold);
      box-shadow: var(--jj-shadow-card);
      flex: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .jj-fp-card-scroll {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
      -webkit-overflow-scrolling: touch;
    }

    .jj-fp-card-fade {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 36px;
      background: linear-gradient(to bottom, rgba(238, 241, 250, 0), var(--jj-indigo-tint));
      border-radius: 0 0 24px 24px;
      pointer-events: none;
    }

    .jj-fp-section + .jj-fp-section {
      margin-top: 16px;
    }

    .jj-fp-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--jj-gold);
      margin: 0 0 8px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid var(--jj-gold);
    }

    .jj-fp-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      margin: 0 -10px;
      border-radius: 8px;
    }

    .jj-fp-row:nth-child(even) {
      background: var(--jj-row-alt);
    }

    .jj-fp-row-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--jj-text-muted);
    }

    .jj-fp-row-value {
      font-size: 14px;
      font-weight: 700;
      color: var(--jj-indigo);
    }

    .jj-fp-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }

    .jj-fp-chip {
      background: var(--jj-indigo);
      color: var(--jj-white);
      border-radius: 20px;
      padding: 6px 14px 6px 10px;
      font-size: 13px;
      font-weight: 500;
      border-left: 2px dashed rgba(255, 255, 255, 0.5);
    }

    .jj-fp-sizes-line {
      font-size: 13px;
      color: var(--jj-text-muted);
      line-height: 1.6;
    }

    .jj-fp-empty {
      font-size: 13px;
      color: var(--jj-text-muted);
    }

    .jj-fp-pill {
      display: inline-block;
      background: var(--jj-gold);
      color: var(--jj-white);
      border-radius: 20px;
      padding: 10px 20px;
      font-size: 15px;
      font-weight: 600;
    }

    .jj-results-summary {
      font-size: 16px;
      font-weight: 500;
      font-style: italic;
      color: var(--jj-indigo);
      text-align: left;
      padding: 16px 20px;
      margin: 14px 0 0;
      line-height: 1.5;
      background: linear-gradient(135deg, var(--jj-indigo-tint), var(--jj-indigo-tint-2));
      border-left: 3px solid var(--jj-gold);
      border-radius: 12px;
    }

    .jj-results-email {
      padding-top: 10px;
    }

    .jj-results-email-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--jj-text-muted);
      margin: 0 0 6px;
      display: block;
    }

    .jj-results-email-input {
      width: 100%;
      height: 52px;
      border-radius: 12px;
      border: 1.5px solid var(--jj-border);
      background: var(--jj-white);
      font-family: inherit;
      font-size: 15px;
      color: var(--jj-text);
      padding: 0 16px;
      outline: none;
      transition: border-color 150ms ease;
      box-sizing: border-box;
    }

    .jj-results-email-input:focus {
      border-color: var(--jj-indigo);
    }

    .jj-results-email-note {
      font-size: 11px;
      color: var(--jj-text-muted);
      text-align: center;
      margin: 6px 0 0;
    }

    .jj-results-cta {
      padding-top: 10px;
    }

    .jj-cta-btn {
      position: relative;
      height: 60px;
      overflow: hidden;
      background: linear-gradient(135deg, var(--jj-indigo), var(--jj-indigo-mid));
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .jj-cta-btn-arrow {
      display: inline-block;
      transition: transform 200ms ease;
      margin-left: 4px;
    }

    .jj-cta-btn:hover .jj-cta-btn-arrow,
    .jj-cta-btn:active .jj-cta-btn-arrow {
      transform: translateX(4px);
    }

    .jj-cta-btn-shine {
      position: absolute;
      top: 0;
      left: 0;
      width: 40%;
      height: 100%;
      background: linear-gradient(115deg, transparent, rgba(255, 255, 255, 0.35), transparent);
      transform: translateX(-160%) skewX(-15deg);
      animation: jj-cta-shine 1.6s ease-in-out 0.6s 1;
      pointer-events: none;
    }

    @keyframes jj-cta-shine {
      0% { transform: translateX(-160%) skewX(-15deg); }
      100% { transform: translateX(260%) skewX(-15deg); }
    }

    .jj-transition-screen {
      position: relative;
      height: 100%;
      width: 100%;
      background: var(--jj-indigo);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      overflow: hidden;
    }

    .jj-transition-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 360px;
      height: 360px;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(var(--jj-gold-rgb), 0.3), transparent 70%);
      pointer-events: none;
    }

    .jj-transition-wordmark {
      position: relative;
      z-index: 1;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--jj-gold);
      margin: 0 0 28px;
    }

    .jj-transition-bar-track {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 240px;
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.15);
      overflow: hidden;
      margin-bottom: 20px;
    }

    .jj-transition-bar-fill {
      height: 100%;
      background: var(--jj-white);
      border-radius: 3px;
    }

    .jj-transition-text {
      position: relative;
      z-index: 1;
      font-size: 18px;
      font-weight: 500;
      color: var(--jj-white);
    }
  `}</style>
);

function TransitionScreen({ answers }) {
  const [text, setText] = useState('Building your recommendation...');

  useEffect(() => {
    const textTimer = setTimeout(() => setText('Taking you to Jackie Jeans...'), 1000);
    const redirectTimer = setTimeout(() => redirectToJackieJeans(answers), 2000);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(redirectTimer);
    };
  }, [answers]);

  return (
    <div className="jj-transition-screen">
      <div className="jj-transition-glow" aria-hidden="true" />
      <p className="jj-transition-wordmark">Jackie Jeans</p>
      <div className="jj-transition-bar-track">
        <motion.div
          className="jj-transition-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'linear' }}
        />
      </div>
      <p className="jj-transition-text">{text}</p>
    </div>
  );
}

function ResultsContent({ answers, email, setEmail, onSubmit }) {
  const sizesLine = (answers.brands || [])
    .map((brand) => `${brand}: Size ${answers.brandSizes?.[brand] ?? '—'}`)
    .join('  •  ');

  const summary = getPersonalizedSummary(answers);

  return (
    <div className="jj-results-screen">

      <motion.p
        className="jj-results-eyebrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Your Fit Profile
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="jj-results-heading">Here's what we found.</h1>
        <p className="jj-results-subtext">Based on your answers, here's the fit we recommend.</p>
      </motion.div>

      <motion.div
        className="jj-fp-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="jj-fp-card-scroll">
          <div className="jj-fp-section">
            <p className="jj-fp-title">Your Measurements</p>
            <div className="jj-fp-row">
              <span className="jj-fp-row-label">📏 Height</span>
              <span className="jj-fp-row-value">{formatHeight(answers.height)}</span>
            </div>
            <div className="jj-fp-row">
              <span className="jj-fp-row-label">⚖️ Weight</span>
              <span className="jj-fp-row-value">
                {answers.weight ? `${answers.weight} lbs` : 'Not provided'}
              </span>
            </div>
            <div className="jj-fp-row">
              <span className="jj-fp-row-label">〰️ Waist</span>
              <span className="jj-fp-row-value">{answers.waist != null ? `${answers.waist}"` : '—'}</span>
            </div>
            <div className="jj-fp-row">
              <span className="jj-fp-row-label">〰️ Hips</span>
              <span className="jj-fp-row-value">{answers.hip != null ? `${answers.hip}"` : '—'}</span>
            </div>
          </div>

          <div className="jj-fp-section">
            <p className="jj-fp-title">Your Fit Preferences</p>
            <div className="jj-fp-row">
              <span className="jj-fp-row-label">Waist fit</span>
              <span className="jj-fp-row-value">
                {WAIST_FIT_LABELS[answers.waistFit] || answers.waistFit || '—'}
              </span>
            </div>
            <div className="jj-fp-row">
              <span className="jj-fp-row-label">Rise</span>
              <span className="jj-fp-row-value">{RISE_LABELS[answers.rise] || answers.rise || '—'}</span>
            </div>
            <div className="jj-fp-row">
              <span className="jj-fp-row-label">Thigh fit</span>
              <span className="jj-fp-row-value">
                {THIGH_FIT_LABELS[answers.thighFit] || answers.thighFit || '—'}
              </span>
            </div>
          </div>

          <div className="jj-fp-section">
            <p className="jj-fp-title">Brands You Wear</p>
            {answers.brands && answers.brands.length > 0 ? (
              <>
                <div className="jj-fp-chips">
                  {answers.brands.map((brand) => (
                    <span key={brand} className="jj-fp-chip">
                      {brand}
                    </span>
                  ))}
                </div>
                <p className="jj-fp-sizes-line">{sizesLine}</p>
              </>
            ) : (
              <p className="jj-fp-empty">No brands selected</p>
            )}
          </div>

          <div className="jj-fp-section">
            <p className="jj-fp-title">We'll Focus On</p>
            <span className="jj-fp-pill">
              {FRUSTRATION_LABELS[answers.frustration] || answers.frustration || '—'}
            </span>
          </div>
        </div>
        <div className="jj-fp-card-fade" />
      </motion.div>

      <motion.p
        className="jj-results-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {summary}
      </motion.p>

      <motion.div
        className="jj-results-email"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <label className="jj-results-email-label" htmlFor="jj-email">
          Save your fit profile to your email (optional)
        </label>
        <input
          id="jj-email"
          type="email"
          className="jj-results-email-input"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="jj-results-email-note">We'll never spam you. Ever.</p>
      </motion.div>

      <motion.div
        className="jj-results-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <PrimaryButton className="jj-cta-btn" onClick={onSubmit}>
          <span className="jj-cta-btn-shine" aria-hidden="true" />
          Find My Perfect Jeans <span className="jj-cta-btn-arrow">→</span>
        </PrimaryButton>
      </motion.div>
    </div>
  );
}

function ResultsScreen({ answers }) {
  const [phase, setPhase] = useState('results');
  const [email, setEmail] = useState('');

  return (
    <>
      <ResultsStyles />
      <AnimatePresence mode="wait" initial={false}>
      {phase === 'results' ? (
        <motion.div
          key="results"
          style={{ height: '100%' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResultsContent
            answers={answers}
            email={email}
            setEmail={setEmail}
            onSubmit={() => setPhase('transition')}
          />
        </motion.div>
      ) : (
        <motion.div
          key="transition"
          style={{ height: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TransitionScreen answers={{ ...answers, email }} />
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

export default ResultsScreen;
