import { PrimaryButton, SecondaryButton } from '../DesignSystem.jsx';

const Styles = () => (
  <style>{`
    .jj-voice-fallback {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 24px;
      text-align: center;
      gap: 12px;
    }

    .jj-voice-fallback-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--jj-indigo-tint);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
      color: var(--jj-indigo);
    }

    .jj-voice-fallback-heading {
      font-size: 22px;
      font-weight: 700;
      color: var(--jj-text);
      margin: 0;
    }

    .jj-voice-fallback-subtext {
      font-size: 15px;
      color: var(--jj-text-muted);
      margin: 0 0 12px;
      line-height: 1.5;
    }

    .jj-voice-fallback-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `}</style>
);

function UnsupportedBrowserScreen({ onSwitchToManual, onTypeInstead }) {
  return (
    <div className="jj-voice-fallback">
      <Styles />
      <div className="jj-voice-fallback-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M5 11.5C5 15.6 8.1 19 12 19C15.9 19 19 15.6 19 11.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="jj-voice-fallback-heading">Voice not supported on this browser</h1>
      <p className="jj-voice-fallback-subtext">Try Chrome or Safari on iOS for voice onboarding.</p>
      <div className="jj-voice-fallback-actions">
        <PrimaryButton onClick={onSwitchToManual}>Switch to Manual Quiz</PrimaryButton>
        <SecondaryButton onClick={onTypeInstead}>Type my answers instead</SecondaryButton>
      </div>
    </div>
  );
}

export default UnsupportedBrowserScreen;
