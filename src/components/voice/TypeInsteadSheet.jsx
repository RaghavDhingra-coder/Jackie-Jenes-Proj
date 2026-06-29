import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SheetStyles = () => (
  <style>{`
    .jj-sheet-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(10, 12, 24, 0.5);
      z-index: 40;
    }

    .jj-sheet {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--jj-white);
      border-radius: 24px 24px 0 0;
      padding: 24px;
      z-index: 41;
    }

    .jj-sheet-handle {
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: var(--jj-border);
      margin: 0 auto 16px;
    }

    .jj-sheet-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .jj-sheet-input {
      flex: 1;
      height: 52px;
      border-radius: 12px;
      border: 1.5px solid var(--jj-border);
      background: var(--jj-cream);
      font-family: inherit;
      font-size: 15px;
      color: var(--jj-text);
      padding: 0 16px;
      outline: none;
      transition: border-color 150ms ease;
      box-sizing: border-box;
    }

    .jj-sheet-input:focus {
      border-color: var(--jj-indigo);
    }

    .jj-sheet-send {
      width: 44px;
      height: 44px;
      min-width: 44px;
      border-radius: 50%;
      background: var(--jj-indigo);
      border: none;
      color: var(--jj-white);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
  `}</style>
);

function TypeInsteadSheet({ open, onClose, onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="jj-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className="jj-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) onClose();
            }}
          >
            <SheetStyles />
            <div className="jj-sheet-handle" />
            <div className="jj-sheet-row">
              <input
                type="text"
                className="jj-sheet-input"
                placeholder="Type your answer here..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
              <button
                type="button"
                className="jj-sheet-send"
                aria-label="Send answer"
                onClick={handleSubmit}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default TypeInsteadSheet;
