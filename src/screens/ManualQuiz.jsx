import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryButton, SkipButton, OptionCard } from '../components/DesignSystem.jsx';
import QuizScreenLayout from '../components/quiz/QuizScreenLayout.jsx';
import DrumRollPicker from '../components/quiz/DrumRollPicker.jsx';
import OptionQuestionScreen from '../components/quiz/OptionQuestionScreen.jsx';
import BrandGrid from '../components/quiz/BrandGrid.jsx';
import SizeChipGroup from '../components/quiz/SizeChipGroup.jsx';
import ResultsScreen from './ResultsScreen.jsx';

const TOTAL_QUESTIONS = 10;

const HEIGHT_ITEMS = Array.from({ length: 74 - 58 + 1 }, (_, i) => {
  const totalInches = 58 + i;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { value: totalInches, label: `${feet}'${inches}"` };
});

const WAIST_ITEMS = Array.from({ length: 52 - 24 + 1 }, (_, i) => {
  const v = 24 + i;
  return { value: v, label: `${v}"` };
});

const HIP_ITEMS = Array.from({ length: 60 - 32 + 1 }, (_, i) => {
  const v = 32 + i;
  return { value: v, label: `${v}"` };
});

const WAIST_FIT_OPTIONS = [
  { value: 'snug', title: 'Snug', subtitle: 'No gap, held firmly in place' },
  { value: 'slightly-relaxed', title: 'Slightly Relaxed', subtitle: 'A little breathing room' },
  { value: 'relaxed', title: 'Relaxed', subtitle: 'Comfortable and loose' },
];

const RISE_OPTIONS = [
  { value: 'high', title: 'High Rise', subtitle: 'Sits at or above the navel' },
  { value: 'mid', title: 'Mid Rise', subtitle: 'Sits just below the navel' },
  { value: 'low', title: 'Low Rise', subtitle: 'Sits on the hips' },
];

const THIGH_FIT_OPTIONS = [
  { value: 'fitted', title: 'Fitted', subtitle: 'Close to the skin, no extra fabric' },
  { value: 'relaxed', title: 'Relaxed', subtitle: 'Some room to move' },
  { value: 'loose', title: 'Loose', subtitle: 'Lots of room, baggy feel' },
];

const BRANDS = [
  "Levi's",
  'Wrangler',
  'Gap',
  'H&M',
  'Zara',
  'Madewell',
  'AG Jeans',
  'Frame',
  'Citizens of Humanity',
  '7 For All Mankind',
  'Lucky Brand',
  'True Religion',
  'Everlane',
  'Uniqlo',
  'American Eagle',
];

const FRUSTRATION_OPTIONS = [
  { value: 'waist-gap', title: 'Waist gap', subtitle: 'Waistband gapes at the back' },
  { value: 'hip-tightness', title: 'Hip tightness', subtitle: 'Too tight around the hips' },
  { value: 'wrong-length', title: 'Wrong length', subtitle: 'Too long or too short' },
  { value: 'thigh-fit', title: 'Thigh fit', subtitle: 'Too tight or baggy in thighs' },
  { value: 'rise', title: 'Rise', subtitle: 'Sits too high or too low' },
  { value: 'other', title: 'Other', subtitle: 'Something else bothers me most' },
];

const STEP = {
  HEIGHT: 0,
  WEIGHT: 1,
  WAIST: 2,
  HIP: 3,
  WAIST_FIT: 4,
  RISE: 5,
  THIGH_FIT: 6,
  BRANDS: 7,
  BRAND_SIZES: 8,
  FRUSTRATION: 9,
  RESULTS: 10,
};

