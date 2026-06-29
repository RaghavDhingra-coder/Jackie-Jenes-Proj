import { motion } from 'framer-motion';

const BrandGridStyles = () => (
  <style>{`
    .jj-brand-scroll {
      max-height: 55vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      mask-image: linear-gradient(to bottom, black 0%, black 88%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 0%, black 88%, transparent 100%);
      padding-bottom: 8px;
    }

    .jj-brand-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .jj-brand-chip {
      position: relative;
      height: 48px;
      border-radius: 12px;
      border: 1.5px solid var(--jj-border);
      background: var(--jj-white);
      color: var(--jj-text);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      padding: 0 8px;
      text-align: center;
      -webkit-tap-highlight-color: transparent;
      transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease;
    }

    .jj-brand-chip:active {
      transform: scale(0.95);
    }

    .jj-brand-chip-selected {
      background: var(--jj-indigo);
      border-color: var(--jj-indigo);
      color: var(--jj-white);
    }

    .jj-brand-chip-full {
      grid-column: 1 / -1;
    }

    .jj-brand-chip-badge {
      position: absolute;
      top: 5px;
      right: 6px;
      display: flex;
    }
  `}</style>
);

function BrandGrid({ brands, selected, onToggle }) {
  const isOddCount = brands.length % 2 === 1;

  return (
    <div className="jj-brand-scroll">
      <BrandGridStyles />
      <div className="jj-brand-grid">
        {brands.map((brand, i) => {
          const isSelected = selected.includes(brand);
          const isFullWidth = isOddCount && i === brands.length - 1;
          return (
            <motion.button
              key={brand}
              type="button"
              whileTap={{ scale: 0.95 }}
              className={`jj-brand-chip ${isSelected ? 'jj-brand-chip-selected' : ''} ${
                isFullWidth ? 'jj-brand-chip-full' : ''
              }`}
              onClick={() => onToggle(brand)}
            >
              <span>{brand}</span>
              {isSelected && (
                <span className="jj-brand-chip-badge">
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
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default BrandGrid;
