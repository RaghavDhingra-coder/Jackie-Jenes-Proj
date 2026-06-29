import { motion } from 'framer-motion';

const LandingStyles = () => (
  <style>{`
    .jj-landing {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px 24px 0;
    }

    .jj-landing-logo {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--jj-gold);
      margin: 0 0 20px;
    }

    .jj-landing-top {
      display: flex;
      flex-direction: column;
    }

    .jj-landing-heading {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin: 0 0 10px;
      color: var(--jj-text);
    }

    .jj-landing-heading-gold {
      color: var(--jj-gold);
    }

    .jj-denim-visual {
      position: relative;
      height: 200px;
      width: 100%;
      overflow: hidden;
    }

    .jj-hero-pill {
      position: absolute;
      left: -8%;
      width: 116%;
      border-radius: 999px;
      overflow: hidden;
      background: var(--jj-indigo);
      box-shadow: 0 16px 32px -16px rgba(27, 45, 107, 0.5);
    }

    .jj-hero-pill-shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 45%;
      height: 100%;
      background: linear-gradient(115deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transform: translateX(-160%) skewX(-15deg);
      animation: jj-hero-shimmer 7s ease-in-out infinite;
      pointer-events: none;
    }

    .jj-hero-pill-1 {
      top: 4%;
      height: 68px;
      transform: rotate(-15deg);
      opacity: 1;
    }
    .jj-hero-pill-1 .jj-hero-pill-shimmer { animation-delay: 0s; }

    .jj-hero-pill-2 {
      top: 42%;
      height: 84px;
      left: -2%;
      width: 104%;
      transform: rotate(0deg);
      opacity: 0.6;
    }
    .jj-hero-pill-2 .jj-hero-pill-shimmer { animation-delay: 1.4s; }

    .jj-hero-pill-3 {
      top: 80%;
      height: 58px;
      left: 10%;
      width: 90%;
      transform: rotate(15deg);
      opacity: 0.3;
    }
    .jj-hero-pill-3 .jj-hero-pill-shimmer { animation-delay: 2.8s; }

    @keyframes jj-hero-shimmer {
      0%, 20% {
        transform: translateX(-160%) skewX(-15deg);
      }
      60%, 100% {
        transform: translateX(260%) skewX(-15deg);
      }
    }

    .jj-landing-bottom {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 8px;
    }

    .jj-choice-card {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      border-radius: 16px;
      padding: 20px;
      border: none;
      border-left: 3px solid transparent;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      position: relative;
      overflow: hidden;
      box-shadow: var(--jj-shadow-card);
      transition: transform 150ms ease, border-left-color 200ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .jj-choice-card:active {
      transform: scale(0.97);
    }

    .jj-choice-card:hover,
    .jj-choice-card:active {
      border-left-color: var(--jj-gold);
    }

    .jj-choice-card:hover .jj-choice-arrow,
    .jj-choice-card:active .jj-choice-arrow {
      transform: translateX(4px);
    }

    .jj-choice-manual {
      background: var(--jj-white);
      border: 1.5px solid var(--jj-border);
      border-left: 3px solid transparent;
      color: var(--jj-text);
    }

    .jj-choice-voice {
      background: linear-gradient(180deg, var(--jj-indigo-mid) 0%, var(--jj-indigo) 100%);
      color: var(--jj-white);
    }

    .jj-choice-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .jj-choice-manual .jj-choice-icon {
      background: var(--jj-indigo-tint);
      color: var(--jj-indigo);
    }

    .jj-choice-voice .jj-choice-icon {
      background: rgba(255, 255, 255, 0.15);
      color: var(--jj-white);
    }

    .jj-choice-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .jj-choice-title {
      font-size: 16px;
      font-weight: 600;
    }

    .jj-choice-subtitle {
      font-size: 13px;
    }

    .jj-choice-manual .jj-choice-subtitle {
      color: var(--jj-text-muted);
    }

    .jj-choice-voice .jj-choice-subtitle {
      color: rgba(255, 255, 255, 0.75);
    }

    .jj-choice-arrow {
      font-size: 18px;
      flex-shrink: 0;
      display: inline-block;
      transition: transform 200ms ease;
    }

    .jj-choice-manual .jj-choice-arrow {
      color: var(--jj-indigo);
    }

    .jj-choice-voice .jj-choice-arrow {
      color: var(--jj-white);
    }

    .jj-choice-shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 40%;
      height: 100%;
      background: linear-gradient(115deg, transparent, rgba(255, 255, 255, 0.18), transparent);
      transform: translateX(-150%) skewX(-15deg);
      animation: jj-shimmer-sweep 6.5s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes jj-shimmer-sweep {
      0%, 25% {
        transform: translateX(-150%) skewX(-15deg);
      }
      65%, 100% {
        transform: translateX(250%) skewX(-15deg);
      }
    }

    .jj-landing-footnote {
      text-align: center;
      font-size: 12px;
      color: var(--jj-text-muted);
      padding-bottom: 16px;
      margin: 4px 0 0;
    }
  `}</style>
);

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 17L3.8 13.8L13 4.6C13.6 4 14.6 4 15.2 4.6L15.4 4.8C16 5.4 16 6.4 15.4 7L6.2 16.2L3 17Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M11.5 6.1L13.9 8.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="2.5" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M4.5 9.5C4.5 12.8 7.1 15 10 15C12.9 15 15.5 12.8 15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M10 15V18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M7 18H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ChoiceCard({ variant, icon, title, subtitle, onClick, shimmer, delay }) {
  return (
    <motion.button
      type="button"
      className={`jj-choice-card jj-choice-${variant}`}
      onClick={onClick}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="jj-choice-icon">{icon}</span>
      <span className="jj-choice-text">
        <span className="jj-choice-title">{title}</span>
        <span className="jj-choice-subtitle">{subtitle}</span>
      </span>
      <span className="jj-choice-arrow">→</span>
      {shimmer && <span className="jj-choice-shimmer" aria-hidden="true" />}
    </motion.button>
  );
}

function LandingScreen({ onSelectManual, onSelectVoice }) {
  return (
    <div className="jj-landing">
      <LandingStyles />

      <div className="jj-landing-top">
        <motion.p
          className="jj-landing-logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Jackie Jeans
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="jj-landing-heading">
            Find jeans that
            <br />
            <span className="jj-landing-heading-gold">actually fit.</span>
          </h1>
          <p className="jj-body">
            Answer 10 quick questions and we'll find your perfect fit.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="jj-denim-visual"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        aria-hidden="true"
      >
        <div className="jj-hero-pill jj-hero-pill-1">
          <span className="jj-hero-pill-shimmer" />
        </div>
        <div className="jj-hero-pill jj-hero-pill-2">
          <span className="jj-hero-pill-shimmer" />
        </div>
        <div className="jj-hero-pill jj-hero-pill-3">
          <span className="jj-hero-pill-shimmer" />
        </div>
      </motion.div>

      <div className="jj-landing-bottom">
        <ChoiceCard
          variant="manual"
          icon={<PencilIcon />}
          title="Fill it out myself"
          subtitle="Quick form, 2 minutes"
          onClick={onSelectManual}
          delay={0.3}
        />
        <ChoiceCard
          variant="voice"
          icon={<MicIcon />}
          title="Talk to our AI Stylist"
          subtitle="Speak naturally, hands-free"
          onClick={onSelectVoice}
          shimmer
          delay={0.4}
        />
        <p className="jj-landing-footnote">Your data is never sold or shared.</p>
      </div>
    </div>
  );
}

export default LandingScreen;