const slideVariants = {
  enter: (dir) => ({ x: dir === 'backward' ? '-100%' : '100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir === 'backward' ? '100%' : '-100%', opacity: 0 }),
};

function BrandProgressDots({ index, total }) {
  const dots = Array.from({ length: total }, (_, i) => (i === index ? '●' : '○')).join(' ');
  return (
    <p className="jj-brand-progress">
      Brand {index + 1} of {total} <span className="jj-brand-dots">{dots}</span>
    </p>
  );
}

function ManualQuiz({ onBack }) {
  const [answers, setAnswers] = useState({
    height: null,
    weight: null,
    waist: null,
    hip: null,
    waistFit: null,
    rise: null,
    thighFit: null,
    brands: [],
    brandSizes: {},
    frustration: null,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [brandIndex, setBrandIndex] = useState(0);
  const [direction, setDirection] = useState('forward');
  const advancingRef = useRef(false);

  useEffect(() => {
    advancingRef.current = false;
  }, [currentStep, brandIndex]);

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    setDirection('forward');
    setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    if (currentStep === 0) {
      onBack?.();
      return;
    }
    setDirection('backward');
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const handleOptionSelect = (key, value) => {
    updateAnswer(key, value);
    if (advancingRef.current) return;
    advancingRef.current = true;
    setTimeout(goNext, 400);
  };

  const toggleBrand = (brand) => {
    setAnswers((prev) => {
      const has = prev.brands.includes(brand);
      return {
        ...prev,
        brands: has ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand],
      };
    });
  };

  const handleBrandsContinue = () => {
    setDirection('forward');
    setBrandIndex(0);
    setCurrentStep(STEP.BRAND_SIZES);
  };

  const handleNoneOfThese = () => {
    setAnswers((prev) => ({ ...prev, brands: [] }));
    setDirection('forward');
    setCurrentStep(STEP.FRUSTRATION);
  };

  const updateBrandSize = (brand, size) => {
    setAnswers((prev) => ({ ...prev, brandSizes: { ...prev.brandSizes, [brand]: size } }));
  };

  const handleBrandSizeContinue = () => {
    if (brandIndex < answers.brands.length - 1) {
      setDirection('forward');
      setBrandIndex((i) => i + 1);
    } else {
      setDirection('forward');
      setCurrentStep(STEP.FRUSTRATION);
    }
  };

  const handleBrandSizeBack = () => {
    if (brandIndex > 0) {
      setDirection('backward');
      setBrandIndex((i) => i - 1);
    } else {
      setDirection('backward');
      setCurrentStep(STEP.BRANDS);
    }
  };

  const handleFrustrationBack = () => {
    if (answers.brands.length > 0) {
      setDirection('backward');
      setBrandIndex(answers.brands.length - 1);
      setCurrentStep(STEP.BRAND_SIZES);
    } else {
      setDirection('backward');
      setCurrentStep(STEP.BRANDS);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEP.HEIGHT:
        return (
          <QuizScreenLayout
            questionNumber={1}
            totalQuestions={TOTAL_QUESTIONS}
            progress={10}
            onBack={goBack}
            headline="What is your height?"
            subtext="We use this to calculate your ideal inseam length."
            bottom={
              <PrimaryButton onClick={goNext} disabled={answers.height == null}>
                Continue
              </PrimaryButton>
            }
          >
            <DrumRollPicker
              items={HEIGHT_ITEMS}
              value={answers.height}
              onChange={(v) => updateAnswer('height', v)}
            />
          </QuizScreenLayout>
        );

      case STEP.WEIGHT:
        return (
          <QuizScreenLayout
            questionNumber={2}
            totalQuestions={TOTAL_QUESTIONS}
            progress={20}
            onBack={goBack}
            headline="What is your weight?"
            subtext="This helps us calibrate proportional fit."
            bottom={<PrimaryButton onClick={goNext}>Continue</PrimaryButton>}
          >
            <div style={{ marginTop: 24 }}>
              <div className="jj-weight-input-row">
                <input
                  className="jj-weight-input"
                  type="number"
                  inputMode="numeric"
                  placeholder="—"
                  value={answers.weight ?? ''}
                  onChange={(e) => updateAnswer('weight', e.target.value)}
                />
                <span className="jj-weight-unit">lbs</span>
              </div>
              <SkipButton onClick={goNext}>Skip this question →</SkipButton>
            </div>
          </QuizScreenLayout>
        );

      case STEP.WAIST:
        return (
          <QuizScreenLayout
            questionNumber={3}
            totalQuestions={TOTAL_QUESTIONS}
            progress={30}
            onBack={goBack}
            headline="What is your waist measurement?"
            subtext="Measure at your narrowest point, in inches."
            bottom={
              <PrimaryButton onClick={goNext} disabled={answers.waist == null}>
                Continue
              </PrimaryButton>
            }
          >
            <DrumRollPicker
              items={WAIST_ITEMS}
              value={answers.waist}
              onChange={(v) => updateAnswer('waist', v)}
            />
            <p className="jj-quiz-tip">Tip: Measure around your natural waist, not your hips.</p>
          </QuizScreenLayout>
        );

      case STEP.HIP:
        return (
          <QuizScreenLayout
            questionNumber={4}
            totalQuestions={TOTAL_QUESTIONS}
            progress={40}
            onBack={goBack}
            headline="What is your hip measurement?"
            subtext="Measure at the fullest point of your hips, in inches."
            bottom={
              <PrimaryButton onClick={goNext} disabled={answers.hip == null}>
                Continue
              </PrimaryButton>
            }
          >
            <DrumRollPicker
              items={HIP_ITEMS}
              value={answers.hip}
              onChange={(v) => updateAnswer('hip', v)}
            />
            <p className="jj-quiz-tip">Tip: Stand with feet together and measure the widest part.</p>
          </QuizScreenLayout>
        );

      case STEP.WAIST_FIT:
        return (
          <OptionQuestionScreen
            questionNumber={5}
            totalQuestions={TOTAL_QUESTIONS}
            progress={50}
            onBack={goBack}
            headline="How do you like jeans to fit at the waist?"
            subtext="Pick what feels most comfortable to you."
            options={WAIST_FIT_OPTIONS}
            value={answers.waistFit}
            onSelect={(v) => handleOptionSelect('waistFit', v)}
          />
        );

      case STEP.RISE:
        return (
          <OptionQuestionScreen
            questionNumber={6}
            totalQuestions={TOTAL_QUESTIONS}
            progress={60}
            onBack={goBack}
            headline="Where should the waistband sit?"
            subtext="This determines the rise of your jeans."
            options={RISE_OPTIONS}
            value={answers.rise}
            onSelect={(v) => handleOptionSelect('rise', v)}
          />
        );

      case STEP.THIGH_FIT:
        return (
          <OptionQuestionScreen
            questionNumber={7}
            totalQuestions={TOTAL_QUESTIONS}
            progress={70}
            onBack={goBack}
            headline="How should jeans fit through the thighs?"
            subtext="This is the second most common fit issue after waist."
            options={THIGH_FIT_OPTIONS}
            value={answers.thighFit}
            onSelect={(v) => handleOptionSelect('thighFit', v)}
          />
        );

      case STEP.BRANDS: {
        const count = answers.brands.length;
        return (
          <QuizScreenLayout
            questionNumber={8}
            totalQuestions={TOTAL_QUESTIONS}
            progress={75}
            onBack={goBack}
            headline="Which denim brands have you bought before?"
            subtext="Select all that apply. This helps us calibrate sizing."
            bottom={
              <>
                <PrimaryButton onClick={handleBrandsContinue} disabled={count === 0}>
                  <span className="jj-continue-row">
                    Continue
                    {count > 0 && (
                      <motion.span
                        key={count}
                        className="jj-continue-badge"
                        initial={{ scale: 0.6 }}
                        animate={{ scale: [1.3, 1] }}
                        transition={{ duration: 0.3 }}
                      >
                        {count}
                      </motion.span>
                    )}
                  </span>
                </PrimaryButton>
                <SkipButton onClick={handleNoneOfThese}>None of these</SkipButton>
              </>
            }
          >
            <BrandGrid brands={BRANDS} selected={answers.brands} onToggle={toggleBrand} />
          </QuizScreenLayout>
        );
      }

      case STEP.BRAND_SIZES: {
        const total = answers.brands.length;
        const brand = answers.brands[brandIndex];
        const selectedSize = answers.brandSizes[brand] ?? null;
        const progress = Math.round(80 + brandIndex * (9 / Math.max(total, 1)));
        return (
          <QuizScreenLayout
            questionNumber={9}
            totalQuestions={TOTAL_QUESTIONS}
            progress={progress}
            onBack={handleBrandSizeBack}
            meta={<BrandProgressDots index={brandIndex} total={total} />}
            headline={
              <>
                <span style={{ fontWeight: 400 }}>What size do you wear in </span>
                <span>{brand}</span>
                <span style={{ fontWeight: 400 }}>?</span>
              </>
            }
            subtext="Pick the size you most recently bought."
            bottom={
              <PrimaryButton onClick={handleBrandSizeContinue} disabled={selectedSize == null}>
                Continue
              </PrimaryButton>
            }
          >
            <SizeChipGroup value={selectedSize} onSelect={(size) => updateBrandSize(brand, size)} />
          </QuizScreenLayout>
        );
      }

      case STEP.FRUSTRATION:
        return (
          <QuizScreenLayout
            questionNumber={10}
            totalQuestions={TOTAL_QUESTIONS}
            progress={95}
            onBack={handleFrustrationBack}
            headline="What's your biggest fit frustration?"
            subtext="We'll prioritize solving this in your recommendation."
            compact
          >
            <div className="jj-q10-options">
              {FRUSTRATION_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.title}
                  subtitle={opt.subtitle}
                  selected={answers.frustration === opt.value}
                  onClick={() => handleOptionSelect('frustration', opt.value)}
                  className="jj-option-tall"
                />
              ))}
            </div>
          </QuizScreenLayout>
        );

      default:
        return <ResultsScreen answers={answers} />;
    }
  };

  const stepKey = currentStep === STEP.BRAND_SIZES ? `brand-size-${brandIndex}` : `step-${currentStep}`;

  return (
    <div className="jj-quiz-root">
      <style>{`
        .jj-quiz-root {
          position: relative;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        .jj-quiz-tip {
          font-size: 13px;
          font-style: italic;
          color: var(--jj-text-muted);
          margin: 16px 0 0;
        }
        .jj-continue-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .jj-continue-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--jj-gold);
          color: var(--jj-white);
          font-size: 12px;
          font-weight: 700;
          padding: 0 5px;
        }
        .jj-weight-input-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 10px;
        }
        .jj-weight-input {
          width: 140px;
          border: none;
          border-bottom: 2px solid var(--jj-border);
          background: transparent;
          font-family: inherit;
          font-size: 52px;
          font-weight: 700;
          color: var(--jj-indigo);
          text-align: center;
          padding: 12px 0;
          outline: none;
          transition: border-color 150ms ease;
        }
        .jj-weight-input:focus {
          border-color: var(--jj-gold);
        }
        .jj-weight-input::placeholder {
          color: var(--jj-border);
          font-weight: 400;
          font-size: 36px;
        }
        .jj-weight-unit {
          font-size: 20px;
          font-weight: 500;
          color: var(--jj-text-muted);
        }
        .jj-brand-progress {
          font-size: 12px;
          font-weight: 500;
          color: var(--jj-text-muted);
          margin: 0 0 8px;
        }
        .jj-brand-dots {
          letter-spacing: 3px;
          color: var(--jj-indigo);
        }
        .jj-q10-options .jj-option + .jj-option {
          margin-top: 6px;
        }
        .jj-option-tall {
          min-height: 72px;
        }

        @media (max-height: 700px) {
          .jj-q10-options .jj-option {
            min-height: 56px;
            padding-left: 14px;
            padding-right: 14px;
          }
          .jj-q10-options .jj-option-label {
            font-size: 14px;
          }
          .jj-q10-options .jj-option-subtitle {
            font-size: 12px;
          }
          .jj-q10-options .jj-option + .jj-option {
            margin-top: 4px;
          }
        }
      `}</style>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={stepKey}
          className="jj-screen"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ManualQuiz;
