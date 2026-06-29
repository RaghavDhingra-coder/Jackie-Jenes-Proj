const BubbleStyles = () => (
  <style>{`
    .jj-ai-bubble {
      position: relative;
      background: var(--jj-white);
      border-radius: 20px;
      padding: 20px 24px;
      box-shadow: var(--jj-shadow-card);
      max-height: 120px;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
    }

    .jj-ai-bubble::before {
      content: '';
      position: absolute;
      top: -7px;
      left: 50%;
      transform: translateX(-50%);
      width: 14px;
      height: 14px;
      background: var(--jj-white);
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }

    .jj-ai-bubble-shimmer {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(100deg, transparent 30%, rgba(var(--jj-indigo-rgb), 0.06) 50%, transparent 70%);
      background-size: 200% 100%;
      animation: jj-bubble-shimmer 2.4s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes jj-bubble-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .jj-ai-bubble-text {
      position: relative;
      font-size: 17px;
      font-weight: 500;
      color: var(--jj-text);
      line-height: 1.6;
      margin: 0;
    }

    .jj-ai-bubble-placeholder {
      font-size: 17px;
      font-weight: 400;
      font-style: italic;
      color: var(--jj-text-muted);
      text-align: center;
      margin: 0;
    }
  `}</style>
);

function AiMessageBubble({ text, isIdle, isSpeaking }) {
  return (
    <div className="jj-ai-bubble">
      <BubbleStyles />
      {isSpeaking && <span className="jj-ai-bubble-shimmer" aria-hidden="true" />}
      {isIdle ? (
        <p className="jj-ai-bubble-placeholder">Tap the mic button below to start talking with Jackie</p>
      ) : (
        <p className="jj-ai-bubble-text">{text}</p>
      )}
    </div>
  );
}

export default AiMessageBubble;
