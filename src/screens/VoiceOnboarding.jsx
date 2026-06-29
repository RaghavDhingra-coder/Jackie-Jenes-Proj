import { useEffect, useRef, useState } from 'react';
import { ProgressBar, PrimaryButton, SecondaryButton } from '../components/DesignSystem.jsx';
import VoiceOrb from '../components/voice/VoiceOrb.jsx';
import AiMessageBubble from '../components/voice/AiMessageBubble.jsx';
import LiveTranscript from '../components/voice/LiveTranscript.jsx';
import QuestionProgressDots from '../components/voice/QuestionProgressDots.jsx';
import MicButton from '../components/voice/MicButton.jsx';
import TypeInsteadSheet from '../components/voice/TypeInsteadSheet.jsx';
import ConfirmLeaveModal from '../components/voice/ConfirmLeaveModal.jsx';
import UnsupportedBrowserScreen from '../components/voice/UnsupportedBrowserScreen.jsx';
import PermissionDeniedScreen from '../components/voice/PermissionDeniedScreen.jsx';

export const STATUS = {
  IDLE: 'idle',
  AI_SPEAKING: 'ai_speaking',
  LISTENING: 'listening',
  PROCESSING: 'processing',
};

const TOTAL_QUESTIONS = 10;
const TYPE_SPEED_MS = 30;
const SILENCE_TIMEOUT_MS = 8000;

const SYSTEM_PROMPT = `You are Jackie, a warm and friendly fit stylist
for Jackie Jeans — a premium denim brand. Your job is to have a natural,
conversational chat with a customer to collect their fit preferences so
we can recommend the perfect pair of jeans.

## Your Personality
- Warm, encouraging, and professional
- Never robotic or form-like — speak naturally
- Brief responses — max 2 sentences per turn
- Occasionally use light affirmations: "Perfect!", "Got it!", "Nice!"
- Never repeat the question if the user already answered it

## Questions to Collect (in order)
1. Height (e.g. "5'6\\"", "five foot six")
2. Weight in lbs — OPTIONAL. Make skipping feel natural.
   If user hesitates or says skip/pass/no, move on immediately.
3. Waist measurement in inches (narrowest point)
4. Hip measurement in inches (fullest point)
5. Waist fit preference: Snug / Slightly Relaxed / Relaxed
6. Rise preference: High Rise / Mid Rise / Low Rise
7. Thigh fit: Fitted / Relaxed / Loose
8. Denim brands bought before (can name multiple)
9. Size in each brand mentioned (ask one brand at a time)
10. Biggest fit frustration: Waist gap / Hip tightness / Wrong length /
    Thigh fit / Rise / Other

## Rules
- Ask one question at a time
- Parse natural speech into structured answers
  ("I'm about five six" → height: "5'6\\"")
  ("around a 28 waist" → waist: "28")
  ("I wear Levi's and Gap" → brands: ["Levi's", "Gap"])
- If answer is unclear, ask ONE clarifying question
- Confirm answers naturally before moving on
  ("5'6\\", perfect!" not "I have recorded your height as 5 feet 6 inches")
- For Q9, ask size for each brand separately in sequence
- When ALL 10 questions are answered, say a warm closing line then
  output the special completion tag

## Output Format
After EVERY response, output a JSON block with current quiz state:
<quiz_state>
{
  "currentQuestion": 3,
  "answeredSoFar": {
    "height": "5'6\\"",
    "weight": "skipped",
    "waist": "28"
  },
  "isComplete": false,
  "nextAction": "ask_hip"
}
</quiz_state>

When all questions are answered set "isComplete": true and include
ALL answers in "answeredSoFar".

## Completion Message (say this when isComplete is true)
"You're all set! I've got everything I need to find your perfect pair.
Taking you to your personalized recommendations now..."
`;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const VoiceStyles = () => (
  <style>{`
    .jj-voice-screen {
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .jj-voice-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 0;
      flex-shrink: 0;
    }

    .jj-voice-back,
    .jj-voice-skip {
      background: none;
      border: none;
      font-family: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
    }

    .jj-voice-back {
      font-size: 20px;
      color: var(--jj-indigo);
      justify-content: flex-start;
    }

    .jj-voice-skip {
      font-size: 13px;
      font-weight: 500;
      color: var(--jj-text-muted);
      justify-content: flex-end;
    }

    .jj-voice-wordmark {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--jj-gold);
      margin: 0;
    }

    .jj-voice-progress-wrap {
      position: relative;
      height: 4px;
      width: 100%;
      margin-top: 14px;
      padding: 0 20px;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .jj-voice-center {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 16px 24px;
      min-height: 0;
      position: relative;
    }

    .jj-voice-timer {
      position: absolute;
      top: 8px;
      right: 24px;
      font-size: 12px;
      color: var(--jj-text-muted);
    }

    .jj-voice-bubble-gap {
      margin-top: 16px;
      width: 100%;
    }

    .jj-voice-transcript-gap {
      margin-top: 16px;
      width: 100%;
    }

    .jj-voice-dots-area {
      flex-shrink: 0;
      padding: 0 24px 8px;
    }

    .jj-voice-bottom-bar {
      flex-shrink: 0;
      padding: 8px 24px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
    }

    .jj-voice-side-btn {
      width: 70px;
      font-size: 14px;
      font-weight: 500;
      color: var(--jj-text-muted);
      background: none;
      border: none;
      cursor: pointer;
      min-height: 44px;
      -webkit-tap-highlight-color: transparent;
    }

    .jj-voice-side-btn-hidden {
      opacity: 0;
      pointer-events: none;
    }

    .jj-voice-error-banner {
      width: 100%;
      background: var(--jj-white);
      border: 1px solid var(--jj-border);
      border-radius: 14px;
      padding: 16px;
      text-align: center;
      box-shadow: var(--jj-shadow-card);
    }

    .jj-voice-error-text {
      font-size: 14px;
      color: var(--jj-text);
      margin: 0 0 12px;
      line-height: 1.6;
    }

    .jj-voice-error-actions {
      display: flex;
      gap: 8px;
    }
  `}</style>
);

