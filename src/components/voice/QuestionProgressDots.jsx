import { motion } from 'framer-motion';

const DotsStyles = () => (
  <style>{`
    .jj-voice-progress-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--jj-text-muted);
      text-align: center;
      margin: 0 0 8px;
    }

    .jj-voice-dots {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .jj-voice-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1.5px solid var(--jj-indigo);
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 300ms ease, border-color 300ms ease, width 300ms ease, height 300ms ease;
    }

    .jj-voice-dot-complete {
      background: var(--jj-indigo);
      border-color: var(--jj-indigo);
    }

    .jj-voice-dot-current {
      width: 10px;
      height: 10px;
      background: var(--jj-gold);
      border-color: var(--jj-gold);
    }

    .jj-voice-dot-check {
      width: 6px;
      height: 6px;
    }
  `}</style>
);

function QuestionProgressDots({ current, total = 10 }) {
  return (
    <div>
      <DotsStyles />
      <p className="jj-voice-progress-label">
        Question {Math.min(current + 1, total)} of {total}
      </p>
      <div className="jj-voice-dots">
        {Array.from({ length: total }, (_, i) => {
          const isComplete = i < current;
          const stateClass = isComplete ? 'jj-voice-dot-complete' : i === current ? 'jj-voice-dot-current' : '';
          return (
            <motion.span
              key={i}
              className={`jj-voice-dot ${stateClass}`}
              initial={false}
              animate={{ scale: i === current ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
            >
              {isComplete && (
                <svg className="jj-voice-dot-check" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6L4.5 8.5L10 3"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionProgressDots;
