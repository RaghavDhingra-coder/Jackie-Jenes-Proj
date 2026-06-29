export const GlobalStyles = () => (
  <style>{`
    :root {
      --jj-indigo: #1B2D6B;
      --jj-indigo-mid: #2A3F8F;
      --jj-indigo-light: #3D5299;
      --jj-cream: #F8F6F1;
      --jj-white: #FFFFFF;
      --jj-gold: #C9A84C;
      --jj-gold-light: #D4A853;
      --jj-text: #1A1A1A;
      --jj-text-muted: #6B6B6B;
      --jj-border: #E0DDD6;
      --jj-indigo-tint: #EEF1FA;
      --jj-indigo-tint-2: #F4F6FD;
      --jj-row-alt: #FAFAFA;
      --jj-shadow-card: 0 2px 12px rgba(27,45,107,0.06), 0 8px 32px rgba(27,45,107,0.08);
      --jj-indigo-rgb: 27, 45, 107;
      --jj-gold-rgb: 201, 168, 76;
    }

    * {
      -webkit-tap-highlight-color: transparent;
    }

    .jj-backdrop {
      min-height: 100dvh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0c0f1a;
    }

    @media (min-width: 431px) {
      .jj-backdrop {
        padding: 32px 0;
      }
    }

    .jj-shell {
      position: relative;
      width: 100%;
      max-width: 430px;
      height: 100dvh;
      background: var(--jj-cream);
      overflow: hidden;
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--jj-text);
    }

    .jj-shell::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      opacity: 0.035;
      mix-blend-mode: multiply;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    @media (min-width: 431px) {
      .jj-shell {
        height: min(100dvh - 64px, 900px);
        border-radius: 28px;
        box-shadow: 0 30px 60px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
      }
    }

    .jj-screen {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .jj-progress-track {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(27, 45, 107, 0.08);
      z-index: 10;
    }

    .jj-progress-fill {
      position: relative;
      height: 100%;
      background: var(--jj-gold);
      transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .jj-progress-dot {
      position: absolute;
      top: 50%;
      right: -2px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--jj-gold);
      transform: translateY(-50%);
      box-shadow: 0 0 4px rgba(201, 168, 76, 0.6);
    }

    .jj-screen-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 32px 24px 24px;
      height: 100%;
    }

    .jj-screen-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .jj-screen-bottom {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .jj-heading {
      font-weight: 700;
      font-size: 26px;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin: 0 0 12px;
      color: var(--jj-text);
    }

    .jj-body {
      font-weight: 400;
      font-size: 16px;
      line-height: 1.6;
      color: var(--jj-text-muted);
      margin: 0;
    }

    .jj-label {
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--jj-text-muted);
      margin: 0 0 8px;
    }

    .jj-btn {
      width: 100%;
      height: 56px;
      border-radius: 14px;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: transform 150ms ease, opacity 150ms ease, background 150ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .jj-btn:active:not(:disabled) {
      transform: scale(0.97);
    }

    .jj-btn-primary {
      background: linear-gradient(180deg, var(--jj-indigo-mid) 0%, var(--jj-indigo) 100%);
      color: var(--jj-white);
    }

    .jj-btn-primary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .jj-btn-secondary {
      background: transparent;
      color: var(--jj-indigo);
      border: 1.5px solid var(--jj-indigo);
    }

    .jj-btn-secondary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .jj-option {
      width: 100%;
      min-height: 68px;
      border-radius: 14px;
      border: 1.5px solid var(--jj-border);
      border-left: 3px solid transparent;
      background: var(--jj-white);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 0 16px 0 17px;
      cursor: pointer;
      transition: border-color 150ms ease, background 150ms ease, transform 200ms ease;
      -webkit-tap-highlight-color: transparent;
      font-family: inherit;
      text-align: left;
    }

    .jj-option:active {
      transform: scale(0.98);
    }

    .jj-option:hover:not(.jj-option-selected) {
      background: var(--jj-row-alt);
    }

    .jj-option + .jj-option {
      margin-top: 12px;
    }

    .jj-option-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .jj-option-label {
      font-size: 16px;
      font-weight: 500;
      color: var(--jj-text);
    }

    .jj-option-subtitle {
      font-size: 13px;
      font-weight: 400;
      color: var(--jj-text-muted);
    }

    .jj-option-selected {
      border-color: var(--jj-indigo);
      border-left-color: var(--jj-gold);
      background: linear-gradient(135deg, var(--jj-indigo-tint), var(--jj-indigo-tint-2));
      transform: scale(1.0);
      animation: jj-option-pop 200ms ease;
    }

    @keyframes jj-option-pop {
      0% { transform: scale(0.98); }
      100% { transform: scale(1); }
    }

    .jj-option-chevron {
      flex-shrink: 0;
      color: var(--jj-border);
      transition: opacity 150ms ease;
    }

    .jj-option-selected .jj-option-chevron {
      opacity: 0;
    }

    .jj-option-check {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--jj-indigo);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      opacity: 0;
      transform: scale(0.6);
      transition: opacity 150ms ease, transform 150ms ease;
    }

    .jj-option-check.jj-visible {
      opacity: 1;
      transform: scale(1);
    }

    .jj-skip {
      display: block;
      margin: 16px auto 0;
      background: none;
      border: none;
      color: var(--jj-text-muted);
      font-size: 14px;
      font-family: inherit;
      cursor: pointer;
      padding: 8px;
      text-align: center;
      transition: transform 200ms ease;
    }

    .jj-skip:hover,
    .jj-skip:active {
      transform: translateX(2px);
    }
  `}</style>
);

export function ProgressBar({ progress }) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className="jj-progress-track">
      <div className="jj-progress-fill" style={{ width: `${clamped}%` }}>
        {clamped > 0 && <span className="jj-progress-dot" />}
      </div>
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, className }) {
  return (
    <button
      type="button"
      className={`jj-btn jj-btn-primary ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      className="jj-btn jj-btn-secondary"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function OptionCard({ label, subtitle, selected, onClick, className }) {
  return (
    <button
      type="button"
      className={`jj-option ${selected ? 'jj-option-selected' : ''} ${className || ''}`}
      onClick={onClick}
    >
      <span className="jj-option-text">
        <span className="jj-option-label">{label}</span>
        {subtitle && <span className="jj-option-subtitle">{subtitle}</span>}
      </span>
      {!selected && (
        <svg className="jj-option-chevron" width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span className={`jj-option-check ${selected ? 'jj-visible' : ''}`}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L4.5 8.5L10 3"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

export function SkipButton({ onClick, children }) {
  return (
    <button type="button" className="jj-skip" onClick={onClick}>
      {children || 'Skip →'}
    </button>
  );
}

export function ScreenWrapper({ progress, children, bottom }) {
  return (
    <div className="jj-screen-wrapper">
      {typeof progress === 'number' && <ProgressBar progress={progress} />}
      <div className="jj-screen-content">{children}</div>
      {bottom && <div className="jj-screen-bottom">{bottom}</div>}
    </div>
  );
}
