import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingScreen from './screens/LandingScreen.jsx';
import ManualQuiz from './screens/ManualQuiz.jsx';
import VoiceOnboarding from './screens/VoiceOnboarding.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import { GlobalStyles } from './components/DesignSystem.jsx';

const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

function App() {
  const [route, setRoute] = useState('landing');
  const [voiceAnswers, setVoiceAnswers] = useState(null);

  const goLanding = () => setRoute('landing');

  let content;
  if (route === 'landing') {
    content = (
      <LandingScreen onSelectManual={() => setRoute('manual')} onSelectVoice={() => setRoute('voice')} />
    );
  } else if (route === 'manual') {
    content = <ManualQuiz onBack={goLanding} />;
  } else if (route === 'voice') {
    content = (
      <VoiceOnboarding
        onBack={goLanding}
        onSkipToForm={() => setRoute('manual')}
        onComplete={(answers) => {
          setVoiceAnswers(answers);
          setRoute('voice-results');
        }}
      />
    );
  } else {
    content = <ResultsScreen answers={voiceAnswers} />;
  }

  return (
    <div className="jj-backdrop">
      <GlobalStyles />
      <div className="jj-shell">
        <AnimatePresence initial={false}>
          <motion.div
            key={route}
            className="jj-screen"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
