const TranscriptStyles = () => (
  <style>{`
    .jj-transcript {
      background: var(--jj-indigo-tint);
      border-radius: 12px;
      padding: 12px 20px;
      width: 100%;
    }

    .jj-transcript-text {
      font-size: 15px;
      font-weight: 400;
      color: var(--jj-text-muted);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }
  `}</style>
);

function LiveTranscript({ text }) {
  return (
    <div className="jj-transcript">
      <TranscriptStyles />
      <p className="jj-transcript-text">{text || 'Your answer will appear here as you speak'}</p>
    </div>
  );
}

export default LiveTranscript;
