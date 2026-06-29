import { ProgressBar } from '../DesignSystem.jsx';

const QuizLayoutStyles = () => (
  <style>{`
    .jj-quiz-screen {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px 24px 24px;
    }

    .jj-quiz-back-row {
      height: 40px;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .jj-quiz-back {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--jj-indigo);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      transition: transform 100ms ease, background 150ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .jj-quiz-back:active {
      transform: scale(0.9);
      background: var(--jj-indigo-tint);
    }

    .jj-quiz-progress-wrap {
      position: relative;
      height: 4px;
      width: 100%;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 28px;
      flex-shrink: 0;
    }

    .jj-quiz-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--jj-gold);
      font-variant-numeric: tabular-nums;
      font-family: 'SF Mono', 'Menlo', monospace;
      margin: 0 0 8px;
    }

    .jj-quiz-heading {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: var(--jj-indigo);
      margin: 0;
    }

    .jj-quiz-subtext {
      font-size: 15px;
      font-weight: 400;
      color: var(--jj-text-muted);
      margin: 8px 0 0;
      line-height: 1.6;
    }

    .jj-quiz-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .jj-quiz-input-area {
      margin-top: 32px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .jj-quiz-bottom {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 16px;
    }
  `}</style>
);

function QuizScreenLayout({
  questionNumber,
  totalQuestions = 10,
  progress,
  onBack,
  headline,
  subtext,
  meta,
  compact,
  children,
  bottom,
}) {
  return (
    <div className="jj-quiz-screen">
      <QuizLayoutStyles />
      <div className="jj-quiz-back-row" style={compact ? { marginBottom: 4 } : undefined}>
        {onBack && (
          <button type="button" className="jj-quiz-back" onClick={onBack} aria-label="Go back">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path
                d="M9 1L1 8L9 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="jj-quiz-progress-wrap" style={compact ? { marginBottom: 6 } : undefined}>
        <ProgressBar progress={progress} />
      </div>
      <div className="jj-quiz-content">
        <p className="jj-quiz-label" style={compact ? { marginBottom: 4 } : undefined}>
          {String(questionNumber).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
        </p>
        {meta}
        <h1 className="jj-quiz-heading" style={compact ? { fontSize: 20, lineHeight: 1.2 } : undefined}>
          {headline}
        </h1>
        {subtext && (
          <p
            className="jj-quiz-subtext"
            style={compact ? { marginTop: 4, fontSize: 13, lineHeight: 1.35 } : undefined}
          >
            {subtext}
          </p>
        )}
        <div className="jj-quiz-input-area" style={compact ? { marginTop: 8 } : undefined}>
          {children}
        </div>
      </div>
      {bottom && <div className="jj-quiz-bottom">{bottom}</div>}
    </div>
  );
}

export default QuizScreenLayout;
