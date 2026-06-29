const NUMERIC_SIZES = ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '38', '40'];
const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const SizeChipStyles = () => (
  <style>{`
    .jj-size-group-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--jj-gold);
      margin: 0 0 10px;
    }

    .jj-size-divider {
      height: 1px;
      background: var(--jj-border);
      margin: 20px 0;
    }

    .jj-size-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .jj-size-chip {
      width: 52px;
      height: 40px;
      border-radius: 10px;
      border: 1.5px solid var(--jj-border);
      background: var(--jj-white);
      color: var(--jj-text);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease;
    }

    .jj-size-chip-selected {
      background: var(--jj-indigo);
      border-color: var(--jj-indigo);
      color: var(--jj-white);
      transform: scale(1.05);
    }
  `}</style>
);

function SizeChipGroup({ value, onSelect }) {
  return (
    <div>
      <SizeChipStyles />
      <p className="jj-size-group-label">Numeric</p>
      <div className="jj-size-wrap">
        {NUMERIC_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            className={`jj-size-chip ${value === size ? 'jj-size-chip-selected' : ''}`}
            onClick={() => onSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="jj-size-divider" />
      <p className="jj-size-group-label">Letter</p>
      <div className="jj-size-wrap">
        {LETTER_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            className={`jj-size-chip ${value === size ? 'jj-size-chip-selected' : ''}`}
            onClick={() => onSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizeChipGroup;