function VoiceOnboarding({ onBack, onSkipToForm, onComplete }) {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [voiceError, setVoiceError] = useState(null); // null | 'unsupported' | 'permission_denied'
  const [apiError, setApiError] = useState(null); // null | { type: 'network'|'api', lastUserMessage }
  const [quizAnswers, setQuizAnswers] = useState({
    height: null,
    weight: null,
    weightSkipped: false,
    waist: null,
    hip: null,
    waistFit: null,
    rise: null,
    thighFit: null,
    brands: [],
    brandSizes: {},
    frustration: null,
  });
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [aiFullText, setAiFullText] = useState('');
  const [aiDisplayedText, setAiDisplayedText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const recognitionRef = useRef(null);
  const conversationStartedRef = useRef(false);
  const finalizedRef = useRef(false);
  const manualStopReasonRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const typeTimersRef = useRef([]);
  const timerStartedRef = useRef(false);
  const intervalRef = useRef(null);
  const prevQuestionRef = useRef(1);

  // Voice list loads asynchronously on some browsers (esp. iOS Safari) — warm the
  // cache early so the first speak() call has a real chance of finding `preferred`.
  useEffect(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
  }, []);

  // Create the SpeechRecognition instance once.
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('unsupported');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      typeTimersRef.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const trackTypeTimer = (id) => {
    typeTimersRef.current.push(id);
    return id;
  };

  const clearTypeTimers = () => {
    typeTimersRef.current.forEach(clearTimeout);
    typeTimersRef.current = [];
  };

  const startSessionTimer = () => {
    if (timerStartedRef.current) return;
    timerStartedRef.current = true;
    intervalRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
  };

  const typewrite = (fullText) => {
    clearTypeTimers();
    setAiFullText(fullText);
    setAiDisplayedText('');
    let i = 0;
    const tick = () => {
      i += 1;
      setAiDisplayedText(fullText.slice(0, i));
      if (i < fullText.length) {
        trackTypeTimer(setTimeout(tick, TYPE_SPEED_MS));
      }
    };
    tick();
  };

  const speak = (text, onCompleteSpeak) => {
    if (!window.speechSynthesis) {
      onCompleteSpeak && onCompleteSpeak();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes('Samantha') ||
        v.name.includes('Google US English') ||
        v.name.includes('Microsoft Aria') ||
        v.name.includes('Karen')
    );
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setStatus(STATUS.AI_SPEAKING);
    utterance.onend = () => {
      setStatus(STATUS.IDLE);
      onCompleteSpeak && onCompleteSpeak();
    };
    utterance.onerror = () => {
      setStatus(STATUS.IDLE);
      onCompleteSpeak && onCompleteSpeak();
    };

    window.speechSynthesis.speak(utterance);
  };

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      manualStopReasonRef.current = 'silence-timeout';
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    }, SILENCE_TIMEOUT_MS);
  };

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setVoiceError('unsupported');
      return;
    }
    try {
      recognition.start();
    } catch {
      // Recognition already active — ignore.
    }
  };

  const sendToClaude = async (userMessage) => {
    setApiError(null);
    setStatus(STATUS.PROCESSING);

    const newHistory = [...conversationHistory, { role: 'user', content: userMessage }];
    setConversationHistory(newHistory);

    let response;
    try {
      response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages: newHistory }),
      });
    } catch (networkErr) {
      console.error('Network error talking to Claude proxy:', networkErr);
      setStatus(STATUS.IDLE);
      setApiError({ type: 'network', lastUserMessage: userMessage });
      return;
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('Claude proxy returned an error:', response.status, errBody);
      setStatus(STATUS.IDLE);
      setApiError({ type: 'api', lastUserMessage: userMessage });
      return;
    }

    const data = await response.json();
    const fullResponse = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    const quizStateMatch = fullResponse.match(/<quiz_state>([\s\S]*?)<\/quiz_state>/);
    let completedNow = false;
    let mergedAnswers = quizAnswers;

    if (quizStateMatch) {
      try {
        const quizState = JSON.parse(quizStateMatch[1]);
        if (quizState.answeredSoFar) {
          mergedAnswers = { ...quizAnswers, ...quizState.answeredSoFar };
          setQuizAnswers(mergedAnswers);
        }
        if (quizState.currentQuestion) {
          if (quizState.currentQuestion > prevQuestionRef.current) {
            setShowCheckmark(true);
            setTimeout(() => setShowCheckmark(false), 500);
          }
          prevQuestionRef.current = quizState.currentQuestion;
          setCurrentQuestion(quizState.currentQuestion);
        }
        if (quizState.isComplete) {
          completedNow = true;
        }
      } catch (parseErr) {
        console.error('Failed to parse quiz_state JSON:', parseErr);
      }
    }

    const speechText = fullResponse.replace(/<quiz_state>[\s\S]*?<\/quiz_state>/g, '').trim();

    setConversationHistory([...newHistory, { role: 'assistant', content: fullResponse }]);
    typewrite(speechText);

    speak(speechText, () => {
      if (completedNow) {
        setTimeout(() => onComplete(mergedAnswers), 500);
      } else {
        setTimeout(() => startListening(), 300);
      }
    });
  };

  const handleUserSpeech = (text) => {
    if (!text || !text.trim()) return;
    finalizedRef.current = true;
    clearSilenceTimer();
    setStatus(STATUS.PROCESSING);
    sendToClaude(text.trim());
  };

  const startConversation = () => {
    prevQuestionRef.current = 1;
    const opening =
      "Hey! I'm Jackie, your personal fit stylist. I'll ask you a few quick questions to find your perfect pair of jeans. Let's start — what's your height?";
    typewrite(opening);
    speak(opening, () => {
      setTimeout(() => startListening(), 300);
    });
    setConversationHistory([
      {
        role: 'assistant',
        content: `${opening}\n<quiz_state>{"currentQuestion":1,"answeredSoFar":{},"isComplete":false}</quiz_state>`,
      },
    ]);
    setCurrentQuestion(1);
  };

  // Keep recognition event handlers fresh every render so they always close
  // over the latest state/handlers without needing to recreate the instance.
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onstart = () => {
      finalizedRef.current = false;
      setStatus(STATUS.LISTENING);
      setTranscript('');
      resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      resetSilenceTimer();
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);
      if (result.isFinal) {
        handleUserSpeech(text);
      }
    };

    recognition.onerror = (event) => {
      clearSilenceTimer();
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceError('permission_denied');
        setStatus(STATUS.IDLE);
      } else if (event.error !== 'no-speech') {
        console.error('SpeechRecognition error:', event.error);
        setStatus(STATUS.IDLE);
      }
      // 'no-speech' is recovered by the onend fallback below.
    };

    recognition.onend = () => {
      clearSilenceTimer();
      const reason = manualStopReasonRef.current;
      manualStopReasonRef.current = null;

      if (finalizedRef.current) return;

      if (reason === 'silence-timeout') {
        const msg = "Still there? Tap the mic when you're ready.";
        typewrite(msg);
        setStatus(STATUS.IDLE);
        speak(msg, () => {});
        return;
      }

      if (transcript.trim()) {
        handleUserSpeech(transcript);
        return;
      }

      const retryMsg = "I didn't catch that — could you say that again?";
      typewrite(retryMsg);
      setStatus(STATUS.IDLE);
      speak(retryMsg, () => {
        setTimeout(() => startListening(), 300);
      });
    };
  });

  const toggleMic = () => {
    if (voiceError) return;
    if (status === STATUS.LISTENING) {
      manualStopReasonRef.current = 'manual-stop';
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    } else if (status === STATUS.IDLE) {
      if (!conversationStartedRef.current) {
        conversationStartedRef.current = true;
        startSessionTimer();
        startConversation();
      } else {
        startListening();
      }
    }
  };

  const handleSkipWeight = () => {
    setQuizAnswers((prev) => ({ ...prev, weight: null, weightSkipped: true }));
    if (status === STATUS.LISTENING) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    }
    handleUserSpeech("Skip — I'd prefer not to share my weight");
  };

  const handleTypedAnswer = (text) => {
    if (!text.trim()) return;
    setSheetOpen(false);
    setTranscript(text);
    if (!conversationStartedRef.current) {
      conversationStartedRef.current = true;
      startSessionTimer();
    }
    if (status === STATUS.LISTENING) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    }
    handleUserSpeech(text);
  };

  const handleRetryApiCall = () => {
    if (!apiError) return;
    const { lastUserMessage } = apiError;
    setApiError(null);
    sendToClaude(lastUserMessage);
  };

  const hasProgress = conversationStartedRef.current || currentQuestion > 1;

  const requestLeave = (action) => {
    if (hasProgress) {
      setConfirmAction(action);
    } else if (action === 'back') {
      onBack();
    } else {
      onSkipToForm();
    }
  };

  const confirmLeave = () => {
    setConfirmAction(null);
    if (confirmAction === 'back') onBack();
    else onSkipToForm();
  };

  if (voiceError === 'unsupported') {
    return (
      <div className="jj-voice-screen">
        <VoiceStyles />
        <UnsupportedBrowserScreen onSwitchToManual={onSkipToForm} onTypeInstead={() => setSheetOpen(true)} />
        <TypeInsteadSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSubmit={handleTypedAnswer} />
      </div>
    );
  }

  if (voiceError === 'permission_denied') {
    return (
      <div className="jj-voice-screen">
        <VoiceStyles />
        <PermissionDeniedScreen onSwitchToManual={onSkipToForm} />
      </div>
    );
  }

  const isIdleBubble = status === STATUS.IDLE && aiDisplayedText === '' && !conversationStartedRef.current;
  const progress = Math.min(100, (currentQuestion / TOTAL_QUESTIONS) * 100);
  const isWeightQuestion = currentQuestion === 2;

  return (
    <div className="jj-voice-screen">
      <VoiceStyles />

      <div className="jj-voice-topbar">
        <button
          type="button"
          className="jj-voice-back"
          aria-label="Go back"
          onClick={() => requestLeave('back')}
        >
          ←
        </button>
        <p className="jj-voice-wordmark">Jackie Jeans</p>
        <button type="button" className="jj-voice-skip" onClick={() => requestLeave('skip')}>
          Skip to form →
        </button>
      </div>

      <div className="jj-voice-progress-wrap">
        <ProgressBar progress={progress} />
      </div>

      <div className="jj-voice-center">
        <p className="jj-voice-timer">{formatTime(elapsedSeconds)}</p>
        <VoiceOrb status={status} showCheckmark={showCheckmark} />

        {apiError ? (
          <div className="jj-voice-error-banner">
            <p className="jj-voice-error-text">
              {apiError.type === 'network'
                ? 'Having trouble connecting. Check your internet and try again.'
                : "Something went wrong. Want to try again or switch to the manual form?"}
            </p>
            <div className="jj-voice-error-actions">
              <PrimaryButton onClick={handleRetryApiCall}>Try again</PrimaryButton>
              {apiError.type === 'api' && (
                <SecondaryButton onClick={onSkipToForm}>Switch to manual</SecondaryButton>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="jj-voice-bubble-gap">
              <AiMessageBubble
                text={aiDisplayedText}
                isIdle={isIdleBubble}
                isSpeaking={status === STATUS.AI_SPEAKING}
              />
            </div>
            <div className="jj-voice-transcript-gap">
              <LiveTranscript text={transcript} />
            </div>
          </>
        )}
      </div>

      <div className="jj-voice-dots-area">
        <QuestionProgressDots current={currentQuestion - 1} total={TOTAL_QUESTIONS} />
      </div>

      <div className="jj-voice-bottom-bar">
        <button
          type="button"
          className={`jj-voice-side-btn ${isWeightQuestion ? '' : 'jj-voice-side-btn-hidden'}`}
          onClick={handleSkipWeight}
        >
          Skip
        </button>

        <MicButton active={status !== STATUS.IDLE || conversationStartedRef.current} onTap={toggleMic} />

        <button type="button" className="jj-voice-side-btn" onClick={() => setSheetOpen(true)}>
          Type instead
        </button>
      </div>

      <TypeInsteadSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleTypedAnswer}
      />

      <ConfirmLeaveModal
        open={confirmAction !== null}
        onStay={() => setConfirmAction(null)}
        onLeave={confirmLeave}
      />
    </div>
  );
}

export default VoiceOnboarding;
