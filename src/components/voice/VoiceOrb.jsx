import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const OrbStyles = () => (
  <style>{`
    .jj-orb-wrap {
      position: relative;
      width: 220px;
      height: 220px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .jj-orb {
      width: 220px;
      height: 220px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 600ms ease, box-shadow 600ms ease;
      position: relative;
      z-index: 2;
    }

    .jj-orb-idle {
      background: radial-gradient(circle, var(--jj-indigo-mid), var(--jj-indigo));
      box-shadow: 0 0 0 8px rgba(var(--jj-indigo-rgb), 0.08),
        0 0 0 16px rgba(var(--jj-indigo-rgb), 0.04),
        0 20px 60px rgba(var(--jj-indigo-rgb), 0.3);
      animation: jj-orb-pulse 3s ease-in-out infinite;
    }

    .jj-orb-ai_speaking {
      background: radial-gradient(circle, var(--jj-indigo-light), var(--jj-indigo));
      box-shadow: 0 0 0 8px rgba(var(--jj-indigo-rgb), 0.08),
        0 0 0 16px rgba(var(--jj-indigo-rgb), 0.04),
        0 20px 60px rgba(var(--jj-indigo-rgb), 0.3);
      animation: jj-orb-breathe 2s ease-in-out infinite;
    }

    .jj-orb-listening {
      background: radial-gradient(circle, var(--jj-gold-light), var(--jj-gold));
      box-shadow: 0 0 0 8px rgba(var(--jj-gold-rgb), 0.12),
        0 0 0 16px rgba(var(--jj-gold-rgb), 0.06),
        0 20px 60px rgba(var(--jj-gold-rgb), 0.25);
    }

    .jj-orb-processing {
      background: radial-gradient(circle, var(--jj-indigo-mid), var(--jj-indigo));
      box-shadow: 0 0 0 8px rgba(var(--jj-indigo-rgb), 0.08),
        0 0 0 16px rgba(var(--jj-indigo-rgb), 0.04),
        0 20px 60px rgba(var(--jj-indigo-rgb), 0.3);
    }

    @keyframes jj-orb-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }

    @keyframes jj-orb-breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }

    .jj-orb-ring {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      border: 2px solid var(--jj-indigo);
      opacity: 0;
      z-index: 1;
      animation: jj-ring-pulse 1.8s ease-out infinite;
    }

    .jj-orb-ring-gold {
      border-color: var(--jj-gold);
    }

    .jj-orb-ring:nth-child(1) { animation-delay: 0s; }
    .jj-orb-ring:nth-child(2) { animation-delay: 0.6s; }
    .jj-orb-ring:nth-child(3) { animation-delay: 1.2s; }

    @keyframes jj-ring-pulse {
      0% { transform: scale(1); opacity: 0.3; }
      100% { transform: scale(1.8); opacity: 0; }
    }

    .jj-orb-conic {
      position: absolute;
      width: 248px;
      height: 248px;
      border-radius: 50%;
      z-index: 1;
      background: conic-gradient(from 0deg, transparent 0deg, var(--jj-gold) 100deg, transparent 340deg);
      -webkit-mask: radial-gradient(closest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
      mask: radial-gradient(closest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
      animation: jj-arc-spin 1.1s linear infinite;
    }

    @keyframes jj-arc-spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 380px), (max-height: 700px) {
      .jj-orb-wrap {
        width: 200px;
        height: 200px;
      }
      .jj-orb {
        width: 200px;
        height: 200px;
      }
      .jj-orb-ring {
        width: 200px;
        height: 200px;
      }
      .jj-orb-conic {
        width: 226px;
        height: 226px;
      }
    }

    .jj-orb-mic-icon {
      width: 32px;
      height: 32px;
      color: var(--jj-white);
    }

    .jj-orb-bars {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 32px;
    }

    .jj-orb-bar {
      width: 4px;
      background: var(--jj-white);
      border-radius: 2px;
      height: 8px;
      animation: jj-bar-bounce 0.8s ease-in-out infinite;
    }

    .jj-orb-bar:nth-child(1) { animation-delay: 0s; }
    .jj-orb-bar:nth-child(2) { animation-delay: 0.1s; }
    .jj-orb-bar:nth-child(3) { animation-delay: 0.2s; }
    .jj-orb-bar:nth-child(4) { animation-delay: 0.3s; }
    .jj-orb-bar:nth-child(5) { animation-delay: 0.4s; }

    @keyframes jj-bar-bounce {
      0%, 100% { height: 8px; }
      50% { height: 28px; }
    }

    .jj-orb-status-label {
      position: absolute;
      bottom: -28px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 13px;
      font-weight: 500;
      color: var(--jj-text-muted);
    }

    .jj-orb-checkmark {
      position: absolute;
      inset: 0;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(46, 163, 99, 0.92);
    }

    @media (prefers-reduced-motion: reduce) {
      .jj-orb-idle,
      .jj-orb-ai_speaking,
      .jj-orb-ring,
      .jj-orb-conic,
      .jj-orb-bar {
        animation: none !important;
      }
    }
  `}</style>
);

function MicIcon() {
  return (
    <svg className="jj-orb-mic-icon" viewBox="0 0 24 24" fill="none">
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

function SoundBars() {
  return (
    <div className="jj-orb-bars" aria-hidden="true">
      <span className="jj-orb-bar" />
      <span className="jj-orb-bar" />
      <span className="jj-orb-bar" />
      <span className="jj-orb-bar" />
      <span className="jj-orb-bar" />
    </div>
  );
}

function VoiceOrb({ status, showCheckmark }) {
  const reducedMotion = useReducedMotion();
  const ringColorClass = status === 'listening' ? 'jj-orb-ring-gold' : '';

  return (
    <div className="jj-orb-wrap">
      <OrbStyles />
      <motion.div
        className={`jj-orb jj-orb-${status}`}
        initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', duration: 0.6 }}
      >
        {status === 'idle' && <MicIcon />}
        {(status === 'ai_speaking' || status === 'listening') && <SoundBars />}
        <AnimatePresence>
          {showCheckmark && (
            <motion.div
              className="jj-orb-checkmark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path
                  d="M18 33L27 42L46 22"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {(status === 'ai_speaking' || status === 'listening') && (
        <>
          <div className={`jj-orb-ring ${ringColorClass}`} />
          <div className={`jj-orb-ring ${ringColorClass}`} />
          <div className={`jj-orb-ring ${ringColorClass}`} />
        </>
      )}

      {status === 'processing' && <div className="jj-orb-conic" />}

      {status === 'listening' && <p className="jj-orb-status-label">Listening...</p>}
      {status === 'processing' && <p className="jj-orb-status-label">Thinking...</p>}
    </div>
  );
}

export default VoiceOrb;
