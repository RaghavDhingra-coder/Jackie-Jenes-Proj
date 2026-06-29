import { useEffect, useRef, useState } from 'react';

const ITEM_HEIGHT = 52;
const VISIBLE_COUNT = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const PAD_HEIGHT = (PICKER_HEIGHT - ITEM_HEIGHT) / 2;

const PickerStyles = () => (
  <style>{`
    .jj-picker-wrap {
      position: relative;
      height: ${PICKER_HEIGHT}px;
    }

    .jj-picker-highlight {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: ${ITEM_HEIGHT}px;
      transform: translateY(-50%);
      background: var(--jj-indigo-tint);
      border-radius: 12px;
      pointer-events: none;
      z-index: 0;
    }

    .jj-picker-highlight::before,
    .jj-picker-highlight::after {
      content: '';
      position: absolute;
      left: 6px;
      right: 6px;
      height: 1px;
      background: var(--jj-indigo);
      opacity: 0.25;
    }

    .jj-picker-highlight::before {
      top: 0;
    }

    .jj-picker-highlight::after {
      bottom: 0;
    }

    .jj-picker-scroll {
      position: relative;
      z-index: 1;
      height: ${PICKER_HEIGHT}px;
      overflow-y: scroll;
      scroll-snap-type: y mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      mask-image: linear-gradient(to bottom, transparent 0, black 40px, black calc(100% - 40px), transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 40px, black calc(100% - 40px), transparent 100%);
    }

    .jj-picker-scroll::-webkit-scrollbar {
      display: none;
    }

    .jj-picker-pad {
      height: ${PAD_HEIGHT}px;
    }

    .jj-picker-item {
      height: ${ITEM_HEIGHT}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
      color: var(--jj-text-muted);
      opacity: 0.4;
      transform: scale(0.85);
      scroll-snap-align: center;
      scroll-snap-stop: always;
      transition: color 150ms ease, font-size 150ms ease, font-weight 150ms ease, opacity 150ms ease, transform 150ms ease;
    }

    .jj-picker-item-selected {
      color: var(--jj-indigo);
      font-weight: 600;
      font-size: 18px;
      opacity: 1;
      transform: scale(1);
    }
  `}</style>
);

function DrumRollPicker({ items, value, onChange }) {
  const containerRef = useRef(null);
  const interactedRef = useRef(false);
  const settleTimeout = useRef(null);

  const initialIndex = () => {
    const idx = items.findIndex((it) => it.value === value);
    return idx >= 0 ? idx : Math.floor(items.length / 2);
  };

  const [centerIndex, setCenterIndex] = useState(initialIndex);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = initialIndex() * ITEM_HEIGHT;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markInteracted = () => {
    interactedRef.current = true;
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    setCenterIndex(clamped);

    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    settleTimeout.current = setTimeout(() => {
      if (interactedRef.current) {
        onChange(items[clamped].value);
      }
    }, 120);
  };

  return (
    <div className="jj-picker-wrap">
      <PickerStyles />
      <div className="jj-picker-highlight" />
      <div
        className="jj-picker-scroll"
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={markInteracted}
        onMouseDown={markInteracted}
        onWheel={markInteracted}
      >
        <div className="jj-picker-pad" />
        {items.map((it, i) => (
          <div
            key={it.value}
            className={`jj-picker-item ${i === centerIndex ? 'jj-picker-item-selected' : ''}`}
          >
            {it.label}
          </div>
        ))}
        <div className="jj-picker-pad" />
      </div>
    </div>
  );
}

export default DrumRollPicker;
