import { motion } from 'framer-motion';

const MicButtonStyles = () => (
  <style>{`
    .jj-mic-btn {
      position: relative;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(27, 45, 107, 0.25);
      transition: background 200ms ease, border-color 200ms ease;
      -webkit-tap-highlight-color: transparent;
      flex-shrink: 0;
    }

    .jj-mic-btn-idle {
      background: var(--jj-white);
      border: 2px solid var(--jj-indigo);
      color: var(--jj-indigo);
    }

    .jj-mic-btn-active {
      background: var(--jj-indigo);
      border: 2px solid var(--jj-indigo);
      color: var(--jj-white);
      box-shadow: 0 8px 32px rgba(27, 45, 107, 0.25), 0 0 0 8px rgba(var(--jj-gold-rgb), 0.2);
      animation: jj-mic-ring-pulse 1.6s ease-in-out infinite;
    }

    @keyframes jj-mic-ring-pulse {
      0%, 100% {
        box-shadow: 0 8px 32px rgba(27, 45, 107, 0.25), 0 0 0 8px rgba(var(--jj-gold-rgb), 0.2);
      }
      50% {
        box-shadow: 0 8px 32px rgba(27, 45, 107, 0.25), 0 0 0 12px rgba(var(--jj-gold-rgb), 0.1);
      }
    }

    .jj-mic-btn-icon {
      width: 28px;
      height: 28px;
    }

    .jj-mic-rec-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #FF3B30;
      animation: jj-rec-pulse 1s ease-in-out infinite;
    }

    @keyframes jj-rec-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.7; }
    }

    @media (prefers-reduced-motion: reduce) {
      .jj-mic-rec-dot {
        animation: none !important;
      }
    }
  `}</style>
);

function MicIconSvg() {
  return (
    <svg className="jj-mic-btn-icon" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 11.5C5 15.6 8.1 19 12 19C15.9 19 19 15.6 19 11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M12 19V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 22H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MicButton({ active, onTap }) {
  return (
    <motion.button
      type="button"
      aria-label="Toggle microphone"
      className={`jj-mic-btn ${active ? 'jj-mic-btn-active' : 'jj-mic-btn-idle'}`}
      onClick={onTap}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.2 }}
    >
      <MicButtonStyles />
      <MicIconSvg />
      {active && <span className="jj-mic-rec-dot" />}
    </motion.button>
  );
}

export default MicButton;
