import { PrimaryButton } from '../DesignSystem.jsx';

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

    .jj-permission-graphic {
      width: 100%;
      max-width: 240px;
      margin: 0 auto 16px;
      background: var(--jj-white);
      border: 1px solid var(--jj-border);
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 4px 20px rgba(27, 45, 107, 0.08);
    }

    .jj-permission-graphic-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--jj-text);
      margin-bottom: 12px;
      text-align: left;
    }

    .jj-permission-graphic-buttons {
      display: flex;
      gap: 8px;
    }

    .jj-permission-graphic-btn {
      flex: 1;
      border-radius: 8px;
      padding: 6px 0;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }

    .jj-permission-graphic-btn-deny {
      background: var(--jj-cream);
      color: var(--jj-text-muted);
    }

    .jj-permission-graphic-btn-allow {
      background: var(--jj-indigo);
      color: var(--jj-white);
    }
  `}</style>
);

function PermissionDeniedScreen({ onSwitchToManual }) {
  return (
    <div className="jj-voice-fallback">
      <Styles />
      <div className="jj-permission-graphic">
        <div className="jj-permission-graphic-row">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M5 11.5C5 15.6 8.1 19 12 19C15.9 19 19 15.6 19 11.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span>Allow microphone access?</span>
        </div>
        <div className="jj-permission-graphic-buttons">
          <span className="jj-permission-graphic-btn jj-permission-graphic-btn-deny">Block</span>
          <span className="jj-permission-graphic-btn jj-permission-graphic-btn-allow">Allow</span>
        </div>
      </div>
      <h1 className="jj-voice-fallback-heading">Microphone access needed</h1>
      <p className="jj-voice-fallback-subtext">
        Please allow microphone access in your browser settings to use voice onboarding.
      </p>
      <PrimaryButton onClick={onSwitchToManual}>Switch to Manual Quiz</PrimaryButton>
    </div>
  );
}

export default PermissionDeniedScreen;
